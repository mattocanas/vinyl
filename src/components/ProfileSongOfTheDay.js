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
import {useNavigation} from '@react-navigation/native';

const ProfileSongOfTheDay = ({data, refresh, stopTrack, playTrack}) => {
  const [{currentUser, currentUserData}, dispatch] = useStateProviderValue();
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  const [ready, setReady] = useState(false);
  const [song, setSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const navigationUse = useNavigation();

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
            verified: currentUserData.verified,
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

        <View style={{marginLeft: 70}}>
          {playing ? (
            <TouchableOpacity
              onPress={() => {
                setPlaying(false);
                stopTrack();
              }}>
              <FastImage
                style={styles.albumArt}
                source={{
                  uri: data.albumArt,
                  priority: FastImage.priority.normal,
                }}
                // resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                playTrack(data.audio);
                setPlaying(true);
              }}>
              <FastImage
                style={styles.albumArt}
                source={{
                  uri: data.albumArt,
                  priority: FastImage.priority.normal,
                }}
                // resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity>
          )}

          <View style={{marginLeft: 10}}>
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.artist}>{data.artist}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  albumArt: {
    height: 200,
    width: 200,
    borderRadius: 10,
    marginRight: 4,
    marginLeft: 4,
    marginTop: 14,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#c1c8d4',
    marginRight: 4,
    width: 200,
    marginTop: 4,
  },
  artist: {
    fontWeight: '300',
    fontSize: 14,
    color: '#a3adbf',
  },
  deleteIcon: {
    color: '#c43b4c',
    fontSize: 24,
  },
  deleteContainer: {
    marginLeft: 100,
  },
  postText: {
    color: '#c1c8d4',
    fontSize: 17,
    marginTop: 4,
    marginBottom: 10,
    marginLeft: 6,
  },
  usernameText: {
    color: '#c1c8d4',
    fontWeight: 'bold',
    marginLeft: 8,
    marginTop: 4,
    fontSize: 14,
  },
  stopIcon: {
    fontSize: 32,
    marginRight: 4,
    color: '#2BAEEC',
  },
  profilePicture: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginLeft: 16,
    borderWidth: 1,
    borderColor: '#2BAEEC',
  },
});

export default ProfileSongOfTheDay;
