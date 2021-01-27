import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Image,
  Animated,
} from 'react-native';
import {auth} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

const App = ({navigation}) => {
  const [animation, setAnimation] = useState(new Animated.Value(0));

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
    startAnimation();

    auth.onAuthStateChanged((user) => {
      navigation.navigate(user ? 'App' : 'Auth');
    });
  });

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: 5000,
      duration: 2000,
    }).start();
  };

  const rotateInterpolate = animation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyles = {
    transform: [{rotate: rotateInterpolate}],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyles]}>
        <FontAwesomeIcon name="compact-disc" size={40} color="#2BAEEC" />
      </Animated.View>
      <Text style={styles.welcomeText}>Loading tunes...</Text>

      {/* <ActivityIndicator color="#2BAEEC" size="large"></ActivityIndicator> */}
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
    marginBottom: 20,
  },
});

export default App;
