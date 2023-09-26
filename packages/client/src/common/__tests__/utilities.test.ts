import { describe, expect, it } from "vitest";

import { truncate } from "../utilities";

describe("Non-DOM tests", () => {
	describe("truncate", () => {
		it("should truncate according to plan", () => {
			const STR = "hello world";
			expect(truncate(STR, 5).truncatedString).toBe("he...");
			expect(truncate(STR, 7).truncatedString).toBe("hell...");
			expect(truncate(STR, 10).truncatedString).toBe("hello w...");
			expect(truncate(STR, 11).truncatedString).toBe(STR);
			expect(truncate(STR, 12).truncatedString).toBe(STR);
		});
	});
});
