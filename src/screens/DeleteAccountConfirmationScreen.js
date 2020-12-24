import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useStateProviderValue} from '../../state/StateProvider';
import {auth, db} from '../../firebase/firebase';
import {useNavigation} from '@react-navigation/native';
import firebase from 'firebase';

const DeleteAccountConfirmationScreen = () => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const navigation = useNavigation();

  const deleteAccount = () => {
    db.collection('users')
      .where('followingIdList', 'array-contains', currentUser.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.update({
            followingIdList: firebase.firestore.FieldValue.arrayRemove(
              currentUser.uid,
            ),
          });
        });
      })

      .then(() => {
        db.collection('users')
          .where('followerIdList', 'array-contains', currentUser.uid)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              doc.data().update({
                followerIdList: firebase.firestore.FieldValue.arrayRemove(
                  currentUser.uid,
                ),
              });
            });
          });
      })
      .then(() => {
        db.collection('users').onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            doc
              .data()
              .collection('posts')
              .where('likes', 'array-contains', currentUser.uid)
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  doc.data().update({
                    likes: firebase.firestore.FieldValue.arrayRemove({
                      uid: currentUser.uid,
                      username: currentUser.displayName,
                    }),
                  });
                });
              });
          });
        });
      })
      .then(() => {
        db.collection('users')
          .doc(currentUser.uid)
          .delete()
          .then(() => {
            auth.currentUser.delete();
            // .then(() => {
            //   navigation.navigate('SigninScreen');
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));

    auth.onAuthStateChanged((user) => {
      navigation.navigate(user ? 'App' : 'Auth');
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>
        Are you sure you want to delete your Vinyl account?
      </Text>
      <View style={{marginTop: 40}}>
        <TouchableOpacity
          style={styles.noButton}
          onPress={() => navigation.navigate('ProfileScreen')}>
          <Text>No, keep my account.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.yesButton} onPress={deleteAccount}>
          <Text>Yes, if you love me, set me free.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242525',
    alignItems: 'center',
  },

  labelText: {
    color: '#1E8C8B',
    fontSize: 18,
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
  },
  noButton: {
    backgroundColor: '#1E8C8B',
    color: '#242525',
    padding: 10,

    borderRadius: 30,

    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: '#c43b4c',
    color: '#242525',
    padding: 10,
    marginTop: 40,
    borderRadius: 30,

    alignItems: 'center',
  },
});

export default DeleteAccountConfirmationScreen;
