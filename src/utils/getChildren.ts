import fs from "fs-extra";
import path from "path";
import getFilePathFromMatch from "./getFilePathFromMatch";
import isDir from "./isDir";
import getExtension from "./getExtension";
import chalk from "chalk";

let currentStack: string[] = [];

export default async function getChildren(
  rootFile: string,
  map: { [key: string]: string[] }
) {
  let content;
  try {
    content = await fs.readFile(rootFile, { encoding: "utf8" });
  } catch (err) {
    console.log(chalk.red.bold("\nError: Could not found the file", rootFile));
    console.log(
      chalk.red.yellow.bold("Make sure the file has the correct extension.")
    );
    process.exit(1);
  }

  if (!currentStack.includes(rootFile)) {
    currentStack.push(rootFile);

    let matches: RegExpMatchArray | null = content.match(
      /import\s+[\w-]+\s+from(\s|\R)*("|')\s*\.{1,2}\/.+("|')/gim
    );
    let children: any = [];

    if (matches) {
      for (let index = 0; index < matches.length; index++) {
        const match = matches[index];

        const dirName = path.dirname(rootFile);

        let normalized = path.resolve(dirName, getFilePathFromMatch(match));

        const isDirFlag = isDir(normalized);

        // Assume it is a file
        let baseName = path.basename(normalized);

        let lastDotIndex = baseName.lastIndexOf(".");

        let extension;
        try {
          // If it already has extension
          if (lastDotIndex > 0) {
            extension = "";
          } else {
            extension = getExtension(normalized, baseName, map);
          }
        } catch (err) {
          if (isDirFlag) {
            baseName = "index";
            normalized = path.join(normalized, baseName);
            extension = getExtension(normalized, baseName, map);
          } else {
            console.log(
              chalk.red.bold("\nError: Could not found the file", normalized)
            );
            process.exit(1);
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
