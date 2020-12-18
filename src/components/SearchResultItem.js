import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, View, Image, StyleSheet} from 'react-native';
import Sound from 'react-native-sound';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import uuid from 'react-uuid';

const SearchResultItem = ({albumArt, title, audio, artist, refresh}) => {
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
  };

  const addSongOfTheDay = () => {
    let newDocRef = db
      .collection('users')
      .doc(currentUser.uid)
      .collection('songsOfTheDay')
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
      })
      .then(setSongOfTheDay(true))
      .then(() => {
        refresh();
      });
  };

  const checkIfSongOfTheDayExists = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .collection('songsOfTheDay')
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => playTrack()}>
        <Image style={styles.albumArt} source={{uri: albumArt}} />
      </TouchableOpacity>

      <View style={styles.songInfoContainer}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.artist}>{artist}</Text>
        {songOfTheDay ? (
          <Text style={styles.songOfTheDayWarning}>
            You already have a song of the day!
          </Text>
        ) : (
          <MaterialIcon
            name="library-add"
            style={styles.songOfTheDayIcon}
            onPress={addSongOfTheDay}
          />
        )}
      </View>
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
    height: 150,
    width: 150,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    color: '#1E8C8B',
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 12,
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
});

export default SearchResultItem;