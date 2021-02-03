import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Button,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import {useNavigation} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import firebase from 'firebase';

const PostCommentScreen = ({route}) => {
  const {uid, docId, data} = route.params;
  const [userData, setUserData] = useState(null);
  const [text, setText] = useState('');
  const [{currentUser, currentUserData}, dispatch] = useStateProviderValue();
  const navigationUse = useNavigation();

  useEffect(() => {
    let active = true;
    // db.collection('users')
    //   .doc(uid)
    //   .get()
    //   .then((doc) => {
    //     setUserData(doc.data());
    //   });
    return () => {
      active = false;
    };
  }, []);

  const onCommentPost = () => {
    db.collection('posts')
      .doc(docId)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion({
          uid: currentUser.uid,
          comment: text,
        }),
      });

    let newCommentRef = db
      .collection('users')
      .doc(uid)
      .collection('posts')
      .doc(docId)
      .collection('comments')
      .doc();

    newCommentRef
      .set({
        commentId: newCommentRef.id,
        creator: currentUser.uid,
        comment: text,
        date: new Date(),
        postOwner: uid,
        postId: docId,
        postData: data,
      })
      .then(() => navigationUse.goBack());

    let newNotificationRef = db
      .collection('users')
      .doc(uid)
      .collection('notifications')
      .doc();
    newNotificationRef.set({
      notificationId: newNotificationRef.id,
      type: 'comment',
      commentId: newCommentRef.id,
      date: new Date().toDateString(),
      preciseDate: new Date(),
      commentBy: currentUser.uid,
      commentByUsername: currentUser.displayName,
      commentByProfilePicture: currentUserData.profilePictureUrl,
      commentByVerified: currentUserData.verified,
      comment: text,
      postId: docId,
      postData: data,
    });
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 20,
            marginLeft: 14,
            alignItems: 'center',
          }}>
          <FastImage
            source={{
              uri: currentUserData.profilePictureUrl,
              priority: FastImage.priority.normal,
            }}
            style={styles.profilePicture}
          />
          <View
            style={{
              backgroundColor: '#c1c8d4',
              height: 40,
              width: 3,
              borderRadius: 20,
              alignSelf: 'center',
              marginLeft: -200,
              marginBottom: -2,
              marginTop: 1,
            }}
          />
          <TextInput
            enablesReturnKeyAutomatically={true}
            placeholder="What's on your mind..."
            placeholderTextColor="rgba(193, 200, 212, 0.2)"
            multiline={true}
            style={styles.input}
            value={text}
            onChangeText={(newText) => setText(newText)}
          />
          <TouchableOpacity style={styles.postButton} onPress={onCommentPost}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
  },
  profilePicture: {
    height: 50,
    width: 50,
    borderRadius: 30,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#2BAEEC',
    marginLeft: -200,
  },
  input: {
    width: 320,
    height: 140,
    borderWidth: 2,
    borderColor: '#c1c8d4',
    color: '#c1c8d4',
    alignSelf: 'center',
    borderRadius: 10,
    textAlign: 'left',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  postButton: {
    marginHorizontal: 30,
    backgroundColor: '#2BAEEC',
    borderRadius: 4,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    marginTop: 2,
    color: '#c1c8d4',
    fontSize: 20,
    fontWeight: '600',
    paddingLeft: 100,
    paddingRight: 100,
  },
});

export default PostCommentScreen;
