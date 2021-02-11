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

const ProfileSongsOfTheDayFeed = ({refresh, stopTrack, playTrack}) => {
  let dataArray = [];
  const [
    {currentUser, currentUserPictureURI},
    dispatch,
  ] = useStateProviderValue();
  const [data, setData] = useState([]);
  const [limitNumber, setLimitNumber] = useState(5);
  const [refreshController, setRefreshController] = useState(false);

  // const [refresh, setRefresh] = useState(false);
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  useEffect(() => {
    let active = true;
    getUsersSOTD();

    return () => {
      active = false;
    };
  }, [limitNumber]);

  // const refreshComponent = () => {
  //   setRefresh(true);
  // };

  const getUsersSOTD = async () => {
    db.collection('users')
      .doc(currentUser.uid)
      .collection('posts')
      .where('type', '==', 'Song of the Day.')
      .orderBy('preciseDate', 'desc')
      .limit(limitNumber)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          dataArray.push(doc.data());
        });
        setData(dataArray);
      });
  };

  const handleLoadMore = () => {
    setLimitNumber(setLimitNumber(limitNumber + 2));
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
          onEndReachedThreshold={10}
          contentContainerStyle={{paddingBottom: 300}}
          keyExtractor={(item) => item.docId}
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <Swipeable
              rightThreshold={30}
              renderRightActions={rightAction}
              onSwipeableRightOpen={() => {
                db.collection('posts').doc(item.docId).delete();

                db.collection('users')
                  .doc(currentUser.uid)
                  .collection('posts')
                  .doc(item.docId)
                  .delete()
                  .then(() => {
                    ReactNativeHapticFeedback.trigger(
                      'notificationSuccess',
                      options,
                    );
                    refresh();
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
  },
  container: {
    alignItems: 'flex-start',
    flex: 1,
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
