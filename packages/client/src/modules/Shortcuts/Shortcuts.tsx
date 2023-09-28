import { useContext, useState } from "react";

import type { ShortcutProps } from "../../common/types";
import { Button, ButtonLink, IconEdit } from "../../components";
import { AppContext } from "../App/AppContext";

const renderShortcuts = ({
	data,
	editable,
	setEditable,
}: {
	editable?: number;
	setEditable?: any;
	data: ShortcutProps[];
}) => {
	return data.map((item) => {
		return (
			<div key={item.position} className="mb-5">
				<h2 className="heading text-center text-slate-200 font-bold">
					{item.title}
					<Button
						raw
						className={
							"ml-3 text-slate-300 hover:text-slate-400 active:text-slate-500"
						}
						onClick={() => {
							setEditable(editable === item.position ? null : item.position);
						}}
					>
						<IconEdit />
					</Button>
				</h2>

				{editable && editable === item.position ? (
					<>
						<textarea
							className="font-mono text-sm h-36 w-full"
							defaultValue={JSON.stringify(item.data, null, 2)}
						/>
						<Button
							className="mt-3"
							slim
							onClick={() => {
								setEditable(editable === item.position ? null : item.position);
							}}
						>
							Save
						</Button>
					</>
				) : (
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
				)}
			</div>
		);
	});
};

export const Shortcuts = () => {
	const { state } = useContext(AppContext);
	const [editable, setEditable] = useState();

	return state && state?.shortcuts?.length > 0 ? (
		renderShortcuts({ data: state.shortcuts, setEditable, editable })
	) : (
		<div className="text-center font-bold">No shortcuts found.</div>
	);
};
