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

const MessageFormScreen = ({route}) => {
  const navigationUse = useNavigation();
  const {userData, songData} = route.params;
  const [text, setText] = useState('');
  const [posted, setPosted] = useState(false);
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();

  const sendMessage = () => {
    let newMessageRef1 = db
      .collection('users')
      .doc(currentUser.uid)
      .collection('messages')
      .doc(userData.uid);

    newMessageRef1.set({
      id: userData.uid,
      username: userData.username,
      profilePictureUrl: userData.profilePictureUrl,
      name: userData.name,
    });

    newMessageRef1.collection('message').doc().set({
      senderId: currentUser.uid,
      senderUsername: currentUserData.username,
      senderProfilePicture: currentUserData.profilePictureUrl,
      receiverId: userData.uid,
      receiverUsername: userData.username,
      receiverProfilePictureUrl: userData.profilePictureUrl,
      artist: songData.artist.name,
      title: songData.title,
      albumArt: songData.album.cover_xl,
      albumId: songData.album.id,
      artistId: songData.artist.id,
      artistTracklist: songData.artist.tracklist,
      albumTracklist: songData.album.tracklist,
      albumName: songData.album.title,
      trackId: songData.id,
      audio: songData.preview,
      verified: currentUserData.verified,
      date: new Date().toDateString(),
      preciseDate: new Date(),
      userNotificationTokens: currentUserData.tokens,
      likes: [],
      type: 'message',
      message: text,
    });

    // newMessageRef1.set({

    // });

    let newMessageRef2 = db
      .collection('users')
      .doc(userData.uid)
      .collection('messages')
      .doc(currentUser.uid);

    newMessageRef2.set({
      id: currentUser.uid,
      username: currentUserData.username,
      profilePictureUrl: currentUserData.profilePictureUrl,
      name: currentUserData.name,
    });

    newMessageRef2.collection('message').doc().set({
      senderId: currentUser.uid,
      senderUsername: currentUserData.username,
      senderProfilePicture: currentUserData.profilePictureUrl,
      receiverId: userData.uid,
      receiverUsername: userData.username,
      receiverProfilePictureUrl: userData.profilePictureUrl,
      artist: songData.artist.name,
      title: songData.title,
      albumArt: songData.album.cover_xl,
      albumId: songData.album.id,
      artistId: songData.artist.id,
      artistTracklist: songData.artist.tracklist,
      albumTracklist: songData.album.tracklist,
      albumName: songData.album.title,
      trackId: songData.id,
      audio: songData.preview,
      verified: currentUserData.verified,
      date: new Date().toDateString(),
      preciseDate: new Date(),
      userNotificationTokens: currentUserData.tokens,
      likes: [],
      type: 'message',
      message: text,
    });

    // newMessageRef2.set({

    // });
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
          <Image
            style={styles.albumArt}
            source={{uri: songData.album.cover_xl}}
          />

          <Text style={styles.title}>{songData.title}</Text>
          <Text style={styles.artist}>{songData.artist.name}</Text>

          <TextInput
            enablesReturnKeyAutomatically={true}
            placeholder="Why this song?"
            placeholderTextColor="rgba(193, 200, 212, 0.2)"
            multiline={true}
            style={styles.input}
            value={text}
            onChangeText={(newText) => setText(newText)}
          />
          <TouchableOpacity style={styles.postButton} onPress={sendMessage}>
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
    backgroundColor: '#171818',
  },
  albumArt: {
    height: 400,
    width: 420,
    paddingTop: 10,
    borderBottomLeftRadius: 64,
    marginLeft: 10,
  },
  title: {
    fontSize: 26,
    color: '#2BAEEC',
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 8,
    marginRight: 8,
    textAlign: 'center',
    width: 260,
  },
  artist: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2BAEEC',
    marginTop: 4,
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

export default MessageFormScreen;
