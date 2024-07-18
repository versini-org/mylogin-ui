import { AuthProvider, useAuth } from "@versini/auth-provider";
import { Suspense, lazy, useReducer } from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";

import { ACTION_STATUS_SUCCESS, CLIENT_ID } from "../../common/constants";
import { DOMAIN } from "../../common/utilities";
import { AppContext } from "../../modules/App/AppContext";
import { reducer } from "../../modules/App/reducer";
import { Login } from "../../modules/Login/Login";
import { Root } from "../Layout/Root";

const params = new URL(document.location.href).searchParams;
const debug = Boolean(params.get("debug")) || false;

const LazyApp = lazy(() => import("./App"));
const LazySassySaint = lazy(() => import("./LazySassySaint"));
const router = createHashRouter([
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
		<AuthProvider clientId={CLIENT_ID} domain={DOMAIN} debug={debug}>
			<AppContext.Provider value={{ state, dispatch }}>
				<Bootstrap />
			</AppContext.Provider>
		</AuthProvider>
	);
};
