import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useReducer } from "react";

import { ACTION_DATA } from "../../common/constants";
import { FAKE_USER_EMAIL, LOG_IN } from "../../common/strings";
import { isDev, serviceCall } from "../../common/utilities";
import { Button, Footer, Main } from "../../components";
import { Shortcuts } from "../Shortcuts/Shortcuts";
import { AppContext } from "./AppContext";
import { reducer } from "./reducer";

function App() {
	const { isLoading, loginWithRedirect, isAuthenticated, user } = useAuth0();
	const [state, dispatch] = useReducer(reducer, {
		shortcuts: [],
	});

	useEffect(() => {
		if (isLoading && !isDev) {
			return;
		}
		document.getElementById("logo")?.classList.add("fadeOut");
		setTimeout(() => {
			document
				.getElementById("root")
				?.classList.replace("app-hidden", "fadeIn");
		}, 500);
	}, [isLoading]);

	useEffect(() => {
		if (!isAuthenticated || isLoading) {
			return;
		}
		(async () => {
			try {
				const response = await serviceCall({
					name: "shortcuts",
					data: {
						user: user?.email || FAKE_USER_EMAIL,
					},
				});

				if (response.status !== 200) {
					dispatch({
						type: ACTION_DATA,
						payload: {
							shortcuts: [],
						},
					});
				} else {
					const data = await response.json();
					dispatch({
						type: ACTION_DATA,
						payload: {
							shortcuts: data,
						},
					});
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		})();
	}, [isAuthenticated, isLoading, user?.email]);

	if (isLoading) {
		return null;
	}

	if (!isAuthenticated) {
		return (
			<AppContext.Provider value={{ state, dispatch }}>
				<Main>
					<Button className="mt-6 mb-4" onClick={() => loginWithRedirect()}>
						{LOG_IN}
					</Button>
				</Main>
				<Footer />
			</AppContext.Provider>
		);
	}

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
