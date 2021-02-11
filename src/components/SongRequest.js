import React, {useEffect, useState} from 'react';
import Moment from 'react-moment';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import Sound from 'react-native-sound';
import AntIcon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import firebase from 'firebase';
import {useNavigation} from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {TypingAnimation} from 'react-native-typing-animation';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';

const SongRequest = ({data, navigateBackTo, playTrack, stopTrack, refresh}) => {
  const [likesNumber, setLikesNumber] = useState(data.likes.length);
  const [{currentUser, currentUserData}, dispatch] = useStateProviderValue();
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const navigationUse = useNavigation();
  const [song, setSong] = useState(null);
  const [ready, setReady] = useState(false);

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      checkIfLiked();

      Sound.setCategory('Playback');

      return () => {
        active = false;
      };
    }, []),
  );

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
      .doc(data.docId)
      .set({
        title: data.title,
        artist: data.artist,
        audio: data.audio,
        albumArt: data.albumArt,
        profilePictureUrl: data.profilePictureUrl,
        uid: data.requestedById,
        username: data.requestedByUsername,
        date: data.date,
        likes: data.likes,
        comments: data.comments,
        docId: data.docId,

        type: data.type,
        albumId: data.albumId,
        albumName: data.albumName,
        albumTracklist: data.albumTracklist,
        artistId: data.artistId,
        artistTracklist: data.artistTracklist,
        trackId: data.trackId,
        verified: data.verified,
      });

    db.collection('posts')
      .doc(data.docId)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion({
          uid: currentUser.uid,
          username: currentUser.displayName,
        }),
      });

    db.collection('users')
      .doc(data.requestedById)
      .collection('posts')
      .doc(data.docId)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion({
          uid: currentUser.uid,
          username: currentUser.displayName,
        }),
      })
      .then(() => {
        // checkIfLiked();
        setLiked(true);
        if (likesNumber == data.likes.length) {
          setLikesNumber(data.likes.length + 1);
        } else {
          setLikesNumber(data.likes.length);
        }

        ReactNativeHapticFeedback.trigger('notificationSuccess', options);
        // refresh();
      });

    let newNotificationRef = db
      .collection('users')
      .doc(data.requestedById)
      .collection('notifications')
      .doc();
    newNotificationRef.set({
      notificationId: newNotificationRef.id,
      type: 'like',
      date: new Date().toDateString(),
      preciseDate: new Date(),
      likedBy: currentUser.uid,
      likedByUsername: currentUser.displayName,
      likedByProfilePicture: currentUserData.profilePictureUrl,
      likedByVerified: currentUserData.verified,
      postId: data.docId,
      postData: {
        title: data.title,
        artist: data.artist,
        audio: data.audio,
        albumArt: data.albumArt,
        profilePictureUrl: data.profilePictureUrl,
        uid: data.requestedById,
        username: data.requestedByUsername,
        date: data.date,
        likes: data.likes,
        comments: data.comments,
        docId: data.docId,

        type: data.type,
        albumId: data.albumId,
        albumName: data.albumName,
        albumTracklist: data.albumTracklist,
        artistId: data.artistId,
        artistTracklist: data.artistTracklist,
        trackId: data.trackId,
        verified: data.verified,
      },
    });
  };

  const onUnlike = () => {
    // setLiked(false);
    // setLikesNumber(likes.length);
    db.collection('users')
      .doc(currentUser.uid)
      .collection('likes')
      .doc(data.docId)
      .delete();

    db.collection('posts')
      .doc(data.docId)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove({
          uid: currentUser.uid,
          username: currentUser.displayName,
        }),
      });

    db.collection('users')
      .doc(data.requestedById)
      .collection('posts')
      .doc(data.docId)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove({
          uid: currentUser.uid,
          username: currentUser.displayName,
        }),
      })
      .then(() => {
        setLiked(false);
        if (likesNumber == data.likes.length) {
          setLikesNumber(data.likes.length - 1);
        } else {
          setLikesNumber(data.likes.length);
        }

        ReactNativeHapticFeedback.trigger('notificationWarning', options);
        // refresh();
      });

    db.collection('users')
      .doc(data.requestedById)
      .collection('notifications')
      .where('likedBy', '==', currentUser.uid)
      .where('postId', '==', data.docId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  };

  const checkIfLiked = () => {
    if (data.likes.some((item) => item.uid == currentUser.uid)) {
      setLiked(true);
    }
  };

  return (
    <>
      {true ? (
        <TouchableOpacity
          onPress={() =>
            navigationUse.navigate('SongRequestDetailScreen', {
              title: data.title,
              artist: data.artist,
              audio: data.audio,
              albumArt: data.albumArt,
              profilePictureUrl: data.profilePictureUrl,
              uid: data.requestedById,
              requestedByUsername: data.requestedByUsername,
              requestedId: data.requestedId,
              requestedUsername: data.requestedUsername,
              date: data.date,
              likes: data.likes,
              comments: data.comments,
              docId: data.docId,
              navigateBackTo: 'HomeScreen',
              type: data.type,
              albumId: data.albumId,
              albumName: data.albumName,
              albumTracklist: data.albumTracklist,
              artistId: data.artistId,
              artistTracklist: data.artistTracklist,
              trackId: data.trackId,
              verified: data.verified,
            })
          }>
          <View
            style={{
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: 'rgba(193, 200, 212, 0.2)',
              marginBottom: 12,
              paddingLeft: 16,
              paddingBottom: 2,
              paddingTop: 4,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() =>
                  navigationUse.navigate('FeedUserDetailScreen', {
                    data: data.requestedById,
                  })
                }>
                <FastImage
                  style={styles.profilePicture}
                  source={{
                    uri: data.profilePictureUrl,
                    priority: FastImage.priority.normal,
                  }}
                  // resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.usernameText}>
                    {data.requestedByName}
                  </Text>
                  {data.verified ? (
                    <MaterialCommunityIcon
                      name="check-decagram"
                      style={styles.verifiedCheck}
                    />
                  ) : null}
                </View>
                <Text style={styles.subUsername}>
                  @{data.requestedByUsername}
                </Text>
              </View>
              <Text style={{fontSize: 6, alignSelf: 'center', marginLeft: 10}}>
                ⚪
              </Text>
              <Moment element={Text} format="MMM Do YY" style={styles.dateText}>
                {data.date}
              </Moment>
            </View>

            <View style={{alignItems: 'center'}}>
              {data.title ? (
                <>
                  <Text style={styles.description}>
                    @{data.requestedUsername} recommended this track to @
                    {data.requestedByUsername}
                  </Text>
                  {playing ? (
                    <TouchableOpacity
                      onPress={() => {
                        ReactNativeHapticFeedback.trigger(
                          'notificationWarning',
                          options,
                        );
                        stopTrack();
                        setPlaying(false);
                      }}>
                      <FastImage
                        style={styles.albumArtPost}
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
                        ReactNativeHapticFeedback.trigger(
                          'notificationSuccess',
                          options,
                        );
                        playTrack(data.audio);
                        setPlaying(true);
                      }}>
                      <FastImage
                        style={styles.albumArtPost}
                        source={{
                          uri: data.albumArt,
                          priority: FastImage.priority.normal,
                        }}
                        // resizeMode={FastImage.resizeMode.contain}
                      />
                    </TouchableOpacity>
                  )}
                  <View>
                    <Text style={styles.titleText}>{data.title}</Text>
                    <Text style={styles.artistText}>{data.artist}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                      }}></View>
                  </View>
                </>
              ) : (
                <Text style={styles.description}>
                  @{data.requestedByUsername} requested a track recommednation
                  from @{data.requestedUsername}
                </Text>
              )}
            </View>

            {data.requestedId == currentUser.uid && data.title == '' ? (
              <TouchableOpacity
                style={styles.recommendButton}
                onPress={() =>
                  navigationUse.navigate('SongRecommendationSearchScreen', {
                    data: data,
                  })
                }>
                <Text style={styles.recommendText}>Recommend a song</Text>
              </TouchableOpacity>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                marginTop: 10,
                // marginLeft: 40,
              }}>
              {liked == true ? (
                <>
                  <TouchableOpacity
                    style={styles.buttonsTab}
                    onPress={onUnlike}>
                    <AntIcon name="heart" style={styles.likeButton} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{alignSelf: 'center'}}
                    onPress={() =>
                      navigationUse.navigate('LikeListScreen', {
                        data: data.likes,
                      })
                    }>
                    <Text style={styles.likesNumber}>{likesNumber} likes</Text>
                  </TouchableOpacity>
                  <IonIcon
                    name="chatbubble-outline"
                    style={styles.commentIcon}
                    onPress={() =>
                      navigationUse.navigate('PostDetailScreen', {
                        title: data.title,
                        artist: data.artist,
                        audio: data.audio,
                        albumArt: data.albumArt,
                        profilePictureUrl: data.profilePictureUrl,
                        uid: data.requestedById,
                        username: data.requestedByUsername,
                        date: data.date,
                        likes: data.likes,
                        comments: data.comments,
                        docId: data.docId,

                        type: data.type,
                        albumId: data.albumId,
                        albumName: data.albumName,
                        albumTracklist: data.albumTracklist,
                        artistId: data.artistId,
                        artistTracklist: data.artistTracklist,
                        trackId: data.trackId,
                        verified: data.verified,
                      })
                    }
                  />
                  <Text style={styles.likesNumber}>{data.comments.length}</Text>
                </>
              ) : (
                <>
                  <TouchableOpacity style={styles.buttonsTab} onPress={onLike}>
                    <AntIcon name="hearto" style={styles.likeButton} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{alignSelf: 'center'}}
                    onPress={() =>
                      navigationUse.navigate('LikeListScreen', {
                        data: data.likes,
                      })
                    }>
                    <Text style={styles.likesNumber}>{likesNumber} likes</Text>
                  </TouchableOpacity>
                  <IonIcon
                    name="chatbubble-outline"
                    style={styles.commentIcon}
                    onPress={() =>
                      navigationUse.navigate('PostDetailScreen', {
                        title: data.title,
                        artist: data.artist,
                        audio: data.audio,
                        albumArt: data.albumArt,
                        profilePictureUrl: data.profilePictureUrl,
                        uid: data.requestedById,
                        username: data.requestedByUsername,
                        date: data.date,
                        likes: data.likes,
                        comments: data.comments,
                        docId: data.docId,

                        type: data.type,
                        albumId: data.albumId,
                        albumName: data.albumName,
                        albumTracklist: data.albumTracklist,
                        artistId: data.artistId,
                        artistTracklist: data.artistTracklist,
                        trackId: data.trackId,
                        verified: data.verified,
                      })
                    }
                  />
                  <Text style={styles.likesNumber}>{data.comments.length}</Text>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 20,
    // marginTop: 8,
    paddingRight: 10,
    paddingBottom: 4,
    flex: 1,
    marginBottom: 2,
    // backgroundColor: 'rgba(18, 18, 18,0.4)',
    marginLeft: 2,
  },
  postContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginLeft: 0,
  },

  profilePicture: {
    height: 34,
    width: 34,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2BAEEC',
  },
  albumArt: {
    height: 210,
    width: 210,
    borderRadius: 8,
    marginLeft: 0,
    marginTop: 20,
    alignSelf: 'flex-start',
    // marginRight: 6,
  },
  albumArtPost: {
    height: 220,
    width: 220,
    borderRadius: 8,
    marginLeft: 0,
    marginTop: 20,
    alignSelf: 'center',
    // marginRight: 6,
  },
  postIntroText: {
    color: '#c1c8d4',
    fontSize: 18,
    marginRight: 6,
    fontWeight: '600',
  },
  titleText: {
    color: '#2BAEEC',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 4,
    marginTop: 10,
    width: 142,
    textAlign: 'center',
  },
  artistIntroText: {
    color: '#c1c8d4',
    fontSize: 16,
    marginLeft: 4,
    width: 164,
  },
  artistText: {
    color: '#a3adbf',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
    marginTop: 4,
    width: 142,
    textAlign: 'center',
  },
  usernameText: {
    color: '#c1c8d4',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 10,
  },
  profileContainer: {
    flexDirection: 'row',
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
    alignSelf: 'center',
    marginLeft: 10,
  },
  likeButton: {
    color: '#6FB1D0',
    fontSize: 28,
    marginBottom: 2,
    marginLeft: 10,
    marginTop: 2,
  },
  buttonsTab: {
    marginTop: 0,
  },
  postContet: {
    color: '#c1c8d4',
    fontSize: 17,
    marginTop: 12,
    lineHeight: 24,
  },
  postTextView: {
    marginRight: 10,
  },
  stopIcon: {
    fontSize: 36,
    marginTop: 6,
    marginLeft: 8,
    color: '#a3adbf',
  },
  likesNumber: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
    color: '#c1c8d4',
    marginLeft: 6,
    alignSelf: 'center',
  },
  playIcon: {
    fontSize: 36,
    marginTop: 6,
    marginLeft: 14,
    color: '#a3adbf',
  },
  description: {
    fontSize: 20,
    color: '#c1c8d4',
    marginTop: 12,
    marginLeft: 10,
    marginRight: 20,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 10,
  },
  SOTDText: {
    marginTop: 12,
    fontSize: 15,
    color: '#c1c8d4',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 14,
  },
  subUsername: {
    color: 'gray',
    marginLeft: 10,
  },
  commentIcon: {
    fontSize: 26,
    marginBottom: 2,
    color: '#c1c8d4',
    marginLeft: 16,
    marginTop: 1,
  },
  verifiedCheck: {
    fontSize: 12,
    color: '#2BAEEC',
    textAlign: 'center',
    marginLeft: 2,
    alignSelf: 'center',
  },
  recommendButton: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    width: 180,
    borderWidth: 2,
    borderColor: '#c1c8d4',
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  recommendText: {
    fontSize: 16,
    color: '#c1c8d4',
  },
});

export default SongRequest;
