import apiAxios from '../apiAxios';
import monitoreoCamarasEndpoints from './monitoreoCamarasEndpoints';

export const list = async () => {
  try {
    const response = await apiAxios.get(monitoreoCamarasEndpoints.list);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const postCreate = async (params) => {
  try {
    const response = await apiAxios.post(monitoreoCamarasEndpoints.create, params);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
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

export const getCamaras = async () => {
  try {
    const response = await apiAxios.get(monitoreoCamarasEndpoints.camaras);
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

export const getVehiculos = async () => {
  try {
    const response = await apiAxios.get(monitoreoCamarasEndpoints.vehiculos);
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

export const postCreateDistribucionPersonal = async (params) => {
  try {
    const response = await apiAxios.post(monitoreoCamarasEndpoints.createDistribucionPersonal, params);
    console.log(response);
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
