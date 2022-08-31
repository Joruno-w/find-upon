import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { locatePath, locatePathSync } from 'locate-path';
export { pathExists, pathExistsSync } from 'path-exists';

const toPath = (urlOrPath) => urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;
const findUpStop = Symbol("findUpStop");
const findUpMultiple = async (name, options = {}) => {
  let directory = path.resolve(toPath(options.cwd) || "");
  const { root } = path.parse(directory);
  const stopAt = path.resolve(directory, options.stopAt || root);
  const limit = options.limit || Number.POSITIVE_INFINITY;
  const paths = [name].flat();
  const runMatcher = async (locateOptions) => {
    if (typeof name !== "function") {
      return locatePath(paths, locateOptions);
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
      matches.push(path.resolve(directory, foundPath));
    }
    if (directory === stopAt || matches.length >= limit) {
      break;
    }
    directory = path.dirname(directory);
  }
  return matches;
};
const findUpMultipleSync = (name, options = {}) => {
  let directory = path.resolve(toPath(options.cwd) || "");
  const { root } = path.parse(directory);
  const stopAt = options.stopAt || root;
  const limit = options.limit || Number.POSITIVE_INFINITY;
  const paths = [name].flat();
  const runMatcher = (locateOptions) => {
    if (typeof name !== "function") {
      return locatePathSync(paths, locateOptions);
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
      matches.push(path.resolve(directory, foundPath));
    }
    if (directory === stopAt || matches.length >= limit) {
      break;
    }
    directory = path.dirname(directory);
  }
  return matches;
};
const findUp = async (name, options = {}) => {
  const matches = await findUpMultiple(name, { ...options, limit: 1 });
  return matches[0];
};
const findUpSync = (name, options = {}) => {
  const matches = findUpMultipleSync(name, { ...options, limit: 1 });
  return matches[0];
};

export { findUp, findUpMultiple, findUpMultipleSync, findUpStop, findUpSync };
