import React, { useState, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Image, ScrollView, Dimensions 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';

// Pega a altura total da tela do aparelho para a imagem de fundo não quebrar com o teclado
const { height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
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
    <View style={styles.container}>
      
      <Image 
        source={require('../../assets/images/background.png')} 
        style={styles.backgroundImage}
      />

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/Areninha_logoteste.png')} 
              style={styles.logoImage} 
              resizeMode="contain" 
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.welcomeText}>Bem-vindo!</Text>
            <Text style={styles.welcomeSubText}>Acesse sua conta</Text>

            <View style={styles.inputBox}>
              <MaterialCommunityIcons name="email-outline" size={22} color="#00838F" style={styles.icon} />
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
              <MaterialCommunityIcons name="lock-outline" size={22} color="#00838F" style={styles.icon} />
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

            <TouchableOpacity 
              style={{ marginTop: 25, alignItems: 'center' }} 
              onPress={() => navigation.navigate('Cadastro')}
            >
              <Text style={{ color: '#666', fontSize: 14 }}>
                Não tem uma conta? <Text style={{ fontWeight: 'bold', color: '#00838F' }}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  backgroundImage: { position: 'absolute', width: '100%', height: height, resizeMode: 'cover' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 5, marginTop: 30 },
  logoImage: { width: 240, height: 240 },
  card: { width: '85%', backgroundColor: '#FFF', borderRadius: 20, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 8 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  welcomeSubText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25, marginTop: 5 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 15, height: 55, marginBottom: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  loginButton: { backgroundColor: '#00838F', height: 55, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  forgotPassword: { marginTop: 15, alignItems: 'center' },
  forgotPasswordText: { color: '#00838F', fontWeight: '600', fontSize: 14 }
});