import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  locatePath,
  locatePathSync,
  Options as LocateOptions,
  AsyncOptions,
} from "locate-path";

type Path = string | undefined;

type NameTypes =
  | string
  | string[]
  | ((directory: URL | Path) => Path | Promise<Path> | Symbol);

interface Options extends LocateOptions {
  limit?: number;
  readonly stopAt?: string;
}

const toPath = (urlOrPath: URL | Path): Path =>
  urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;

export const findUpStop: Symbol = Symbol("findUpStop");

export const findUpMultiple = async (
  name: NameTypes,
  options: Options = {}
) => {
  let directory = path.resolve(toPath(options.cwd) || "");
  const { root } = path.parse(directory);
  const stopAt = path.resolve(directory, options.stopAt || root);
  const limit = options.limit || Number.POSITIVE_INFINITY;
  const paths = [name].flat();

  const runMatcher = async (locateOptions: AsyncOptions) => {
    if (typeof name !== "function") {
      return locatePath(paths as string[], locateOptions);
    }

    const foundPath = await name(locateOptions.cwd);
    if (typeof foundPath === "string") {
      return locatePath([foundPath], locateOptions);
    }

    return foundPath;
  };

  const matches = [];
  while (true) {
    const foundPath = await runMatcher({ ...options, cwd: directory });

    if (foundPath === findUpStop) {
      break;
    }

    if (foundPath) {
      matches.push(path.resolve(directory, foundPath as string));
    }

    if (directory === stopAt || matches.length >= limit) {
      break;
    }

    directory = path.dirname(directory);
  }

  return matches;
};

export const findUpMultipleSync = (name: NameTypes, options: Options = {}) => {
  let directory = path.resolve(toPath(options.cwd) || "");
  const { root } = path.parse(directory);
  const stopAt = options.stopAt || root;
  const limit = options.limit || Number.POSITIVE_INFINITY;
  const paths = [name].flat();

  const runMatcher = (locateOptions: AsyncOptions) => {
    if (typeof name !== "function") {
      return locatePathSync(paths as string[], locateOptions);
    }

    const foundPath = name(locateOptions.cwd);
    if (typeof foundPath === "string") {
      return locatePathSync([foundPath], locateOptions);
    }

    return foundPath;
  };

  const matches = [];
  while (true) {
    const foundPath = runMatcher({ ...options, cwd: directory });

    if (foundPath === findUpStop) {
      break;
    }

    if (foundPath) {
      matches.push(path.resolve(directory, foundPath as string));
    }

    if (directory === stopAt || matches.length >= limit) {
      break;
    }

    directory = path.dirname(directory);
  }

  return matches;
};

export const findUp = async (name: NameTypes, options = {}) => {
  const matches = await findUpMultiple(name, { ...options, limit: 1 });
  return matches[0];
};

export const findUpSync = (name: NameTypes, options = {}) => {
  const matches = findUpMultipleSync(name, { ...options, limit: 1 });
  return matches[0];
};

export { hasPath, hasPathSync } from "has-path";
