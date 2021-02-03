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

const FeedItem = ({
  title,
  artist,
  audio,
  albumArt,
  profilePictureUrl,
  uid,
  username,
  date,
  likes,
  comments,
  type,
  description,
  albumId,
  albumName,
  albumTracklist,
  artistId,
  artistTracklist,
  trackId,
  docId,
  navigateBackTo,
  verified,
  playTrack,
  stopTrack,
  name,
  refresh,
}) => {
  const [likesNumber, setLikesNumber] = useState(likes.length);
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
        albumId,
        albumName,
        albumTracklist,
        artistId,
        artistTracklist,
        trackId,
        verified,
      });

    db.collection('posts')
      .doc(docId)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion({
          uid: currentUser.uid,
          username: currentUser.displayName,
        }),
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
        // checkIfLiked();
        setLiked(true);
        if (likesNumber == likes.length) {
          setLikesNumber(likes.length + 1);
        } else {
          setLikesNumber(likes.length);
        }

        ReactNativeHapticFeedback.trigger('notificationSuccess', options);
        // refresh();
      });

    let newNotificationRef = db
      .collection('users')
      .doc(uid)
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
      postId: docId,
      postData: {
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
        albumId,
        albumName,
        albumTracklist,
        artistId,
        artistTracklist,
        trackId,
        verified,
      },
    });
  };

  const onUnlike = () => {
    // setLiked(false);
    // setLikesNumber(likes.length);
    db.collection('users')
      .doc(currentUser.uid)
      .collection('likes')
      .doc(docId)
      .delete();

    db.collection('posts')
      .doc(docId)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove({
          uid: currentUser.uid,
          username: currentUser.displayName,
        }),
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
        setLiked(false);
        if (likesNumber == likes.length) {
          setLikesNumber(likes.length - 1);
        } else {
          setLikesNumber(likes.length);
        }

        ReactNativeHapticFeedback.trigger('notificationWarning', options);
        // refresh();
      });

    db.collection('users')
      .doc(uid)
      .collection('notifications')
      .where('likedBy', '==', currentUser.uid)
      .where('postId', '==', docId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  };

  const checkIfLiked = () => {
    if (likes.some((item) => item.uid == currentUser.uid)) {
      setLiked(true);
    }
  };

  // const getUserData = () => {
  //   db.collection('users')
  //     .doc(uid)
  //     .get()
  //     .then((doc) => {
  //       setUserData(doc.data());
  //     });
  // };

  return (
    <>
      {true ? (
        <TouchableOpacity
          onPress={() =>
            navigationUse.navigate('PostDetailScreen', {
              title,
              artist,
              audio,
              albumArt,
              profilePictureUrl,
              uid,
              username,
              date,
              likesNumber,
              likes,
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
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.usernameText}>{name}</Text>
                  {verified ? (
                    <MaterialCommunityIcon
                      name="check-decagram"
                      style={styles.verifiedCheck}
                    />
                  ) : null}
                </View>
                <Text style={styles.subUsername}>@{username}</Text>
              </View>
              <Text style={{fontSize: 6, alignSelf: 'center', marginLeft: 10}}>
                ⚪
              </Text>
              <Moment element={Text} format="MMM Do YY" style={styles.dateText}>
                {date}
              </Moment>
            </View>
            {type == 'Song of the Day.' ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FastImage
                  style={styles.albumArt}
                  source={{
                    uri: albumArt,
                    priority: FastImage.priority.normal,
                  }}
                  // resizeMode={FastImage.resizeMode.contain}
                />
                <View>
                  <Text style={styles.SOTDText}>Song of the day:</Text>
                  <Text style={styles.titleText}>{title}</Text>
                  <Text style={styles.artistText}>{artist}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
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
                        style={styles.playIcon}
                        onPress={() => {
                          ReactNativeHapticFeedback.trigger(
                            'notificationSuccess',
                            options,
                          );
                          playTrack(audio);
                          setPlaying(true);
                        }}
                      />
                    )}

                    {/* {song ? (
                      <TouchableOpacity>
                        <IonIcon
                          name="stop"
                          style={styles.stopIcon}
                          onPress={() => {
                            ReactNativeHapticFeedback.trigger(
                              'notificationWarning',
                              options,
                            );
                            song.stop();
                            setPlaying(false);
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity>
                        <IonIcon name="stop" style={styles.stopIcon} />
                      </TouchableOpacity>
                    )} */}
                  </View>
                </View>
              </View>
            ) : (
              <View style={{alignItems: 'center'}}>
                <Text style={styles.description}>{description}</Text>

                <FastImage
                  style={styles.albumArtPost}
                  source={{
                    uri: albumArt,
                    priority: FastImage.priority.normal,
                  }}
                  // resizeMode={FastImage.resizeMode.contain}
                />
                <View>
                  <Text style={styles.titleText}>{title}</Text>
                  <Text style={styles.artistText}>{artist}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                    {playing ? (
                      <IonIcon
                        name="stop"
                        style={styles.stopIcon}
                        onPress={() => {
                          ReactNativeHapticFeedback.trigger(
                            'notificationWarning',
                            options,
                          );
                          song.stop();
                          setPlaying(false);
                        }}
                      />
                    ) : (
                      <IonIcon
                        name="play"
                        style={styles.playIcon}
                        onPress={() => {
                          ReactNativeHapticFeedback.trigger(
                            'notificationSuccess',
                            options,
                          );
                          handleAudio(audio);
                        }}
                      />
                    )}
                  </View>
                </View>
              </View>
            )}

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
                      navigationUse.navigate('LikeListScreen', {data: likes})
                    }>
                    <Text style={styles.likesNumber}>{likesNumber} likes</Text>
                  </TouchableOpacity>
                  <IonIcon
                    name="chatbubble-outline"
                    style={styles.commentIcon}
                    onPress={() =>
                      navigationUse.navigate('PostDetailScreen', {
                        title,
                        artist,
                        audio,
                        albumArt,
                        profilePictureUrl,
                        uid,
                        username,
                        date,
                        likesNumber,
                        likes,
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
                      })
                    }
                  />
                  <Text style={styles.likesNumber}>{comments.length}</Text>
                </>
              ) : (
                <>
                  <TouchableOpacity style={styles.buttonsTab} onPress={onLike}>
                    <AntIcon name="hearto" style={styles.likeButton} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{alignSelf: 'center'}}
                    onPress={() =>
                      navigationUse.navigate('LikeListScreen', {data: likes})
                    }>
                    <Text style={styles.likesNumber}>{likesNumber} likes</Text>
                  </TouchableOpacity>
                  <IonIcon
                    name="chatbubble-outline"
                    style={styles.commentIcon}
                    onPress={() =>
                      navigationUse.navigate('PostDetailScreen', {
                        title,
                        artist,
                        audio,
                        albumArt,
                        profilePictureUrl,
                        uid,
                        username,
                        date,
                        likesNumber,
                        likes,
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
                      })
                    }
                  />
                  <Text style={styles.likesNumber}>{comments.length}</Text>
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
    // textAlign: 'center',
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
});

export default FeedItem;
