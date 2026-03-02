import React, { useState, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Image 
} from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function handleLogin() {
    if (email === '' || senha === '') {
      Alert.alert('Atenção', 'Preencha seu e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, senha);
    } catch (error) {
      Alert.alert('Erro', error.message);
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topBackground} />

      <View style={styles.logoContainer}>
        <MaterialCommunityIcons name="soccer" size={80} color="#00838F" />
        <Text style={styles.logoTitle}>ARENINHA</Text>
        <Text style={styles.logoSubtitle}>Escola Areninha</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.welcomeText}>Bem-vindo!</Text>
        <Text style={styles.welcomeSubText}>Acesse sua conta</Text>

        <View style={styles.inputBox}>
          <MaterialCommunityIcons name="email-outline" size={22} color="#0056b3" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputBox}>
          <MaterialCommunityIcons name="lock-outline" size={22} color="#0056b3" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={!mostrarSenha}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <MaterialCommunityIcons name={mostrarSenha ? "eye-outline" : "eye-off-outline"} size={22} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.loginButtonText}>Entrar</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" style={{ position: 'absolute', right: 20 }} />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou continue com</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="google" size={20} color="#DB4437" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <MaterialCommunityIcons name="microsoft-windows" size={20} color="#00A4EF" />
            <Text style={styles.socialButtonText}>Microsoft</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.bottomBackground} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '35%',
    backgroundColor: '#00838F',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  bottomBackground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    backgroundColor: '#00838F',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -50,
  },
  logoTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#00838F',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  logoSubtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  card: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  welcomeSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 5,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#0056b3',
    height: 55,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#0056b3',
    fontWeight: '600',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 12,
    width: '48%',
  },
  socialButtonText: {
    marginLeft: 8,
    color: '#555',
    fontWeight: '600',
  }
});