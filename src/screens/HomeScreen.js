import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DailyMusic from '../components/DailyMusic';
import FollowingFeed from '../components/FollowingFeed';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import Sound from 'react-native-sound';
import messaging from '@react-native-firebase/messaging';
import {fcmService} from '../notifications/FCMService';
import {localNotificationService} from '../notifications/LocalNotificationService';
import firebase from 'firebase';

const HomeScreen = () => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();

  useEffect(() => {
    let active = true;
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

  return (
    <View style={styles.container}>
      <DailyMusic />
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
});

export default HomeScreen;
