import { AuthProvider, useAuth } from "@versini/auth-provider";
import { Suspense, lazy, useReducer } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import {
	ACTION_STATUS_SUCCESS,
	DEFAULT_SESSION_EXPIRATION,
} from "../../common/constants";
import { AppContext } from "../../modules/App/AppContext";
import { reducer } from "../../modules/App/reducer";
import { Login } from "../../modules/Login/Login";
import { Root } from "../Layout/Root";

const LazyApp = lazy(() => import("./App"));
const LazySassySaint = lazy(() => import("./LazySassySaint"));
const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "",
				element: (
					<Suspense fallback={<div />}>
						<LazyApp />
					</Suspense>
				),
			},
			{
				path: "chat",
				element: (
					<Suspense fallback={<div />}>
						<LazySassySaint />
					</Suspense>
				),
			},
		],
	},
]);

const Bootstrap = () => {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Login />;
	}
	return <RouterProvider router={router} />;
};

export const AppBootstrap = () => {
	const [state, dispatch] = useReducer(reducer, {
		status: ACTION_STATUS_SUCCESS,
		sections: [],
		editMode: false,
		editSections: false,
	});
	return (
		<AuthProvider
			clientId={"b44c68f0-e5b3-4a1d-a3e3-df8632b0223b"}
			sessionExpiration={DEFAULT_SESSION_EXPIRATION}
		>
			<AppContext.Provider value={{ state, dispatch }}>
				<Bootstrap />
			</AppContext.Provider>
		</AuthProvider>
	);
};
