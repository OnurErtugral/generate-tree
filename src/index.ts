#!/usr/bin/env node

import path from "path";
import fs from "fs-extra";
import argv from "minimist";

import openHTMLInBrowser from "./utils/openHTMLInBrowser";
import getFiles from "./utils/getAllFiles";
import mapFileNameToExtention from "./utils/mapFileNameToExtention";
import createOutputDir from "./utils/createOutputDir";
import test from "./example/footer/footer";
import test1 from "./example/header/header";
import bar from "./example";
import getExtention from "./utils/getExtension";
import getFilePathFromMatch from "./utils/getFilePathFromMatch";
import isDir from "./utils/isDir";

let map: { [key: string]: any } = {};

async function returnChildren(rootFile: string) {
  const content = await fs.readFile(rootFile, { encoding: "utf8" });
  //   console.log("rootFile: ", rootFile);

  let matches: RegExpMatchArray | null = content.match(
    /(from|require)(\s|\R)*("|')\s*\.{1,2}.+("|')/gim
  );
  let children: any = [];

  if (matches) {
    for (let index = 0; index < matches.length; index++) {
      const match = matches[index];
      // console.log("match: ", match);

      const dirName = path.dirname(rootFile);
      // console.log("dirName: ", dirName);

      let normalized = path.resolve(dirName, getFilePathFromMatch(match));
      // console.log("normalized: ", normalized);

      const isDirFlag = isDir(normalized);
      // console.log("isDir: ", isDirFlag);

      let baseName = path.basename(normalized);
      // console.log("baseName: ", baseName);

      let extension;
      try {
        extension = getExtention(normalized, baseName, map);
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
      console.log(pathName);

      children.push(await returnChildren(pathName));
    }
  }

  return {
    path: path.basename(rootFile),
    children: children.length < 1 ? null : children,
  };
}

async function init(root: string) {
  const baseDir = process.cwd();
  const rootFile = path.join(baseDir, root);

  const files: string[] = await getFiles(baseDir);
  //   console.log(files);
  map = mapFileNameToExtention(files);
  // console.log(JSON.stringify(map, null, 2));

  const outputJSON = await returnChildren(rootFile);
  const outputStr = JSON.stringify(outputJSON, null, 2);
  // console.log(outputStr);

  const outputDirPath = createOutputDir(baseDir, outputStr);

  if (process.env.NODE_ENV !== "dev")
    openHTMLInBrowser(path.join(outputDirPath, "index.html"));
}

if (process.env.NODE_ENV !== "dev") {
  const args = argv(process.argv.slice(2));
  if (!args["entryFile"]) {
    throw new Error("--entryFile flag is required.");
  }
  init(args["entryFile"]);
} else {
  init("./src/index.ts");
}
