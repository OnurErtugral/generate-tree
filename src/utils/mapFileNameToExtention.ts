import path from "path";

export default function createFileExtentionMap(files: Array<string>) {
  let map: { [key: string]: any } = {};

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
