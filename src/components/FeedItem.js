import React, {useEffect} from 'react';
import Moment from 'react-moment';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Sound from 'react-native-sound';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import firebase from 'firebase';
import {useState} from 'react/cjs/react.development';

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
  docId,
}) => {
  const [{currentUser}, dispatch] = useStateProviderValue();
  const [liked, setLiked] = useState(false);

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
        description: 'Songs of the day.',
      });

    db.collection('users')
      .doc(uid)
      .collection('songsOfTheDay')
      .doc(docId)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion({
          uid: currentUser.uid,
          username: currentUser.displayName,
        }),
      })
      .then(() => {
        checkIfLiked();
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
      .collection('songsOfTheDay')
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
      .collection('songsOfTheDay')
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
      <View style={styles.postContentContainer}>
        <Text style={styles.postIntroText}>Song of the day:</Text>

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
        <TouchableOpacity style={styles.buttonsTab} onPress={onUnlike}>
          <AntIcon name="heart" style={styles.likeButton} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.buttonsTab} onPress={onLike}>
          <AntIcon name="hearto" style={styles.likeButton} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginTop: 20,
  },
  postContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginLeft: 20,
  },

  profilePicture: {
    height: 40,
    width: 40,
    borderRadius: 30,
  },
  albumArt: {
    height: 34,
    width: 34,
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
    marginLeft: 8,
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
    fontSize: 20,
  },
  buttonsTab: {
    marginLeft: 15,
  },
});

export default FeedItem;
