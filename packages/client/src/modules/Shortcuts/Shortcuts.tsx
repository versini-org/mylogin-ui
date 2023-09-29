import { useContext, useState } from "react";

import { ACTION_SET_DATA } from "../../common/constants";
import { Button, ButtonLink, IconEdit } from "../../components";
import { AppContext } from "../App/AppContext";

export const Shortcuts = () => {
	const { state, dispatch } = useContext(AppContext);
	const [editable, setEditable] = useState<number | null>();
	const [userInput, setUserInput] = useState("");

	return state && state?.shortcuts?.length > 0 ? (
		<>
			{state.shortcuts.map((item) => {
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
									setEditable(
										editable === item.position ? null : item.position,
									);
									setUserInput(JSON.stringify(item.data, null, 2));
								}}
							>
								<IconEdit />
							</Button>
						</h2>

						{editable && editable === item.position ? (
							<>
								<textarea
									className="font-mono text-sm h-36 w-full"
									value={userInput}
									onChange={(e) => setUserInput(e.target.value)}
								/>
								<Button
									className="mt-3 mr-2"
									slim
									onClick={() => {
										setEditable(
											editable === item.position ? null : item.position,
										);
									}}
								>
									Cancel
								</Button>
								<Button
									className="mt-3"
									slim
									onClick={async () => {
										setEditable(
											editable === item.position ? null : item.position,
										);
										try {
											const { jsonParse, addUniqueId } = await import(
												"../../common/jsonUtilities"
											);
											item.data = addUniqueId(jsonParse(userInput));

											dispatch({
												type: ACTION_SET_DATA,
												payload: {
													status: "stale",
													shortcut: item,
												},
											});
										} catch (error) {
											// eslint-disable-next-line no-console
											console.error(error);
										}
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
			})}
		</>
	) : (
		<div className="text-center font-bold">No shortcuts found.</div>
	);
};
