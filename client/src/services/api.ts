/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from './axios';

export async function fetchData<T>(url: string, customAdapter?: AxiosInstance, headers?: any): Promise<T> {
  const adapter = customAdapter || axios;
  const response: AxiosResponse<T> = await adapter.get<T>(url, { headers });
  return response.data;
}
export async function postData<T>(url: string, data: any, customAdapter?: AxiosInstance, headers?: any): Promise<T> {
  const adapter = customAdapter || axios;
  const response: AxiosResponse<T> = await adapter.post<T>(url, data, { headers });
  return response.data;
}

export async function putData<T>(url: string, data: any, customAdapter?: AxiosInstance): Promise<T> {
  const adapter = customAdapter || axios;
  const response: AxiosResponse<T> = await adapter.put<T>(url, data);
  return response.data;
}

export async function deleteData<T>(url: string, customAdapter?: AxiosInstance, headers?: any): Promise<T> {
  const adapter = customAdapter || axios;
  const response: AxiosResponse<T> = await adapter.delete(url, { headers });
  return response.data;
}

export async function patchData<T>(url: string, data: any, customAdapter?: AxiosInstance, headers?: any): Promise<T> {
  const adapter = customAdapter || axios;
  const response: AxiosResponse<T> = await adapter.patch(url, data, { headers });
  return response.data;
}
