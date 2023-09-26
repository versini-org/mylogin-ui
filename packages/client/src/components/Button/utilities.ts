import clsx from "clsx";

export const TYPE_ICON = "icon";
export const TYPE_BUTTON = "button";
export const TYPE_LINK = "link";

type getButtonClassesProps = {
	type: typeof TYPE_BUTTON | typeof TYPE_ICON | typeof TYPE_LINK;
	className?: string;
	raw: boolean;
	kind: string;
	disabled: boolean;
	fullWidth: boolean;
	slim?: boolean;
};

export const getButtonClasses = ({
	type,
	className,
	raw,
	kind,
	disabled,
	fullWidth,
	slim,
}: getButtonClassesProps) => {
	return clsx(
		className,
		"focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-slate-300",
		{
			"font-medium text-sm sm:text-base": type === TYPE_BUTTON,
			"text-sm text-center": type === TYPE_LINK,
			"p-2": type === TYPE_ICON,
			"rounded-full ": !raw,
			"rounded-sm ": raw,
			"text-slate-200 bg-slate-900 hover:bg-slate-800 active:text-slate-300 active:bg-slate-700":
				kind === "dark" && !disabled && !raw,
			"text-slate-200 bg-slate-900": kind === "dark" && disabled && !raw,
			"text-slate-200 bg-slate-500 hover:bg-slate-600 active:text-slate-300 active:bg-slate-700":
				kind === "light" && !disabled && !raw,
			"text-slate-200 bg-slate-500": kind === "light" && disabled && !raw,
			"w-full": fullWidth,
			"px-0 sm:px-4 py-1":
				slim && !raw && (type === TYPE_BUTTON || type === TYPE_LINK),
			"px-4 py-2":
				!slim && !raw && (type === TYPE_BUTTON || type === TYPE_LINK),
			"disabled:opacity-50 disabled:cursor-not-allowed": disabled,
			"max-h-8": type === TYPE_LINK,
		},
	);
};
