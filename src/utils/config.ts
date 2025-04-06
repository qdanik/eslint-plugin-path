import { join, isAbsolute } from "path";
import { FILES } from "./constants";
import { loadConfigFile, isFileExists, isPathExists } from "./helpers";

/**
 * Alias item structure
 */
export interface AliasItem {
  path: string;
  alias: string | null;
  aliases?: AliasItem[];
}

/**
 * Helps to clear matchers' key or value
 * @param value - The value to clear
 * @returns The cleared tsconfig path matcher value
 */
export function clearMatcher(value: string): string {
  return value.replace("*", "");
}

/**
 * Helps to create alias item creator based on package dir
 * @param packageDir - The package directory
 * @returns Returns alias item creator
 */
export function getAliasItemCreator(packageDir: string): (path: string, alias?: string) => AliasItem {
  return function createAliasItem(path: string, alias: string | null = null): AliasItem {
    return {
      path: isAbsolute(path) ? clearMatcher(path) : join(packageDir, clearMatcher(path)),
      alias: alias ? clearMatcher(alias) : null,
    };
  };
}

/**
 * Creates alias items that were described in tsconfig.json
 *
 * @param packagePath - The package path
 * @returns Returns array of alias items
 */
export function getConfigSettings(packagePath: string): Array<AliasItem> {
  let fileName: string | null = null;

  if (isFileExists(packagePath, FILES.tsconfig)) {
    fileName = FILES.tsconfig;
  }

  if (isFileExists(packagePath, FILES.jsconfig)) {
    fileName = FILES.jsconfig;
  }

  if (fileName === null) {
    return [];
  }

  const urls: AliasItem[] = [];
  const config = loadConfigFile(packagePath, fileName);
  const createAliasItem = getAliasItemCreator(packagePath);

  if (isPathExists(config, "data.compilerOptions.paths")) {
    const entires: [string, string[]][] = Object.entries(config.data.compilerOptions.paths)
    entires.forEach(([key, paths]) =>
      paths.forEach((path) => urls.push(createAliasItem(path, key)))
    );
  }

  if (isPathExists(config, "data.compilerOptions.baseUrl")) {
    urls.push(createAliasItem(config.data.compilerOptions.baseUrl));
  }

  return urls;
}
