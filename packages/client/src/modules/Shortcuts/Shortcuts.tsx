import { Button, ButtonIcon, ButtonLink } from "@versini/ui-components";
import { TextArea, TextInput } from "@versini/ui-form";
import { IconEdit } from "@versini/ui-icons";
import { useContext, useState } from "react";

import { ACTION_SET_DATA } from "../../common/constants";
import { AppContext } from "../App/AppContext";

export const Shortcuts = () => {
	const { state, dispatch } = useContext(AppContext);
	const [editable, setEditable] = useState<string | null>();
	const [userInputShortcuts, setUserInputShortcuts] = useState("");
	const [userInputSectionTitle, setUserInputSectionTitle] = useState("");

	return state && state?.sections?.length > 0 ? (
		<>
			{state.sections.map((section) => {
				return (
					<div key={section.id} className="mb-5">
						<h2 className="heading text-center font-bold text-slate-200">
							{section.title}
							<ButtonIcon
								focusMode="light"
								mode="light"
								noBorder
								size="small"
								className="ml-1"
								label="Edit section"
								onClick={() => {
									setEditable(editable === section.id ? null : section.id);
									setUserInputSectionTitle(
										JSON.stringify(section.title, null, 2),
									);
									setUserInputShortcuts(
										JSON.stringify(section.shortcuts, null, 2),
									);
								}}
							>
								<IconEdit className="h-3 w-3" />
							</ButtonIcon>
						</h2>

						{editable && editable === section.id ? (
							<>
								<TextInput
									mode="dark"
									focusMode="light"
									label="Section title"
									name={`section-title-${section.id}`}
									className="mb-2 mt-2"
									type="text"
									value={userInputSectionTitle}
									onChange={(e) =>
										setUserInputSectionTitle(e.target.value.toString())
									}
								/>

								<TextArea
									textAreaClassName="font-mono text-sm"
									mode="dark"
									focusMode="light"
									label={`Shortcuts for ${section.title}`}
									name={`shortcuts-${section.id}`}
									value={userInputShortcuts}
									onChange={(e) => setUserInputShortcuts(e.target.value)}
								/>

								<Button
									mode="light"
									focusMode="light"
									className="mr-2 mt-3"
									onClick={() => {
										setEditable(editable === section.id ? null : section.id);
									}}
								>
									Cancel
								</Button>
								<Button
									focusMode="light"
									noBorder
									className="mt-3"
									onClick={async () => {
										setEditable(editable === section.id ? null : section.id);
										try {
											const { jsonParse } = await import(
												"../../common/jsonUtilities"
											);
											try {
												section.title = jsonParse(userInputSectionTitle, true);
											} catch (error) {
												// eslint-disable-next-line no-console
												console.error(error);
											}

											dispatch({
												type: ACTION_SET_DATA,
												payload: {
													status: "stale",
													section: section,
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
								{section.shortcuts.map((shortcut) => {
									return (
										<ButtonLink
											focusMode="light"
											key={`${shortcut.url}-${shortcut.label}`}
											noBorder
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
