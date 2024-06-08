import { Suspense, lazy, useReducer } from "react";

import {
	ACTION_STATUS_SUCCESS,
	DEFAULT_SESSION_EXPIRATION,
	LOCAL_STORAGE_PREFIX,
} from "../../common/constants";
import { AppContext } from "../../modules/App/AppContext";
import { reducer } from "../../modules/App/reducer";
import { AuthProvider, useAuth } from "../../modules/AuthProvider";
import { Login } from "../../modules/Login/Login";

const LazyApp = lazy(() => import("./App"));

const Bootstrap = () => {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Login />;
	}
	return (
		<Suspense fallback={<div />}>
			<LazyApp />
		</Suspense>
	);
};

export const AppBootstrap = () => {
	const [state, dispatch] = useReducer(reducer, {
		status: ACTION_STATUS_SUCCESS,
		sections: [],
	});
	return (
		<AuthProvider
			clientId={LOCAL_STORAGE_PREFIX}
			sessionExpiration={DEFAULT_SESSION_EXPIRATION}
		>
			<AppContext.Provider value={{ state, dispatch }}>
				<Bootstrap />
			</AppContext.Provider>
		</AuthProvider>
	);
};
