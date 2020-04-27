#!/usr/bin/env node

import path from "path";
import fs from "fs-extra";
import argv from "minimist";
import ora from "ora";
import chalk from "chalk";

import openHTMLInBrowser from "./utils/openHTMLInBrowser";
import getFiles from "./utils/getAllFiles";
import mapFileNameToExtention from "./utils/mapFileNameToExtention";
import createOutputDir from "./utils/createOutputDir";
import getExtention from "./utils/getExtension";
import getFilePathFromMatch from "./utils/getFilePathFromMatch";
import isDir from "./utils/isDir";

if (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "dev") {
  process.env.NODE_ENV = "production";
}

let map: { [key: string]: any } = {};
let currentStack: string[] = [];

async function returnChildren(rootFile: string) {
  const content = await fs.readFile(rootFile, { encoding: "utf8" });
  if (!currentStack.includes(rootFile)) {
    currentStack.push(rootFile);

    let matches: RegExpMatchArray | null = content.match(
      /(from|require)(\s|\R)*("|')\s*\.{1,2}.+("|')/gim
    );
    let children: any = [];

    if (matches) {
      for (let index = 0; index < matches.length; index++) {
        const match = matches[index];

        const dirName = path.dirname(rootFile);

        let normalized = path.resolve(dirName, getFilePathFromMatch(match));

        const isDirFlag = isDir(normalized);

        let baseName = path.basename(normalized);

        let lastDotIndex = baseName.lastIndexOf(".");

        let extension;
        try {
          if (lastDotIndex > 0) {
            extension = "";
          } else {
            extension = getExtention(normalized, baseName, map);
          }
        } catch (err) {
          if (isDirFlag) {
            baseName = "index";
            normalized = path.join(normalized, baseName);
            extension = getExtention(normalized, baseName, map);
          } else {
            throw new Error(err);
          }
        }

        const pathName = normalized + extension;

        children.push(await returnChildren(pathName));
      }
    }

    currentStack = currentStack.slice(0, currentStack.length - 1);

    return {
      path: path.basename(rootFile),
      children: children.length < 1 ? null : children,
    };
  } else {
    return {
      path: path.basename(rootFile),
      children: null,
    };
  }
}

async function init(root: string) {
  const baseDir = process.cwd();
  const rootFile = path.join(baseDir, root);

  const spinner = ora("Reading files...").start();
  const files: string[] = await getFiles(baseDir);
  spinner.succeed();

  spinner.text = "Extracting extensions";
  spinner.start();
  map = mapFileNameToExtention(files);
  spinner.succeed();

  spinner.text = "Building component tree";
  spinner.start();
  const outputJSON = await returnChildren(rootFile);
  const outputStr = JSON.stringify(outputJSON, null, 2);
  spinner.succeed();

  spinner.text = "Generating output output files";
  spinner.start();
  const outputDirPath = createOutputDir(baseDir, outputStr);
  spinner.succeed();

  if (process.env.NODE_ENV === "production") {
    openHTMLInBrowser(path.join(outputDirPath, "index.html"));
  }
  console.log(
    chalk.green.bold(
      `Visulization is ready at ${chalk.underline(
        path.join(outputDirPath, "/index.html")
      )}`
    )
  );
}

if (process.env.NODE_ENV === "production") {
  const args = argv(process.argv.slice(2));
  if (!args["entryFile"]) {
    throw new Error("--entryFile flag is required.");
  }
  init(args["entryFile"]);
} else {
  init("./src/index.ts");
}
