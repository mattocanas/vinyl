import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Moment from 'react-moment';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useNavigation} from '@react-navigation/native';

const PlaylistSong = ({
  albumArt,
  title,
  artist,
  addedById,
  profilePictureUrl,
  addedByUsername,
  addedOnDate,
  playTrack,
  audio,
  stopTrack,
}) => {
  const [playing, setPlaying] = useState(false);
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  const navigationUse = useNavigation();

  return (
    <View style={{marginTop: 20}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() =>
            navigationUse.navigate('FeedUserDetailScreen', {data: addedById})
          }>
          <FastImage
            style={styles.profilePicture}
            source={{
              uri: profilePictureUrl,
              priority: FastImage.priority.normal,
            }}
            // resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
        <Text style={styles.usernameText}>{addedByUsername}</Text>
        <Moment fromNow element={Text} style={styles.dateText}>
          {addedOnDate.toDate()}
        </Moment>
      </View>
      <View style={{flexDirection: 'row'}}>
        {playing ? (
          <TouchableOpacity
            onPress={() => {
              ReactNativeHapticFeedback.trigger('notificationWarning', options);
              stopTrack();
              setPlaying(false);
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
        ) : (
          <TouchableOpacity
            onPress={() => {
              ReactNativeHapticFeedback.trigger('notificationSuccess', options);
              playTrack(audio);
              setPlaying(true);
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
        )}
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.artistText}>{artist}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  albumArt: {
    height: 170,
    width: 170,
    borderRadius: 8,
    marginLeft: 0,
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  titleText: {
    color: '#2BAEEC',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 4,
    marginTop: 10,
    width: 142,
    textAlign: 'center',
    alignSelf: 'center',
  },
  artistText: {
    color: '#a3adbf',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
    marginTop: 4,
    width: 142,
    textAlign: 'center',
    alignSelf: 'center',
  },
  profilePicture: {
    height: 30,
    width: 30,
    borderRadius: 20,
  },
  usernameText: {
    color: '#c1c8d4',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 10,
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
    alignSelf: 'center',
    marginLeft: 10,
  },
});

export default PlaylistSong;
