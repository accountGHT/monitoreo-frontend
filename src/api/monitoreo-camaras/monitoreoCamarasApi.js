import { handleError } from 'api/apiHelpers';
import apiAxios from '../apiAxios';
import monitoreoCamarasEndpoints from './monitoreoCamarasEndpoints';
import endpoints from './monitoreoCamarasEndpoints';

export const getMonitoreoCamaras = async () => {
  try {
    const response = await apiAxios.get(endpoints.list);
    return response.data;
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const createMonitoreoCamaras = async (payload) => {
  try {
    const response = await apiAxios.post(endpoints.list, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const getMonitoreoCamarasById = async (id) => {
  try {
    const response = await apiAxios.get(`${endpoints.list}/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const updateMonitoreoCamaras = async (id, payload) => {
  try {
    const response = await apiAxios.put(`${endpoints.list}/${id}`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteMonitoreoCamaras = async (id) => {
  try {
      const response = await apiAxios.delete(`${endpoints.list}/${id}`);
      return response.data;
  } catch (error) {
      console.log(error);
      return handleError(error);
  }
};







export const getZonas = async () => {
  try {
    const response = await apiAxios.get(monitoreoCamarasEndpoints.zonas);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const getTiposIncidencia = async () => {
  try {
    const response = await apiAxios.get(monitoreoCamarasEndpoints.tiposIncidencia);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const getPersonas = async () => {
  try {
    const response = await apiAxios.get(monitoreoCamarasEndpoints.personas);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTiposComunicacion = async () => {
  try {
    const response = await apiAxios.get(monitoreoCamarasEndpoints.tiposComunicacion);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const postCreateCentralComunicacion = async (params) => {
  try {
    const response = await apiAxios.post(monitoreoCamarasEndpoints.createCentralComunicacion, params);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTiposPatrullaje = async () => {
  try {
    const response = await apiAxios.get(monitoreoCamarasEndpoints.tiposPatrullaje);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getDatosGrafico = async (params) => {
  try {
    const response = await apiAxios.get(`${monitoreoCamarasEndpoints.datosGrafico}${params}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTablaGrafico = async (params) => {
  try {
    params = params ?? '';
    const response = await apiAxios.get(`${monitoreoCamarasEndpoints.tablaGrafico}${params}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const getDatosGraficoCentralComunicaciones = async (params) => {
  try {
    const response = await apiAxios.get(`${monitoreoCamarasEndpoints.datosGraficoCentralComunicaciones}${params}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
