import React, {useEffect, useState} from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Moment from 'react-moment';
import Sound from 'react-native-sound';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import FastImage from 'react-native-fast-image';

const UserSongOfTheDay = ({data, refresh}) => {
  const [{currentUser}, dispatch] = useStateProviderValue();
  const [ready, setReady] = useState(false);
  const [song, setSong] = useState(null);

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  useEffect(() => {
    let active = true;
    return () => {
      active = false;
    };
  }, [ready]);

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
    track.play();
    ReactNativeHapticFeedback.trigger('notificationSuccess', options);
  };

  const stopTrack = () => {
    track.stop();
    track.reset();
    ReactNativeHapticFeedback.trigger('notificationError', options);
  };

  const removeSongOfTheDay = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .collection('posts')
      .doc(data.docId)
      .delete()
      .then(() => {
        refresh();
      });
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <FastImage
          style={styles.profilePicture}
          source={{
            uri: data.profilePictureUrl,
            priority: FastImage.priority.normal,
          }}
          // resizeMode={FastImage.resizeMode.contain}
        />

        <Moment element={Text} format="MMM Do YY" style={styles.date}>
          {data.date}
        </Moment>
      </View>

      <View style={{marginLeft: 70, alignItems: 'flex-start'}}>
        <View style={{flexDirection: 'row'}}>
          <FastImage
            style={styles.albumArt}
            source={{uri: data.albumArt, priority: FastImage.priority.normal}}
            // resizeMode={FastImage.resizeMode.contain}
          />
          <View style={{flexDirection: 'row'}}>
            <View style={{marginLeft: 10}}>
              <Text style={styles.title}>{data.title}</Text>
              <Text style={styles.artist}>{data.artist}</Text>
            </View>
            {true ? (
              <>
                <TouchableOpacity>
                  <IonIcon
                    name="play"
                    style={styles.stopIcon}
                    onPress={() => {
                      ReactNativeHapticFeedback.trigger(
                        'notificationSuccess',
                        options,
                      );
                      handleAudio(data.audio);
                    }}
                  />
                </TouchableOpacity>
                {song ? (
                  <TouchableOpacity>
                    <IonIcon
                      name="stop"
                      style={styles.stopIcon}
                      onPress={() => {
                        ReactNativeHapticFeedback.trigger(
                          'notificationWarning',
                          options,
                        );
                        song.stop();
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity>
                    <IonIcon name="stop" style={styles.stopIcon} />
                  </TouchableOpacity>
                )}
              </>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  albumArt: {
    height: 50,
    width: 50,
    borderRadius: 4,
    marginRight: 4,
    marginLeft: 4,
  },
  profilePicture: {
    height: 50,
    width: 50,
    borderRadius: 30,
  },
  container: {
    // flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
    color: '#c1c8d4',
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E8C8B',
    marginRight: 4,
    width: 124,
  },
  artist: {
    fontWeight: '300',
    fontSize: 14,
    color: '#5AB9B9',
  },
  deleteIcon: {
    color: '#c43b4c',
    fontSize: 24,
  },
  deleteContainer: {
    marginLeft: 50,
  },
  stopIcon: {
    fontSize: 32,
    marginRight: 4,
    color: '#1E8C8B',
  },
});

export default UserSongOfTheDay;
