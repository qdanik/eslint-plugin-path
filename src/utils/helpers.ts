import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { loadTsConfig } from "load-tsconfig";

/**
 * Helps to detect if a path exists or not
 * @param map - The object to check the path in
 * @param path - The path to check
 * @returns True if the path exists, false otherwise
 */
export function isPathExists(map: Record<string, any>, path: string): boolean {
  let pathToTarget: any = map;
  for (const step of path.split(".")) {
    pathToTarget = pathToTarget[step];
    if (pathToTarget === undefined) {
      return false;
    }
  }
  return true;
}

/**
 * Loads and parses JSON files
 * @param dir - The directory where the file is located
 * @param filename - The name of the file to load
 * @returns The parsed JSON file
 */
export function loadConfigFile(dir: string, filename: string): any {
  try {
    const path = join(dir, filename);

    if (filename === "jsconfig.json") {
      return {
        data: JSON.parse(readFileSync(path, "utf8")),
      };
    }

    const file = loadTsConfig(path);

    return file;
  } catch (error) {
    throw new Error(`'${filename}' is invalid. Please, validate JSON file.`);
  }
}

/**
 * Helps to check if a file exists
 * @param dir - The directory where the file might be located
 * @param filename - The name of the file to check
 * @returns True if the file exists, false otherwise
 */
export function isFileExists(dir: string, filename: string): boolean {
  return existsSync(join(dir, filename));
}