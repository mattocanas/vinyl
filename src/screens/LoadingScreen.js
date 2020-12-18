import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {auth} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';

const App = ({navigation}) => {
  const [{currentUser}, dispatch] = useStateProviderValue();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: 'SET_USER',
          currentUser: user,
        });
      } else {
        dispatch({
          type: 'SET_USER',
          currentUser: null,
        });
      }
      // navigation.navigate(user ? 'App' : 'Auth');
    });
  });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      navigation.navigate(user ? 'App' : 'Auth');
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to listen</Text>
      <ActivityIndicator size="large"></ActivityIndicator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222831',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    color: '#1E8C8B',
  },
});

export default App;
