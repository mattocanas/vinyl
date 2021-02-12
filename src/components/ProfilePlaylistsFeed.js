import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ProfilePlaylistsFeed = () => {
  const navigationUse = useNavigation();

  return (
    <View>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigationUse.navigate('CreatePlaylistFormScreen')}>
        <Text style={styles.createText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  createButton: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    width: 160,
    borderWidth: 2,
    borderColor: '#c1c8d4',
    borderRadius: 10,
    marginTop: 20,
  },
  createText: {
    fontSize: 16,
    color: '#c1c8d4',
  },
});

export default ProfilePlaylistsFeed;
