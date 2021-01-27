import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useStateProviderValue} from '../../state/StateProvider';
import {auth} from '../../firebase/firebase';
import {useNavigation} from '@react-navigation/native';
import {db} from '../../firebase/firebase';
import firebase from 'firebase';

const UserSettingsScreen = ({route}) => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const navigation = useNavigation();
  const {usersId} = route.params;

  const blockUser = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .update({
        followingIdList: firebase.firestore.FieldValue.arrayRemove(usersId),
        followerIdList: firebase.firestore.FieldValue.arrayRemove(usersId),
        blockedUsersIdList: firebase.firestore.FieldValue.arrayUnion(usersId),
      });

    db.collection('users')
      .doc(usersId)
      .update({
        followingIdList: firebase.firestore.FieldValue.arrayRemove(
          currentUser.uid,
        ),
        followerIdList: firebase.firestore.FieldValue.arrayRemove(
          currentUser.uid,
        ),
      })
      .then(() => {
        navigation.navigate('ProfileScreen');
      });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.componentContainer} onPress={blockUser}>
        <MaterialIcon name="block" size={24} style={styles.icon} />
        <Text style={styles.labelText}>Block User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    alignItems: 'center',
  },
  componentContainer: {
    flexDirection: 'row',
    marginTop: 30,
    padding: 10,
    borderBottomColor: '#c1c8d4',
    borderBottomWidth: 4,
    alignItems: 'center',
  },
  labelText: {
    color: '#2BAEEC',
    fontSize: 24,
  },
  icon: {
    color: '#c1c8d4',
    marginRight: 8,
  },
  verionNumber: {
    color: '#c1c8d4',
    fontSize: 10,
    marginTop: 20,
  },
});

export default UserSettingsScreen;
