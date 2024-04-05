import {
	ButtonIcon,
	Footer,
	Header,
	Main,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@versini/ui-components";
import { TextInput } from "@versini/ui-form";
import {
	IconAdd,
	IconDelete,
	IconDown,
	IconEdit,
	IconUp,
} from "@versini/ui-icons";
import { useEffect, useReducer, useRef, useState } from "react";

import {
	ACTION_REFRESH_DATA,
	ACTION_STATUS_ERROR,
	ACTION_STATUS_SUCCESS,
	LOCAL_STORAGE_BASIC_AUTH,
} from "../../common/constants";
import {
	onChangeSectionTitle,
	onClickAddSection,
	onClickChangeSectionPosition,
} from "../../common/handlers";
import { useLocalStorage } from "../../common/hooks";
import { APP_NAME, APP_OWNER, FAKE_USER_EMAIL } from "../../common/strings";
import { SectionProps } from "../../common/types";
import { getShortcuts } from "../../common/utilities";
import { Login } from "../Login/Login";
import { Shortcuts } from "../Shortcuts/Shortcuts";
import { AppContext } from "./AppContext";
import { ConfirmationPanel } from "./ConfirmationPanel";
import { reducer } from "./reducer";

function App() {
	const storage = useLocalStorage();
	const [errorMessage, setErrorMessage] = useState("");
	const [editable, setEditable] = useState<boolean | null>();
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [basicAuth, setBasicAuth] = useState(
		storage.get(LOCAL_STORAGE_BASIC_AUTH),
	);
	const [state, dispatch] = useReducer(reducer, {
		status: ACTION_STATUS_SUCCESS,
		sections: [],
	});
	const sectionToDeleteRef = useRef<SectionProps | null>(null);

	/**
	 * Fade out the logo and fade in the app.
	 */
	useEffect(() => {
		document.getElementById("logo")?.classList.add("fadeOut");
		setTimeout(() => {
			document
				.getElementById("root")
				?.classList.replace("app-hidden", "fadeIn");
		}, 500);
	});

	useEffect(() => {
		/**
		 * User is not authenticated, we cannot request for data yet.
		 */
		if (!basicAuth || basicAuth === "") {
			return;
		}

		/**
		 * User is authenticated, we can request for data.
		 */
		(async () => {
			const response = await getShortcuts({
				userId: FAKE_USER_EMAIL,
				basicAuth,
			});

			if (response.status !== 200) {
				if (response.status === 401) {
					storage.remove(LOCAL_STORAGE_BASIC_AUTH);
					setBasicAuth("");
					setErrorMessage("Invalid credentials");
				}
				dispatch({
					type: ACTION_REFRESH_DATA,
					payload: {
						status: ACTION_STATUS_ERROR,
						sections: [],
					},
				});
			} else {
				const data = response.data;
				dispatch({
					type: ACTION_REFRESH_DATA,
					payload: {
						status: ACTION_STATUS_SUCCESS,
						sections: data,
					},
				});
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [basicAuth]);

	/**
	 * User is not authenticated, we need to show simple login form.
	 */
	if (!basicAuth || basicAuth === "") {
		return (
			<AppContext.Provider value={{ state, dispatch }}>
				<div className="prose prose-lighter">
					<Header>
						<h1 className="text-center">My Shortcuts</h1>
					</Header>
					<Main>
						<Login
							storage={storage}
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
							setBasicAuth={setBasicAuth}
						/>
					</Main>
					<Footer
						mode="light"
						row1={
							<div>
								{APP_NAME} v{import.meta.env.BUILDVERSION} -{" "}
								{import.meta.env.BUILDTIME}
							</div>
						}
						row2={
							<div>
								&copy; {new Date().getFullYear()} {APP_OWNER}
							</div>
						}
					/>
				</div>
			</AppContext.Provider>
		);
	}

	/**
	 * User is fully authenticated. We can show the app.
	 */
	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{showConfirmation && (
				<ConfirmationPanel
					basicAuth={basicAuth}
					dispatch={dispatch}
					sectionToDeleteRef={sectionToDeleteRef}
					setShowConfirmation={setShowConfirmation}
					showConfirmation={showConfirmation}
				/>
			)}

			<div className="prose prose-lighter">
				<Header>
					<h1 className="heading mb-0 text-center">
						My Shortcuts
						{state && state?.sections?.length > 0 && (
							<ButtonIcon
								focusMode="light"
								mode="light"
								noBorder
								size="small"
								className="ml-2"
								label="Edit section"
								onClick={() => {
									setEditable(!editable);
								}}
							>
								<IconEdit />
							</ButtonIcon>
						)}
					</h1>
				</Header>

				<Main className="pt-0">
					{state && state?.sections?.length > 0 && editable && (
						<div className="flex flex-wrap px-10">
							<Table compact caption="Edit Sections" spacing={{ b: 5 }}>
								<TableHead>
									<TableRow>
										<TableCell>Section</TableCell>
										<TableCell className="text-right">Move</TableCell>
										<TableCell className="text-right">Add</TableCell>
										<TableCell className="text-right">Delete</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{state.sections.map((section, idx) => (
										<TableRow key={section.id}>
											<TableCell>
												<TextInput
													labelHidden
													focusMode="light"
													label="Section Title"
													name={section.title}
													defaultValue={section.title}
													onChange={(e) => {
														onChangeSectionTitle({
															basicAuth,
															e,
															section,
															dispatch,
															state,
														});
													}}
												/>
											</TableCell>
											<TableCell>
												<div className="flex justify-end gap-2">
													{section.id !== state.sections[0].id && (
														<ButtonIcon
															noBorder
															label="Move up"
															mode="light"
															focusMode="alt-system"
															onClick={() => {
																onClickChangeSectionPosition({
																	basicAuth,
																	sectionId: section.id,
																	direction: "up",
																	dispatch,
																});
															}}
														>
															<IconUp monotone className="h-3 w-3" />
														</ButtonIcon>
													)}

													{section.id !==
														state.sections[state.sections.length - 1].id && (
														<ButtonIcon
															noBorder
															label="Move down"
															mode="light"
															focusMode="alt-system"
															onClick={() => {
																onClickChangeSectionPosition({
																	basicAuth,
																	sectionId: section.id,
																	direction: "down",
																	dispatch,
																});
															}}
														>
															<IconDown className="h-3 w-3" monotone />
														</ButtonIcon>
													)}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex justify-end">
													<ButtonIcon
														mode="light"
														focusMode="alt-system"
														noBorder
														label="New Section"
														onClick={() => {
															onClickAddSection({
																basicAuth,
																dispatch,
																sections: state.sections,
																position: idx,
															});
														}}
													>
														<IconAdd className="h-3 w-3" monotone />
													</ButtonIcon>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex justify-end">
													<ButtonIcon
														mode="light"
														focusMode="alt-system"
														noBorder
														label="Delete Section"
														onClick={() => {
															sectionToDeleteRef.current = section;
															setShowConfirmation(true);
														}}
													>
														<div className="text-red-400">
															<IconDelete className="h-3 w-3" monotone />
														</div>
													</ButtonIcon>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
					{state && state?.sections?.length > 0 && <Shortcuts />}
				</Main>
				<Footer
					mode="light"
					row1={
						<div>
							{APP_NAME} v{import.meta.env.BUILDVERSION} -{" "}
							{import.meta.env.BUILDTIME}
						</div>
					}
					row2={
						<div>
							&copy; {new Date().getFullYear()} {APP_OWNER}
						</div>
					}
				/>
			</div>
		</AppContext.Provider>
	);
}

export default App;
