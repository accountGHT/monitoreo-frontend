import { handleError } from 'api/apiHelpers';
import apiAxios from '../apiAxios';
import { rolesEndpoints as endpoints } from './seguridadEndpoints';

export const getRoles = async () => {
    try {
        const response = await apiAxios.get(endpoints.list);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const createRol = async (payload) => {
    try {
        const response = await apiAxios.post(endpoints.list, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getRolById = async (id) => {
    try {
        const response = await apiAxios.get(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const updateRol = async (id, payload) => {
    try {
        const response = await apiAxios.put(`${endpoints.list}/${id}`, payload);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const deleteRol = async (id) => {
    try {
        const response = await apiAxios.delete(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getRolForAutocomplete = async () => {
    try {
        const response = await apiAxios.get(endpoints.autocomplete);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
