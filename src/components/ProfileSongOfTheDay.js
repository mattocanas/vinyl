import React, {useEffect, useState} from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Moment from 'react-moment';
import Sound from 'react-native-sound';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const ProfileSongOfTheDay = ({data, refresh}) => {
  const [{currentUser}, dispatch] = useStateProviderValue();
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  useEffect(() => {
    let active = true;
    Sound.setCategory('Playback');
    return () => {
      active = false;
    };
  }, []);

  const track = new Sound(data.audio, null, (e) => {
    if (e) {
      console.log('error', e);
    } else {
      // all good
    }
  });

  const playTrack = () => {
    track.play();
    ReactNativeHapticFeedback.trigger('notificationSuccess', options);
  };

  const stopTrack = () => {
    track.stop();
    ReactNativeHapticFeedback.trigger('notificationWarning', options);
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Image
          style={styles.profilePicture}
          source={{uri: data.profilePictureUrl}}
        />

        <View style={{marginLeft: 10}}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={playTrack}>
              <Image style={styles.albumArt} source={{uri: data.albumArt}} />
            </TouchableOpacity>
            <Moment element={Text} format="MMM Do YY" style={styles.date}>
              {data.date}
            </Moment>
          </View>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.artist}>{data.artist}</Text>
        </View>
        <TouchableOpacity>
          <IonIcon
            name="stop-circle-outline"
            style={styles.stopIcon}
            onPress={stopTrack}
          />
        </TouchableOpacity>
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
  },
  artist: {
    fontWeight: '300',
    fontSize: 14,
    color: '#5AB9B9',
  },

  stopIcon: {
    fontSize: 30,
    // marginTop: 12,
    marginLeft: 16,
    color: '#22B3B2',
  },
});

export default ProfileSongOfTheDay;
