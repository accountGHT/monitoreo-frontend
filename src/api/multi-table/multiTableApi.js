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
        console.log(error);
        return handleError(error);
    }
};


export const getMultiTableById = async (id) => {
    try {
        const response = await apiAxios.get(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const updateMultiTable = async (id, formData) => {
    try {
        const response = await apiAxios.put(`${endpoints.list}/${id}`, formData);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const deleteMultiTable = async (id) => {
    try {
        const response = await apiAxios.delete(`${endpoints.list}/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
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

//
export const getZonasForAutocomplete = async () => {
    try {
        const response = await apiAxios.get(endpoints.autocompleteZonas);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getTiposPatrullajeForAutocomplete = async () => {
    try {
        const response = await apiAxios.get(endpoints.autocompleteTiposPatrullaje);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getTiposComunicacionForAutocomplete = async () => {
    try {
        const response = await apiAxios.get(endpoints.autocompleteTiposComunicacion);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getTiposIncidenciaForAutocomplete = async () => {
    try {
        const response = await apiAxios.get(endpoints.autocompleteTiposIncidencia);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getCamarasForAutocomplete = async () => {
    try {
        const response = await apiAxios.get(endpoints.autocompleteCamaras);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
};

export const getClasificadoresForAutocomplete = async () => {
    try {
        const response = await apiAxios.get(endpoints.autoCompleteClasificadores);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
}

export const getInstitucionesForAutocomplete = async () => {
    try {
        const response = await apiAxios.get(endpoints.autoCompleteInstituciones);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
}
export const getAreasForAutocomplete = async () => {
    try {
        const response = await apiAxios.get(endpoints.autoCompleteAreas);
        return response.data;
    } catch (error) {
        console.log(error);
        return handleError(error);
    }
}