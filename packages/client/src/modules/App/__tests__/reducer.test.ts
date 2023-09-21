import { describe, expect, it } from "vitest";

import { ACTION_DATA } from "../../../common/constants";
import { reducer } from "../reducer";

describe("Non-DOM tests", () => {
	describe("reducer tests", () => {
		it("should return the initial state", () => {
			const state = {
				shortcuts: [],
			};
			expect(reducer(state, undefined)).toEqual(state);
		});

		it("should update the data state on ACTION_DATA", () => {
			const state = {
				shortcuts: [],
			};
			const actionPayload = {
				shortcuts: [
					{
						position: 1,
						title: "testTitle",
						data: [
							{
								id: "testId",
								label: "testLabel",
								url: "testUrl",
							},
						],
					},
				],
			};
			expect(
				reducer(state, {
					type: ACTION_DATA,
					payload: actionPayload,
				}),
			).toEqual({
				shortcuts: actionPayload.shortcuts,
			});
		});
	});
});
