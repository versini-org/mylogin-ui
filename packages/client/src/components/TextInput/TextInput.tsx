import type { TextInputProps } from "./TextInputTypes";

export const TextInput = ({
	type,
	placeholder,
	onChange,
	errorMessage,
	...extraProps
}: TextInputProps) => {
	return (
		<>
			<input
				{...extraProps}
				className="block w-full resize-none rounded-md border-none py-3 px-4 text-base caret-slate-100 focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-slate-300 bg-slate-900 text-slate-200 placeholder-slate-400 sm:text-base"
				type={type}
				placeholder={placeholder}
				onChange={(e) => onChange && onChange(e)}
			/>

			{errorMessage && (
				<div aria-hidden className="pl-2 text-sm text-red-900">
					{errorMessage}
				</div>
			)}
		</>
	);
};
