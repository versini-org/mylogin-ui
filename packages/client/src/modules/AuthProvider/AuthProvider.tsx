import { useLocalStorage } from "@versini/ui-hooks";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { AuthContext } from "./AuthContext";

type AuthState = {
	isAuthenticated: boolean;
	idToken: string;
	logoutReason: string;
	userId: string;
	accessToken?: string;
	refreshToken?: string;
};
export const AUTH_TYPES = {
	ID_TOKEN: "id_token",
};
const EXPIRED_SESSION =
	"Oops! It looks like your session has expired. For your security, please log in again to continue.";

const serviceCall = async ({ params = {} }: { params?: any }) => {
	try {
		const nonce = uuidv4();
		const response = await fetch(
			`${process.env.PUBLIC_AUTH_SERVER_URL}/authenticate`,
			{
				credentials: "include",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Auth-TenantId": `${params.tenantId}`,
				},
				body: JSON.stringify({ ...params, nonce }),
			},
		);

		if (response.status !== 200) {
			return { status: response.status, data: [] };
		}
		const { data, errors } = await response.json();
		if (data.nonce !== nonce) {
			return { status: 500, data: [] };
		}

		return {
			status: response.status,
			data,
			errors,
		};
	} catch (_error) {
		console.error(_error);
		return { status: 500, data: [] };
	}
};

function usePrevious<T>(state: T): T | undefined {
	const ref = useRef<T>();
	useEffect(() => {
		ref.current = state;
	});
	return ref.current;
}

export const AuthProvider = ({
	children,
	sessionExpiration,
	tenantId,
	accessType,
}: {
	children: React.ReactNode;
	sessionExpiration?: string;
	tenantId: string;
	accessType?: string;
}) => {
	const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage(
		`@@auth@@::${tenantId}::@@access@@`,
		"",
	);
	const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage(
		`@@auth@@::${tenantId}::@@refresh@@`,
		"",
	);
	const [idToken, setIdToken, removeIdToken] = useLocalStorage(
		`@@auth@@::${tenantId}::@@user@@`,
		"",
	);
	const [authState, setAuthState] = useState<AuthState>({
		isAuthenticated: !!idToken,
		accessToken,
		refreshToken,
		idToken,
		logoutReason: "",
		userId: "",
	});

	const previousIdToken = usePrevious(idToken) || "";

	useEffect(() => {
		if (previousIdToken !== idToken && idToken !== "") {
			setAuthState({
				isAuthenticated: true,
				accessToken,
				refreshToken,
				idToken,
				logoutReason: "",
				userId: authState.userId,
			});
		} else if (previousIdToken !== idToken && idToken === "") {
			setAuthState({
				isAuthenticated: false,
				accessToken: "",
				refreshToken: "",
				idToken: "",
				logoutReason: EXPIRED_SESSION,
				userId: "",
			});
		}
	}, [accessToken, refreshToken, idToken, previousIdToken, authState.userId]);

	const login = async (username: string, password: string) => {
		const response = await serviceCall({
			params: {
				type: accessType || AUTH_TYPES.ID_TOKEN,
				username,
				password,
				sessionExpiration,
				tenantId,
			},
		});

		if (response.data?.idToken) {
			setIdToken(response.data.idToken);
			response.data.accessToken && setAccessToken(response.data.accessToken);
			response.data.refreshToken && setRefreshToken(response.data.refreshToken);
			setAuthState({
				isAuthenticated: true,
				idToken: response.data.idToken,
				accessToken: response.data.accessToken,
				refreshToken: response.data.refreshToken,
				userId: response.data.userId,
				logoutReason: "",
			});
			return true;
		}
		return false;
	};

	const logout = () => {
		removeAccessToken();
		removeRefreshToken();
		removeIdToken();
	};

	return (
		<AuthContext.Provider value={{ ...authState, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
