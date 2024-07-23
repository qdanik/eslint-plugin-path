import { dirname, join, resolve } from "path";
import { existsSync } from "fs";
import { FILES } from "./constants";

/**
 * Package.json directory finder
 * @param {string} filePath - path to directory where packages.json is located
 * @returns {string} path to directory where packages.json is located
 */
export function getPackagePath(filePath: string): string {
  let dir = resolve(filePath || "", FILES.package);

  do {
    dir = dirname(dir);
  } while (!existsSync(join(dir, FILES.package)) && dir !== "/");

  if (!existsSync(join(dir, FILES.package))) {
    return process?.cwd() || "";
  }

  return dir;
}