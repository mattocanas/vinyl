import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
} from 'react-native';
import FeedItem from './FeedItem';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import Sound from 'react-native-sound';

const FollowingFeed = () => {
  const [{currentUser}, dispatch] = useStateProviderValue();
  const [followingIdList, setFollowingIdList] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [refreshController, setRefreshController] = useState(false);
  const [loading, setLoading] = useState(true);
  const [song, setSong] = useState(null);
  const [lastPostDate, setLastPostDate] = useState(null);
  const [limitNumber, setLimitNumber] = useState(8);

  let followingDataArray = [];

  useEffect(() => {
    let active = true;
    // getFollowing();
    // getFollowingData();
    getPosts();
    return () => {
      active = false;
    };
  }, [refresh, refreshController, limitNumber]);

  const refreshComponent = () => {
    setRefreshController(true);
    getPosts();
  };

  const refreshProp = () => {
    setRefreshController(true);
  };

  const getPosts = async () => {
    let postsArray = [];
    db.collection('posts')
      .where('followerIdList', 'array-contains', currentUser.uid)
      .orderBy('preciseDate', 'desc')
      .limit(limitNumber)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          postsArray.push(doc.data());
        });
        setRefreshController(false);
        setFollowingData(postsArray);
        // setLastPostDate(followingData[followingData.length - 1].preciseDate);
        // console.log(lastPostDate);
      });
  };

  const handleLoadMore = () => {
    setLimitNumber(limitNumber + 12);
    getPosts();
  };

  const handleAudio = (url) => {
    if (song) {
      song.stop();
      track = new Sound(url, null, (e) => {
        if (e) {
          console.log('error', e);
        } else {
          // setReady(true);

          setSong(track);
          track.play();
          // setPlaying(true);
        }
      });
    } else {
      track = new Sound(url, null, (e) => {
        if (e) {
          console.log('error', e);
        } else {
          // setReady(true);

          setSong(track);
          track.play();
          // setPlaying(true);
        }
      });
    }
  };

  const stopTrack = () => {
    if (song) {
      song.stop();
    }
  };

  return (
    <View style={styles.container}>
      {/* {loading ? (
        <ActivityIndicator
          style={{marginTop: 20}}
          size="large"
          color="#2BAEEC"
        />
      ) : null} */}
      {followingData[0] ? (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshController}
              onRefresh={refreshComponent}
              title="Pull for new tunes."
              titleColor="#2BAEEC"
              tintColor="#2BAEEC"
            />
          }
          style={styles.flatlist}
          // horizontal={true}
          data={followingData}
          keyExtractor={(item) => item.docId}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0}
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
              albumId={item.albumId}
              albumName={item.albumName}
              albumTracklist={item.albumTracklist}
              artistId={item.artistId}
              artistTracklist={item.artistTracklist}
              name={item.name}
              trackId={item.trackId}
              verified={item.verified}
              navigateBackTo={'HomeScreen'}
              playTrack={(track) => {
                handleAudio(track);
              }}
              stopTrack={() => {
                stopTrack();
              }}
              refresh={() => refreshProp()}
            />
          )}
        />
      ) : (
        <Text
          style={{
            alignSelf: 'center',
            marginTop: 60,
            fontSize: 20,
            color: '#c1c8d4',
          }}>
          You're all caught up!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flatlist: {
    marginBottom: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#171818',
  },
});

export default FollowingFeed;
