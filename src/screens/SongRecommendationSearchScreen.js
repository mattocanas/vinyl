import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SearchDeezer from '../components/SearchDeezer';

const SongRecommendationSearchScreen = ({route}) => {
  const {data} = route.params;
  return (
    <View style={styles.container}>
      <SearchDeezer type={'Song Request'} recommendationPostData={data} />
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

export default SongRecommendationSearchScreen;
