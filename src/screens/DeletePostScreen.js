import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {useStateProviderValue} from '../../state/StateProvider';
import {auth, db} from '../../firebase/firebase';
import {useNavigation} from '@react-navigation/native';

const DeletePostScreen = ({route}) => {
  const {docId, uid} = route.params;
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const navigation = useNavigation();

  useEffect(() => {
    let active = true;

    return () => {
      active = false;
    };
  }, []);

  const onDelete = () => {
    db.collection('posts').doc(docId).delete();
    db.collection('users')
      .doc(uid)
      .collection('posts')
      .doc(docId)
      .delete()
      .then(() => {
        navigation.navigate('ProfileScreen');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>
        Are you sure you want to delete this post?
      </Text>
      <View style={{marginTop: 40}}>
        <TouchableOpacity
          style={styles.noButton}
          onPress={() => navigation.goBack()}>
          <Text>No, this post can stay.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.yesButton} onPress={onDelete}>
          <Text>Yes, this post must go.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    alignItems: 'center',
  },

  labelText: {
    color: '#2BAEEC',
    fontSize: 18,
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
  },
  noButton: {
    backgroundColor: '#2BAEEC',
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
  reportedText: {
    color: '#c1c8d4',
    textAlign: 'center',
    fontSize: 24,
    marginTop: 20,
    padding: 10,
  },
});

export default DeletePostScreen;
