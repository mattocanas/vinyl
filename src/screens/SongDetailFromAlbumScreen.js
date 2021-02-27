import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import Sound from 'react-native-sound';
import {useNavigation} from '@react-navigation/native';
import {handleScheduleNotification} from '../notifications/notification.ios';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import axios from 'axios';

const dimensions = Dimensions.get('screen');

const SongDetailFromAlbumScreen = ({route}) => {
  const navigationUse = useNavigation();
  const [ready, setReady] = useState(false);
  const [song, setSong] = useState(null);
  const [playing, setPlaying] = useState(false);

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const {id} = route.params;
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();

  const [songOfTheDay, setSongOfTheDay] = useState(false);
  const [data, setData] = useState(null);
  useEffect(() => {
    let active = true;
    axios.get(`https://api.deezer.com/track/${id}`).then((response) => {
      setData(response.data);
    });
    Sound.setCategory('Playback');
    checkIfSongOfTheDayExists();
    return () => {
      active = false;
    };
  }, [ready]);

  const addSongOfTheDay = () => {
    let newDocRef = db
      .collection('users')
      .doc(currentUser.uid)
      .collection('posts')
      .doc();

    let newPostRef = db.collection('posts').doc(newDocRef.id);

    newPostRef.set({
      docId: newPostRef.id,
      artist: data.artist.name,
      title: data.title,
      albumArt: data.album.cover_xl,
      albumId: data.album.id,
      artistId: data.artist.id,
      artistTracklist: data.artist.tracklist,
      albumTracklist: data.album.tracklist,
      albumName: data.album.title,
      trackId: data.id,
      audio: data.preview,
      username: currentUserData.username,
      name: currentUserData.name,
      uid: currentUser.uid,
      date: new Date().toDateString(),
      preciseDate: new Date(),
      verified: currentUserData.verified,
      profilePictureUrl: currentUserData.profilePictureUrl,
      userNotificationTokens: currentUserData.tokens,
      likes: [],
      comments: {},
      description: '',
      type: 'Song of the Day.',
      followerIdList: [currentUser.uid, ...currentUserData.followerIdList],
    });

    newDocRef
      .set({
        docId: newDocRef.id,
        artist: data.artist.name,
        title: data.title,
        albumArt: data.album.cover_xl,
        albumId: data.album.id,
        artistId: data.artist.id,
        artistTracklist: data.artist.tracklist,
        albumTracklist: data.album.tracklist,
        albumName: data.album.title,
        audio: data.preview,
        username: currentUserData.username,
        name: currentUserData.name,

        uid: currentUser.uid,
        verified: currentUserData.verified,
        date: new Date().toDateString(),
        preciseDate: new Date(),
        userNotificationTokens: currentUserData.tokens,
        profilePictureUrl: currentUserData.profilePictureUrl,
        likes: [],
        comments: [],
        description: '',
        type: 'Song of the Day.',
      })
      .then(setSongOfTheDay(true))
      // .then(() => {
      //   handleScheduleNotification(
      //     'Share your music',
      //     "Don't forget to add your song of the day!",
      //   );
      // })
      .then(() => {
        navigationUse.navigate('SearchScreen');
      });
  };

  const checkIfSongOfTheDayExists = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .collection('posts')
      .where('date', '==', new Date().toDateString())
      .where('type', '==', 'Song of the Day.')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.exists) {
            setSongOfTheDay(true);
          } else {
            // console.log('doesnt');
          }
        });
      });
  };

  const render = () => {
    if (data) {
      const handleAudio = (url) => {
        track = new Sound(url, null, (e) => {
          if (e) {
            console.log('error', e);
          } else {
            setReady(true);
            console.log(track.isLoaded());
            setSong(track);
            track.play();
            setPlaying(true);
          }
        });
      };

      return (
        <ScrollView
          contentContainerStyle={{alignItems: 'center'}}
          showsVerticalScrollIndicator={false}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={styles.albumArt}
              source={{uri: data.album.cover_xl}}
            />
            <MaterialIcon
              onPress={() => navigationUse.goBack()}
              name="arrow-back-ios"
              color="white"
              style={{
                fontSize: 40,
                position: 'absolute',
                marginTop: 50,
                alignSelf: 'flex-start',
                marginLeft: 30,
              }}
            />
          </View>

          {songOfTheDay ? (
            <Text style={styles.warning}>
              You already have a song of the day! Head over to your profile if
              you want to remove it.
            </Text>
          ) : (
            <Text style={{fontSize: 10, color: 'gray', marginTop: 12}}>
              Click the calendar icon to make this your song of the day!
            </Text>
          )}

          <Text style={styles.title}>{data.title}</Text>
          {true ? (
            <View
              style={{flexDirection: 'row', marginTop: 10, marginBottom: 4}}>
              {playing ? (
                <TouchableOpacity
                  style={styles.stopButton}
                  onPress={() => {
                    ReactNativeHapticFeedback.trigger(
                      'notificationWarning',
                      options,
                    );
                    song.stop();
                    setPlaying(false);
                  }}>
                  <IonIcon name="stop" style={styles.stopIcon} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => {
                    ReactNativeHapticFeedback.trigger(
                      'notificationSuccess',
                      options,
                    );
                    handleAudio(data.preview);
                  }}>
                  <IonIcon name="play" style={styles.playIcon} />
                </TouchableOpacity>
              )}
              {songOfTheDay != true ? (
                <TouchableOpacity style={styles.songOfTheDayButton}>
                  <MaterialIcon
                    name="library-add"
                    style={styles.songOfTheDayIcon}
                    onPress={addSongOfTheDay}
                  />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity style={styles.songOfTheDayButton}>
                <MaterialIcon
                  name="post-add"
                  style={styles.repostIcon}
                  onPress={() =>
                    navigationUse.navigate('PostFormScreen', {data: data})
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.songOfTheDayButton}>
                <IonIcon
                  name="paper-plane"
                  style={styles.repostIcon}
                  onPress={() =>
                    navigationUse.navigate('MessageSelectScreen', {
                      songData: data,
                    })
                  }
                />
              </TouchableOpacity>
            </View>
          ) : null}
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 8,
            }}>
            {/* <Image
              source={{uri: data.artist.picture_xl}}
              style={styles.artistPhoto}
            /> */}
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                {/* <MaterialCommunityIcon
                  name="microphone-variant"
                  style={styles.artist}
                /> */}
                <Text style={styles.artist}>{data.artist.name}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                {/* <MaterialIcon name="album" style={styles.album} /> */}
                <Text
                  onPress={() =>
                    navigationUse.navigate('AlbumDetailScreen', {
                      id: data.album.id,
                    })
                  }
                  style={styles.album}>
                  {data.album.title}
                </Text>
              </View>
            </View>
          </View>

          {/* <Text style={styles.rank}>Deezer Rank: {data.rank.toString()}</Text>
          <Text style={styles.duration}>
            Song Duration: {data.duration.toString()} seconds.
          </Text> */}
          {/* {data.explicit_lyrics ? (
            <Text style={styles.explcitWarning}>
              Your grandparents might not appreciate this song. It contains
              explicit lyrics.
            </Text>
          ) : null} */}
        </ScrollView>
      );
    } else {
      return <ActivityIndicator size="large" color="#2BAEEC" />;
    }
  };

  return (
    // <View style={styles.container}>

    <LinearGradient
      colors={['#171818', '#171818', '#171818']}
      style={styles.container}>
      {data ? render() : null}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    alignItems: 'center',
    // paddingLeft: 12,
    // paddingRight: 12,
  },
  albumArt: {
    height: dimensions.height / 2.0,
    width: dimensions.width,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  songOfTheDayIcon: {
    fontSize: 32,
    color: '#c1c8d4',
    marginTop: 13,
    marginLeft: 2,
  },
  repostIcon: {
    fontSize: 32,
    color: '#c1c8d4',
    marginTop: 13,
    marginLeft: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  title: {
    fontSize: 40,
    color: '#2BAEEC',
    fontWeight: '400',
    width: 300,
    textAlign: 'center',
    marginTop: 16,
    width: dimensions.width - 100,
    marginTop: 10,
  },
  artist: {
    fontSize: 32,
    color: '#b8c2c2',
    fontWeight: '300',
    marginTop: 10,
    textAlign: 'center',
    marginLeft: 2,
    marginRight: 2,
    alignSelf: 'center',
    width: dimensions.width - 150,
  },
  album: {
    fontSize: 24,
    fontWeight: '300',
    color: '#b8c2c2',
    marginTop: 4,
    padding: 2,
    textAlign: 'center',
    marginLeft: 2,
    marginRight: 2,
    alignSelf: 'center',
    width: dimensions.width - 150,
  },
  rank: {
    fontWeight: '300',
    fontSize: 18,
    color: '#c1c8d4',
    marginTop: 16,
  },
  duration: {
    fontWeight: '300',
    fontSize: 18,
    color: '#c1c8d4',
    marginTop: 4,
  },
  explcitWarning: {
    fontWeight: '300',
    fontSize: 14,
    color: '#c1c8d4',
    marginTop: 6,
    textAlign: 'center',
    width: dimensions.width - 80,
  },
  warning: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7F1535',
    textAlign: 'center',
    padding: 4,
    marginTop: 8,
    width: dimensions.width - 80,
  },
  songOfTheDayButton: {
    backgroundColor: '#2BAEEC',
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 12,
    width: 60,
    height: 60,
  },
  stopIcon: {
    fontSize: 40,
    color: '#c1c8d4',
    marginTop: 9,
    marginLeft: 4,
  },
  playIcon: {
    fontSize: 40,
    color: '#c1c8d4',
    marginTop: 9,
    marginLeft: 4,
  },
  playButton: {
    backgroundColor: '#2BAEEC',
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 12,
    width: 60,
    height: 60,
  },
  stopButton: {
    backgroundColor: '#2BAEEC',
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 12,
    width: 60,
    height: 60,
  },
  artistPhoto: {
    height: 60,
    width: 60,
    borderRadius: 10,
    marginRight: 8,
  },
});

export default SongDetailFromAlbumScreen;
