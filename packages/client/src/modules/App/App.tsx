import {
	ButtonIcon,
	Main,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableRow,
} from "@versini/ui-components";
import { TextInput } from "@versini/ui-form";
import { IconAdd, IconDelete, IconDown, IconUp } from "@versini/ui-icons";
import { ThemeProvider } from "@versini/ui-system";
import { useContext, useEffect, useRef, useState } from "react";

import { useAuth } from "@versini/auth-provider";
import {
	ACTION_INVALIDATE_SESSION,
	ACTION_REFRESH_DATA,
	ACTION_STATUS_ERROR,
	ACTION_STATUS_SUCCESS,
} from "../../common/constants";
import {
	onChangeSectionTitle,
	onClickAddSection,
	onClickChangeSectionPosition,
	onClickDeleteSection,
} from "../../common/handlers";
import { SectionProps } from "../../common/types";
import { SERVICE_TYPES, serviceCall } from "../../common/utilities";
import { AppFooter } from "../Common/AppFooter";
import { ConfirmationPanel } from "../Common/ConfirmationPanel";
import { Shortcuts } from "../Shortcuts/Shortcuts";
import { AppContext } from "./AppContext";

function App() {
	const { logout, isAuthenticated, getAccessToken } = useAuth();

	const [showConfirmation, setShowConfirmation] = useState(false);

	const { state, dispatch } = useContext(AppContext);

	const effectToGetShortcutsDidRun = useRef(false);
	const sectionToDeleteRef = useRef<SectionProps | null>(null);
	const customTheme = {
		"--av-action-dark-hover": "#64748b",
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: dispatch is not a dependency because it is a stable reference
	useEffect(() => {
		if (effectToGetShortcutsDidRun.current) {
			return;
		}
		/**
		 * User is not authenticated, we cannot request for data yet.
		 */
		if (!isAuthenticated) {
			return;
		}

		/**
		 * User is authenticated, we can request for data.
		 */
		(async () => {
			const accessToken = await getAccessToken();
			if (!accessToken) {
				dispatch({
					type: ACTION_INVALIDATE_SESSION,
					payload: {
						status: ACTION_STATUS_ERROR,
					},
				});
				return;
			}
			const response = await serviceCall({
				accessToken,
				type: SERVICE_TYPES.GET_SHORTCUTS,
			});

			if (response.status !== 200 || response?.errors?.length > 0) {
				dispatch({
					type: ACTION_INVALIDATE_SESSION,
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
						sections: data,
					},
				});
			}
		})();
		return () => {
			effectToGetShortcutsDidRun.current = true;
		};
	}, [isAuthenticated]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (state.status === ACTION_STATUS_ERROR) {
			logout();
		}
	}, [state.status]);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			<ConfirmationPanel
				setShowConfirmation={setShowConfirmation}
				showConfirmation={showConfirmation}
				action={async () => {
					onClickDeleteSection({
						dispatch,
						accessToken: await getAccessToken(),
						section: sectionToDeleteRef.current,
					});
				}}
			>
				<p>
					Are you sure you want to delete section{" "}
					<span className="text-lg">{sectionToDeleteRef?.current?.title}</span>?
				</p>
			</ConfirmationPanel>

			<ThemeProvider customTheme={customTheme} className="prose prose-lighter">
				<Main className="pt-0">
					{state && state?.sections?.length > 0 && state.editSections && (
						<div className="flex flex-wrap">
							<Table compact caption="Edit Sections" spacing={{ b: 5 }}>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
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
													onChange={async (e) => {
														onChangeSectionTitle({
															accessToken: await getAccessToken(),
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
															onClick={async () => {
																onClickChangeSectionPosition({
																	accessToken: await getAccessToken(),
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
															onClick={async () => {
																onClickChangeSectionPosition({
																	accessToken: await getAccessToken(),
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
														onClick={async () => {
															onClickAddSection({
																accessToken: await getAccessToken(),
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

								<TableFooter>
									<TableRow>
										<TableCell colSpan={4} className="text-center uppercase">
											{state.sections.length} sections
										</TableCell>
									</TableRow>
								</TableFooter>
							</Table>
						</div>
					)}
					{state && state?.sections?.length > 0 && <Shortcuts />}
				</Main>

				<AppFooter />
			</ThemeProvider>
		</AppContext.Provider>
	);
}

export default App;
