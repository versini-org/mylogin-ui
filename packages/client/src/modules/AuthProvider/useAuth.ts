import { useContext } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";

export const useAuth = (context = AuthContext): AuthContextType =>
	useContext(context) as AuthContextType;
