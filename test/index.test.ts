import { expect, it } from "vitest";
import { findUp } from "../src";

it("finds up file", async () => {
  expect(await findUp("index.js",{type: 'file'})).toMatchInlineSnapshot('"/Users/wangshengliang/Desktop/find-upon/index.js"');
});