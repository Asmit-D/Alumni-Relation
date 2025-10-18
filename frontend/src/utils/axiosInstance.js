import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// Create axios instance for Login and Registration
export default axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

// Create axios instance for Protected Routes
export const protectedAxios = axios.create({
	baseURL: API_BASE_URL,
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
});
