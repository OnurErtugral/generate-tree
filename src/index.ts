import path from "path";

import fs, { Dirent } from "fs-extra";
import test from "./example/footer/footer";
import test1 from "./example/header/header";

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
      const dirName = path.dirname(rootFile);
      const normalized = path.resolve(dirName, getFileName(element));
      const baseName = path.basename(normalized);
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

    // fs.rmdirSync(dirPath);
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

async function init(root: string) {
  const baseDir = __dirname;
  const rootFile = path.join(__dirname, root);

  const files: string[] = await getFiles(baseDir);
  //   console.log(files);
  createFileExtentionMap(files);
  //   console.log(JSON.stringify(map, null, 2));

  const matches = await returnChildren(rootFile);

  const matchesStr = JSON.stringify(matches, null, 2);
  console.log(matchesStr);

  const dumpFilePath = path.normalize(__dirname + "/component-tree");
  console.log(dumpFilePath);
  if (fs.existsSync(dumpFilePath)) {
    deleteFolderRecursive(dumpFilePath);
  }

  // fs.mkdirSync(dumpFilePath);

  fs.writeFileSync(path.join(dumpFilePath, "data.json"), matchesStr);
}

init("./index.ts");
