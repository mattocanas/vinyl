import React, {useEffect, useState} from 'react';
import Moment from 'react-moment';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Sound from 'react-native-sound';
import AntIcon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import firebase from 'firebase';
import {useNavigation} from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {TypingAnimation} from 'react-native-typing-animation';

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
  refresh,
}) => {
  const [{currentUser}, dispatch] = useStateProviderValue();
  const [liked, setLiked] = useState(false);
  const [postData, setPostData] = useState(null);
  const navigationUse = useNavigation();
  const [song, setSong] = useState(null);
  const [ready, setReady] = useState(false);
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
  }, [liked, ready]);

  const track = new Sound(audio, null, (e) => {
    if (e) {
      console.log('error', e);
    } else {
      setReady(true);
    }
  });

  const playTrack = () => {
    track.play();
    ReactNativeHapticFeedback.trigger('notificationSuccess', options);
  };

  const stopTrack = () => {
    ReactNativeHapticFeedback.trigger('notificationWarning', options);
    track.stop();
    track.reset();
  };

  const getData = () => {
    db.collection('users')
      .doc(uid)
      .collection('posts')
      .doc(docId)
      .get()
      .then((doc) => {
        setPostData(doc.data());
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
        ReactNativeHapticFeedback.trigger('notificationSuccess', options);
        // refresh();
      });
  };

  const onUnlike = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .collection('likes')
      .doc(docId)
      .delete()
      .then(() => {
        // setLiked(false);
        checkIfLiked();
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
        ReactNativeHapticFeedback.trigger('notificationWarning', options);
        // refresh();
      });
  };

  const checkIfLiked = () => {
    getData();
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

  return (
    <>
      {postData ? (
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
            })
          }>
          <View style={styles.mainContainer}>
            <View style={styles.profileContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigationUse.navigate('FeedUserDetailScreen', {data: uid})
                }>
                <Image
                  style={styles.profilePicture}
                  source={{
                    uri: profilePictureUrl,
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.usernameText}>{postData.username} |</Text>
              <Moment element={Text} format="MMM Do YY" style={styles.dateText}>
                {date}
              </Moment>
            </View>
            <View style={{marginLeft: 10}}>
              {description ? (
                <View style={styles.postTextView}>
                  <Text style={styles.postContet}>{postData.description}</Text>
                </View>
              ) : null}
              <View style={styles.postContentContainer}>
                {type == 'Song of the Day.' ? (
                  <Text style={styles.postIntroText}>Song of the day:</Text>
                ) : null}

                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <Image
                    style={styles.albumArt}
                    source={{
                      uri: albumArt,
                    }}
                  />
                </View>

                <View style={{alignItems: 'flex-start', marginLeft: 8}}>
                  <Text style={styles.titleText}>{postData.title}</Text>

                  <Text style={styles.artistIntroText}> by </Text>
                  <Text style={styles.artistText}>{postData.artist}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {liked == true ? (
                  <>
                    <TouchableOpacity
                      style={styles.buttonsTab}
                      onPress={onUnlike}>
                      <AntIcon name="heart" style={styles.likeButton} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigationUse.navigate('LikeListScreen', {data: likes})
                      }>
                      <Text style={styles.likesNumber}>
                        {postData.likes.length.toString()} likes
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.buttonsTab}
                      onPress={onLike}>
                      <AntIcon name="hearto" style={styles.likeButton} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigationUse.navigate('LikeListScreen', {data: likes})
                      }>
                      <Text style={styles.likesNumber}>
                        {postData.likes.length.toString()} likes
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                {ready ? (
                  <>
                    <TouchableOpacity>
                      <IonIcon
                        name="play-circle-outline"
                        style={styles.playIcon}
                        onPress={playTrack}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <IonIcon
                        name="stop-circle-outline"
                        style={styles.stopIcon}
                        onPress={stopTrack}
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        color: '#1E8C8B',
                        marginLeft: 8,
                        marginTop: 12,
                      }}>
                      Loading tunes
                    </Text>
                    <TypingAnimation dotColor="#1E8C8B" />
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 16,
    // marginTop: 8,
    paddingRight: 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(193, 200, 212, 0.4)',
    flex: 1,
    marginBottom: 8,
    // backgroundColor: 'rgba(18, 18, 18,0.4)',
  },
  postContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginLeft: 0,
  },

  profilePicture: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  albumArt: {
    height: 50,
    width: 50,
    borderRadius: 4,
    marginRight: 0,
    marginLeft: 4,
  },
  postIntroText: {
    color: '#c1c8d4',
    fontSize: 18,
    marginRight: 6,
    fontWeight: '600',
  },
  titleText: {
    color: '#1E8C8B',
    fontSize: 16,
    fontWeight: '700',
    width: 164,
  },
  artistIntroText: {
    color: '#c1c8d4',
    fontSize: 16,
    marginLeft: 2,
    width: 164,
  },
  artistText: {
    color: '#5AB9B9',
    fontSize: 16,
    fontWeight: '700',
    width: 164,
  },
  usernameText: {
    color: '#c1c8d4',
    fontWeight: 'bold',
    marginLeft: 8,
    marginTop: 20,
    fontSize: 18,
  },
  profileContainer: {
    flexDirection: 'row',
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
    color: 'gray',
    marginTop: 24,
  },
  likeButton: {
    color: '#7F1535',
    fontSize: 28,
    marginTop: 10,
  },
  buttonsTab: {
    marginLeft: 15,
    marginTop: 4,
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
    fontSize: 34,
    marginTop: 12,
    marginLeft: 12,
    color: '#1E8C8B',
  },
  likesNumber: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '400',
    color: '#c1c8d4',
    marginLeft: 10,
  },
  playIcon: {
    fontSize: 34,
    marginTop: 12,
    marginLeft: 16,
    color: '#1E8C8B',
  },
});

export default FeedItem;
