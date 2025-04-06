import { resolve } from "path";
import { existsSync } from "fs";


const extensions = [".js", ".ts", ".jsx", ".tsx"];
const modulesFolder = "node_modules";


/**
 * Check if the path is relative to the parent directory.
 * @param path - The path to check.
 * @returns True if the path is relative to the parent directory.
 */
export function isRelativeToParent(path: string): boolean {
  return /^\.\.$|^\.\.[\\/]/.test(path);
}

/**
 * Check if the given path exists.
 * @param path - The path to check.
 * @returns True if the path exists.
 */
export function isExistingPath(path: string): boolean {
  const paths = [path, ...extensions.map((ext) => `${path}${ext}`), ...extensions.map((ext) => `${path}/index${ext}`)];

  return paths.some((target) => existsSync(target));
}

/**
 * Check if the path is external.
 * @param path - The path to check.
 * @param packagePath - The package path to resolve against.
 * @returns True if the path is external.
 */
export function isExternalPath(path: string, packagePath: string): boolean {
  if (!path) {
    return false;
  }

  const modulePath = resolve(packagePath, modulesFolder, path);

  return isExistingPath(modulePath);
}