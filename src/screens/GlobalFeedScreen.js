import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import FeedItem from '../components/FeedItem';
import DailyMusic from '../components/DailyMusic';
import Sound from 'react-native-sound';

const GlobalFeedScreen = () => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();

  useEffect(() => {
    let active = true;
    getData();

    return () => {
      active = false;
    };
  }, []);

  let uidArray = [];
  let dataArray = [];

  const [allData, setData] = useState([]);
  const [uidData, setUidData] = useState([]);
  const [refreshController, setRefreshController] = useState(false);
  const [loading, setLoading] = useState(true);
  const [song, setSong] = useState(null);

  const refreshComponent = () => {
    setRefreshController(true);
    getData();
  };

  const getData = () => {
    db.collection('users')
      .get()
      .then((snapshot) =>
        snapshot.forEach((doc) => {
          uidArray.push(doc.data().uid);
        }),
      )
      .then(() => {
        getPosts();
        setRefreshController(false);
        setLoading(false);
      });
  };

  const getPosts = () => {
    let postsArray = [];
    uidArray.map((id) => {
      db.collection('users')
        .doc(id)
        .collection('posts')
        .where('type', '==', 'Song of the Day.')
        .orderBy('preciseDate', 'desc')
        .limit(1)

        // .where('date', '==', new Date().toDateString())
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            postsArray.push(doc.data());
            postsArray.sort((a, b) => {
              let a_date = new Date(a.date);
              let b_date = new Date(b.date);
              return b_date - a_date;
            });
          });

          setData(postsArray);
        });
    });
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
      <Text style={styles.headerText}>Discover music from all over! 🌎</Text>
      {/* <DailyMusic /> */}
      {loading ? <ActivityIndicator size="large" color="#2BAEEC" /> : null}
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
        data={allData}
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
            verified={item.verified}
            albumId={item.albumId}
            albumName={item.albumName}
            albumTracklist={item.albumTracklist}
            artistId={item.artistId}
            artistTracklist={item.artistTracklist}
            trackId={item.trackId}
            navigateBackTo={'GlobalFeedScreen'}
            name={item.name}
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
  container: {
    flex: 1,
    backgroundColor: '#171818',
    paddingTop: 80,
  },
  headerText: {
    fontSize: 18,
    color: '#c1c8d4',
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 24,
    fontWeight: 'bold',
  },
});

export default GlobalFeedScreen;
