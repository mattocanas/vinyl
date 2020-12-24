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

const EditProfileScreen = ({route}) => {
  const [
    {currentUser, usersCurrentLocation, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const [username, setUsername] = useState(currentUserData.username);
  const [email, setEmail] = useState(currentUser.email);
  const [fullName, setFullName] = useState(currentUserData.name);
  const [bio, setBio] = useState(currentUserData.bio);

  const [ready1, setReady1] = useState(false);
  const [ready2, setReady2] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [profileUpdateError, setProfileUpdateError] = useState(null);
  const [emailUpdateError, setEmailUpdateError] = useState(null);
  const [unfinihsedError, setUnfinishedError] = useState(false);

  const navigation = useNavigation();

  const onFormSubmit = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .update({
        username: username,
        bio: bio,

        name: fullName,
      })
      .then(() => {
        setReady1(true);
      })
      .catch((error) => {
        setSubmitError(error.message);
      });

    auth.currentUser
      .updateProfile({
        displayName: username,
      })
      .then(() => {
        {
          setReady2(true);
        }
      })
      .catch((error) => {
        setProfileUpdateError(error.message);
      });

    auth.currentUser
      .updateEmail(email)
      .then(() => {
        {
          ready1 && ready2 ? navigation.navigate('ProfileScreen') : null;
        }
      })
      .catch((error) => setEmailUpdateError(error.message));
  };

  const onUnfinishedSubmit = () => {
    setUnfinishedError(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>Edit your account info</Text>
            <Text style={styles.inputLabel}> username</Text>
            <TextInput
              style={styles.textInput}
              value={username}
              onChangeText={(e) => setUsername(e)}
              autoCapitalize={'none'}
            />
            <Text style={styles.inputLabel}>email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={(e) => setEmail(e)}
              autoCapitalize={'none'}
            />
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={(e) => setFullName(e)}
              autoCapitalize={'none'}
            />

            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={styles.textInput}
              value={bio}
              onChangeText={(e) => setBio(e)}
              autoCapitalize={'none'}
            />

            {unfinihsedError === true ? (
              <Text style={styles.submitErrorMessage}>
                Please fill in all the fields
              </Text>
            ) : submitError !== null ? (
              <Text style={styles.submitErrorMessage}>{submitError}</Text>
            ) : profileUpdateError !== null ? (
              <Text style={styles.submitErrorMessage}>
                {profileUpdateError}
              </Text>
            ) : emailUpdateError !== null ? (
              <Text style={styles.submitErrorMessage}>{emailUpdateError}</Text>
            ) : null}
            {(username !== '') &
            (fullName !== '') &
            (email !== '') &
            (bio !== '') ? (
              <TouchableOpacity
                onPress={onFormSubmit}
                style={styles.submitButton}>
                <Text>Update your account!</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onUnfinishedSubmit}
                style={styles.submitButton}>
                <Text>Save Changes</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    marginTop: 10,
    backgroundColor: '#b3b3b3',
    borderRadius: 5,
    width: 360,
    height: 30,
    paddingLeft: 2,
    paddingTop: 8,
    paddingBottom: 8,
    color: 'black',
    opacity: 0.8,
  },
  container: {
    backgroundColor: '#242525',
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingLeft: 6,
    paddingRight: 6,
  },
  inputLabel: {
    color: '#c1c8d4',
    fontSize: 14,
    marginTop: 12,
  },
  title: {
    color: '#1E8C8B',
    fontSize: 24,
    textAlign: 'center',
    paddingLeft: 6,
    paddingRight: 6,
  },
  submitButton: {
    backgroundColor: '#1E8C8B',
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

export default EditProfileScreen;
