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
        username: currentUser.displayName,
        uid: currentUser.uid,
        date: new Date().toDateString(),
        profilePictureUrl: currentUserData.profilePictureUrl,
        likes: [],
        comments: {},
        description: '',
        type: 'Song of the Day.',
      })
      .then(setSongOfTheDay(true))
      .then(() => {
        handleScheduleNotification(
          'Share your music',
          "Don't forget to add your song of the day!",
        );
      })
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
      const track = new Sound(data.preview, null, (e) => {
        if (e) {
          console.log('error', e);
        } else {
          setReady(true);
        }
      });

      const playTrack = () => {
        track.play();
        ReactNativeHapticFeedback.trigger('notificationSuccess', options);
        {
          track.isPlaying() == false ? track.reset() : null;
        }
      };

      const stopTrack = () => {
        ReactNativeHapticFeedback.trigger('notificationWarning', options);
        track.stop();
        track.reset();
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
          </View>
          {ready ? (
            <View style={{flexDirection: 'row', marginTop: -34}}>
              <TouchableOpacity style={styles.playButton} onPress={playTrack}>
                <IonIcon name="play-circle-outline" style={styles.playIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopButton} onPress={stopTrack}>
                <IonIcon name="stop-circle-outline" style={styles.stopIcon} />
              </TouchableOpacity>
            </View>
          ) : null}

          <Text style={styles.title}>{data.title}</Text>
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
                <MaterialCommunityIcon
                  name="microphone-variant"
                  style={styles.artist}
                />
                <Text style={styles.artist}>{data.artist.name}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <MaterialIcon name="album" style={styles.album} />
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

          {songOfTheDay ? (
            <Text style={styles.warning}>
              You already have a song of the day! Head over to your profile if
              you want to remove it.
            </Text>
          ) : null}
          <Text style={styles.rank}>Deezer Rank: {data.rank.toString()}</Text>
          <Text style={styles.duration}>
            Song Duration: {data.duration.toString()} seconds.
          </Text>
          {data.explicit_lyrics ? (
            <Text style={styles.explcitWarning}>
              Your grandparents might not appreciate this song. It contains
              explicit lyrics.
            </Text>
          ) : null}
          <View style={styles.iconContainer}>
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
              <IonIcon
                name="paper-plane"
                style={styles.repostIcon}
                onPress={() =>
                  navigationUse.navigate('PostFormScreen', {data: data})
                }
              />
            </TouchableOpacity>
          </View>
          <Text style={{fontSize: 8, color: 'gray', marginTop: 4}}>
            Click the plus icon to make this your song of the day!
          </Text>
        </ScrollView>
      );
    } else {
      return <ActivityIndicator size="large" color="#1E8C8B" />;
    }
  };

  return (
    // <View style={styles.container}>

    <LinearGradient
      colors={['#2a2b2b', '#242525', '#242525']}
      style={styles.container}>
      {data ? render() : null}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a2b2b',
    alignItems: 'center',
    // paddingLeft: 12,
    // paddingRight: 12,
  },
  albumArt: {
    height: dimensions.height / 2,
    width: dimensions.width,
    borderBottomLeftRadius: 60,
  },
  songOfTheDayIcon: {
    fontSize: 30,
    color: '#c1c8d4',
  },
  repostIcon: {
    fontSize: 28,
    color: '#c1c8d4',
  },
  iconContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  title: {
    fontSize: 32,
    color: '#1E8C8B',
    fontWeight: '400',
    width: 300,
    textAlign: 'center',
    marginTop: 16,
    width: dimensions.width - 80,
  },
  artist: {
    fontSize: 30,
    color: '#b8c2c2',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 0,
  },
  album: {
    fontSize: 28,
    fontWeight: '300',
    color: '#b8c2c2',
    marginTop: 4,
    padding: 2,
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
    backgroundColor: '#1E8C8B',
    padding: 14,
    borderRadius: 40,
    margin: 10,
  },
  stopIcon: {
    fontSize: 32,
    color: '#c1c8d4',
    marginTop: 13,
    marginLeft: 2,
  },
  playIcon: {
    fontSize: 32,
    marginTop: 13,
    color: '#c1c8d4',
    marginLeft: 2,
  },
  playButton: {
    backgroundColor: '#1E8C8B',
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 12,
    width: 60,
    height: 60,
  },
  stopButton: {
    backgroundColor: '#1E8C8B',
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