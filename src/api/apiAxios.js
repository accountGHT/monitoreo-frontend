import axios from 'axios';
import { loadFromLocalStorage } from 'utils/localStorage';

const apiAxios = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

delete apiAxios.defaults.headers.common.Authorization;

const token = loadFromLocalStorage("token");
if (token) {
    apiAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

// interceptor for http
// apiAxios.interceptors.response.use(
//     (response) => response,
//     (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
// );

export default apiAxios;
