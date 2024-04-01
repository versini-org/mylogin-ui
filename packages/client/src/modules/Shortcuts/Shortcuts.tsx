import {
	ButtonIcon,
	ButtonLink,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@versini/ui-components";
import { TextArea, TextInput } from "@versini/ui-form";
import {
	IconAdd,
	IconDelete,
	IconDown,
	IconEdit,
	IconUp,
} from "@versini/ui-icons";
import { useContext, useState } from "react";

import {
	ACTION_REFRESH_DATA,
	ACTION_SET_STATUS,
	ACTION_STATUS_ERROR,
	ACTION_STATUS_SUCCESS,
	LOCAL_STORAGE_BASIC_AUTH,
} from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import { FAKE_USER_EMAIL } from "../../common/strings";
import type { SectionProps } from "../../common/types";
import { editShortcuts } from "../../common/utilities";
import { AppContext } from "../App/AppContext";

export const Shortcuts = () => {
	const storage = useLocalStorage();
	const { state, dispatch } = useContext(AppContext);
	const [editable, setEditable] = useState<string | null>();
	const [userInputShortcuts, setUserInputShortcuts] = useState("");
	const [basicAuth] = useState(storage.get(LOCAL_STORAGE_BASIC_AUTH));

	const onClickSaveShortcuts = async ({
		section,
	}: {
		section: SectionProps;
	}) => {
		setEditable(editable === section.id ? null : section.id);
		try {
			const { jsonParse } = await import("../../common/jsonUtilities");
			try {
				section.shortcuts = jsonParse(userInputShortcuts);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			}

			const response = await editShortcuts({
				userId: FAKE_USER_EMAIL,
				basicAuth,
				sectionId: section.id,
				sectionTitle: section.title,
				shortcuts: section.shortcuts,
			});
			if (response.status !== 200) {
				dispatch({
					type: ACTION_SET_STATUS,
					payload: {
						status: ACTION_STATUS_ERROR,
					},
				});
			} else {
				dispatch({
					type: ACTION_REFRESH_DATA,
					payload: {
						status: ACTION_STATUS_SUCCESS,
						sections: response.data,
					},
				});
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	};

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
									setUserInputShortcuts(
										JSON.stringify(section.shortcuts, null, 2),
									);
								}}
							>
								<IconEdit className="h-3 w-3" />
							</ButtonIcon>
						</h2>

						{editable && editable === section.id && (
							<>
								{/* <TextArea
									className="mt-2"
									textAreaClassName="font-mono text-sm"
									mode="dark"
									focusMode="light"
									label={`Shortcuts for ${section.title}`}
									name={`shortcuts-${section.id}`}
									value={userInputShortcuts}
									onChange={(e) => setUserInputShortcuts(e.target.value)}
								/> */}
								<Table
									compact
									caption="Edit Shortcuts"
									spacing={{ b: 5, t: 5 }}
								>
									<TableHead>
										<TableRow>
											<TableCell>Label</TableCell>
											<TableCell>URL</TableCell>
											<TableCell className="text-right">Position</TableCell>
											<TableCell className="text-right">Add</TableCell>
											<TableCell className="text-right">Delete</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{section.shortcuts.map((shortcut, idx) => (
											<TableRow
												key={`${shortcut.url}-${shortcut.label}-${idx}`}
											>
												<TableCell>
													<TextInput
														focusMode="light"
														label="Shortcut label"
														labelHidden
														name="shortcut-label"
														value={shortcut.label}
														onChange={(e) => {
															shortcut.label = e.target.value;
														}}
													/>
												</TableCell>
												<TableCell>
													<TextArea
														textAreaClassName="font-mono text-sm"
														focusMode="light"
														label="URL"
														name="url"
														value={shortcut.url}
														onChange={(e) => {
															shortcut.url = e.target.value;
														}}
													/>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														{/* {shortcut.url !== section.shortcuts[0].url && ( */}
														{idx !== 0 && (
															<ButtonIcon
																noBorder
																label="Move up"
																mode="light"
																focusMode="alt-system"
																onClick={() => {
																	// onClickChangePosition({
																	// 	basicAuth,
																	// 	sectionId: section.id,
																	// 	direction: "up",
																	// 	dispatch,
																	// });
																}}
															>
																<IconUp monotone className="h-3 w-3" />
															</ButtonIcon>
														)}

														{/* {shortcut.url !== section.shortcuts[section.shortcuts.length - 1] .url && ( */}
														{idx !== section.shortcuts.length - 1 && (
															<ButtonIcon
																noBorder
																label="Move down"
																mode="light"
																focusMode="alt-system"
																onClick={() => {
																	// onClickChangePosition({
																	// 	basicAuth,
																	// 	sectionId: section.id,
																	// 	direction: "down",
																	// 	dispatch,
																	// });
																}}
															>
																<IconDown className="h-3 w-3" monotone />
															</ButtonIcon>
														)}
													</div>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end">
														<ButtonIcon
															mode="light"
															focusMode="alt-system"
															noBorder
															label="New Shortcut"
															onClick={() => {
																// onClickAddShortcut({
																// 	basicAuth,
																// 	section: section,
																// 	dispatch,
																// });
															}}
														>
															<IconAdd className="h-3 w-3" monotone />
														</ButtonIcon>
													</div>
												</TableCell>
												<TableCell className="text-right">
													<ButtonIcon
														focusMode="light"
														mode="light"
														noBorder
														label="Delete shortcut"
														onClick={() => {
															section.shortcuts = section.shortcuts.filter(
																(s) => s.url !== shortcut.url,
															);
														}}
													>
														<div className="text-red-400">
															<IconDelete className="h-3 w-3" monotone />
														</div>
													</ButtonIcon>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</>
						)}
						<div className="flex flex-wrap justify-center">
							{section.shortcuts.map((shortcut, idx) => {
								return (
									<ButtonLink
										focusMode="light"
										key={`${shortcut.url}-${shortcut.label}-${idx}`}
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
					</div>
				);
			})}
		</>
	) : (
		<div className="text-center font-bold">No shortcuts found.</div>
	);
};
