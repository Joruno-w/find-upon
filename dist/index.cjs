'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const path = require('node:path');
const node_url = require('node:url');
const locatePath = require('locate-path');
const pathExists = require('path-exists');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const path__default = /*#__PURE__*/_interopDefaultLegacy(path);

const toPath = (urlOrPath) => urlOrPath instanceof URL ? node_url.fileURLToPath(urlOrPath) : urlOrPath;
const findUpStop = Symbol("findUpStop");
const findUpMultiple = async (name, options = {}) => {
  let directory = path__default.resolve(toPath(options.cwd) || "");
  const { root } = path__default.parse(directory);
  const stopAt = path__default.resolve(directory, options.stopAt || root);
  const limit = options.limit || Number.POSITIVE_INFINITY;
  const paths = [name].flat();
  const runMatcher = async (locateOptions) => {
    if (typeof name !== "function") {
      return locatePath.locatePath(paths, locateOptions);
    }
    const foundPath = await name(locateOptions.cwd);
    if (typeof foundPath === "string") {
      return locatePath.locatePath([foundPath], locateOptions);
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
      matches.push(path__default.resolve(directory, foundPath));
    }
    if (directory === stopAt || matches.length >= limit) {
      break;
    }
    directory = path__default.dirname(directory);
  }
  return matches;
};
const findUpMultipleSync = (name, options = {}) => {
  let directory = path__default.resolve(toPath(options.cwd) || "");
  const { root } = path__default.parse(directory);
  const stopAt = options.stopAt || root;
  const limit = options.limit || Number.POSITIVE_INFINITY;
  const paths = [name].flat();
  const runMatcher = (locateOptions) => {
    if (typeof name !== "function") {
      return locatePath.locatePathSync(paths, locateOptions);
    }
    const foundPath = name(locateOptions.cwd);
    if (typeof foundPath === "string") {
      return locatePath.locatePathSync([foundPath], locateOptions);
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
      matches.push(path__default.resolve(directory, foundPath));
    }
    if (directory === stopAt || matches.length >= limit) {
      break;
    }
    directory = path__default.dirname(directory);
  }
  return matches;
};
async function findUp(name, options = {}) {
  const matches = await findUpMultiple(name, { ...options, limit: 1 });
  return matches[0];
}
function findUpSync(name, options = {}) {
  const matches = findUpMultipleSync(name, { ...options, limit: 1 });
  return matches[0];
}

exports.pathExists = pathExists.pathExists;
exports.pathExistsSync = pathExists.pathExistsSync;
exports.findUp = findUp;
exports.findUpMultiple = findUpMultiple;
exports.findUpMultipleSync = findUpMultipleSync;
exports.findUpStop = findUpStop;
exports.findUpSync = findUpSync;
