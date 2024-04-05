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
import { useContext, useRef, useState } from "react";

import { LOCAL_STORAGE_BASIC_AUTH } from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import type { SectionProps } from "../../common/types";
import { AppContext } from "../App/AppContext";
import { ConfirmationPanel } from "./ConfirmationPanel";
import { onChangeShortcut, onClickAddShortcut } from "./handlers";

export const Shortcuts = () => {
	const storage = useLocalStorage();
	const { state, dispatch } = useContext(AppContext);
	const [editable, setEditable] = useState<string | null>();
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [basicAuth] = useState(storage.get(LOCAL_STORAGE_BASIC_AUTH));
	const shortcutPositionRef = useRef<number | null>(null);
	const sectionWithShortcutRef = useRef<SectionProps | null>(null);

	return state && state?.sections?.length > 0 ? (
		<>
			{showConfirmation && (
				<ConfirmationPanel
					basicAuth={basicAuth}
					dispatch={dispatch}
					position={shortcutPositionRef.current}
					section={sectionWithShortcutRef.current}
					setShowConfirmation={setShowConfirmation}
					showConfirmation={showConfirmation}
				/>
			)}

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
								}}
							>
								<IconEdit className="h-3 w-3" />
							</ButtonIcon>
						</h2>

						{editable && editable === section.id && (
							<Table compact caption="Edit Shortcuts" spacing={{ b: 5, t: 5 }}>
								<TableHead>
									<TableRow>
										<TableCell>Label</TableCell>
										<TableCell>URL</TableCell>
										<TableCell className="text-right">Move</TableCell>
										<TableCell className="text-right">Add</TableCell>
										<TableCell className="text-right">Delete</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{section.shortcuts.map((shortcut, idx) => (
										<TableRow key={`edit-shortcut-${shortcut.id}`}>
											<TableCell>
												<TextInput
													focusMode="light"
													label="Shortcut label"
													labelHidden
													name={shortcut.label}
													defaultValue={shortcut.label}
													onChange={(e) => {
														onChangeShortcut({
															position: idx,
															basicAuth,
															label: e.target.value,
															section,
															dispatch,
														});
													}}
												/>
											</TableCell>
											<TableCell>
												<TextArea
													textAreaClassName="font-mono text-sm"
													focusMode="light"
													label="URL"
													name={shortcut.url}
													defaultValue={shortcut.url}
													onChange={(e) => {
														onChangeShortcut({
															position: idx,
															basicAuth,
															url: e.target.value,
															section,
															dispatch,
														});
													}}
												/>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
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
															onClickAddShortcut({
																basicAuth,
																dispatch,
																position: idx,
																section,
															});
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
													disabled={section.shortcuts.length === 1}
													onClick={() => {
														shortcutPositionRef.current = idx;
														sectionWithShortcutRef.current = section;
														setShowConfirmation(true);
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
