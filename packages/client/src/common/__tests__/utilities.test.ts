import { describe, expect, it } from "vitest";

import { truncate } from "../utilities";

describe("Non-DOM tests", () => {
	describe("truncate", () => {
		it("should truncate according to plan", () => {
			expect(truncate("hello world", 5)).toBe("hello...");
			expect(truncate("hello world", 11)).toBe("hello world");
			expect(truncate("hello world", 12)).toBe("hello world");
		});
	});
});
