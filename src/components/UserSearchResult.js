import React from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const UserSearchResult = ({data, navigation}) => {
  const navigationUse = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigationUse.navigate('UserDetailScreen', {
          data: data,
        })
      }>
      <Image
        style={styles.profilePicture}
        source={{uri: data.profilePictureUrl}}
      />
      <Text style={styles.usernameText}>{data.username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profilePicture: {
    height: 50,
    width: 50,
    borderRadius: 40,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameText: {
    marginLeft: 20,
    fontSize: 20,
    color: '#c1c8d4',
    fontWeight: 'bold',
  },
});

export default UserSearchResult;
