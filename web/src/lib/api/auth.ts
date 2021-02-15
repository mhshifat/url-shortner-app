import axios from "../axios";

export const register = async (body: any) => {
	try {
		const { data } = await axios.post("/register", body);
		return Promise.resolve(data);
	} catch (err) {
		return Promise.reject(err);
	}
};

export const login = async (body: any) => {
	try {
		const { data } = await axios.post("/login", body);
		return Promise.resolve(data);
	} catch (err) {
		return Promise.reject(err);
	}
};

export const logout = async () => {
	try {
		const { data } = await axios.get("/logout");
		return Promise.resolve(data);
	} catch (err) {
		return Promise.reject(err);
	}
};

export const me = async () => {
	try {
		const { data } = await axios.get("/me");
		return Promise.resolve(data);
	} catch (err) {
		return Promise.reject(err);
	}
};
