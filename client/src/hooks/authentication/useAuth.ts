import { useContext } from "react";
import { AuthContext, type AuthContextType } from "@/context/authentication/AuthProvider";

const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext) as AuthContextType;
	if (context === undefined) {
		throw new Error('Check if "useAuth" is being used inside AuthProvider');
	}
	return context;
};
export default useAuth;

export const useIsSuperAdmin = () => {
	const { user } = useAuth();
	return user?.isSuperAdmin || false;
};
