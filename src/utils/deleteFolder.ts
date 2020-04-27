import path from "path";
import fs from "fs-extra";

// https://stackoverflow.com/questions/18052762/remove-directory-which-is-not-empty/32197381
const deleteFolderRecursive = function (dirPath: string) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });

    if (process.env.NODE_ENV === "production") fs.rmdirSync(dirPath);
  }
};

export default deleteFolderRecursive;
