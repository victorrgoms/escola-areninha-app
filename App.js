import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // <-- Novo
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import FrequenciaScreen from './src/screens/FrequenciaScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navegação das abas inferiores
function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Tira o cabeçalho nativo branco de todas as telas
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Frequência') iconName = 'calendar-month'; // Icóne mais proximo da arte
          else if (route.name === 'Calendário') iconName = 'calendar-check';
          else if (route.name === 'Perfil') iconName = 'account';

          return <MaterialCommunityIcons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#00838F',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { height: 60, paddingBottom: 10, paddingTop: 5 },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Frequência" component={FrequenciaScreen} />
      {/* Telas provisórias para os outros botões */}
      <Tab.Screen name="Calendário" component={HomeScreen} />
      <Tab.Screen name="Perfil" component={HomeScreen} />
    </Tab.Navigator>
  );
}

function Routes() {
  const { userToken, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00838F" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          {/* A tela principal logada agora é o Menu de Abas */}
          <Stack.Screen name="MainTabs" component={TabRoutes} />
          {/* Telas que abrem "por cima" das abas e podem ter o botão de voltar */}
          <Stack.Screen name="Map" component={MapScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar style="light" />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}