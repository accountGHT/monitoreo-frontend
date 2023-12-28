import axios from 'axios';
import authEndpoints from './authEndpoints';
import { loadFromLocalStorage } from 'utils/localStorage';
import { handleError } from 'api/apiHelpers';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const token = loadFromLocalStorage("token");
console.log(`token`, token);
if (token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export const login = async (credentials) => {
  try {
    const response = await api.post(authEndpoints.login, credentials);
    return response.data;
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const me = async () => {
  const token = loadFromLocalStorage("token");
  console.log(`token`, token);
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  try {
    const response = await api.get(authEndpoints.me);
    return response.data;
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};
