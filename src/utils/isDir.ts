import fs from "fs-extra";

export default function isDir(path: string) {
  try {
    const isDir = fs.lstatSync(path).isDirectory();
    if (isDir) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}
