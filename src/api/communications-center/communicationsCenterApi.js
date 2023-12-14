import { handleError } from 'api/apiHelpers';
import apiAxios from '../apiAxios';
import endpoints from './communicationsCenterEndpoints';

export const getCommunicationsCenter = async () => {
    try {
        const response = await apiAxios.get(endpoints.list);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const createCommunicationsCenter = async (payload) => {
    try {
        const response = await apiAxios.post(endpoints.list, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getCommunicationsCenterById = async (id) => {
    try {
        const response = await apiAxios.get(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const updateCommunicationsCenter = async (id, payload) => {
    try {
        const response = await apiAxios.put(`${endpoints.list}/${id}`, payload);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};


export const deleteCommunicationsCenter = async (id) => {
    try {
        const response = await apiAxios.delete(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};
