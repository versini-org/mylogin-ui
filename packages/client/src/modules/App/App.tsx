import {
	Button,
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
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { lazy, Suspense, useEffect, useReducer, useRef, useState } from "react";

import {
	ACTION_REFRESH_DATA,
	ACTION_SET_STATUS,
	ACTION_STATUS_ERROR,
	ACTION_STATUS_SUCCESS,
	LOCAL_STORAGE_BASIC_AUTH,
} from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import { APP_NAME, APP_OWNER, FAKE_USER_EMAIL } from "../../common/strings";
import { SectionProps } from "../../common/types";
import {
	addSection,
	addShortcuts,
	changeSectionPosition,
	deleteSection,
	editSectionTitle,
	getShortcuts,
} from "../../common/utilities";
import { Login } from "../Login/Login";
import { Shortcuts } from "../Shortcuts/Shortcuts";
import { AppContext } from "./AppContext";
import { reducer } from "./reducer";

const LazyPanel = lazy(() => import("../Lazy/Panel"));

const onClickAddSection = async ({
	basicAuth,
	dispatch,
	sections,
}: {
	basicAuth: any;
	dispatch: any;
	sections: any;
}) => {
	const response = await addSection({
		userId: FAKE_USER_EMAIL,
		basicAuth,
	});
	if (response.status !== 200) {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	} else {
		const data = response.data;
		dispatch({
			type: ACTION_REFRESH_DATA,
			payload: {
				status: ACTION_STATUS_SUCCESS,
				sections: [...sections, data],
			},
		});
	}
};

const onChangeSectionTitle = async ({
	e,
	section,
	dispatch,
	basicAuth,
	state,
}: {
	basicAuth: any;
	dispatch: any;
	e: any;
	section: any;
	state: any;
}) => {
	const response = await editSectionTitle({
		userId: FAKE_USER_EMAIL,
		basicAuth,
		sectionId: section.id,
		sectionTitle: e.target.value,
	});
	if (response.status !== 200) {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	} else {
		const editedSection = response.data;
		const sections = state.sections.map((s: any) => {
			if (s.id === editedSection.id) {
				return editedSection;
			}
			return s;
		});

		dispatch({
			type: ACTION_REFRESH_DATA,
			payload: {
				status: ACTION_STATUS_SUCCESS,
				sections,
			},
		});
	}
};

const onClickChangePosition = async ({
	basicAuth,
	sectionId,
	direction,
	dispatch,
}: {
	basicAuth: any;
	direction: string;
	dispatch: any;
	sectionId: string;
}) => {
	const response = await changeSectionPosition({
		userId: FAKE_USER_EMAIL,
		basicAuth,
		sectionId,
		direction,
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
};

const onClickAddShortcut = async ({
	basicAuth,
	section,
	dispatch,
}: {
	basicAuth: any;
	dispatch: any;
	section: any;
}) => {
	const response = await addShortcuts({
		userId: FAKE_USER_EMAIL,
		basicAuth,
		sectionId: section.id,
		sectionTitle: section.title,
		shortcuts: [
			...section.shortcuts,
			{
				label: "New Shortcut",
				url: "https://example.com",
			},
		],
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
};

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

	const onClickDeleteSection = async ({ dispatch }: { dispatch: any }) => {
		setShowConfirmation(!showConfirmation);
		const response = await deleteSection({
			userId: FAKE_USER_EMAIL,
			basicAuth,
			sectionId: sectionToDeleteRef?.current?.id,
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
	};

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
				<Suspense fallback={<div />}>
					<LazyPanel
						kind="messagebox"
						open={showConfirmation}
						onOpenChange={setShowConfirmation}
						title="Delete Section"
						footer={
							<Flexgrid columnGap={2} alignHorizontal="flex-end">
								<FlexgridItem>
									<Button
										mode="dark"
										variant="secondary"
										focusMode="light"
										onClick={() => {
											setShowConfirmation(false);
										}}
									>
										Cancel
									</Button>
								</FlexgridItem>
								<FlexgridItem>
									<Button
										mode="dark"
										variant="danger"
										focusMode="light"
										onClick={() => {
											onClickDeleteSection({
												dispatch,
											});
										}}
									>
										Delete
									</Button>
								</FlexgridItem>
							</Flexgrid>
						}
					>
						<p>
							Are you sure you want to delete section{" "}
							<span className="text-lg">
								{sectionToDeleteRef?.current?.title}
							</span>
							?
						</p>
					</LazyPanel>
				</Suspense>
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
							<Button
								focusMode="light"
								noBorder
								spacing={{ b: 5 }}
								onClick={() => {
									onClickAddSection({
										basicAuth,
										dispatch,
										sections: state.sections,
									});
								}}
							>
								Add New Section
							</Button>
							<Table compact caption="Edit Sections" spacing={{ b: 5 }}>
								<TableHead>
									<TableRow>
										<TableCell>Section</TableCell>
										<TableCell className="text-right">Position</TableCell>
										<TableCell className="text-right">New Shortcut</TableCell>
										<TableCell className="text-right">Delete</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{state.sections.map((section) => (
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
																onClickChangePosition({
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
																onClickChangePosition({
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
														label="New Shortcut"
														onClick={() => {
															onClickAddShortcut({
																basicAuth,
																section: section,
																dispatch,
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
