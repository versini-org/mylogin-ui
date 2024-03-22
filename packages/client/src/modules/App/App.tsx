import { ButtonIcon, Footer, Header, Main } from "@versini/ui-components";
import { IconEdit } from "@versini/ui-icons";
import { useEffect, useReducer, useState } from "react";

import {
	ACTION_GET_DATA,
	ACTION_SET_STATUS,
	ACTION_STATUS_ERROR,
	ACTION_STATUS_SUCCESS,
	LOCAL_STORAGE_BASIC_AUTH,
} from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import { APP_NAME, APP_OWNER, FAKE_USER_EMAIL } from "../../common/strings";
import { serviceCall } from "../../common/utilities";
import { Login } from "../Login/Login";
import { Shortcuts } from "../Shortcuts/Shortcuts";
import { AppContext } from "./AppContext";
import { reducer } from "./reducer";

function App() {
	const storage = useLocalStorage();
	const [errorMessage, setErrorMessage] = useState("");
	const [basicAuth, setBasicAuth] = useState(
		storage.get(LOCAL_STORAGE_BASIC_AUTH),
	);
	const [state, dispatch] = useReducer(reducer, {
		status: ACTION_STATUS_SUCCESS,
		shortcuts: [],
	});

	useEffect(() => {
		document.getElementById("logo")?.classList.add("fadeOut");
		setTimeout(() => {
			document
				.getElementById("root")
				?.classList.replace("app-hidden", "fadeIn");
		}, 500);
	});

	useEffect(() => {
		if (state.shortcuts.length === 0 || state.status !== "stale") {
			return;
		}

		const authorization = `Basic ${basicAuth}`;

		(async () => {
			try {
				const response = await serviceCall({
					name: "update-shortcuts",
					headers: {
						authorization,
					},
					data: {
						user: FAKE_USER_EMAIL,
						shortcuts: state.shortcuts,
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
							shortcuts: data,
						},
					});
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.shortcuts, state.status]);

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
				const response = await serviceCall({
					name: "shortcuts",
					headers: {
						authorization,
					},
					data: {
						user: FAKE_USER_EMAIL,
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
							shortcuts: [],
						},
					});
				} else {
					const data = await response.json();
					dispatch({
						type: ACTION_GET_DATA,
						payload: {
							status: ACTION_STATUS_SUCCESS,
							shortcuts: data,
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
			<div className="prose prose-lighter">
				<Header>
					<h1 className="heading mb-0 text-center">
						My Shortcuts
						<ButtonIcon
							focusMode="light"
							mode="light"
							noBorder
							size="small"
							className="ml-2"
							label="Edit section"
							// onClick={() => {
							// 	setEditable(
							// 		editable === item.position ? null : item.position,
							// 	);
							// 	setUserInputSectionTitle(JSON.stringify(item.title, null, 2));
							// 	setUserInputShortcuts(JSON.stringify(item.data, null, 2));
							// }}
						>
							<IconEdit
							// className="h-3 w-3"
							/>
						</ButtonIcon>
					</h1>
				</Header>
				<Main className="pt-0">
					{state && state?.shortcuts?.length > 0 && <Shortcuts />}
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
