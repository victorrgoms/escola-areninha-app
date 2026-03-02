import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Assim que a app abre, verifica se já existe um token guardado
  useEffect(() => {
    async function carregarToken() {
      const tokenGuardado = await AsyncStorage.getItem('@Areninha:token');
      if (tokenGuardado) {
        setUserToken(tokenGuardado);
      }
      setLoading(false);
    }
    carregarToken();
  }, []);

  async function signIn(email, senha) {
    try {
      const response = await api.post('/login', { email, senha });
      const { token } = response.data;
      
      await AsyncStorage.setItem('@Areninha:token', token);
      setUserToken(token);
    } catch (error) {
      console.error("Erro no login", error);
      throw new Error("Email ou senha incorretos");
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem('@Areninha:token');
    setUserToken(null);
  }

  return (
    <AuthContext.Provider value={{ userToken, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}