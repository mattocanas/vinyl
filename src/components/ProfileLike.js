import React, {useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Moment from 'react-moment';
import Sound from 'react-native-sound';
import IonIcon from 'react-native-vector-icons/Ionicons';

const ProfileLike = ({data}) => {
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
  };

  const stopTrack = () => {
    track.stop();
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={playTrack}>
          <Image style={styles.albumArt} source={{uri: data.albumArt}} />
        </TouchableOpacity>
        <Text style={styles.usernameText}>{data.username} |</Text>

        <Moment element={Text} format="MMM Do YY" style={styles.date}>
          {data.date}
        </Moment>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{marginLeft: 70, alignItems: 'flex-start'}}>
          <Text style={styles.description}>{data.description}</Text>

          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.artist}>{data.artist}</Text>
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
  description: {
    fontSize: 16,
    color: '#c1c8d4',
    marginRight: 30,
    marginBottom: 8,
  },
  usernameText: {
    color: '#c1c8d4',
    fontWeight: 'bold',
    marginLeft: 8,
    marginTop: 4,
  },
  stopIcon: {
    fontSize: 30,
    // marginTop: 12,

    color: '#22B3B2',
  },
});

export default ProfileLike;
