import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import firebase from 'firebase';
import {useNavigation} from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import CommentsScreen from './CommentsScreen';
import Moment from 'react-moment';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';

const SongRequestDetailScreen = ({route}) => {
  const {
    title,
    artist,
    audio,
    albumArt,
    profilePictureUrl,
    uid,
    requestedByUsername,
    date,
    likes,
    comments,
    type,
    // description,
    albumId,
    albumName,
    albumTracklist,
    artistId,
    artistTracklist,
    trackId,
    navigateBackTo,
    docId,
    verified,
    requestedId,
    requestedUsername,
  } = route.params;
  const [song, setSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const navigationUse = useNavigation();

  const handleAudio = (url) => {
    track = new Sound(url, null, (e) => {
      if (e) {
        console.log('error', e);
      } else {
        setSong(track);
        track.play();
        setPlaying(true);
      }
    });
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={{alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <MaterialIcon
          onPress={() => {
            if (song) {
              song.stop();
            }
            navigationUse.navigate(navigateBackTo);
          }}
          name="arrow-back-ios"
          color="white"
          style={{
            fontSize: 30,
            position: 'absolute',
            marginTop: 54,
            alignSelf: 'flex-start',
            marginLeft: 30,
          }}
        />
        <View style={styles.profileContainer}>
          <TouchableOpacity
            onPress={() =>
              navigationUse.navigate('FeedUserDetailScreen', {data: uid})
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
          <Text style={styles.usernameText}>{requestedByUsername}</Text>
          {verified ? (
            <MaterialCommunityIcon
              name="check-decagram"
              style={styles.verifiedCheck}
            />
          ) : null}
          <Text style={styles.usernameText}></Text>
          <Text style={{fontSize: 6, alignSelf: 'center', marginRight: 1}}>
            ⚪️
          </Text>
          <Moment fromNow element={Text} style={styles.dateText}>
            {date}
          </Moment>
        </View>
        {title == '' ? (
          <>
            <Text style={{width: 380, marginTop: 20, marginLeft: 30}}>
              <Text
                style={styles.usernameTextLink}
                onPress={() =>
                  navigationUse.navigate('FeedUserDetailScreen', {
                    data: uid,
                  })
                }>
                @{requestedByUsername}
              </Text>
              <Text style={styles.requestedText}> requested a track from </Text>
              <Text
                style={styles.usernameTextLink}
                onPress={() =>
                  navigationUse.navigate('FeedUserDetailScreen', {
                    data: requestedId,
                  })
                }>
                @{requestedUsername}
              </Text>
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: 40,
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigationUse.navigate('LikeListScreen', {data: likes})
                }>
                <Text style={styles.likesNumber}>{likes.length} likes</Text>
              </TouchableOpacity>
              <IonIcon
                name="chatbubble-outline"
                style={styles.commentIcon}
                onPress={() =>
                  navigationUse.navigate('PostCommentScreen', {
                    uid: uid,
                    docId: docId,
                    data: {
                      title,
                      artist,
                      audio,
                      albumArt,
                      profilePictureUrl,
                      uid,
                      username: requestedByUsername,
                      date,
                      preciseDate,
                      likes,
                      likesNumber: likes.length,
                      comments,
                      type,
                      // description,
                      albumId,
                      albumName,
                      albumTracklist,
                      artistId,
                      artistTracklist,
                      trackId,
                      navigateBackTo,
                      docId,
                      verified,
                    },
                  })
                }
              />
              <Text style={styles.commentsNumber}>
                {comments.length} comments
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigationUse.navigate('ReportPostScreen', {
                    title,
                    artist,
                    audio,
                    albumArt,
                    profilePictureUrl,
                    uid,
                    username: requestedByUsername,
                    date,
                    likes,
                    comments,
                    type,
                    description,
                    docId,
                  })
                }>
                <MaterialIcon name="report" style={styles.reportButton} />
              </TouchableOpacity>
            </View>

            <CommentsScreen docId={docId} uid={uid} />
          </>
        ) : null}

        {title != '' ? (
          <View>
            <View style={{marginLeft: 30}}>
              {playing ? (
                <TouchableOpacity
                  onPress={() => {
                    song.stop();
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
              )}
              <Text
                style={styles.titleText}
                onPress={() =>
                  navigationUse.navigate('SongDetailFromAlbumScreen', {
                    id: trackId,
                  })
                }>
                {title}
              </Text>
              <Text style={styles.artistText}>{artist}</Text>
              <Text style={{width: 380, marginTop: 20}}>
                <Text
                  style={styles.usernameTextLink}
                  onPress={() =>
                    navigationUse.navigate('FeedUserDetailScreen', {
                      data: requestedId,
                    })
                  }>
                  @{requestedUsername}
                </Text>
                <Text style={styles.requestedText}>
                  {' '}
                  recommended this track to{' '}
                </Text>
                <Text
                  style={styles.usernameTextLink}
                  onPress={() =>
                    navigationUse.navigate('FeedUserDetailScreen', {
                      data: uid,
                    })
                  }>
                  @{requestedByUsername}
                </Text>
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: 40,
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigationUse.navigate('LikeListScreen', {data: likes})
                }>
                <Text style={styles.likesNumber}>{likes.length} likes</Text>
              </TouchableOpacity>
              <IonIcon
                name="chatbubble-outline"
                style={styles.commentIcon}
                onPress={() =>
                  navigationUse.navigate('PostCommentScreen', {
                    uid: uid,
                    docId: docId,
                    data: {
                      title,
                      artist,
                      audio,
                      albumArt,
                      profilePictureUrl,
                      uid,
                      username: requestedByUsername,
                      date,
                      preciseDate,
                      likes,
                      likesNumber: likes.length,
                      comments,
                      type,
                      // description,
                      albumId,
                      albumName,
                      albumTracklist,
                      artistId,
                      artistTracklist,
                      trackId,
                      navigateBackTo,
                      docId,
                      verified,
                    },
                  })
                }
              />
              <Text style={styles.commentsNumber}>
                {comments.length} comments
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigationUse.navigate('ReportPostScreen', {
                    title,
                    artist,
                    audio,
                    albumArt,
                    profilePictureUrl,
                    uid,
                    username: requestedByUsername,
                    date,
                    likes,
                    comments,
                    type,
                    description,
                    docId,
                  })
                }>
                <MaterialIcon name="report" style={styles.reportButton} />
              </TouchableOpacity>
            </View>

            <CommentsScreen docId={docId} uid={uid} />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#171818',
  },
  profilePicture: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginLeft: 30,

    borderColor: '#2BAEEC',
    borderWidth: 1,
    alignItems: 'center',
  },
  usernameText: {
    color: '#c1c8d4',
    fontWeight: 'bold',
    marginLeft: 8,
    // marginTop: 4,
    fontSize: 16,
    alignSelf: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 120,
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
    color: 'gray',
    alignSelf: 'center',
  },
  requestedText: {
    alignSelf: 'center',
    color: '#c1c8d4',
    fontSize: 20,
    marginTop: 30,
  },
  usernameTextLink: {
    color: '#c1c8d4',
    fontSize: 20,
    marginTop: 30,
    color: '#2BAEEC',
    textDecorationLine: 'underline',
  },
  albumArt: {
    height: 340,
    width: 340,
    borderRadius: 14,
    marginTop: 28,
  },
  titleText: {
    color: '#c1c8d4',
    fontSize: 30,
    fontWeight: '500',
    marginTop: 18,
    width: 340,
  },
  artistText: {
    color: '#a3adbf',
    fontSize: 24,
    fontWeight: '500',
    width: 280,

    width: 340,
  },
  likesNumber: {
    // marginTop: 14,
    fontSize: 18,
    fontWeight: '500',
    color: '#c1c8d4',
    marginRight: 30,
  },
  reportButton: {
    color: '#c1c8d4',
    fontSize: 28,
    // marginTop: 14,
    marginLeft: 0,
    // position: 'relative',
    // left: 230,
  },
  commentIcon: {
    fontSize: 26,
    color: '#c1c8d4',
    marginRight: 4,
    // marginTop: 12,
  },
  verifiedCheck: {
    fontSize: 24,
    color: '#2BAEEC',
    textAlign: 'center',
    marginLeft: 0,
    marginRight: -8,
    marginTop: 1,
  },
  commentsNumber: {
    fontSize: 18,
    fontWeight: '500',
    color: '#c1c8d4',
    marginRight: 30,
  },
});

export default SongRequestDetailScreen;
