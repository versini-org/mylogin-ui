import { createContext } from "react";

export type AuthContextType = {
	login: (username: string, password: string) => Promise<boolean>;
	logout: () => void;
	isAuthenticated: boolean;
	accessToken?: string;
	logoutReason?: string;
};

const stub = (): never => {
	throw new Error("You forgot to wrap your component in <AuthProvider>.");
};

export const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	login: stub,
	logout: stub,
	accessToken: undefined,
	logoutReason: "",
});
