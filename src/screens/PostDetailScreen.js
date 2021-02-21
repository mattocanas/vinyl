import React, {useEffect, useState} from 'react';
import Moment from 'react-moment';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Sound from 'react-native-sound';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import IonIcon from 'react-native-vector-icons/Ionicons';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import firebase from 'firebase';
import {useNavigation} from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import CommentsScreen from './CommentsScreen';

const dimensions = Dimensions.get('screen');

const PostDetailScreen = ({route}) => {
  const {
    title,
    artist,
    audio,
    albumArt,
    profilePictureUrl,
    uid,
    username,
    date,
    likes,
    likesNumber,
    comments,
    type,
    description,
    albumId,
    albumName,
    albumTracklist,
    artistId,
    artistTracklist,
    trackId,
    navigateBackTo,
    docId,
    verified,
  } = route.params;

  const [{currentUser}, dispatch] = useStateProviderValue();
  const [liked, setLiked] = useState(false);
  const navigationUse = useNavigation();
  const [ready, setReady] = useState(false);
  const [song, setSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  // const [likesNumber, setLikesNumber] = useState(likes.length);
  const [refresh, setRefresh] = useState(false);

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
  }, [refresh]);

  const handleAudio = (url) => {
    track = new Sound(url, null, (e) => {
      if (e) {
        console.log('error', e);
      } else {
        setReady(true);

        setSong(track);
        track.play();
        setPlaying(true);
      }
    });
  };

  const onLike = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .collection('likes')
      .doc(docId)
      .set({
        title: title,
        artist: artist,
        audio: audio,
        albumArt: albumArt,
        profilePictureUrl: profilePictureUrl,
        uid: uid,
        username: username,
        date: date,
        likes: likes,
        comments: comments,
        docId: docId,
        description: description,
        type: type,
      });

    db.collection('users')
      .doc(uid)
      .collection('posts')
      .doc(docId)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion({
          uid: currentUser.uid,
          username: currentUser.displayName,
        }),
      })
      .then(() => {
        checkIfLiked();
        setLiked(true);
        // setLikesNumber(likes.length + 1);
        ReactNativeHapticFeedback.trigger('notificationSuccess', options);
      });
  };

  const onUnlike = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .collection('likes')
      .doc(docId)
      .delete()
      .then(() => {
        setLiked(false);
      });

    db.collection('users')
      .doc(uid)
      .collection('posts')
      .doc(docId)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove({
          uid: currentUser.uid,
          username: currentUser.displayName,
        }),
      })
      .then(() => {
        checkIfLiked();
        setLiked(false);
        // setLikesNumber(likes.length);
        ReactNativeHapticFeedback.trigger('notificationWarning', options);
      });
  };

  const checkIfLiked = () => {
    db.collection('users')
      .doc(uid)
      .collection('posts')
      .where('likes', 'array-contains', {
        uid: currentUser.uid,
        username: currentUser.displayName,
      })
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.exists) {
            if (doc.data().docId == docId) {
              setLiked(true);
            }
          } else {
            setLiked(false);
          }
        });
      });
  };

  const refreshComponent = () => {
    setRefresh(true);
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
          <Text style={styles.usernameText}>{username}</Text>
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

        {type == 'Song of the Day.' ? (
          <View
            style={{alignItems: 'center', alignSelf: 'center', marginTop: 14}}>
            <Text style={styles.SOTDText}>Song of the day:</Text>

            <FastImage
              style={styles.albumArt}
              source={{
                uri: albumArt,
                priority: FastImage.priority.normal,
              }}
              // resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.artistText}>{artist}</Text>
          </View>
        ) : (
          <View style={{alignItems: 'center'}}>
            <Text style={styles.description}>{description}</Text>

            <FastImage
              style={styles.albumArt}
              source={{
                uri: albumArt,
                priority: FastImage.priority.normal,
              }}
              // resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.artistText}>{artist}</Text>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: 2,
            marginBottom: 2,
          }}>
          {playing ? (
            <TouchableOpacity
              onPress={() => {
                song.stop();
                setPlaying(false);
              }}>
              <IonIcon name="stop" style={styles.stopIcon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                handleAudio(audio);
              }}>
              <IonIcon name="play" style={styles.playIcon} />
            </TouchableOpacity>
          )}
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
                  likes,
                  likesNumber: likes.length,
                  comments,
                  type,
                  description,
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
          <Text style={styles.commentsNumber}>{comments.length} comments</Text>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#171818',
    alignItems: 'center',
    // paddingLeft: 12,
    // paddingRight: 12,
  },
  postContentContainer: {
    flexDirection: 'row',
    marginTop: 24,
    marginLeft: 34,
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
  likeButton: {
    color: '#2BAEEC',
    fontSize: 28,
    marginTop: 10,
  },
  buttonsTab: {
    marginTop: 14,
    marginRight: 10,
  },
  postContet: {
    color: '#c1c8d4',
    fontSize: 22,
    marginTop: 20,
    lineHeight: 24,
    marginLeft: 44,
    width: dimensions.width - 60,
  },
  postTextView: {
    marginRight: 10,
  },
  stopIcon: {
    fontSize: 70,
    color: '#a3adbf',
    marginTop: 2,
    marginLeft: 4,
    marginTop: 20,
  },
  playIcon: {
    fontSize: 60,
    marginTop: 20,
    color: '#a3adbf',
    marginLeft: 4,
    marginBottom: 16,
  },

  albumIntroText: {
    color: '#2BAEEC',
    fontSize: 20,
    marginRight: 8,
    marginLeft: 8,
  },
  albumText: {
    color: '#a3adbf',
    fontSize: 20,
    fontWeight: '500',
    width: 280,
    textAlign: 'center',
    width: 340,
  },
  albumIntroTextSOTD: {
    color: '#2BAEEC',
    fontSize: 20,
    marginRight: 8,
    marginLeft: 8,
  },
  albumTextSOTD: {
    color: '#a3adbf',
    fontSize: 30,
    fontWeight: '500',
    width: 280,
    textAlign: 'center',
    width: 340,
    marginTop: 6,
  },
  artistIntroTextSOTD: {
    color: '#2BAEEC',
    fontSize: 20,
  },
  artistTextSOTD: {
    color: '#a3adbf',
    fontSize: 30,
    fontWeight: '500',
    width: 260,
    textAlign: 'center',
    width: 340,
    marginTop: 6,
  },
  titleTextSOTD: {
    color: '#c1c8d4',
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 30,
    width: 340,
  },
  SOTDText: {
    fontSize: 30,
    color: '#2BAEEC',
  },
  description: {
    color: '#c1c8d4',
    fontSize: 26,
    marginRight: 20,
    marginTop: 20,
    alignSelf: 'flex-start',
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
    fontSize: 12,
    color: '#2BAEEC',
    textAlign: 'center',
    marginLeft: 4,
    marginRight: 4,
    marginTop: 1,
    alignSelf: 'center',
  },
  commentsNumber: {
    fontSize: 18,
    fontWeight: '500',
    color: '#c1c8d4',
    marginRight: 30,
  },
});

export default PostDetailScreen;
