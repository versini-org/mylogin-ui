/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TextInput } from "../..";

describe("TextInput (exceptions)", () => {
	it("should be able to require/import from root", () => {
		expect(TextInput).toBeDefined();
	});
});

describe("TextInput modifiers", () => {
	it("should render a default text input", async () => {
		render(<TextInput placeholder="hello world" />);
		const input = await screen.findByPlaceholderText("hello world");
		expect(input.className).toContain("py-3");
	});

	it("should render a text input with an error message", async () => {
		render(
			<TextInput errorMessage="error message" placeholder="hello world" />,
		);
		const errorMessage = await screen.findByText("error message");
		expect(errorMessage.className).toContain("text-red-900");
	});
});

describe("TextInput methods", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should honor the onClick prop", async () => {
		const events = {
			onChange: () => {},
		};
		const spyOnChange = vi.spyOn(events, "onChange");
		const user = userEvent.setup();
		// @ts-ignore
		render(<TextInput onChange={spyOnChange} placeholder="hello world" />);
		const input = await screen.findByPlaceholderText("hello world");
		await user.type(input, "aa");

		expect(spyOnChange).toHaveBeenCalledTimes(2);
	});
});
