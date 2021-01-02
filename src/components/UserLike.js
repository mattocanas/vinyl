import React, {useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Moment from 'react-moment';
import Sound from 'react-native-sound';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const UserLike = ({data}) => {
  useEffect(() => {
    let active = true;
    Sound.setCategory('Playback');
    return () => {
      active = false;
    };
  }, []);
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

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
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={styles.profilePicture}
          source={{uri: data.profilePictureUrl}}
        />
        <Text style={styles.usernameText}>{data.username} |</Text>

        <Moment element={Text} format="MMM Do YY" style={styles.date}>
          {data.date}
        </Moment>
      </View>

      <View style={{marginLeft: 70, alignItems: 'flex-start'}}>
        {data.description != '' ? (
          <Text style={styles.description}>{data.description}</Text>
        ) : (
          <Text style={styles.description}>Song of the day:</Text>
        )}
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={playTrack}>
            <Image style={styles.albumArt} source={{uri: data.albumArt}} />
          </TouchableOpacity>
          <View style={{marginLeft: 10}}>
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
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(193, 200, 212, 0.1)',
    paddingLeft: 10,
    paddingBottom: 6,
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
  description: {
    fontSize: 16,
    color: '#c1c8d4',
    marginRight: 30,
    marginBottom: 12,
  },
  usernameText: {
    color: '#c1c8d4',
    fontWeight: 'bold',
    marginLeft: 8,
    marginTop: 4,
  },
  stopIcon: {
    fontSize: 32,
    marginLeft: 16,
    color: '#1E8C8B',
  },
});

export default UserLike;
