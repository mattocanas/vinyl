import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Moment from 'react-moment';
import Sound from 'react-native-sound';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {useStateProviderValue} from '../../state/StateProvider';

const ProfileLike = ({data, stopTrack, playTrack}) => {
  const [{currentUser, currentUserData}, dispatch] = useStateProviderValue();
  const [ready, setReady] = useState(false);
  const [song, setSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const navigationUse = useNavigation();

  useEffect(() => {
    let active = true;
    return () => {
      active = false;
    };
  }, [ready]);
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigationUse.navigate('PostDetailScreen', {
            title: data.title,
            artist: data.artist,
            audio: data.audio,
            albumArt: data.albumArt,
            profilePictureUrl: data.profilePictureUrl,
            uid: data.uid,
            username: data.username,
            date: data.date,
            preciseDate: data.preciseDate,

            likes: data.likes,
            likesNumber: data.likes.toLength,
            comments: data.comments,
            type: data.type,
            description: data.description,
            albumId: data.albumId,
            albumName: data.albumName,
            albumTracklist: data.albumTracklist,
            artistId: data.artistId,
            artistTracklist: data.artistTracklist,
            trackId: data.trackId,
            navigateBackTo: 'ProfileScreen',
            docId: data.docId,
            verified: data.verified,
          });
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FastImage
            style={styles.profilePicture}
            source={{
              uri: data.profilePictureUrl,
              priority: FastImage.priority.normal,
            }}
            // resizeMode={FastImage.resizeMode.contain}
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

          <View style={{flexDirection: 'row', marginBottom: 4}}>
            <Image style={styles.albumArt} source={{uri: data.albumArt}} />
            <View style={{marginLeft: 10}}>
              <Text style={styles.title}>{data.title}</Text>
              <Text style={styles.artist}>{data.artist}</Text>
            </View>
            {playing ? (
              <IonIcon
                name="stop"
                style={styles.stopIcon}
                onPress={() => {
                  ReactNativeHapticFeedback.trigger(
                    'notificationWarning',
                    options,
                  );
                  stopTrack();
                  setPlaying(false);
                }}
              />
            ) : (
              <IonIcon
                name="play"
                style={styles.stopIcon}
                onPress={() => {
                  ReactNativeHapticFeedback.trigger(
                    'notificationSuccess',
                    options,
                  );
                  playTrack(data.audio);
                  setPlaying(true);
                }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: '#2BAEEC',
  },
  container: {
    // flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(193, 200, 212, 0.1)',
    paddingLeft: 20,
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
    color: '#2BAEEC',
    marginRight: 10,
    width: 124,
  },
  artist: {
    fontWeight: '300',
    fontSize: 14,
    color: '#a3adbf',
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
    marginRight: 4,
    color: '#2BAEEC',
  },
});

export default ProfileLike;
