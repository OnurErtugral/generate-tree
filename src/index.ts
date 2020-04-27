#!/usr/bin/env node

import path from "path";
import argv from "minimist";
import ora from "ora";
import chalk from "chalk";

import openHTMLInBrowser from "./utils/openHTMLInBrowser";
import getFiles from "./utils/getAllFiles";
import mapFileNameToExtention from "./utils/mapFileNameToExtention";
import createOutputDir from "./utils/createOutputDir";
import getChildren from "./utils/getChildren";

if (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "dev") {
  process.env.NODE_ENV = "production";
}

async function init(root: string) {
  const baseDir = process.cwd();
  const rootFile = path.join(baseDir, root);

  const spinner = ora("Reading files...").start();
  const files: string[] = await getFiles(baseDir);
  spinner.succeed();

  spinner.text = "Extracting extensions...";
  spinner.start();
  const map = mapFileNameToExtention(files);
  spinner.succeed();

  spinner.text = "Building component tree...";
  spinner.start();
  const outputJSON = await getChildren(rootFile, map);
  const outputStr = JSON.stringify(outputJSON, null, 2);
  spinner.succeed();

  spinner.text = "Generating output files...";
  spinner.start();
  const outputDirPath = createOutputDir(baseDir, outputStr);
  spinner.succeed();

  if (process.env.NODE_ENV === "production") {
    openHTMLInBrowser(path.join(outputDirPath, "index.html"));
  }
  console.log(
    chalk.green.bold(
      `Visualization is ready: ${chalk.underline(
        path.join(outputDirPath, "/index.html")
      )}`
    )
  );
}

if (process.env.NODE_ENV === "production") {
  const args = argv(process.argv.slice(2));
  if (!args["entryFile"]) {
    console.error(chalk.red.bold("Error: --entryFile flag is required."));
    process.exit(1);
  }
  init(args["entryFile"]);
} else {
  init("./src/index.ts");
}
