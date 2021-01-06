import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useStateProviderValue} from '../../state/StateProvider';
import {auth} from '../../firebase/firebase';
import {useNavigation} from '@react-navigation/native';

const SettingsScreen = () => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const navigation = useNavigation();

  const signoutUser = () => {
    dispatch({
      type: 'SET_USER',
      currentUser: null,
    });
    dispatch({
      type: 'GET_CURRENTUSERDATA',
      currentUserData: null,
    });
    auth.signOut();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.componentContainer}
        onPress={() => navigation.navigate('EditProfileScreen')}>
        <MaterialCommunityIcon
          name="face-profile"
          size={24}
          style={styles.icon}
        />
        <Text style={styles.labelText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={signoutUser} style={styles.componentContainer}>
        <MaterialCommunityIcon
          name="logout-variant"
          size={24}
          style={styles.icon}
        />
        <Text style={styles.labelText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.componentContainer}
        onPress={() =>
          Linking.openURL('https://www.thevinylapp.net/terms-and-conditions')
        }>
        <FontAwesomeIcon name="legal" size={24} style={styles.icon} />
        <Text style={styles.labelText}>Terms of Service</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={styles.componentContainer}
        onPress={() => navigation.navigate('DeleteAccountConfirmationScreen')}>
        <MaterialIcon name="delete-forever" size={24} style={styles.icon} />
        <Text style={styles.labelText}>Delete account.</Text>
      </TouchableOpacity> */}
      <Text style={styles.verionNumber}>vinyl Version 1.3.1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a2b2b',
    alignItems: 'center',
  },
  componentContainer: {
    flexDirection: 'row',
    marginTop: 30,
    padding: 10,
    borderBottomColor: '#c1c8d4',
    borderBottomWidth: 4,
    alignItems: 'center',
  },
  labelText: {
    color: '#1E8C8B',
    fontSize: 24,
  },
  icon: {
    color: '#c1c8d4',
    marginRight: 8,
  },
  verionNumber: {
    color: '#c1c8d4',
    fontSize: 10,
    marginTop: 20,
  },
});

export default SettingsScreen;
