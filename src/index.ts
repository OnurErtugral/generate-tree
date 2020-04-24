#!/usr/bin/env node

import path from "path";
import open from "open";
import fs, { Dirent } from "fs-extra";
import argv from "minimist";

import { htmlTemplate, script, style } from "./template/constants";
import test from "./example/footer/footer";
import test1 from "./example/header/header";
import bar from "./example";

function getFileName(match: string) {
  match = match.replace("'", '"');
  const start = match.indexOf(".");
  const end = match.lastIndexOf('"');
  return match.slice(start, end);
}

async function returnChildren(rootFile: string) {
  const content = await fs.readFile(rootFile, { encoding: "utf8" });

  //   console.log("rootFile: ", rootFile);

  let matches: RegExpMatchArray | null = content.match(
    /(from|require)(\s|\R)*("|')\s*\.{1,2}.+("|')/gim
  );
  let children: any = [];

  if (matches) {
    // console.log("matches");

    for (let index = 0; index < matches.length; index++) {
      //   console.log("for: ", index);

      const element = matches[index];
      // console.log("element: ", element);
      const dirName = path.dirname(rootFile);
      // console.log("dirName: ", dirName);
      let normalized = path.resolve(dirName, getFileName(element));
      // console.log("normalized: ", normalized);

      try {
        const isDir = fs.lstatSync(normalized).isDirectory();
        console.log("isDir: ", isDir);
        if (isDir) {
          normalized = path.join(normalized, "/index");
        }
      } catch (err) {}

      const baseName = path.basename(normalized);
      // console.log("baseName: ", baseName);

      const extension = map[path.dirname(normalized)].filter(
        (file: any) => file.name === baseName
      )[0].extention;

      const pathName = normalized + extension;
      console.log(path.dirname(rootFile));
      const a = await returnChildren(pathName);

      children.push(a);
    }
  }

  return {
    path: path.basename(rootFile),
    children: children.length < 1 ? null : children,
  };
}

let map: { [key: string]: any } = {};
function createFileExtentionMap(files: Array<string>) {
  files.forEach((file) => {
    const fileNameRaw = path.basename(file);

    const name = fileNameRaw.slice(0, fileNameRaw.lastIndexOf("."));
    const extention = path.extname(fileNameRaw);

    if (![".js", ".jsx", ".ts", ".tsx"].includes(extention)) return;

    map[path.dirname(file)] = map[path.dirname(file)]
      ? [...map[path.dirname(file)], { name, extention }]
      : [{ name, extention }];
  });

  return map;
}

// https://stackoverflow.com/questions/18052762/remove-directory-which-is-not-empty/32197381
const deleteFolderRecursive = function(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file, index) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    if (process.env.NODE_ENV !== "dev") fs.rmdirSync(dirPath);
  }
};

async function getFiles(dir: string) {
  // @ts-ignore
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent: Dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

async function openHTML(path: string) {
  // Opens the image in the default image viewer and waits for the opened app to quit.
  await open(path, { wait: true });
  // console.log("The image viewer app quit");
}

async function init(root: string) {
  const baseDir = process.cwd();
  const rootFile = path.join(baseDir, root);

  const files: string[] = await getFiles(baseDir);
  //   console.log(files);
  createFileExtentionMap(files);
  // console.log(JSON.stringify(map, null, 2));

  const matches = await returnChildren(rootFile);
  const matchesStr = JSON.stringify(matches, null, 2);
  // console.log(matchesStr);

  const dumpFilePath = path.join(baseDir, "./component-tree");
  // console.log(dumpFilePath);
  if (fs.existsSync(dumpFilePath)) {
    deleteFolderRecursive(dumpFilePath);
  }
  if (process.env.NODE_ENV !== "dev") fs.mkdirSync(dumpFilePath);

  // Write files
  fs.writeFileSync(
    path.join(dumpFilePath, "data.js"),
    "var data = " + matchesStr
  );
  fs.writeFileSync(path.join(dumpFilePath, "script.js"), script);
  fs.writeFileSync(path.join(dumpFilePath, "style.css"), style);
  fs.writeFileSync(path.join(dumpFilePath, "index.html"), htmlTemplate);

  if (process.env.NODE_ENV !== "dev")
    openHTML(path.join(dumpFilePath, "index.html"));
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
