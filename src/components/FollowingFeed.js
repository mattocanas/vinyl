import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import FeedItem from './FeedItem';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';

const FollowingFeed = () => {
  const [{currentUser}, dispatch] = useStateProviderValue();
  const [followingIdList, setFollowingIdList] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshController, setRefreshController] = useState(false);
  let followingDataArray = [];

  useEffect(() => {
    let active = true;
    getFollowing();
    getFollowingData();
    followingDataArray = [];

    return () => {
      active = false;
    };
  }, [refresh]);

  const getFollowingData = () => {
    followingIdList.map((id) =>
      db
        .collection('users')
        .doc(id)
        .collection('songsOfTheDay')
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            followingDataArray.push(doc.data());
            setFollowingData(followingDataArray);
            setRefreshController(false);
          });
        }),
    );
  };

  const getFollowing = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .onSnapshot((snapshot) => {
        setFollowingIdList(snapshot.data().followingIdList);
        setRefresh(true);
      });
  };

  const refreshComponent = () => {
    setRefreshController(true);
    getFollowingData();
  };

  return (
    <View>
      <FlatList
        refreshing={refreshController}
        onRefresh={refreshComponent}
        data={followingData}
        keyExtractor={(item) => item.docId}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <FeedItem
            title={item.title}
            artist={item.artist}
            albumArt={item.albumArt}
            audio={item.audio}
            username={item.username}
            uid={item.uid}
            profilePictureUrl={item.profilePictureUrl}
            likes={item.likes}
            comments={item.comments}
            date={item.date}
            docId={item.docId}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default FollowingFeed;
