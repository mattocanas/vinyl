import React, {useEffect, useState} from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Moment from 'react-moment';
import Sound from 'react-native-sound';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserSongOfTheDay = ({data, refresh}) => {
  const [{currentUser}, dispatch] = useStateProviderValue();

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
        <TouchableOpacity onPress={playTrack}>
          <Image style={styles.albumArt} source={{uri: data.albumArt}} />
        </TouchableOpacity>
        <Moment element={Text} format="MMM Do YY" style={styles.date}>
          {data.date}
        </Moment>
      </View>

      <View style={{marginLeft: 70}}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.artist}>{data.artist}</Text>
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
  deleteIcon: {
    color: '#c43b4c',
    fontSize: 24,
  },
  deleteContainer: {
    marginLeft: 50,
  },
});

export default UserSongOfTheDay;
