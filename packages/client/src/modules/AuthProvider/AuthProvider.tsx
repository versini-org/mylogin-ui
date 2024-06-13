import { useLocalStorage } from "@versini/ui-hooks";
import { useEffect, useRef, useState } from "react";

import { AuthContext } from "./AuthContext";

const EXPIRED_SESSION =
	"Oops! It looks like your session has expired. For your security, please log in again to continue.";
const authenticateQuery = {
	method: "authenticate",
	schema: `query authenticate(
		$username: String!,
		$password: String!,
		$sessionExpiration: String)
{
	authenticate(
			username: $username,
			password: $password,
			sessionExpiration: $sessionExpiration)
	{
		token
	}
}`,
};

// const graphQLCall = async ({
// 	query,
// 	data,
// 	headers = {},
// }: {
// 	data: any;
// 	query: any;
// 	headers?: any;
// }) => {
// 	const response = await fetch(`${process.env.PUBLIC_SERVER_URL}/graphql`, {
// 		method: "POST",
// 		headers: {
// 			...headers,
// 			"Content-Type": "application/json",
// 			Accept: "application/json",
// 		},
// 		body: JSON.stringify({
// 			query,
// 			variables: data,
// 		}),
// 	});
// 	return response;
// };
const serviceCall = async ({
	// basicAuth,
	type,
	params = {},
}: { type: any; params?: any }) => {
	const requestData = type?.data ? type.data(params) : params;
	try {
		const response = await fetch(
			`${process.env.PUBLIC_AUTH_SERVER_URL}/authenticate`,
			{
				credentials: "include",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Auth-TenantId": `${params.tenantId}`,
				},
				body: JSON.stringify(requestData),
			},
		);

		if (response.status !== 200) {
			return { status: response.status, data: [] };
		}
		const { data, errors } = await response.json();
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
}: {
	children: React.ReactNode;
	sessionExpiration?: string;
	tenantId: string;
}) => {
	const [accessToken, setAccessTokenInLocalStorage] = useLocalStorage(
		`@@auth@@::${tenantId}::@@access@@`,
		"",
	);
	const [refreshToken, setRefreshTokenInLocalStorage] = useLocalStorage(
		`@@auth@@::${tenantId}::@@refresh@@`,
		"",
	);
	const [idToken, setIdTokenInLocalStorage] = useLocalStorage(
		`@@auth@@::${tenantId}::@@user@@`,
		"",
	);
	const [authState, setAuthState] = useState({
		isAuthenticated: !!accessToken,
		accessToken,
		refreshToken,
		idToken,
		logoutReason: "",
	});

	const previousAccessToken = usePrevious(accessToken) || "";

	useEffect(() => {
		if (previousAccessToken !== accessToken && accessToken !== "") {
			setAuthState({
				isAuthenticated: true,
				accessToken,
				refreshToken,
				idToken,
				logoutReason: "",
			});
		} else if (previousAccessToken !== accessToken && accessToken === "") {
			setAuthState({
				isAuthenticated: false,
				accessToken: "",
				refreshToken: "",
				idToken: "",
				logoutReason: EXPIRED_SESSION,
			});
		}
	}, [accessToken, refreshToken, idToken, previousAccessToken]);

	const login = async (username: string, password: string) => {
		const response = await serviceCall({
			type: authenticateQuery,
			params: {
				username,
				password,
				sessionExpiration,
				tenantId,
			},
		});

		if (
			response.data?.accessToken &&
			response.data?.refreshToken &&
			response.data?.idToken
		) {
			setAccessTokenInLocalStorage({
				// @ts-expect-error
				token: response.data.accessToken,
			});
			setRefreshTokenInLocalStorage({
				// @ts-expect-error
				token: response.data.refreshToken,
			});
			setIdTokenInLocalStorage({
				// @ts-expect-error
				token: response.data.idToken,
			});
			return true;
		}
		return false;
	};

	const logout = () => {
		// setBasicAuth("");
	};

	return (
		<AuthContext.Provider value={{ ...authState, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
