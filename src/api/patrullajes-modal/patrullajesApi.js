import { handleError } from 'api/apiHelpers';
import apiAxios from '../apiAxios';
import endpoints from './patrullajesEndPoints';

export const getPatrullajesPorDistro = async (id) => {
    try {
        const response = await apiAxios(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const createPatrullaje = async (payload) => {
    try {
        const response = await apiAxios.post(endpoints.post, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getPatrullajeById = async (id) => {
    try {
        const response = await apiAxios.get(`${endpoints.show}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const updatePatrullaje = async (id, payload) => {
    try {
        const response = await apiAxios.put(`${endpoints.update}/${id}`, payload);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const deletePatrullaje = async (id) => {
    try {
        const response = await apiAxios.delete(`${endpoints.delete}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};


export const getPatrullajes = async () => {
    try {
        const response = await apiAxios.get(endpoints.despatch);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

