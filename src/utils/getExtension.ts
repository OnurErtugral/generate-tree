import path from "path";

export default function getExtention(
  normalized: string,
  baseName: string,
  map: any
) {
  return map[path.dirname(normalized)].filter(
    (file: any) => file.name === baseName
  )[0].extention;
}
