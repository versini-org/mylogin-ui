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
				className="block w-full resize-none rounded-md border-none bg-slate-900 px-4 py-3 text-base text-slate-200 placeholder-slate-400 caret-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-0 sm:text-base"
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
