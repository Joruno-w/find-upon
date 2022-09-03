# find-upon

> Find a file or directory by walking up parent directories

## Install

```
$ npm install find-upon
```

## Usage

```
/
└── example
    └── Joruno
        ├── index.js
        └── foo
            ├── foo.js
            └── bar
                ├── baz
                └── bar.js
```

`example.js`

```js
import path from "node:path";
import { findUp, pathExists } from "find-upon";

console.log(await findUp("index.js"));
//=> '/example/Joruno/index.js'

console.log(await findUp(["main.js", "index.js"]));
//=> '/example/Joruno/index.js'

console.log(
  await findUp(
    async (directory) => {
      const hasUnicorns = await pathExists(path.join(directory, "index.js"));
      return hasUnicorns && directory;
    },
    { type: "directory" }
  )
);
//=> '/example/Joruno'
```

## API

### findUp(name, options?)

### findUp(matcher, options?)

Returns a `Promise` for either the path or `undefined` if it couldn't be found.

### findUp([...name], options?)

Returns a `Promise` for either the first path found (by respecting the order of the array) or `undefined` if none could be found.

### findUpMultiple(name, options?)

### findUpMultiple(matcher, options?)

Returns a `Promise` for either an array of paths or an empty array if none could be found.

### findUpMultiple([...name], options?)

Returns a `Promise` for either an array of the first paths found (by respecting the order of the array) or an empty array if none could be found.

### findUpSync(name, options?)

### findUpSync(matcher, options?)

Returns a path or `undefined` if it couldn't be found.

### findUpSync([...name], options?)

Returns the first path found (by respecting the order of the array) or `undefined` if none could be found.

### findUpMultipleSync(name, options?)

### findUpMultipleSync(matcher, options?)

Returns an array of paths or an empty array if none could be found.

### findUpMultipleSync([...name], options?)

Returns an array of the first paths found (by respecting the order of the array) or an empty array if none could be found.

#### name

Type: `string`

The name of the file or directory to find.

#### matcher

Type: `Function`

A function that will be called with each directory until it returns a `string` with the path, which stops the search, or the root directory has been reached and nothing was found. Useful if you want to match files with certain patterns, set of permissions, or other advanced use-cases.

When using async mode, the `matcher` may optionally be an async or promise-returning function that returns the path.

#### options

Type: `object`

##### cwd

Type: `URL | string`\
Default: `process.cwd()`

The directory to start from.

##### type

Type: `string`\
Default: `'file'`\
Values: `'file'` `'directory'`

The type of paths that can match.

##### allowSymlinks

Type: `boolean`\
Default: `true`

Allow symbolic links to match if they point to the chosen path type.

##### stopAt

Type: `string`\
Default: `path.parse(cwd).root`

The path to the directory to stop the search before reaching root if there were no matches before the `stopAt` directory.

### hasPath(path | path[])

Returns a `Promise<boolean>` of whether the path exists.

### hasPathSync(path | path[])

Returns a `boolean` of whether the path exists.

#### path

Type: `string`

The path to a file or directory.

### findUpStop

A [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) that can be returned by a `matcher` function to stop the search and cause `findUp` to immediately return `undefined`. Useful as a performance optimization in case the current working directory is deeply nested in the filesystem.

```js
import path from "node:path";
import { findUp, findUpStop } from "find-upon";

await findUp((directory) => {
  return path.basename(directory) === "work" ? findUpStop : "logo.png";
});
```
