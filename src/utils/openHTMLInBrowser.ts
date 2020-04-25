import open from "open";

export default async function openHTML(path: string) {
  await open(path, { wait: true });
}
