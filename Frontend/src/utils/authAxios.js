import axios from "./axios";

let interceptorId = null;

export const authAxios = (getToken) => {
  if (interceptorId !== null) {
    axios.interceptors.request.eject(interceptorId);
  }

  interceptorId = axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axios;
};