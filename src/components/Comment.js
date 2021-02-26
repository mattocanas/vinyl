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
import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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

  const rightAction = () => (
    <View style={styles.swipeContainer}>
      <MaterialCommunityIcon name="delete" style={styles.deleteIcon} />
    </View>
  );

  return (
    <View
      style={{
        width: Dimensions.get('screen').width,

        // borderBottomWidth: 1,
        // borderBottomColor: 'rgba(193, 200, 212, 0.1)',
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
        {/* <FontAwesomeIcon
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
        ) : null} */}
      </View>
      <View
        style={{
          backgroundColor: '#c1c8d4',
          height: 16,
          width: 3,
          borderRadius: 20,
          alignSelf: 'flex-start',
          marginLeft: 26,
          marginBottom: -2,
          marginTop: 1,
        }}
      />
      <TouchableOpacity
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
        style={{
          marginLeft: 15,
          borderWidth: 1,
          borderColor: '#c1c8d4',
          borderRadius: 20,
          paddingLeft: 6,
          width: 240,
          marginTop: 3,
          paddingBottom: 4,
          paddingTop: 3,
          paddingRight: 4,
        }}>
        <Text style={styles.commentText}>{commentText}</Text>
      </TouchableOpacity>
      <FlatList
        data={replies}
        keyExtractor={(item) => item.replyId}
        renderItem={({item}) => (
          <>
            {item.creator == currentUser.uid || postOwner == currentUser.uid ? (
              <Swipeable
                rightThreshold={30}
                renderRightActions={rightAction}
                onSwipeableRightOpen={() => {
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
                }}>
                <View
                  style={{
                    alignItems: 'flex-start',
                    marginLeft: 40,
                  }}>
                  <View
                    style={{
                      backgroundColor: '#c1c8d4',
                      height: 16,
                      width: 3,
                      borderRadius: 20,
                      alignSelf: 'flex-start',
                      marginLeft: 26,
                      marginBottom: -2,
                      marginTop: 1,
                    }}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{flexDirection: 'row', alignItems: 'center'}}
                      onPress={() =>
                        navigationUse.navigate('FeedUserDetailScreen', {
                          data: item.creator,
                        })
                      }>
                      <FastImage
                        style={styles.profilePicture}
                        source={{
                          uri: item.replyByProfilePicture,
                          priority: FastImage.priority.normal,
                        }}
                      />
                      <Text style={styles.username}>
                        {item.replyByUsername}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#c1c8d4',
                      height: 30,
                      width: 3,
                      borderRadius: 20,
                      alignSelf: 'flex-start',
                      marginLeft: 26,
                      marginBottom: -2,
                      marginTop: 1,
                    }}
                  />
                  <View
                    style={{
                      marginLeft: 12,
                      borderWidth: 1,
                      borderColor: '#c1c8d4',
                      borderRadius: 20,
                      paddingLeft: 6,
                      width: 240,
                      marginTop: 3,
                      paddingBottom: 4,
                      paddingTop: 3,
                      paddingRight: 4,
                    }}>
                    <Text style={styles.commentText}>{item.reply}</Text>
                  </View>
                </View>
              </Swipeable>
            ) : (
              <View
                style={{
                  alignItems: 'flex-start',
                  marginLeft: 40,
                }}>
                <View
                  style={{
                    backgroundColor: '#c1c8d4',
                    height: 30,
                    width: 3,
                    borderRadius: 20,
                    alignSelf: 'flex-start',
                    marginLeft: 26,
                    marginBottom: -2,
                    marginTop: 1,
                  }}
                />
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={() =>
                      navigationUse.navigate('FeedUserDetailScreen', {
                        data: item.creator,
                      })
                    }>
                    <FastImage
                      style={styles.profilePicture}
                      source={{
                        uri: item.replyByProfilePicture,
                        priority: FastImage.priority.normal,
                      }}
                    />
                    <Text style={styles.username}>{item.replyByUsername}</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: '#c1c8d4',
                    height: 30,
                    width: 3,
                    borderRadius: 20,
                    alignSelf: 'flex-start',
                    marginLeft: 26,
                    marginBottom: -2,
                    marginTop: 1,
                  }}
                />
                <View
                  style={{
                    marginLeft: 12,
                    borderWidth: 1,
                    borderColor: '#c1c8d4',
                    borderRadius: 20,
                    paddingLeft: 6,
                    width: 240,
                    marginTop: 3,
                    paddingBottom: 4,
                    paddingTop: 3,
                    paddingRight: 4,
                  }}>
                  <Text style={styles.commentText}>{item.reply}</Text>
                </View>
              </View>
            )}
          </>
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
    width: 180,
    alignSelf: 'center',
    textAlign: 'center',
  },

  replyIcon: {
    fontSize: 20,
    color: '#c1c8d4',
  },
  deleteIcon: {
    color: '#c43b4c',
    alignSelf: 'center',
    marginTop: -20,
    fontSize: 20,
    marginLeft: -50,
  },
  swipeContainer: {
    width: 40,
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default Comment;
