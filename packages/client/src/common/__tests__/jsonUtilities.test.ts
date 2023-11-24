import { describe, expect, it } from "vitest";

import { wrapStringInDoubleQuotes } from "../jsonUtilities";

describe("jsonUtilities tests", () => {
	describe("wrapStringInDoubleQuotes tests", () => {
		it("should wrap a string in double quotes if it is not already wrapped", () => {
			expect(wrapStringInDoubleQuotes("testString")).toEqual('"testString"');
		});

		it("should replace the wrapping single quotes if they are present with double", () => {
			expect(wrapStringInDoubleQuotes("'testString'")).toEqual('"testString"');
		});

		it("should not wrap a string in double quotes if it is already wrapped", () => {
			expect(wrapStringInDoubleQuotes('"testString"')).toEqual('"testString"');
		});

		it("should not replace the wrapping double quotes if they are present", () => {
			expect(wrapStringInDoubleQuotes('"testString"')).toEqual('"testString"');
		});

		it("should replace mix-matched wrapping quotes with double quotes", () => {
			expect(wrapStringInDoubleQuotes("'testString\"")).toEqual('"testString"');
			expect(wrapStringInDoubleQuotes("'testString")).toEqual('"testString"');
			expect(wrapStringInDoubleQuotes("\"testString'")).toEqual('"testString"');
			expect(wrapStringInDoubleQuotes("testString'")).toEqual('"testString"');
		});
	});
});
