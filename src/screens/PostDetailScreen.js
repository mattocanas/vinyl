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
import IonIcon from 'react-native-vector-icons/Ionicons';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import firebase from 'firebase';
import {useNavigation} from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import AntIcon from 'react-native-vector-icons/AntDesign';

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
  } = route.params;

  const [{currentUser}, dispatch] = useStateProviderValue();
  const [liked, setLiked] = useState(false);
  const navigationUse = useNavigation();
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
  }, []);

  const track = new Sound(audio, null, (e) => {
    if (e) {
      console.log('error', e);
    } else {
      // all good
    }
  });

  const playTrack = () => {
    track.play();
    ReactNativeHapticFeedback.trigger('notificationSuccess', options);
    {
      track.isPlaying() == false ? track.reset() : null;
    }
  };

  const stopTrack = () => {
    ReactNativeHapticFeedback.trigger('notificationWarning', options);
    track.stop();
    track.reset();
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

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={{alignItems: 'flex-start'}}
        showsVerticalScrollIndicator={false}>
        <Image
          style={styles.albumArt}
          source={{
            uri: albumArt,
          }}
        />

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
          <Text style={styles.usernameText}>{username} |</Text>
          <Moment element={Text} format="MMM Do YY" style={styles.dateText}>
            {date}
          </Moment>
        </View>
        {description ? (
          <View style={styles.postTextView}>
            <Text style={styles.postContet}>{description}</Text>
          </View>
        ) : null}
        <View style={styles.postContentContainer}>
          {type == 'Song of the Day.' ? (
            <View>
              <Text style={styles.postIntroText}>Song of the day:</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  onPress={() =>
                    navigationUse.navigate('SongDetailFromAlbumScreen', {
                      id: trackId,
                    })
                  }
                  style={styles.titleTextSOTD}>
                  {title}
                </Text>
                <Text style={styles.albumIntroTextSOTD}>from</Text>
                <Text
                  onPress={() =>
                    navigationUse.navigate('AlbumDetailScreen', {id: albumId})
                  }
                  style={styles.albumTextSOTD}>
                  {albumName}
                </Text>
              </View>

              <Text style={styles.artistIntroTextSOTD}> by </Text>
              <Text style={styles.artistTextSOTD}>{artist}</Text>
            </View>
          ) : (
            <View>
              <Text
                onPress={() =>
                  navigationUse.navigate('SongDetailFromAlbumScreen', {
                    id: trackId,
                  })
                }
                style={styles.titleText}>
                {title}
              </Text>

              <Text style={styles.albumIntroText}>from</Text>
              <Text
                onPress={() =>
                  navigationUse.navigate('AlbumDetailScreen', {id: albumId})
                }
                style={styles.albumText}>
                {albumName}
              </Text>

              <Text style={styles.artistIntroText}> by </Text>
              <Text style={styles.artistText}>{artist}</Text>
            </View>
          )}
        </View>

        {liked == true ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <TouchableOpacity style={styles.buttonsTab} onPress={onUnlike}>
              <AntIcon name="heart" style={styles.likeButton} />
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() =>
                navigationUse.navigate('LikeListScreen', {data: likes})
              }>
              <Text style={styles.likesNumber}>
                {likes.length.toString()} likes
              </Text>
            </TouchableOpacity>

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
        ) : (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <TouchableOpacity style={styles.buttonsTab} onPress={onLike}>
              <AntIcon name="hearto" style={styles.likeButton} />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() =>
                navigationUse.navigate('LikeListScreen', {data: likes})
              }>
              <Text style={styles.likesNumber}>
                {likes.length.toString()} likes
              </Text>
            </TouchableOpacity>

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
        )}
        <View
          style={{flexDirection: 'row', alignSelf: 'center', marginTop: 30}}>
          <TouchableOpacity style={styles.playButton} onPress={playTrack}>
            <IonIcon name="play-circle-outline" style={styles.playIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.stopButton} onPress={stopTrack}>
            <IonIcon name="stop-circle-outline" style={styles.stopIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#2a2b2b',
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
    height: 90,
    width: 90,
    borderRadius: 60,
    marginLeft: 30,
    marginTop: -50,
    borderColor: '#1E8C8B',
    borderWidth: 2,
  },
  albumArt: {
    height: dimensions.height / 2,
    width: dimensions.width,
    borderBottomRightRadius: 60,
  },
  postIntroText: {
    color: '#c1c8d4',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  titleText: {
    color: '#1E8C8B',
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 8,
  },
  artistIntroText: {
    color: '#c1c8d4',
    fontSize: 18,
    marginLeft: 2,
  },
  artistText: {
    color: '#5AB9B9',
    fontSize: 24,
    fontWeight: '300',
  },
  usernameText: {
    color: '#c1c8d4',
    fontWeight: 'bold',
    marginLeft: 8,
    marginTop: 4,
    fontSize: 20,
  },
  profileContainer: {
    flexDirection: 'row',
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
    color: 'gray',
    marginTop: 10,
  },
  likeButton: {
    color: '#7F1535',
    fontSize: 28,
    marginTop: 10,
  },
  buttonsTab: {
    marginLeft: 44,
    marginTop: 4,
  },
  postContet: {
    color: '#c1c8d4',
    fontSize: 18,
    marginTop: 16,
    lineHeight: 24,
    marginLeft: 44,
    width: dimensions.width - 60,
  },
  postTextView: {
    marginRight: 10,
  },
  stopIcon: {
    fontSize: 32,
    color: '#c1c8d4',
    marginTop: 13,
    marginLeft: 2,
  },
  playIcon: {
    fontSize: 32,
    marginTop: 13,
    color: '#c1c8d4',
    marginLeft: 2,
  },
  playButton: {
    backgroundColor: '#1E8C8B',
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 16,
    width: 60,
    height: 60,
    marginBottom: 60,
  },
  stopButton: {
    backgroundColor: '#1E8C8B',
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 16,
    width: 60,
    height: 60,
    marginBottom: 60,
  },
  likesNumber: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '500',
    color: '#c1c8d4',
    marginLeft: 50,
  },
  reportButton: {
    color: '#7F1535',
    fontSize: 30,
    marginTop: 24,
    marginLeft: 12,
  },
  albumIntroText: {
    color: '#c1c8d4',
    fontSize: 18,
    marginBottom: 2,
  },
  albumText: {
    color: '#1E8C8B',
    fontSize: 24,
    fontWeight: '300',
    width: 310,
    marginBottom: 8,
  },
  albumIntroTextSOTD: {
    color: '#c1c8d4',
    fontSize: 18,
    marginRight: 8,
    marginLeft: 8,
  },
  albumTextSOTD: {
    color: '#1E8C8B',
    fontSize: 24,
    fontWeight: '300',
  },
  artistIntroTextSOTD: {
    color: '#c1c8d4',
    fontSize: 18,
  },
  artistTextSOTD: {
    color: '#5AB9B9',
    fontSize: 24,
    fontWeight: '300',
  },
  titleTextSOTD: {
    color: '#1E8C8B',
    fontSize: 24,
    fontWeight: '300',
  },
});

export default PostDetailScreen;
