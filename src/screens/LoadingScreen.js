import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Image,
} from 'react-native';
import {auth} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import Sound from 'react-native-sound';

const App = ({navigation}) => {
  const [{currentUser}, dispatch] = useStateProviderValue();
  useEffect(() => {
    Sound.setCategory('Playback');
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

    return () => {};
  });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      navigation.navigate(user ? 'App' : 'Auth');
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Tapping into the matrix...</Text>

      <ActivityIndicator color="#1E8C8B" size="large"></ActivityIndicator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2b2b',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    color: '#c1c8d4',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default App;
