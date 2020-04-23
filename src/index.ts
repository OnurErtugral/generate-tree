import path from "path";

import fs from "fs";
import glob from "glob";
import test from "./example/footer/footer";
import test1 from "./example/header/header";

function getFileName(match: string) {
  match = match.replace("'", '"');
  const start = match.indexOf(".");
  const end = match.lastIndexOf('"');
  return match.substr(start, end - start);
}

async function returnChildren(rootFile: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(rootFile, { encoding: "utf8" }, async (err, content) => {
      if (err) {
        reject(err);
      }
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
          const pathName = path.join(
            path.dirname(rootFile),
            getFileName(element) + ".ts"
          );
          const a = await returnChildren(pathName);

          children.push(a);
        }
      }

      resolve({
        path: rootFile,
        children: children.length < 1 ? null : children,
      });
    });
  });
}

async function init(root: string) {
  const rootFile = path.join(__dirname, root);

  const matches = await returnChildren(rootFile);

  console.log("matches: ", JSON.stringify(matches, null, 2));
}

init("./index.ts");
