import path from "path";
import fs, { Dirent } from "fs-extra";

export default async function getFiles(dir: string) {
  // @ts-ignore
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent: Dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (!["node_modules", ".git", "dist"].includes(dirent.name)) {
        if (dirent.isDirectory()) {
          return getFiles(res);
        } else {
          return res;
        }
      } else {
        return "";
      }
    })
  );
  return Array.prototype.concat(...files);
}
