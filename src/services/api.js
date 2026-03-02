import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.18.106:8080/api',
});

api.interceptors.request.use(
  async (config) => {
    // pega o cracha q guardamos no login
    const token = await AsyncStorage.getItem('@Areninha:token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;