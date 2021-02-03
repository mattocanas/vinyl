import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import firebase from 'firebase';

const Comment = ({
  uid,
  commentText,
  commentId,
  postOwner,
  postId,
  nav,
  postData,
}) => {
  const [userData, setUserData] = useState(null);
  const [replies, setReplies] = useState([]);
  const [{currentUser}, dispatch] = useStateProviderValue();
  const navigationUse = useNavigation();

  // useEffect(() => {
  //   let active = true;
  //   getReplies();
  //   db.collection('users')
  //     .doc(uid)
  //     .get()
  //     .then((doc) => {
  //       setUserData(doc.data());
  //     });
  //   return () => {
  //     active = false;
  //   };
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      getReplies();
      db.collection('users')
        .doc(uid)
        .get()
        .then((doc) => {
          setUserData(doc.data());
        });

      return () => (active = false);
    }, []),
  );

  const onDeleteComment = () => {
    db.collection('posts')
      .doc(postId)
      .update({
        comments: firebase.firestore.FieldValue.arrayRemove({
          uid: currentUser.uid,
          comment: commentText,
        }),
      });

    db.collection('users')
      .doc(postOwner)
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .doc(commentId)
      .delete()
      .then(() => nav());

    db.collection('users')
      .doc(uid)
      .collection('notifications')
      .where('commentId', '==', commentId)
      .where('postId', '==', postId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  };

  const getReplies = () => {
    let repliesArray = [];
    db.collection('users')
      .doc(postOwner)
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .doc(commentId)
      .collection('replies')
      .orderBy('date', 'asc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          repliesArray.push(doc.data());
        });
        setReplies(repliesArray);
      });
  };

  return (
    <View
      style={{
        width: Dimensions.get('screen').width,

        borderBottomWidth: 1,
        borderBottomColor: 'rgba(193, 200, 212, 0.2)',
        paddingBottom: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {userData ? (
          <>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() =>
                navigationUse.navigate('FeedUserDetailScreen', {
                  data: uid,
                })
              }>
              <FastImage
                style={styles.profilePicture}
                source={{
                  uri: userData.profilePictureUrl,
                  priority: FastImage.priority.normal,
                }}
              />
              <Text style={styles.username}>{userData.username}</Text>
            </TouchableOpacity>
          </>
        ) : null}
        <Text style={styles.commentText}>{commentText}</Text>
        <FontAwesomeIcon
          name="reply"
          style={styles.replyIcon}
          onPress={() => {
            navigationUse.navigate('CommentReplyScreen', {
              uid,
              commentText,
              commentId,
              postOwner,
              postId,
              nav,
              commentOwner: uid,
              postData,
            });
          }}
        />
        {uid == currentUser.uid || postOwner == currentUser.uid ? (
          <MaterialIcon
            name="delete"
            style={styles.deleteIcon}
            onPress={onDeleteComment}
          />
        ) : null}
      </View>
      <FlatList
        data={replies}
        keyExtractor={(item) => item.replyId}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 40,
              marginTop: 20,
            }}>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() =>
                navigationUse.navigate('FeedUserDetailScreen', {
                  data: item.creator,
                })
              }>
              {/* <FastImage
                style={styles.profilePicture}
                source={{
                  uri: item.replyByProfilePicture,
                  priority: FastImage.priority.normal,
                }}
              /> */}
              <Text style={styles.username}>{item.replyByUsername}</Text>
            </TouchableOpacity>
            <Text style={styles.commentText}>{item.reply}</Text>
            {item.creator == currentUser.uid || postOwner == currentUser.uid ? (
              <MaterialIcon
                name="delete"
                style={styles.deleteIcon}
                onPress={() => {
                  db.collection('users')
                    .doc(postOwner)
                    .collection('posts')
                    .doc(postId)
                    .collection('comments')
                    .doc(commentId)
                    .collection('replies')
                    .doc(item.replyId)
                    .delete()
                    .then(() => nav());

                  db.collection('users')
                    .doc(uid)
                    .collection('notifications')
                    .where('commentId', '==', item.replyId)
                    .where('postId', '==', postId)
                    .get()
                    .then((snapshot) => {
                      snapshot.forEach((doc) => {
                        doc.ref.delete();
                      });
                    });
                }}
              />
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profilePicture: {
    height: 32,
    width: 32,
    borderRadius: 30,
    marginLeft: 10,
  },
  username: {
    fontSize: 14,
    color: '#c1c8d4',
    marginRight: 8,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
    color: '#c1c8d4',
    width: 210,
  },
  deleteIcon: {
    fontSize: 22,
    color: '#7F1535',
    marginLeft: 10,
  },
  replyIcon: {
    fontSize: 20,
    color: '#c1c8d4',
  },
});

export default Comment;
