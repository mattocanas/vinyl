import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Text, RefreshControl} from 'react-native';
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

    return () => {
      active = false;
    };
  }, [refresh, refreshController]);

  const getFollowingData = () => {
    followingDataArray = [];
    followingIdList.map((id) =>
      db
        .collection('users')
        .doc(id)
        .collection('posts')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            followingDataArray.push(doc.data());

            followingDataArray.sort((a, b) => {
              let a_date = new Date(a.date);
              let b_date = new Date(b.date);
              return b_date - a_date;
            });
          });
          setFollowingData(followingDataArray);
        }),
    );
  };

  const getFollowing = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .onSnapshot((snapshot) => {
        followingDataArray = [];
        setFollowingIdList(snapshot.data().followingIdList);

        setRefreshController(false);
        setRefresh(true);
      });
  };

  const refreshComponent = () => {
    setRefreshController(true);
    getFollowing();
  };

  const refreshProp = () => {
    setRefreshController(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshController}
            onRefresh={refreshComponent}
            title="Pull for new tunes."
            titleColor="#1E8C8B"
            tintColor="#1E8C8B"
          />
        }
        style={styles.flatlist}
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
            type={item.type}
            description={item.description}
            refresh={() => refreshProp()}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flatlist: {
    marginBottom: 1,
  },
  container: {
    flex: 1,
  },
});

export default FollowingFeed;
