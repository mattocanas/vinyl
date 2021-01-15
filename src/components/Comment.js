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
} from 'react-native';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const Comment = ({uid, commentText, commentId, postOwner, postId, nav}) => {
  const [userData, setUserData] = useState(null);
  const [{currentUser}, dispatch] = useStateProviderValue();
  const navigationUse = useNavigation();

  useEffect(() => {
    let active = true;
    db.collection('users')
      .doc(uid)
      .get()
      .then((doc) => {
        setUserData(doc.data());
      });
    return () => {
      active = false;
    };
  }, []);

  const onDeleteComment = () => {
    db.collection('users')
      .doc(postOwner)
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .doc(commentId)
      .delete()
      .then(() => nav());
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}>
      {userData ? (
        <>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
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
      {uid == currentUser.uid || postOwner == currentUser.uid ? (
        <MaterialIcon
          name="delete"
          style={styles.deleteIcon}
          onPress={onDeleteComment}
        />
      ) : null}

      {/* {postOwner == currentUser.uid ? (
        <MaterialIcon
          name="delete"
          style={styles.deleteIcon}
          onPress={onDeleteComment}
        />
      ) : null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  profilePicture: {
    height: 32,
    width: 32,
    borderRadius: 30,
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
    width: 230,
  },
  deleteIcon: {
    fontSize: 18,
    color: '#7F1535',
  },
});

export default Comment;
