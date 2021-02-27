import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';

const ArtistDetailScreen = ({route}) => {
  const navigationUse = useNavigation();

  const [{currentUser}, dispatch] = useStateProviderValue();

  const {artistName} = route.params;

  const onAddFavoriteArtist = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .update({
        favoriteArtist: artistName,
      })
      .then(() => navigationUse.goBack());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.contruction}>
        This page is currently under construction!
      </Text>
      <Text style={styles.header}>
        Would you like to make this artist your favorite artist?
      </Text>
      <TouchableOpacity onPress={onAddFavoriteArtist}>
        <Text style={styles.yesText}>Yes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigationUse.goBack()}>
        <Text style={styles.noText}>No, take me back!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  picture: {
    height: 200,
    width: 200,
    marginTop: 100,
  },
  name: {
    color: '#2BAEEC',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  contruction: {
    color: '#c1c8d4',
    fontSize: 18,
    marginTop: 40,
    textDecorationLine: 'underline',
  },
  header: {
    marginTop: 20,
    color: '#c1c8d4',
    fontSize: 18,
    textAlign: 'center',
  },
  yesText: {
    marginTop: 20,
    color: '#2BAEEC',
    fontSize: 24,
  },
  noText: {
    marginTop: 10,
    color: '#c1c8d4',
    fontSize: 20,
  },
});

export default ArtistDetailScreen;
