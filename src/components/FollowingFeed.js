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
    followingIdList.push(currentUser.uid);
    followingIdList.map((id) =>
      db
        .collection('users')
        .doc(id)
        .collection('posts')
        .orderBy('preciseDate', 'desc')
        .limit(12)
        // .limit(12)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.data().preciseDate != null) {
              followingDataArray.push(doc.data());
            }

            // followingDataArray.sort((a, b) => {
            //   let a_date = new Date(a.date);
            //   let b_date = new Date(b.date);
            //   return b_date - a_date;
            // });
          });
          // setFollowingData(followingDataArray);
        })
        .then(() => {
          setFollowingData(
            followingDataArray.sort((a, b) => {
              let a_date = new Date(a.preciseDate.toDate());
              let b_date = new Date(b.preciseDate.toDate());
              return b_date - a_date;
            }),
          );
        }),
    );
  };

  const getFollowing = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .get()
      .then((snapshot) => {
        followingDataArray = [];
        setFollowingIdList(snapshot.data().followingIdList);

        setRefreshController(false);
        setRefresh(true);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const refreshComponent = () => {
    setRefreshController(true);
    getFollowing();
  };

  const refreshProp = () => {
    setRefreshController(true);
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
