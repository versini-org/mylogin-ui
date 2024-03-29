import { Panel } from "@versini/ui-components";
import { ReactNode } from "react";
import { JSX } from "react/jsx-runtime";

const LazyPanel = (
	props: JSX.IntrinsicAttributes & {
		children: ReactNode;
		onOpenChange: (open: boolean) => void;
		open: boolean;
		title: string;
		borderMode?: "dark" | "light" | undefined;
		footer?: ReactNode;
		kind?: "messagebox" | "panel" | undefined;
	},
) => {
	return <Panel {...props} />;
};

export default LazyPanel;
