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

const Comment = ({uid, commentText, commentId}) => {
  const [userData, setUserData] = useState(null);

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

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {userData ? (
        <>
          <FastImage
            style={styles.profilePicture}
            source={{
              uri: userData.profilePictureUrl,
              priority: FastImage.priority.normal,
            }}
          />
          <Text style={styles.username}>{userData.username}</Text>
        </>
      ) : null}
      <Text style={styles.commentText}>{commentText}</Text>
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
  },
});

export default Comment;
