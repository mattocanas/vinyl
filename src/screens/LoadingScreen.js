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
    // const track = new Sound(
    //   'https://developers.deezer.com/%22https://cdns-preview-4.dzcdn.net/stream/c-44d3354d6fb4a85a6cbad12731f1d9be-4.mp3/%22',
    //   null,
    //   (e) => {
    //     if (e) {
    //       console.log('error', e);
    //     } else {
    //       // all good
    //       track.reset();
    //     }
    //   },
    // );
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
    backgroundColor: '#171818',
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
