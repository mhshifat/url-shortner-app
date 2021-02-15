import { createContext, useContext, useEffect, useState } from "react";
import { login, logout, me } from "../lib/api/auth";

interface AuthContextState {
	user: Object | null;
	loginUser: (values: any) => Promise<void>;
	logoutUser: () => Promise<boolean>;
}

const AuthContext = createContext<Partial<AuthContextState>>({});

export const AuthProvider: React.FC = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		me()
			.then((user) => {
				setUser(user);
			})
			.catch((err) => console.error(err));
	}, []);

	const loginUser = async (values: any) => {
		return login(values)
			.then((user) => {
				console.log(user);
				setUser(user);
				return Promise.resolve(user);
			})
			.catch((err) => Promise.reject(err));
	};

	const logoutUser = () => {
		return logout()
			.then(() => {
				setUser(null);
				return Promise.resolve(true);
			})
			.catch((err) => Promise.reject(err));
	};

	return (
		<AuthContext.Provider value={{ user, loginUser, logoutUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
