import { useContext } from "react";

import type { ShortcutProps } from "../../common/types";
import { ButtonLink } from "../../components";
import { AppContext } from "../App/AppContext";

const renderShortcuts = (data: ShortcutProps[]) => {
	return data.map((item) => {
		return (
			<div key={item.position} className="mb-5">
				<h2 className="heading text-center text-slate-200 font-bold">
					{item.title}
				</h2>
				<div className="flex flex-wrap justify-center">
					{item.data.map((shortcut) => {
						return (
							<ButtonLink
								key={shortcut.id}
								slim
								link={shortcut.url}
								target="_blank"
								className="mr-1 mt-1 w-44 sm:w-52"
								maxLabelLength={23}
							>
								{shortcut.label}
							</ButtonLink>
						);
					})}
				</div>
			</div>
		);
	});
};

export const Shortcuts = () => {
	const { state } = useContext(AppContext);
	return state && state?.shortcuts?.length > 0 ? (
		renderShortcuts(state.shortcuts)
	) : (
		<div className="text-center font-bold">No shortcuts found.</div>
	);
};
