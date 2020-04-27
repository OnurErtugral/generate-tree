import path from "path";
import fs from "fs-extra";

import { htmlTemplate, script, style } from "../template/constants";
import deleteFolderRecursive from "./deleteFolder";

export default function createOutputDir(baseDir: string, data: string): string {
  const outputDirPath = path.join(baseDir, "./component-tree");

  if (fs.existsSync(outputDirPath)) {
    deleteFolderRecursive(outputDirPath);
  }
  if (process.env.NODE_ENV === "production") fs.mkdirSync(outputDirPath);

  // Write files
  fs.writeFileSync(path.join(outputDirPath, "data.js"), "var data = " + data);
  fs.writeFileSync(path.join(outputDirPath, "script.js"), script);
  fs.writeFileSync(path.join(outputDirPath, "style.css"), style);
  fs.writeFileSync(path.join(outputDirPath, "index.html"), htmlTemplate);

  return outputDirPath;
}
