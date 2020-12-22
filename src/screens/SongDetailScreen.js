import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import Sound from 'react-native-sound';
import {useNavigation} from '@react-navigation/native';

const SongDetailScreen = ({route}) => {
  const navigationUse = useNavigation();

  const {data} = route.params;
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

  const track = new Sound(data.preview, null, (e) => {
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
      .collection('posts')
      .doc();

    newDocRef
      .set({
        docId: newDocRef.id,
        artist: data.artist.name,
        title: data.title,
        albumArt: data.album.cover,
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
      .then(setSongOfTheDay(true));
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
            // console.log('doesnt');
          }
        });
      });
  };

  return (
    <View style={styles.container}>
      <Image style={styles.albumArt} source={{uri: data.album.cover}} />
      <View style={styles.iconContainer}>
        {songOfTheDay != true ? (
          <MaterialIcon
            name="library-add"
            style={styles.songOfTheDayIcon}
            onPress={addSongOfTheDay}
          />
        ) : null}
        <IonIcon
          name="paper-plane"
          style={styles.repostIcon}
          onPress={() => navigationUse.navigate('PostFormScreen', {data: data})}
        />
      </View>
      {songOfTheDay ? (
        <Text style={styles.warning}>You already have a song of the day!</Text>
      ) : null}
      <Text style={styles.title}>{data.title}</Text>
      <TouchableOpacity
        onPress={() =>
          navigationUse.navigate('ArtistDetailScreen', {data: data.artist})
        }>
        <Text style={styles.artist}>{data.artist.name}</Text>
      </TouchableOpacity>
      <Text style={styles.album}>{data.album.title}</Text>
      <Text style={styles.rank}>Deezer Rank: {data.rank.toString()}</Text>
      <Text style={styles.duration}>
        Song Duration: {data.duration.toString()} seconds.
      </Text>
      {data.explicit_lyrics ? (
        <Text style={styles.explcitWarning}>
          Your grandparents might not appreciate this song. It contains explicit
          lyrics.
        </Text>
      ) : (
        <Text style={styles.explcitWarning}>
          You don't have to change this song when your parents come in. It
          doesn't have any bad words.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242525',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  albumArt: {
    height: 200,
    width: 200,
    marginTop: 40,
  },
  songOfTheDayIcon: {
    fontSize: 30,
    color: '#5AB9B9',
    marginLeft: 10,
  },
  repostIcon: {
    fontSize: 28,
    color: '#c1c8d4',
    marginLeft: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  title: {
    fontSize: 26,
    color: '#5AB9B9',
    fontWeight: 'bold',
    marginTop: 20,
  },
  artist: {
    fontSize: 24,
    fontWeight: '600',
    color: '#5AB9B9',
    marginTop: 4,
  },
  album: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5AB9B9',
    marginTop: 4,
  },
  rank: {
    fontWeight: '200',
    fontSize: 18,
    color: '#c1c8d4',
    marginTop: 4,
  },
  duration: {
    fontWeight: '200',
    fontSize: 18,
    color: '#c1c8d4',
    marginTop: 4,
  },
  explcitWarning: {
    fontWeight: '200',
    fontSize: 16,
    color: '#c1c8d4',
    marginTop: 12,
    textAlign: 'center',
    paddingRight: 8,
    paddingLeft: 8,
  },
  warning: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7F1535',
    marginTop: 8,
  },
});

export default SongDetailScreen;
