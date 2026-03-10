import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Modal, Text, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext'; 

export default function HeaderApp({ showBack = false }) {
  const navigation = useNavigation();
  const { signOut } = useContext(AuthContext); 
  
  // controla se o menu flutuante ta visivel ou nao
  const [menuVisible, setMenuVisible] = useState(false);

  const handlePerfil = () => {
    setMenuVisible(false);
    navigation.navigate('Perfil');
  };

  const handleSair = () => {
    setMenuVisible(false);
    signOut();
  };

  return (
    <View style={styles.headerContainer}>
      
      <View style={styles.topBar}>
        {showBack ? (
          <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Inicio')}>
            <MaterialCommunityIcons name="arrow-left" size={32} color="#00838F" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <MaterialCommunityIcons name="menu" size={32} color="#00838F" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MaterialCommunityIcons name="account-circle-outline" size={32} color="#00838F" />
        </TouchableOpacity>
      </View>

      <View style={styles.logoWrapper}>
        <Image 
          source={require('../../assets/images/Areninha_logoteste.png')} 
          style={styles.logoImage} 
          resizeMode="contain" 
        />
      </View>

      {/* menu dropdown moderno que abre ao clicar na foto */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        {/* clicando no fundo escurinho ele fecha o menu */}
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownMenu}>
                
                <TouchableOpacity style={styles.menuItem} onPress={handlePerfil}>
                  <MaterialCommunityIcons name="account-outline" size={24} color="#00838F" />
                  <Text style={styles.menuText}>Meu Perfil</Text>
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                <TouchableOpacity style={styles.menuItem} onPress={handleSair}>
                  <MaterialCommunityIcons name="logout" size={24} color="#FF5252" />
                  <Text style={[styles.menuText, { color: '#FF5252' }]}>Sair da Conta</Text>
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent',
    paddingTop: 80, 
    paddingBottom: 20,
    alignItems: 'center',
    position: 'relative',
    zIndex: 1, 
  },
  topBar: {
    position: 'absolute',
    top: 45, 
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: -10,
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  
  // estilos do modal/menu dropdown
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)', // da um fundo meio apagado pro app focar no menu
  },
  dropdownMenu: {
    position: 'absolute',
    top: 90, // desce pra ficar certinho embaixo do icone
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingVertical: 10,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8, // faz a sombra funcionar no android
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 15,
  }
});