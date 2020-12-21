import React, {useEffect} from 'react';
import Moment from 'react-moment';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Sound from 'react-native-sound';
import AntIcon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import firebase from 'firebase';
import {useState} from 'react/cjs/react.development';
import {useNavigation} from '@react-navigation/native';

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
  docId,
  refresh,
}) => {
  const [{currentUser}, dispatch] = useStateProviderValue();
  const [liked, setLiked] = useState(false);
  const navigationUse = useNavigation();

  useEffect(() => {
    let active = true;
    Sound.setCategory('Playback');
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
  };

  const stopTrack = () => {
    track.stop();
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
        description: '',
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
        refresh();
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
        refresh();
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
      <View style={styles.profileContainer}>
        <Image
          style={styles.profilePicture}
          source={{
            uri: profilePictureUrl,
          }}
        />
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
          <Text style={styles.postIntroText}>Song of the day:</Text>
        ) : null}

        <TouchableOpacity
          style={{alignItems: 'center', flexDirection: 'row'}}
          onPress={playTrack}>
          <Image
            style={styles.albumArt}
            source={{
              uri: albumArt,
            }}
          />
          <Text style={styles.titleText}>{title}</Text>
        </TouchableOpacity>

        <Text style={styles.artistIntroText}> by </Text>
        <Text style={styles.artistText}>{artist}</Text>
      </View>

      {liked == true ? (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={styles.buttonsTab} onPress={onUnlike}>
            <AntIcon name="heart" style={styles.likeButton} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigationUse.navigate('LikeListScreen', {data: likes})
            }>
            <Text style={styles.likesNumber}>
              {likes.length.toString()} likes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <IonIcon
              name="stop-circle-outline"
              style={styles.stopIcon}
              onPress={stopTrack}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={styles.buttonsTab} onPress={onLike}>
            <AntIcon name="hearto" style={styles.likeButton} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigationUse.navigate('LikeListScreen', {data: likes})
            }>
            <Text style={styles.likesNumber}>
              {likes.length.toString()} likes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <IonIcon
              name="stop-circle-outline"
              style={styles.stopIcon}
              onPress={stopTrack}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginTop: 8,
    marginRight: 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(193, 200, 212, 0.2)',
    flex: 1,
  },
  postContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginLeft: 0,
  },

  profilePicture: {
    height: 40,
    width: 40,
    borderRadius: 30,
  },
  albumArt: {
    height: 30,
    width: 30,
    borderRadius: 4,
    marginRight: 4,
  },
  postIntroText: {
    color: '#c1c8d4',
    fontSize: 12,
    marginRight: 8,
  },
  titleText: {
    color: '#1E8C8B',
    fontSize: 12,
    fontWeight: '500',
  },
  artistIntroText: {
    color: '#c1c8d4',
    fontSize: 12,
    marginLeft: 2,
  },
  artistText: {
    color: '#1E8C8B',
    fontSize: 12,
    fontWeight: '500',
  },
  usernameText: {
    color: '#c1c8d4',
    fontWeight: 'bold',
    marginLeft: 8,
    marginTop: 4,
  },
  profileContainer: {
    flexDirection: 'row',
  },
  dateText: {
    fontSize: 8,
    marginLeft: 4,
    color: 'gray',
    marginTop: 8,
  },
  likeButton: {
    color: '#7F1535',
    fontSize: 24,
    marginTop: 10,
  },
  buttonsTab: {
    marginLeft: 15,
  },
  postContet: {
    color: '#c1c8d4',
    fontSize: 16,
    marginTop: 16,
  },
  postTextView: {
    marginRight: 12,
  },
  stopIcon: {
    fontSize: 24,
    marginTop: 8,
    marginLeft: 12,
    color: '#22B3B2',
  },
  likesNumber: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '400',
    color: '#c1c8d4',
    marginLeft: 10,
  },
});

export default FeedItem;
