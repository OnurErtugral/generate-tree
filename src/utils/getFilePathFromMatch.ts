export default function getFilePathFromMatch(match: string) {
  match = match.replace(/'/g, '"');
  const start = match.indexOf(".");
  const end = match.lastIndexOf('"');
  return match.slice(start, end);
}
