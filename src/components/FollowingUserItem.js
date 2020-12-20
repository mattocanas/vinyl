import React, {useEffect, useState} from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const FollowingUserItem = ({data}) => {
  const navigationUse = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.container2}
        onPress={() =>
          navigationUse.navigate('UserDetailScreen', {
            data: data,
          })
        }>
        <Image
          source={{uri: data.profilePictureUrl}}
          style={styles.profilePicture}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.usernameText}>{data.username}</Text>
          <Text style={styles.nameText}>{data.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  container2: {
    flexDirection: 'row',
  },
  profilePicture: {
    height: 40,
    width: 40,
    borderRadius: 30,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#c1c8d4',
    letterSpacing: 1,
  },
  nameText: {
    fontSize: 14,
    color: '#c1c8d4',
  },
  nameContainer: {
    marginLeft: 20,
  },
});

export default FollowingUserItem;
