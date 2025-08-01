import Axios from 'axios';

export const API_BASE_URL = 'http://localhost:4000';

const baseInitializers = {
	baseURL: API_BASE_URL,
	withCredentials: true,
};

const privateInitializers = {
	...baseInitializers,
	withCredentials: true,
	'Content-Type': 'application/json',
};

const instance = Axios.create(baseInitializers);
export const axiosPrivateInstance = Axios.create(privateInitializers);
export const axiosPrivateRefreshInstance = Axios.create(privateInitializers);

export default instance;