import { handleError } from 'api/apiHelpers';
import apiAxios from '../apiAxios';
import endpoints from './multiTablesEndpoints';

export const getMultiTables = async (params) => {
    try {
        params = params ?? '';
        const response = await apiAxios.get(`${endpoints.list}${params}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const createMultiTable = async (params) => {
    try {
        const response = await apiAxios.post(endpoints.list, params);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};


export const getVehiculoById = async (id) => {
    try {
        const response = await apiAxios.get(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateMultiTable = async (id, formData) => {
    console.log(formData);
    try {
        const response = await apiAxios.get(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteMultiTable = async (id) => {
    try {
        const response = await apiAxios.get(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getMultiTablesForAutocomplete = async (params) => {
    try {
        params = params ?? '';
        const response = await apiAxios.get(`${endpoints.autocomplete}${params}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};