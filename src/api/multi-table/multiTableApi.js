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