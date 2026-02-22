import axios from "axios";

const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const api = axios.create({
	baseURL: `${base}/api`,
	withCredentials: true,

	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			console.warn("Session expired. Redirecting to login...");

			if (window.location.pathname !== '/login') {
				window.location.href = "/login";
			}
		}

		return Promise.reject(error);
	}
)

export default api;