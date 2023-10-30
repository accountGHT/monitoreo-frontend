import axios from 'axios';
import authEndpoints from './authEndpoints';
import { loadFromLocalStorage } from 'utils/localStorage';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const token = loadFromLocalStorage("token");
if (token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export const login = async (credentials) => {
  try {
    const response = await api.post(authEndpoints.login, credentials);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
