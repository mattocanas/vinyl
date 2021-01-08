import React, {useEffect, useState} from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DailyMusic from './DailyMusic';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Sound from 'react-native-sound';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import FastImage from 'react-native-fast-image';

const DailyMusicItem = ({
  title,
  artist,
  albumArt,
  audio,
  date,
  likes,
  description,
  id,
}) => {
  const [playing, setPlaying] = useState(false);
  const [{currentUser}, dispatch] = useStateProviderValue();
  const [liked, setLiked] = useState(false);
  const [song, setSong] = useState(null);
  const [ready, setReady] = useState(false);
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  useEffect(() => {
    let active = true;
    checkIfLiked();

    return () => {
      active = false;
    };
  }, [liked]);

  const handleAudio = (url) => {
    track = new Sound(url, null, (e) => {
      if (e) {
        console.log('error', e);
      } else {
        setReady(true);
        console.log(track.isLoaded());
        setSong(track);
        track.play();
      }
    });
  };

  const playTrack = () => {
    song.play();
    ReactNativeHapticFeedback.trigger('notificationSuccess', options);
  };

  const stopTrack = () => {
    ReactNativeHapticFeedback.trigger('notificationWarning', options);
    setPlaying(false);
    song.stop();
    song.reset();
  };

  const likePost = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .collection('likes')
      .doc(id)
      .set({
        title: title,
        artist: artist,
        albumArt: albumArt,
        description: description,
        audio: audio,
        date: date,
        likes: likes,
      })
      .then(() => {
        setLiked(true);
        ReactNativeHapticFeedback.trigger('notificationSuccess', options);
      });
  };

  const checkIfLiked = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .collection('likes')
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      });
  };

  const unlikePost = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .collection('likes')
      .doc(id)
      .delete()
      .then(() => {
        setLiked(false);
        ReactNativeHapticFeedback.trigger('notificationWarning', options);
      });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.albumArtContainer}>
        <TouchableOpacity
          onPress={() => {
            handleAudio(audio);
          }}>
          <FastImage
            style={styles.albumArt}
            source={{
              uri: albumArt,
              priority: FastImage.priority.normal,
            }}
            // resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>

        <View
          style={{flexDirection: 'row', marginTop: 6, alignItems: 'center'}}>
          {liked == true ? (
            <TouchableOpacity onPress={unlikePost}>
              <AntIcon style={styles.heartIcon} name="heart" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={likePost}>
              <AntIcon style={styles.heartIcon} name="hearto" />
            </TouchableOpacity>
          )}
          <IonIcon
            name="stop-circle-outline"
            style={styles.stopIcon}
            onPress={() => song.stop()}
          />

          {/* <AntIcon style={styles.repostIcon} name="retweet" /> */}
        </View>
      </View>
      <View style={styles.snippetContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.artistText}>{artist}</Text>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 110,
    width: 160,
  },
  albumArt: {
    height: 100,
    width: 100,
    borderRadius: 4,
  },
  albumArtContainer: {
    alignItems: 'center',
  },
  snippetContainer: {
    marginLeft: 8,
  },
  heartIcon: {
    fontSize: 28,
    color: '#7F1535',
    // marginRight: 8,
  },
  repostIcon: {
    fontSize: 28,
    color: '#c1c8d4',
  },
  titleText: {
    fontWeight: 'bold',
    color: '#1E8C8B',
  },
  artistText: {
    color: '#5AB9B9',
    marginTop: 1,
  },
  descriptionText: {
    color: '#c1c8d4',
    fontSize: 10,
    letterSpacing: 1.1,
    marginTop: 6,
  },
  stopIcon: {
    fontSize: 30,
    // marginTop: 12,
    marginLeft: 8,
    color: '#1E8C8B',
  },
});

export default DailyMusicItem;
