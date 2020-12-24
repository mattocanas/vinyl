import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import {auth, db} from '../../firebase/firebase';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [nameExistsError, setNameExistsError] = useState(false);

  const checkUsername = () => {
    db.collection('users')
      .where('username', '==', username)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.exists) {
            setErrorMessage('This username already exists!');
          }
        });
      })
      .then(() => {
        handleSignUp();
      });
  };

  const sendError = () => {
    setErrorMessage('Please fill in all fields.');
  };

  const handleSignUp = () => {
    let active = true;

    auth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .then((cred) => {
        {
          errorMessage == null
            ? cred.user.updateProfile({
                displayName: username,
              })
            : null;
        }

        return db.collection('users').doc(cred.user.uid).set({
          bio: bio,
          followerIdList: [],
          followingIdList: [],
          username: username,
          uid: cred.user.uid,
          name: name,
          verified: false,
          profilePictureUrl:
            'data:image/jpeg;base64,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',
        });
      });
    return () => {
      active = false;
    };
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <ImageBackground
              style={{flex: 0.6, paddingTop: 200, paddingBottom: 40}}
              source={require('../../assets/AuthScreen.png')}>
              <View style={styles.errorMessage}>
                {errorMessage && (
                  <Text style={styles.error}>{errorMessage}</Text>
                )}
              </View>

              <View style={styles.form}>
                <View>
                  <Text style={styles.inputTitle}>username</Text>
                  <TextInput
                    onChangeText={(newUsername) => setUsername(newUsername)}
                    value={username}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <View style={{marginTop: 26}}>
                  <Text style={styles.inputTitle}>name</Text>
                  <TextInput
                    onChangeText={(newName) => setName(newName)}
                    value={name}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <View style={{marginTop: 26}}>
                  <Text style={styles.inputTitle}>Email</Text>
                  <TextInput
                    onChangeText={(newEmail) => setEmail(newEmail)}
                    value={email}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={{marginTop: 26}}>
                  <Text style={styles.inputTitle}>Password</Text>
                  <TextInput
                    onChangeText={(newPassword) => setPassword(newPassword)}
                    value={password}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                  />
                </View>

                <View style={{marginTop: 26}}>
                  <Text style={styles.inputTitle}>Bio</Text>
                  <TextInput
                    onChangeText={(newBio) => setBio(newBio)}
                    value={bio}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Tell us about yourself!"
                    placeholderTextColor="gray"
                  />
                </View>
              </View>

              <Text style={styles.termsOfService}>
                By signing up for Bookd, you agree to all our terms or service.
              </Text>
              {(bio != '') &
              (email != '') &
              (password != '') &
              (name != '') &
              (username != '') ? (
                <TouchableOpacity onPress={checkUsername} style={styles.button}>
                  <Text style={{color: '#FFF', fontWeight: '500'}}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={sendError} style={styles.button}>
                  <Text style={{color: '#FFF', fontWeight: '500'}}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.signin}
                onPress={() => navigation.navigate('Signin')}>
                <Text style={{color: '#c1c8d4', fontSize: 13}}>
                  Already have an account?{' '}
                  <Text style={{color: '#1E8C8B', fontWeight: '500'}}>
                    Sign in!
                  </Text>
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1C1C',
    flex: 1,
  },
  greeting: {
    color: '#1E8C8B',
    marginTop: 32,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  errorMessage: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginTop: 40,
    marginBottom: 8,
  },
  error: {
    color: '#c43b4c',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 30,
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: '#c1c8d4',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  input: {
    borderBottomColor: '#c1c8d4',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: '#c1c8d4',
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: '#1E8C8B',
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    width: 100,
    justifyContent: 'center',
    marginTop: 10,
  },
  signin: {
    marginBottom: 60,
    alignSelf: 'center',
    marginTop: 32,
  },
  termsOfService: {
    color: '#c1c8d4',
    fontSize: 12,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default SignupScreen;
