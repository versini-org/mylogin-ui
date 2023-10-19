import { useEffect, useReducer, useState } from "react";

import {
	ACTION_GET_DATA,
	ACTION_SET_STATUS,
	ACTION_STATUS_ERROR,
	ACTION_STATUS_SUCCESS,
	LOCAL_STORAGE_BASIC_AUTH,
} from "../../common/constants";
import { useLocalStorage } from "../../common/hooks";
import {
	FAKE_USER_EMAIL,
	LOG_IN,
	PASSWORD_PLACEHOLDER,
} from "../../common/strings";
import { serviceCall } from "../../common/utilities";
import { Button, Footer, Main, TextInput } from "../../components";
import { Shortcuts } from "../Shortcuts/Shortcuts";
import { AppContext } from "./AppContext";
import { reducer } from "./reducer";

function App() {
	const storage = useLocalStorage();
	const [basicAuth, setBasicAuth] = useState(
		storage.get(LOCAL_STORAGE_BASIC_AUTH),
	);
	const [simpleLogin, setSimpleLogin] = useState({
		password: "",
	});
	const [errorMessage, setErrorMessage] = useState("");
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
				<Main>
					<form className="mx-auto flex w-96 flex-col flex-wrap">
						<TextInput
							type="password"
							placeholder={PASSWORD_PLACEHOLDER}
							onChange={(e) => {
								setSimpleLogin({ ...simpleLogin, password: e.target.value });
								setErrorMessage("");
							}}
							errorMessage={errorMessage}
						/>

						<Button
							type="submit"
							className="mb-4 mt-6"
							onClick={(e) => {
								e.preventDefault();
								const data = `${btoa(
									`${FAKE_USER_EMAIL}:${simpleLogin.password}`,
								)}`;
								storage.set(LOCAL_STORAGE_BASIC_AUTH, data);
								setBasicAuth(storage.get(LOCAL_STORAGE_BASIC_AUTH));
							}}
						>
							{LOG_IN}
						</Button>
					</form>
				</Main>
				<Footer />
			</AppContext.Provider>
		);
	}

	/**
	 * User is fully authenticated. We can show the app.
	 */
	return (
		<AppContext.Provider value={{ state, dispatch }}>
			<Main>
				<Shortcuts />
			</Main>
			<Footer />
		</AppContext.Provider>
	);
}

export default App;
