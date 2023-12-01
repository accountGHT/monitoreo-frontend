import { handleError } from 'api/apiHelpers';
import apiAxios from '../apiAxios';
import endpoints from './vehiculosEndpoints';

export const getVehiculos = async () => {
    try {
        const response = await apiAxios.get(endpoints.list);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const createVehiculo = async (params) => {
    try {
        const response = await apiAxios.post(endpoints.list, params);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const getVehicleById = async (id) => {
    try {
        const response = await apiAxios.get(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const updateVehicle = async (id, formData) => {
    try {
        const response = await apiAxios.put(`${endpoints.list}/${id}`, formData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const deleteVehicle = async (id) => {
    try {
        const response = await apiAxios.delete(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getVehiculosForAutocomplete = async () => {
    try {
        const response = await apiAxios.get(endpoints.autocomplete);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};



