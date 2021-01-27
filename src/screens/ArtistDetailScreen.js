import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
import axios from 'axios';

const ArtistDetailScreen = ({route}) => {
  const navigationUse = useNavigation();
  const {data} = route.params;

  useEffect(() => {
    let active = true;

    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image source={{uri: data.picture}} style={styles.picture} />
      <Text style={styles.name}>{data.name}</Text>
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
});

export default ArtistDetailScreen;
