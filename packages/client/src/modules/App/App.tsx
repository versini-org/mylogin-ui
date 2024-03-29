import {
	Button,
	ButtonIcon,
	Footer,
	Header,
	Main,
	Panel,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@versini/ui-components";
import { IconDelete, IconDown, IconEdit, IconUp } from "@versini/ui-icons";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";
import { useEffect, useReducer, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
	ACTION_GET_DATA,
	ACTION_SET_STATUS,
	ACTION_STATUS_ERROR,
	ACTION_STATUS_SUCCESS,
	LOCAL_STORAGE_BASIC_AUTH,
} from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import { APP_NAME, APP_OWNER, FAKE_USER_EMAIL } from "../../common/strings";
import { SectionProps } from "../../common/types";
import { GRAPHQL_QUERIES, graphQLCall } from "../../common/utilities";
import { Login } from "../Login/Login";
import { Shortcuts } from "../Shortcuts/Shortcuts";
import { AppContext } from "./AppContext";
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

	const onClickChangePosition = async ({
		sectionId,
		direction,
		dispatch,
	}: {
		direction: string;
		dispatch: any;
		sectionId: string;
	}) => {
		const authorization = `Basic ${basicAuth}`;

		try {
			const response = await graphQLCall({
				headers: {
					authorization,
				},
				query: GRAPHQL_QUERIES.CHANGE_SECTION_POSITION,
				data: {
					userId: FAKE_USER_EMAIL,
					sectionId,
					direction,
				},
			});

			if (response.status !== 200) {
				dispatch({
					type: ACTION_SET_STATUS,
					payload: {
						status: ACTION_STATUS_ERROR,
					},
				});
			} else {
				const data = await response.json();
				dispatch({
					type: ACTION_GET_DATA,
					payload: {
						status: ACTION_STATUS_SUCCESS,
						sections: data.data.changeSectionPosition,
					},
				});
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	};

	const onClickDeleteSection = async ({ dispatch }: { dispatch: any }) => {
		setShowConfirmation(!showConfirmation);
		const authorization = `Basic ${basicAuth}`;
		try {
			const response = await graphQLCall({
				headers: {
					authorization,
				},
				query: GRAPHQL_QUERIES.DELETE_SECTION,
				data: {
					userId: FAKE_USER_EMAIL,
					sectionId: sectionToDeleteRef?.current?.id,
				},
			});
			if (response.status !== 200) {
				dispatch({
					type: ACTION_SET_STATUS,
					payload: {
						status: ACTION_STATUS_ERROR,
					},
				});
			} else {
				const data = await response.json();
				dispatch({
					type: ACTION_GET_DATA,
					payload: {
						status: ACTION_STATUS_SUCCESS,
						sections: data.data.deleteSection,
					},
				});
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	};

	const onClickAddSection = async () => {
		const authorization = `Basic ${basicAuth}`;
		try {
			const response = await graphQLCall({
				headers: {
					authorization,
				},
				query: GRAPHQL_QUERIES.ADD_SECTION,
				data: {
					userId: FAKE_USER_EMAIL,
					sectionTitle: "New Section",
					shortcuts: [
						{ label: "New Shortcut", url: "https://example.com", id: uuidv4() },
					],
				},
			});
			if (response.status !== 200) {
				dispatch({
					type: ACTION_SET_STATUS,
					payload: {
						status: ACTION_STATUS_ERROR,
					},
				});
			} else {
				const data = await response.json();
				dispatch({
					type: ACTION_GET_DATA,
					payload: {
						status: ACTION_STATUS_SUCCESS,
						sections: data.data.addSection,
					},
				});
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	};

	useEffect(() => {
		document.getElementById("logo")?.classList.add("fadeOut");
		setTimeout(() => {
			document
				.getElementById("root")
				?.classList.replace("app-hidden", "fadeIn");
		}, 500);
	});

	useEffect(() => {
		if (state.sections.length !== 1 || state.status !== "stale") {
			return;
		}

		const authorization = `Basic ${basicAuth}`;

		(async () => {
			try {
				const response = await graphQLCall({
					headers: {
						authorization,
					},
					query: GRAPHQL_QUERIES.SET_SHORTCUTS,
					data: {
						userId: FAKE_USER_EMAIL,
						sectionId: state.sections[0].id,
						sectionTitle: state.sections[0].title,
						shortcuts: state.sections[0].shortcuts,
					},
				});

				if (response.status !== 200) {
					dispatch({
						type: ACTION_SET_STATUS,
						payload: {
							status: ACTION_STATUS_ERROR,
						},
					});
				} else {
					const data = await response.json();
					dispatch({
						type: ACTION_GET_DATA,
						payload: {
							status: ACTION_STATUS_SUCCESS,
							sections: data.data.updateUserShortcuts,
						},
					});
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.sections, state.status]);

	useEffect(() => {
		let authorization = "";

		/**
		 * User is not authenticated, we cannot request for data yet.
		 */
		if (!basicAuth || basicAuth === "") {
			return;
		}

		/**
		 * User is authenticated, we can request for data, with the
		 * corresponding basic auth header.
		 */
		if (basicAuth && basicAuth !== "") {
			authorization = `Basic ${basicAuth}`;
		}

		(async () => {
			try {
				const response = await graphQLCall({
					headers: {
						authorization,
					},
					query: GRAPHQL_QUERIES.GET_SHORTCUTS,
					data: {
						userId: FAKE_USER_EMAIL,
					},
				});

				if (response.status !== 200) {
					if (response.status === 401) {
						storage.remove(LOCAL_STORAGE_BASIC_AUTH);
						setBasicAuth("");
						setErrorMessage("Invalid credentials");
					}
					dispatch({
						type: ACTION_GET_DATA,
						payload: {
							status: ACTION_STATUS_ERROR,
							sections: [],
						},
					});
				} else {
					const data = await response.json();
					dispatch({
						type: ACTION_GET_DATA,
						payload: {
							status: ACTION_STATUS_SUCCESS,
							sections: data.data.getUserSections,
						},
					});
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
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
			<Panel
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
					<span className="text-lg">{sectionToDeleteRef?.current?.title}</span>
				</p>
			</Panel>
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
								onClick={onClickAddSection}
							>
								Add New Section
							</Button>
							<Table caption="Edit Sections" spacing={{ b: 5 }}>
								<TableHead>
									<TableRow>
										<TableCell>Section</TableCell>
										<TableCell className="text-right">Position</TableCell>
										<TableCell className="text-right">Delete</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{state.sections.map((section) => (
										<TableRow key={section.id}>
											<TableCell>{section.title}</TableCell>
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
														label="Delete chat"
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
