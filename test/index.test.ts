import { expect, it } from "vitest";
import { findUp } from "../src";

it("finds up file", async () => {
  expect(await findUp("index.js")).toMatchInlineSnapshot('"/Users/wangshengliang/Desktop/find-upon/index.js"');
  expect(await findUp("index.js",{type: 'file'})).toMatchInlineSnapshot('"/Users/wangshengliang/Desktop/find-upon/index.js"');
  expect(await findUp("index.test.js",{type: 'directory'})).toMatchInlineSnapshot('undefined');
  expect(await findUp("index.js",{type: 'file'})).toMatchInlineSnapshot('"/Users/wangshengliang/Desktop/find-upon/index.js"');
  expect(await findUp("index.js",{type: 'file'})).toMatchInlineSnapshot('"/Users/wangshengliang/Desktop/find-upon/index.js"');
  expect(await findUp("index.js",{type: 'file'})).toMatchInlineSnapshot('"/Users/wangshengliang/Desktop/find-upon/index.js"');
  expect(await findUp("index.js",{type: 'file'})).toMatchInlineSnapshot('"/Users/wangshengliang/Desktop/find-upon/index.js"');
});