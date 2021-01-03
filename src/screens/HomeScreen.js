import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DailyMusic from '../components/DailyMusic';
import FollowingFeed from '../components/FollowingFeed';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import Sound from 'react-native-sound';

const HomeScreen = () => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();

  useEffect(() => {
    let active = true;
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
      active = false;
    };
  }, []);

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
    backgroundColor: '#242525',
  },
});

export default HomeScreen;
