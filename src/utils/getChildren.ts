import fs from "fs-extra";
import path from "path";
import getFilePathFromMatch from "./getFilePathFromMatch";
import isDir from "./isDir";
import getExtention from "./getExtension";

let currentStack: string[] = [];

export default async function getChildren(
  rootFile: string,
  map: { [key: string]: string[] }
) {
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

        children.push(await getChildren(pathName, map));
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
