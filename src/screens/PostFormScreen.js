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

const PostFormScreen = ({route}) => {
  const navigationUse = useNavigation();
  const {data} = route.params;
  const [text, setText] = useState('');
  const [posted, setPosted] = useState(false);
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();

  const post = () => {
    let newDocRef = db
      .collection('users')
      .doc(currentUser.uid)
      .collection('posts')
      .doc();

    newDocRef
      .set({
        docId: newDocRef.id,

        artist: data.artist.name,
        title: data.title,
        albumArt: data.album.cover,
        audio: data.preview,
        username: currentUser.displayName,
        uid: currentUser.uid,
        date: new Date().toDateString(),
        profilePictureUrl: currentUserData.profilePictureUrl,
        likes: [],
        comments: {},
        description: text,
        type: 'Post',
      })
      .then(() => navigationUse.navigate('HomeScreen'));
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
          <Image style={styles.albumArt} source={{uri: data.album.cover}} />

          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.artist}>{data.artist.name}</Text>

          <TextInput
            placeholder="Why this song?"
            placeholderTextColor="rgba(193, 200, 212, 0.2)"
            multiline={true}
            style={styles.input}
            value={text}
            onChangeText={(newText) => setText(newText)}
          />
          <TouchableOpacity style={styles.postButton} onPress={post}>
            <Text style={styles.shareText}>Share Track</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a2b2b',
  },
  albumArt: {
    height: 200,
    width: 200,
    marginTop: 40,
    borderRadius: 10,
  },
  title: {
    fontSize: 26,
    color: '#5AB9B9',
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 8,
    marginRight: 8,
  },
  artist: {
    fontSize: 24,
    fontWeight: '600',
    color: '#5AB9B9',
    marginTop: 4,
  },
  input: {
    width: 300,
    height: 100,
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
    padding: 6,
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 200,
  },
  shareText: {
    color: '#212121',
    fontWeight: '600',
  },
});

export default PostFormScreen;
