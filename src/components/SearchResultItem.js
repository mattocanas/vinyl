import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, View, Image, StyleSheet} from 'react-native';
import Sound from 'react-native-sound';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import uuid from 'react-uuid';
import {useNavigation} from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const SearchResultItem = ({
  albumArt,
  allData,
  title,
  audio,
  artist,
  refresh,
}) => {
  const navigationUse = useNavigation();
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const [songOfTheDay, setSongOfTheDay] = useState(false);
  useEffect(() => {
    let active = true;
    Sound.setCategory('Playback');
    checkIfSongOfTheDayExists();
    return () => {
      active = false;
    };
  }, []);

  const track = new Sound(audio, null, (e) => {
    if (e) {
      console.log('error', e);
    } else {
      // all good
    }
  });

  const playTrack = () => {
    track.play();
    {
      track.isPlaying() == false ? track.reset() : null;
    }
  };

  const stopTrack = () => {
    ReactNativeHapticFeedback.trigger('notificationWarning', options);
    track.stop();
  };

  const addSongOfTheDay = () => {
    let newDocRef = db
      .collection('users')
      .doc(currentUser.uid)
      .collection('posts')
      .doc();

    newDocRef
      .set({
        docId: newDocRef.id,
        artist: artist,
        title: title,
        albumArt: albumArt,
        audio: audio,
        username: currentUser.displayName,
        uid: currentUser.uid,
        date: new Date().toDateString(),
        profilePictureUrl: currentUserData.profilePictureUrl,
        likes: [],
        comments: {},
        description: 'Song of the Day.',
      })
      .then(setSongOfTheDay(true))
      .then(() => {
        refresh();
      });
  };

  const checkIfSongOfTheDayExists = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .collection('posts')
      .where('date', '==', new Date().toDateString())
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.exists) {
            setSongOfTheDay(true);
          } else {
            console.log('doesnt');
          }
        });
      });
  };

  const deleteSongOfTheDay = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .collection('posts')
      .where('description', '==', 'Song of the Day.')
      .where('date', '==', new Date().toDateString())
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.delete();
        });
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() =>
          navigationUse.navigate('SongDetailScreen', {data: allData})
        }>
        <Image style={styles.albumArt} source={{uri: albumArt}} />
        <View style={styles.songInfoContainer}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.artist}>{artist}</Text>

          {/* <TouchableOpacity>
          <IonIcon
            name="stop-circle-outline"
            style={styles.stopIcon}
            onPress={stopTrack}
          />
        </TouchableOpacity> */}

          {/* {songOfTheDay ? (
          <TouchableOpacity>
            <Text style={styles.songOfTheDayWarning}>
              You already have a song of the day!
            </Text>
          </TouchableOpacity>
        ) : (
          <MaterialIcon
            name="library-add"
            style={styles.songOfTheDayIcon}
            onPress={addSongOfTheDay}
          />
        )} */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 4,
    flexDirection: 'row',
  },
  albumArt: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    color: '#1E8C8B',
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
    color: '#c1c8d4',
  },
  songOfTheDayIcon: {
    fontSize: 30,
    color: '#5AB9B9',
    marginLeft: 10,
    marginTop: 8,
  },
  songInfoContainer: {
    marginLeft: 12,
  },
  songOfTheDayWarning: {
    fontSize: 8,
    color: '#c1c8d4',
  },
  stopIcon: {
    fontSize: 34,
    marginTop: 12,
    // marginLeft: 16,
    color: '#1E8C8B',
  },
});

export default SearchResultItem;
