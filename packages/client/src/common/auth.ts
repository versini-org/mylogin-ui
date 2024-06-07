import { useLocalStorage } from "@versini/ui-hooks";
import { LOCAL_STORAGE_BASIC_AUTH, LOCAL_STORAGE_PREFIX } from "./constants";
import { SERVICE_TYPES, serviceCall } from "./utilities";

export const useAuth = () => {
	const [basicAuth, setBasicAuth] = useLocalStorage(
		LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_BASIC_AUTH,
		"",
	);

	const login = async (username: string, password: string) => {
		const response = await serviceCall({
			basicAuth,
			type: SERVICE_TYPES.AUTHENTICATE,
			params: {
				username,
				password,
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

	return {
		basicAuth,
		login,
		logout,
	};
};
