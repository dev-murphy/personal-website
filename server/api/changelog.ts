import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export default defineEventHandler(async () => {
  return await readFile(resolve(process.cwd(), "CHANGELOG.md"), "utf-8");
});
