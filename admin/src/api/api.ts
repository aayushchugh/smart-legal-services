import axios from "axios";

// TODO: auto add token to header
const API = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

API.interceptors.response.use(
	(res) => Promise.resolve(res.data),
	(err) => Promise.reject(err.response),
);

export default API;
