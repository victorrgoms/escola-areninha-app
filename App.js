import 'react-native-gesture-handler'; // OBRIGATÓRIO SER A PRIMEIRA LINHA
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Image, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import FrequenciaScreen from './src/screens/FrequenciaScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import GaleriaScreen from './src/screens/GaleriaScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import CalendarioScreen from './src/screens/CalendarioScreen';
import EquipeScreen from './src/screens/EquipeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// --- NOVO: CABEÇALHO CUSTOMIZADO DO MENU LATERAL ---
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#FFF' }}>
      
      {/* Área da Logo */}
      <View style={{ alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', marginBottom: 10 }}>
        <Image 
          source={require('./assets/images/Areninha_logoteste.png')} 
          style={{ width: 160, height: 160, resizeMode: 'contain', marginTop: -10 }} 
        />
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#00838F', marginTop: -20, marginBottom: 10 }}>
          Menu do Monitor
        </Text>
      </View>
      
      {/* Renderiza os botões de navegação padrão abaixo da imagem */}
      <DrawerItemList {...props} />

    </DrawerContentScrollView>
  );
}

// Navegação das abas inferiores
function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Frequência') iconName = 'clipboard-list';
          else if (route.name === 'Calendario') iconName = 'calendar-month';

          return <MaterialCommunityIcons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#00838F',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { height: 60, paddingBottom: 10, paddingTop: 5 },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Frequência" component={FrequenciaScreen} />
      <Tab.Screen name="Calendario" component={CalendarioScreen} />
    </Tab.Navigator>
  );
}

// Navegação Lateral (Side Bar)
function DrawerRoutes() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />} // Conecta o nosso menu customizado aqui!
      screenOptions={{
        headerShown: false, 
        drawerActiveTintColor: '#00838F',
        drawerInactiveTintColor: '#333',
        drawerStyle: {
          backgroundColor: '#FFF',
          width: 280,
        },
      }}
    >
      <Drawer.Screen 
        name="Página Inicial" 
        component={TabRoutes} 
        options={{ drawerIcon: ({ color }) => <MaterialCommunityIcons name="home" size={24} color={color} /> }}
      />
      <Drawer.Screen 
        name="Meu Perfil" 
        component={PerfilScreen} 
        options={{ drawerIcon: ({ color }) => <MaterialCommunityIcons name="account" size={24} color={color} /> }}
      />
      <Drawer.Screen 
        name="Equipe" 
        component={EquipeScreen} 
        options={{ drawerIcon: ({ color }) => <MaterialCommunityIcons name="account-group" size={24} color={color} /> }}
      />
      <Drawer.Screen 
        name="Galeria" 
        component={GaleriaScreen} 
        options={{ drawerIcon: ({ color }) => <MaterialCommunityIcons name="image-multiple" size={24} color={color} /> }}
      />
    </Drawer.Navigator>
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
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainDrawer" component={DrawerRoutes} />
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