import axios from "../axios";

export const shorten = async (url: string) => {
	try {
		const { data } = await axios.post("/shorten", { url });
		return Promise.resolve(data);
	} catch (err) {
		return Promise.reject(err);
	}
};

export const updateShorten = async (id: string, url: string) => {
	try {
		const { data } = await axios.put("/shortne/" + id, { url });
		return Promise.resolve(data);
	} catch (err) {
		return Promise.reject(err);
	}
};

export const deleteShorten = async (id: string) => {
	try {
		const { data } = await axios.delete("/shortne/" + id);
		return Promise.resolve(data);
	} catch (err) {
		return Promise.reject(err);
	}
};
