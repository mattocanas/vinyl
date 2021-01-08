import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {auth} from '../../firebase/firebase';

const PasswordResetScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = (Email) => {
    auth
      .sendPasswordResetEmail(email)
      .then(function (user) {
        setSuccess(true);
      })
      .catch((error) => setErrorMessage(error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Please enter the email address of your account!
      </Text>
      <View style={styles.errorMessage}>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        {success && (
          <Text style={styles.error}>
            Please check your inbox! Once you've selected a new password, return
            to the signin page!
          </Text>
        )}
      </View>
      <TextInput
        onChangeText={(newEmail) => setEmail(newEmail)}
        value={email}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.button} onPress={resetPassword}>
        <Text style={{color: '#FFF', fontWeight: '500'}}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#171818',
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
  },
  input: {
    borderBottomColor: '#c1c8d4',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: '#c1c8d4',
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
  },
  greeting: {
    color: '#c1c8d4',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: '#1E8C8B',
    borderRadius: 4,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  errorMessage: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  error: {
    color: '#1E8C8B',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PasswordResetScreen;
