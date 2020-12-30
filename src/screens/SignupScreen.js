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
  Linking,
} from 'react-native';
import {auth, db} from '../../firebase/firebase';
import CheckBox from '@react-native-community/checkbox';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [nameExistsError, setNameExistsError] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBox2, setToggleCheckBox2] = useState(false);

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

        return db
          .collection('users')
          .doc(cred.user.uid)
          .set({
            bio: bio,
            followerIdList: [],
            followingIdList: ['cp9Y6yEGQIdjfWbYmNi7wIT9eKx2'],
            blockedUsersIdList: [],
            username: username.split(' ').join('').toLowerCase(),
            uid: cred.user.uid,
            name: name,
            verified: false,
            lowercase: name.split(' ').join('').toLowerCase(),
            profilePictureUrl:
              'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0d02fd8f-1763-46c2-98ff-7311b19b5795/defaultProfilePicture.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201229%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201229T174635Z&X-Amz-Expires=86400&X-Amz-Signature=fd03a33f11e25092fe35db26f6b5c46db50788326d391089cd9cad50725d61aa&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22defaultProfilePicture.jpg%22',
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
              style={{flex: 0.6, paddingTop: 220, paddingBottom: 40}}
              source={require('../../assets/AuthScreen.png')}>
              <View style={styles.errorMessage}>
                {errorMessage && (
                  <Text style={styles.error}>{errorMessage}</Text>
                )}
              </View>

              <View style={styles.form}>
                <View>
                  <Text style={styles.inputTitle}>username</Text>
                  <Text style={{color: '#c1c8d4', fontSize: 10, marginTop: 2}}>
                    psst, any spaces you use in your username will be ignored.
                  </Text>
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

                <View
                  style={{
                    marginTop: 26,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <CheckBox
                    onCheckColor="#1E8C8B"
                    onTintColor="#1E8C8B"
                    style={styles.checkbox}
                    disabled={false}
                    value={toggleCheckBox}
                    onValueChange={(newValue) => setToggleCheckBox(newValue)}
                  />
                  <Text style={styles.termsOfService}>I agree to Vinyl's </Text>
                  <Text
                    style={styles.link}
                    onPress={() =>
                      Linking.openURL(
                        'https://www.thevinylapp.net/terms-and-conditions',
                      )
                    }>
                    Terms of Service{' '}
                  </Text>
                  <Text style={styles.termsOfService}>and </Text>
                  <Text
                    style={styles.link}
                    onPress={() =>
                      Linking.openURL(
                        'https://www.thevinylapp.net/privacy-policy',
                      )
                    }>
                    Privacy Policy
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 26,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <CheckBox
                    onCheckColor="#1E8C8B"
                    onTintColor="#1E8C8B"
                    style={styles.checkbox}
                    disabled={false}
                    value={toggleCheckBox2}
                    onValueChange={(newValue) => setToggleCheckBox2(newValue)}
                  />
                  <Text style={styles.termsOfService}>
                    I am 13 years of age or older, and have recieved parent
                    permission if I'm between 13-18 years of age.
                  </Text>
                </View>
              </View>

              {(bio != '') &
              (toggleCheckBox2 == true) &
              (toggleCheckBox == true) &
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
    backgroundColor: '#2a2b2b',
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
    marginTop: 60,
  },
  form: {
    marginTop: 8,
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
    fontSize: 10,
    marginLeft: 4,
    marginRight: 4,

    textAlign: 'center',
  },
  checkbox: {},
  link: {
    color: '#1E8C8B',
    fontSize: 10,
    // marginLeft: 4,
    // marginRight: 4,

    textAlign: 'center',
  },
});

export default SignupScreen;
