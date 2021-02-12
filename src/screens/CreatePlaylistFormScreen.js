import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {db} from '../../firebase/firebase';
import {auth} from '../../firebase/firebase';
import firebase from 'firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CreatePlaylistFormScreen = ({}) => {
  const [
    {currentUser, usersCurrentLocation, currentUserData},
    dispatch,
  ] = useStateProviderValue();

  const navigation = useNavigation();

  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');

  const onFormSubmit = () => {
    let newUserPostRef = db
      .collection('users')
      .doc(currentUser.uid)
      .collection('posts')
      .doc();
    let newPostRef = db.collection('posts').doc(newUserPostRef.id);

    newUserPostRef.set({
      docId: newUserPostRef.id,
      creatorId: currentUser.uid,
      creatorUsername: currentUserData.username,
      creatorName: currentUserData.name,
      date: new Date().toDateString(),
      preciseDate: new Date(),
      playlistName: playlistName,
      playlistDescription: playlistDescription,
      type: 'Playlist',
      verified: currentUserData.verified,
      profilePictureUrl: currentUserData.profilePictureUrl,
      userNotificationTokens: currentUserData.tokens,
      likes: [],
      comments: [],
      followerIdList: [currentUser.uid, ...currentUserData.followerIdList],
    });

    newPostRef.set({
      docId: newUserPostRef.id,
      creatorId: currentUser.uid,
      creatorUsername: currentUserData.username,
      creatorName: currentUserData.name,
      date: new Date().toDateString(),
      preciseDate: new Date(),
      playlistName: playlistName,
      playlistDescription: playlistDescription,
      type: 'Playlist',
      verified: currentUserData.verified,
      profilePictureUrl: currentUserData.profilePictureUrl,
      userNotificationTokens: currentUserData.tokens,
      likes: [],
      comments: [],
      followerIdList: [currentUser.uid, ...currentUserData.followerIdList],
    });

    navigation.navigate('ProfileScreen');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>
              Create a playlist that your friends can add to!
            </Text>
            <Text style={styles.inputLabel}>Playlist Name</Text>
            <TextInput
              style={styles.textInput}
              autoCapitalize={'none'}
              onChangeText={(e) => setPlaylistName(e)}
            />
            <Text style={styles.inputLabel}>
              Describe the type of music you're looking for in a few words.
            </Text>
            <TextInput
              style={styles.textInput}
              autoCapitalize={'none'}
              onChangeText={(e) => setPlaylistDescription(e)}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={onFormSubmit}>
              <Text>Create Playlist</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    marginTop: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    borderRadius: 5,
    width: 320,
    height: 30,
    paddingLeft: 2,
    paddingTop: 8,
    paddingBottom: 8,
    color: 'white',
    opacity: 0.8,
  },
  container: {
    backgroundColor: '#171818',
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingLeft: 6,
    paddingRight: 6,
  },
  inputLabel: {
    color: '#c1c8d4',
    fontSize: 14,
    marginTop: 30,
    width: 310,
    textAlign: 'center',
  },
  title: {
    color: '#2BAEEC',
    fontSize: 24,
    textAlign: 'center',
    paddingLeft: 6,
    paddingRight: 6,
  },
  submitButton: {
    backgroundColor: '#2BAEEC',
    color: 'black',
    borderRadius: 15,
    marginTop: 30,
    paddingRight: 12,
    paddingLeft: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  submitErrorMessage: {
    fontSize: 16,
    color: '#c43b4c',
  },
  overwriteMessage: {
    marginTop: 8,
    color: 'gray',
    fontSize: 10,
  },
});

export default CreatePlaylistFormScreen;
