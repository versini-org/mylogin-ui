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

const graphQLCall = async ({
	query,
	data,
	headers = {},
}: {
	data: any;
	query: any;
	headers?: any;
}) => {
	const response = await fetch(`${process.env.PUBLIC_SERVER_URL}/graphql`, {
		method: "POST",
		headers: {
			...headers,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			query,
			variables: data,
		}),
	});
	return response;
};
const serviceCall = async ({
	basicAuth,
	type,
	params = {},
}: { basicAuth: any; type: any; params?: any }) => {
	const requestData = type?.data ? type.data(params) : params;
	try {
		const authorization = `Bearer ${basicAuth.token}`;
		const response = await graphQLCall({
			headers: {
				authorization,
			},
			query: type.schema,
			data: requestData,
		});

		if (response.status !== 200) {
			return { status: response.status, data: [] };
		}
		const { data, errors } = await response.json();
		return {
			status: response.status,
			data: data[type.method],
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
	clientId,
}: {
	children: React.ReactNode;
	sessionExpiration?: string;
	clientId: string;
}) => {
	const [accessToken, setBasicAuth] = useLocalStorage(
		`${clientId}-basic-auth`,
		"",
	);
	const [authState, setAuthState] = useState({
		isAuthenticated: !!accessToken,
		accessToken,
		logoutReason: "",
	});

	const previousAccessToken = usePrevious(accessToken) || "";

	useEffect(() => {
		if (previousAccessToken !== accessToken && accessToken !== "") {
			setAuthState({
				isAuthenticated: true,
				accessToken,
				logoutReason: "",
			});
		} else if (previousAccessToken !== accessToken && accessToken === "") {
			setAuthState({
				isAuthenticated: false,
				accessToken: "",
				logoutReason: EXPIRED_SESSION,
			});
		}
	}, [accessToken, previousAccessToken]);

	const login = async (username: string, password: string) => {
		const response = await serviceCall({
			basicAuth: accessToken,
			type: authenticateQuery,
			params: {
				username,
				password,
				sessionExpiration,
			},
		});
		if (response.data?.token) {
			setBasicAuth({
				// @ts-expect-error
				token: response.data.token,
			});
			return true;
		}
		return false;
	};

	const logout = () => {
		setBasicAuth("");
	};

	return (
		<AuthContext.Provider value={{ ...authState, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
