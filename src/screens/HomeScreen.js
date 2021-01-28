import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import DailyMusic from '../components/DailyMusic';
import FollowingFeed from '../components/FollowingFeed';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import Sound from 'react-native-sound';
import messaging from '@react-native-firebase/messaging';
import {fcmService} from '../notifications/FCMService';
import {localNotificationService} from '../notifications/LocalNotificationService';
import firebase from 'firebase';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const HomeScreen = () => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const navigationUse = useNavigation();

  useEffect(() => {
    let active = true;
    // startAnimation();

    // Sound.setCategory('Playback');

    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    function onRegister(token) {}

    function onNotification(notify) {
      const options = {
        soundName: 'default',
        playSound: true,
      };
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options,
      );
    }

    function onOpenNotification(notify) {}
    // requestUserPermission();
    db.collection('users')
      .doc(currentUser.uid)
      .onSnapshot((doc) => {
        const data = doc.data();
        dispatch({
          type: 'SET_CURRENTUSERPICTUREURI',
          currentUserPictureURI: data.profilePictureUrl,
        });
        dispatch({
          type: 'GET_CURRENTUSERDATA',
          currentUserData: data,
        });
      });

    return () => {
      fcmService.unRegister();
      localNotificationService.unregister();
      active = false;
    };
  }, []);

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        return saveTokenToDatabase(token);
      });

    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      saveTokenToDatabase(token);
    });
  }, []);

  async function saveTokenToDatabase(token) {
    // Assume user is already signed in
    const userId = currentUser.uid;

    // Add the token to the users datastore
    await db
      .collection('users')
      .doc(userId)
      .update({
        tokens: firebase.firestore.FieldValue.arrayUnion(token),
      });
  }

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: 5040,
      duration: 5000,
    }).start();
  };

  const rotateInterpolate = animation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyles = {
    marginLeft: 20,

    transform: [{rotate: rotateInterpolate}],
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingTop: 42,
          backgroundColor: 'transparent',
          paddingBottom: 12,
          borderBottomLeftRadius: 0,
          // borderBottomRightRadius: 40,
          // borderBottomLeftRadius: 40,
          borderColor: '#a3adbf',
          borderBottomWidth: 1,
          // borderRightWidth: 3,
          // borderLeftWidth: 3,
          // alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'flex-end',
          }}>
          {currentUserData ? (
            <>
              <TouchableOpacity
                onPress={() => navigationUse.navigate('ProfileScreen')}>
                <FastImage
                  style={styles.profilePicture}
                  source={{
                    uri: currentUserData.profilePictureUrl,
                    priority: FastImage.priority.normal,
                  }}

                  // resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>

              {/* <Animated.View style={[animatedStyles]}>
               
              </Animated.View>

              <Text style={styles.welcomeText}>Welcome, </Text> */}

              {/* <View style={{flexDirection: 'row'}}>
              <Text style={styles.nameText}>{currentUserData.name}</Text>
            </View> */}
            </>
          ) : null}
          <FontAwesomeIcon
            style={styles.welcomeIcon}
            name="compact-disc"
            size={46}
            color="#2BAEEC"
          />
          <IonIcon
            name="paper-plane"
            style={styles.messageIcon}
            onPress={() => navigationUse.navigate('MessageListScreen')}
          />
        </View>
      </View>

      {/* <DailyMusic /> */}
      <FollowingFeed />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    paddingTop: -10,
  },
  welcomeText: {
    color: '#2BAEEC',
    fontSize: 30,
    fontWeight: '800',
    // marginLeft: 4,
    marginTop: 14,
  },
  nameText: {
    fontSize: 26,
    color: '#c1c8d4',
    fontWeight: '700',
    marginTop: 4,
    // marginLeft: 88,
  },
  welcomeIcon: {
    color: '#2BAEEC',
    fontSize: 38,
    fontWeight: '800',
    // marginLeft: 10,
    marginTop: 14,
    alignSelf: 'center',
  },
  messageIcon: {
    color: '#c1c8d4',
    fontSize: 24,
    fontWeight: '800',
    // marginTop: 14,
    // position: 'absolute',
    alignSelf: 'flex-end',
    position: 'relative',
    left: 140,
  },
  profilePicture: {
    height: 34,
    width: 34,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2BAEEC',
    alignSelf: 'flex-end',
    position: 'relative',
    right: 140,
    // marginTop: 16,
  },
});

export default HomeScreen;
