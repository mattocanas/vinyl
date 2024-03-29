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
  ActivityIndicator,
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
import Hyperlink from 'react-native-hyperlink';
import RNUrlPreview from 'react-native-url-preview';

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
    preciseDate,
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
  const [likesNumber, setLikesNumber] = useState(likes.length);

  const [refresh, setRefresh] = useState(false);
  const [likesNumb, setLikesNumb] = useState(null);
  const [postData, setPostData] = useState(null);

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  useEffect(() => {
    let active = true;
    // getPost();
    // checkIfLiked();
    // console.log(postData);
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
        // setLiked(true);
        // setLikesNumber(likes.length + 1);

        setLiked(true);
        if (likesNumber == likes.length) {
          setLikesNumber(likes.length + 1);
        } else {
          setLikesNumber(likes.length);
        }
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

        // setLikesNumber(likes.length);
        ReactNativeHapticFeedback.trigger('notificationWarning', options);
      });
  };

  const checkIfLiked = () => {
    db.collection('posts')
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

  const getPost = async () => {
    db.collection('posts')
      .doc(docId)
      .get()
      .then((doc) => {
        setPostData(doc.data());
      });
  };

  const refreshComponent = () => {
    setRefresh(true);
  };

  return (
    <View style={styles.mainContainer}>
      {true ? (
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
            {preciseDate ? (
              <Moment
                date={preciseDate.toDate()}
                fromNow
                element={Text}
                style={styles.dateText}>
                {date}
              </Moment>
            ) : (
              <Moment
                date={date}
                fromNow
                element={Text}
                style={styles.dateText}>
                {date}
              </Moment>
            )}
          </View>

          {type == 'Song of the Day.' ? (
            <View
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 14,
              }}>
              <Text style={styles.SOTDText}>Song of the day:</Text>

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
              <TouchableOpacity
                onPress={() =>
                  navigationUse.navigate('ArtistDetailScreen', {
                    artistName: artist,
                  })
                }>
                <Text style={styles.artistText}>{artist}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{alignItems: 'center'}}>
              <Hyperlink
                linkDefault={true}
                linkStyle={{color: '#2980b9', fontSize: 16}}>
                <Text selectable style={styles.description}>
                  {description}
                </Text>
              </Hyperlink>
              <RNUrlPreview
                containerStyle={{
                  borderRadius: 20,
                  backgroundColor: 'transparent',
                  borderColor: '#c1c8d4',
                  borderWidth: 1,
                  width: 330,

                  marginTop: 20,
                }}
                titleStyle={{color: '#c1c8d4', fontSize: 12, width: 200}}
                descriptionStyle={{fontSize: 10, color: 'gray'}}
                imageStyle={{width: 80, marginLeft: 4}}
                text={description}
              />
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
              <TouchableOpacity
                onPress={() =>
                  navigationUse.navigate('ArtistDetailScreen', {
                    artistName: artist,
                  })
                }>
                <Text style={styles.artistText}>{artist}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
              marginTop: 40,
            }}>
            {/* {liked ? (
              <AntIcon
                name="heart"
                style={styles.likeButton}
                onPress={onUnlike}
              />
            ) : (
              <AntIcon
                name="hearto"
                style={styles.likeButton}
                onPress={onLike}
              />
            )} */}

            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() =>
                navigationUse.navigate('LikeListScreen', {data: likes})
              }>
              <Text style={styles.likesNumber}>{likesNumber}</Text>
              <Text style={styles.likesNumberText}>likes</Text>
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
                    username,
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
                  username,
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
      ) : (
        <ActivityIndicator />
      )}
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
    fontSize: 25,
    marginRight: 6,
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
    width: dimensions.width - 100,
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
    color: 'rgba(193,200,212, .8)',
    fontSize: 22,
    marginRight: 20,
    marginTop: 20,
    alignSelf: 'flex-start',
    width: dimensions.width - 60,
    lineHeight: 28,
    marginLeft: 10,
  },
  likesNumberText: {
    // marginTop: 14,
    fontSize: 18,
    fontWeight: '500',
    color: '#c1c8d4',
    marginRight: 30,
  },
  likesNumber: {
    color: '#2BAEEC',
    fontSize: 18,
    fontWeight: '500',
    marginRight: 4,
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
