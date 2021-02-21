import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import ProfileSongOfTheDay from './ProfileSongOfTheDay';
import ProfilePost from './ProfilePost';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';

const ProfilePostsFeed = ({refresh, playTrack, stopTrack}) => {
  const [
    {currentUser, currentUserPictureURI},
    dispatch,
  ] = useStateProviderValue();
  const [data, setData] = useState([]);
  const [limitNumber, setLimitNumber] = useState(4);
  const navigationUse = useNavigation();

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      getUsersPosts();

      return () => {
        active = false;
      };
    }, [limitNumber]),
  );

  // const refreshComponent = () => {
  //   setRefresh(true);
  // };

  const getUsersPosts = () => {
    let dataArray = [];
    db.collection('users')
      .doc(currentUser.uid)
      .collection('posts')
      .where('type', '==', 'Post')
      .limit(limitNumber)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          dataArray.push(doc.data());
          dataArray.sort((a, b) => {
            let a_date = new Date(a.date);
            let b_date = new Date(b.date);
            return b_date - a_date;
          });
        });
        setData(dataArray);
      });
  };

  const handleLoadMore = () => {
    setLimitNumber(limitNumber + 20);
    getUsersPosts();
  };

  const rightAction = () => (
    <View style={styles.swipeContainer}>
      <MaterialCommunityIcon name="delete" style={styles.deleteIcon} />
    </View>
  );

  return (
    <View style={styles.container}>
      {data[0] != null ? (
        <FlatList
          onEndReached={handleLoadMore}
          contentContainerStyle={{paddingBottom: 300}}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.docId}
          data={data}
          renderItem={({item}) => (
            <Swipeable
              rightThreshold={30}
              renderRightActions={rightAction}
              onSwipeableRightOpen={() => {
                navigationUse.navigate('DeletePostScreen', {
                  docId: item.docId,
                  uid: currentUser.uid,
                });
              }}>
              <ProfilePost
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
          You have't posted anything yet! Start sharing your music!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textDNE: {
    textAlign: 'center',
    color: '#c1c8d4',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 40,
    padding: 10,
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

export default ProfilePostsFeed;
