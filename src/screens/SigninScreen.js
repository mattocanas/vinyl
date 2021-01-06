import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {auth} from '../../firebase/firebase';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const SinginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = () => {
    let active = true;
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => setErrorMessage(error.message));
    return () => {
      active = false;
    };
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <ImageBackground
              style={{flex: 1, paddingTop: 260, paddingBottom: 200}}
              source={require('../../assets/AuthScreen.png')}>
              <View style={styles.errorMessage}>
                {errorMessage && (
                  <Text style={styles.error}>{errorMessage}</Text>
                )}
              </View>

              <View style={styles.form}>
                <View>
                  <Text style={styles.inputTitle}>Email</Text>
                  <TextInput
                    onChangeText={(newEmail) => setEmail(newEmail)}
                    value={email}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={{marginTop: 32}}>
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
              </View>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={{color: '#FFF', fontWeight: '500'}}>Sign in</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Signup')}
                style={{alignSelf: 'center', marginTop: 32}}>
                <Text style={{color: '#c1c8d4', fontSize: 13}}>
                  New to Vinyl?{' '}
                  <Text style={{color: '#1E8C8B', fontWeight: '500'}}>
                    Sign up here!
                  </Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('PasswordResetScreen')}
                style={{alignSelf: 'center', marginTop: 32}}>
                <Text style={{color: '#c1c8d4', fontSize: 13}}>
                  Forgot your password?{' '}
                  <Text style={{color: '#1E8C8B', fontWeight: '500'}}>
                    Reset it here!
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
    // marginTop: 32,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  errorMessage: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginTop: 14,
    marginBottom: 10,
  },
  error: {
    color: '#c43b4c',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
    // marginTop: 100,
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
});

export default SinginScreen;
