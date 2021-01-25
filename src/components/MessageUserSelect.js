import React, {useEffect, useState} from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const MessageUserSelect = ({userData, songData}) => {
  const navigationUse = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.container2}
        onPress={() =>
          navigationUse.navigate('MessageFormScreen', {
            userData: userData,
            songData: songData,
          })
        }>
        <FastImage
          source={{
            uri: userData.profilePictureUrl,
            priority: FastImage.priority.normal,
          }}
          style={styles.profilePicture}
          // resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.usernameText}>{userData.username}</Text>
          <Text style={styles.nameText}>{userData.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
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

export default MessageUserSelect;
