import { handleError } from 'api/apiHelpers';
import apiAxios from '../apiAxios';
import endpoints from './personasEndpoints';

export const getPersonas = async () => {
    try {
        const response = await apiAxios.get(endpoints.list);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const createPerson = async (payload) => {
    try {
        const response = await apiAxios.post(endpoints.list, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getPersonById = async (id) => {
    try {
        const response = await apiAxios.get(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const updatePerson = async (id, payload) => {
    try {
        const response = await apiAxios.put(`${endpoints.list}/${id}`, payload);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const deletePerson = async (id) => {
    try {
        const response = await apiAxios.delete(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getPersonasForAutocomplete = async () => {
    try {
        const response = await apiAxios.get(endpoints.autocomplete);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};



