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

const PostCommentScreen = ({route}) => {
  const {uid, docId} = route.params;
  const [userData, setUserData] = useState(null);
  const [text, setText] = useState('');
  const [{currentUser, currentUserData}, dispatch] = useStateProviderValue();
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

  const onCommentPost = () => {
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
      })
      .then(() => navigationUse.navigate('HomeScreen'));
  };
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            marginTop: 80,
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
          <TextInput
            placeholder="What's on your mind..."
            placeholderTextColor="rgba(193, 200, 212, 0.2)"
            multiline={true}
            style={styles.input}
            onChangeText={(newText) => setText(newText)}
            // onSubmitEditing={onCommentPost}
          />
          <Button onPress={() => onCommentPost()} title="Post" />
        </View>
      </TouchableWithoutFeedback>
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
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#1E8C8B',
  },
  input: {
    width: 400,
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
    backgroundColor: '#1E8C8B',
    width: 250,
    height: 30,
    marginTop: 30,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    marginTop: 2,
    color: '#c1c8d4',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default PostCommentScreen;
