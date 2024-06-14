import { handleError } from 'api/apiHelpers';
import apiAxios from '../apiAxios';
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

export const getDataForChartMonitoreoCamaras = async (payload) => {
  try {
    const response = await apiAxios.post(endpoints.dataForChart, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};

export const getTableDashboardMonitoreoCamaras = async (payload) => {
  try {
    const response = await apiAxios.post(endpoints.tableDashboar, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
};
