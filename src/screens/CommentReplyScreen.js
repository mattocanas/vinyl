import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CommentReplyScreen = ({route}) => {
  const navigationUse = useNavigation();
  const {
    uid,
    commentText,
    commentId,
    commentOwner,
    postOwner,
    postId,
    nav,
    postData,
  } = route.params;
  const [text, setText] = useState('');
  const [posted, setPosted] = useState(false);
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();

  const onReply = () => {
    let newReplyRef = db
      .collection('users')
      .doc(postOwner)
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .doc(commentId)
      .collection('replies')
      .doc();

    newReplyRef
      .set({
        replyId: newReplyRef.id,
        creator: currentUser.uid,
        reply: text,
        date: new Date(),
        postOwner: uid,
        postId: postId,
      })
      .then(() => navigationUse.goBack());

    let newNotificationRef = db
      .collection('users')
      .doc(commentOwner)
      .collection('notifications')
      .doc();
    newNotificationRef.set({
      notificationId: newNotificationRef.id,
      type: 'reply',
      commentId: newReplyRef.id,
      date: new Date().toDateString(),
      preciseDate: new Date(),
      replyBy: currentUser.uid,
      replyByUsername: currentUser.displayName,
      replyByProfilePicture: currentUserData.profilePictureUrl,
      replyByVerified: currentUserData.verified,
      comment: text,
      postId: postId,
      postData: postData,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center'}}
          style={styles.container}>
          <Text style={styles.comment}>{commentText}</Text>

          <TextInput
            enablesReturnKeyAutomatically={true}
            placeholder="Respond to this comment..."
            placeholderTextColor="rgba(193, 200, 212, 0.2)"
            multiline={true}
            style={styles.input}
            value={text}
            onChangeText={(newText) => setText(newText)}
          />
          <TouchableOpacity style={styles.postButton} onPress={onReply}>
            <Text style={styles.shareText}>Reply</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
  },
  comment: {
    fontSize: 20,
    color: '#c1c8d4',
    marginTop: 30,
    width: 290,
  },
  input: {
    width: 340,
    height: 140,
    borderWidth: 2,
    borderColor: '#c1c8d4',
    color: '#c1c8d4',
    marginTop: 30,
    borderRadius: 10,
    textAlign: 'left',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  postButton: {
    backgroundColor: '#2BAEEC',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    marginLeft: 240,
  },
  shareText: {
    color: '#212121',
    fontWeight: '600',
  },
});

export default CommentReplyScreen;
