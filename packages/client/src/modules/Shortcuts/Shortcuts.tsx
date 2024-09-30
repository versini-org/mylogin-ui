import { useAuth } from "@versini/auth-provider";
import { Anchor } from "@versini/ui-anchor";
import { ButtonIcon } from "@versini/ui-button";
import { Card } from "@versini/ui-card";
import {
	IconAdd,
	IconDelete,
	IconDown,
	IconEdit,
	IconUp,
} from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableRow,
} from "@versini/ui-table";
import { TextArea } from "@versini/ui-textarea";
import { TextInput } from "@versini/ui-textinput";
import { useContext, useRef, useState } from "react";

import { CARD_SECTION, CARD_SECTION_VISIBLE } from "../../common/constants";
import {
	onChangeShortcut,
	onClickAddShortcut,
	onClickChangeShortcutPosition,
	onClickDeleteShortcut,
} from "../../common/handlers";
import type { SectionProps } from "../../common/types";
import { AppContext } from "../App/AppContext";
import { ConfirmationPanel } from "../Common/ConfirmationPanel";

export const Shortcuts = () => {
	const { state, dispatch } = useContext(AppContext);
	const [editable, setEditable] = useState<string | null>();
	const [showConfirmation, setShowConfirmation] = useState(false);
	const shortcutPositionRef = useRef<number | null>(null);
	const sectionWithShortcutRef = useRef<SectionProps | null>(null);

	const { getAccessToken } = useAuth();

	return state && state?.sections?.length > 0 ? (
		<>
			<ConfirmationPanel
				setShowConfirmation={setShowConfirmation}
				showConfirmation={showConfirmation}
				action={async () => {
					onClickDeleteShortcut({
						accessToken: await getAccessToken(),
						dispatch,
						section: sectionWithShortcutRef.current,
						position: shortcutPositionRef.current,
					});
				}}
			>
				<p>Are you sure you want to delete the following shortcut:</p>
				<ol>
					<li>
						Label:{" "}
						<span className="text-lg">
							{
								sectionWithShortcutRef?.current?.shortcuts[
									shortcutPositionRef?.current || 0
								]?.label
							}
						</span>
					</li>
					<li>
						Section:{" "}
						<span className="text-lg">
							{sectionWithShortcutRef?.current?.title}
						</span>
					</li>
				</ol>
			</ConfirmationPanel>

			{state.sections.map((section) => {
				return (
					<Card
						className={CARD_SECTION}
						compact
						mode="dark"
						key={section.id}
						spacing={{ b: 2 }}
						header={
							<Flexgrid alignHorizontal="space-between">
								<FlexgridItem>
									<h2 className="heading">{section.title}</h2>
								</FlexgridItem>
								<FlexgridItem>
									{state && state?.sections?.length > 0 && state.editMode && (
										<ButtonIcon
											noBackground
											focusMode="light"
											mode="light"
											noBorder
											size="small"
											label={`Edit shortcuts for section ${section.title}`}
											onClick={() => {
												setEditable(
													editable === section.id ? null : section.id,
												);
											}}
										>
											<IconEdit className="h-3 w-3" />
										</ButtonIcon>
									)}
								</FlexgridItem>
							</Flexgrid>
						}
					>
						<div>
							{editable && editable === section.id && (
								<Table
									compact
									caption="Edit Shortcuts"
									spacing={{ b: 5, t: 5 }}
								>
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
														onChange={async (e) => {
															onChangeShortcut({
																position: idx,
																accessToken: await getAccessToken(),
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
														onChange={async (e) => {
															onChangeShortcut({
																position: idx,
																accessToken: await getAccessToken(),
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
																onClick={async () => {
																	onClickChangeShortcutPosition({
																		accessToken: await getAccessToken(),
																		section,
																		direction: "up",
																		dispatch,
																		position: idx,
																	});
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
																onClick={async () => {
																	onClickChangeShortcutPosition({
																		accessToken: await getAccessToken(),
																		section,
																		direction: "down",
																		dispatch,
																		position: idx,
																	});
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
															onClick={async () => {
																onClickAddShortcut({
																	accessToken: await getAccessToken(),
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

									<TableFooter>
										<TableRow>
											<TableCell colSpan={5} className="text-center uppercase">
												{section.shortcuts.length} shortcuts
											</TableCell>
										</TableRow>
									</TableFooter>
								</Table>
							)}
							<div className="flex flex-wrap justify-center">
								{section.shortcuts.map((shortcut, idx) => {
									return (
										<Anchor
											key={`${shortcut.url}-${shortcut.label}-${idx}`}
											className={`mr-1 mt-1 w-44 sm:w-52 btn-shortcut ${CARD_SECTION_VISIBLE}`}
											focusMode="light"
											href={shortcut.url}
											mode="dark"
											noBorder
											noNewWindowIcon
											target="_blank"
										>
											{shortcut.label}
										</Anchor>
									);
								})}
							</div>
						</div>
					</Card>
				);
			})}
		</>
	) : (
		<div className="text-center font-bold">No shortcuts found.</div>
	);
};
