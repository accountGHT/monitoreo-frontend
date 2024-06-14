import { handleError } from 'api/apiHelpers';
import apiAxios from '../apiAxios';
import endpoints from './distribucionPersonalEndPoints';

export const getDistribucionPersonal = async () => {
    try {
        const response = await apiAxios.get(endpoints.list);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const createDistribucionPersonal = async (payload) => {
    try {
        const response = await apiAxios.post(endpoints.list, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getDistribucionPersonalById = async (id) => {
    try {
        const response = await apiAxios.get(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const updateDistribucionPersonal = async (id, payload) => {
    try {
        const response = await apiAxios.put(`${endpoints.list}/${id}`, payload);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const deleteDistribucionPersonal = async (id) => {
    try {
        const response = await apiAxios.delete(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getDataForChartDistribucionPersonal = async (payload) => {
    try {
        const response = await apiAxios.post(endpoints.dataForChart, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getTableDashboardDistribucionPersonal = async (payload) => {
    try {
        const response = await apiAxios.post(endpoints.tableDashboar, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

