import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SearchDeezer from '../components/SearchDeezer';

const PlaylistAddSearchScreen = ({route}) => {
  const {data} = route.params;
  return (
    <View style={styles.container}>
      <SearchDeezer type={'Playlist'} playlistData={data} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    alignItems: 'center',
  },
});

export default PlaylistAddSearchScreen;
