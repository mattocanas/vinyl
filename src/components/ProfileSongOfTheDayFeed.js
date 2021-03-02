import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import ProfileSongOfTheDay from './ProfileSongOfTheDay';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';

const ProfileSongsOfTheDayFeed = ({refresh, stopTrack, playTrack}) => {
  let dataArray = [];
  const [
    {currentUser, currentUserPictureURI},
    dispatch,
  ] = useStateProviderValue();
  const [data, setData] = useState([]);
  const [limitNumber, setLimitNumber] = useState(4);
  const [refreshController, setRefreshController] = useState(false);
  const navigationUse = useNavigation();

  // const [refresh, setRefresh] = useState(false);
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      getUsersSOTD();
      // navigationUse.addListener('focus', () => {
      //   getUsersSOTD();
      //   console.log('here');
      // });

      return () => {
        active = false;
      };
    }, [limitNumber]),
  );

  const getUsersSOTD = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .collection('posts')
      .where('type', '==', 'Song of the Day.')
      .limit(limitNumber)
      .orderBy('preciseDate', 'desc')

      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          dataArray.push(doc.data());
        });
        setData(dataArray);
      });
  };

  const handleLoadMore = () => {
    setLimitNumber(setLimitNumber(limitNumber + 4));
    getUsersSOTD();
  };

  const rightAction = () => (
    <View style={styles.swipeContainer}>
      <MaterialCommunityIcon name="delete" style={styles.deleteIcon} />
    </View>
  );

  const refreshComponent = () => {
    setRefreshController(true);
    getUsersSOTD();
  };

  const refreshProp = () => {
    setRefreshController(true);
  };

  return (
    <View style={styles.container}>
      {data[0] != null ? (
        <FlatList
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0}
          contentContainerStyle={{paddingBottom: 300}}
          keyExtractor={(item) => item.docId}
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <Swipeable
              rightThreshold={30}
              renderRightActions={rightAction}
              onSwipeableRightOpen={() => {
                navigationUse.navigate('DeletePostScreen', {
                  uid: currentUser.uid,
                  docId: item.docId,
                });
              }}>
              <ProfileSongOfTheDay
                refresh={() => refresh()}
                data={item}
                stopTrack={stopTrack}
                playTrack={playTrack}
              />
            </Swipeable>
          )}
        />
      ) : (
        <Text style={styles.textDNE}>
          You have't had a song of the day yet! Start listening to some music!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textDNE: {
    textAlign: 'center',
    color: '#c1c8d4',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 40,
    paddingLeft: 16,
    paddingRight: 16,
    alignSelf: 'center',
    marginLeft: 40,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    marginLeft: -40,
  },
  swipeContainer: {
    width: 40,
    alignItems: 'center',
  },
  deleteIcon: {
    color: '#c43b4c',
    alignSelf: 'center',
    marginTop: 70,
    fontSize: 20,
  },
});

export default ProfileSongsOfTheDayFeed;
