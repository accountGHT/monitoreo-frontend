import { handleError } from 'api/apiHelpers';
import apiAxios from '../apiAxios';
import endpoints from './centralPatrullajeEndPoints';


export const createCentralPatrullaje = async (payload) => {
    try {
        const response = await apiAxios.post(endpoints.create, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};



