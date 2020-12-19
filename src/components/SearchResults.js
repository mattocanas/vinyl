import React, {useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import uuid from 'react-uuid';
import SearchResultItem from '../components/SearchResultItem';

const SearchResultsScreen = ({searchResults}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onSetRefresh = () => {
    setRefreshing(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatlist}
        keyExtractor={(result) => uuid()}
        data={searchResults}
        renderItem={({item}) => {
          //   console.log(item);
          return (
            <SearchResultItem
              albumArt={item.album.cover}
              title={item.title}
              audio={item.preview}
              artist={item.artist.name}
              refresh={() => onSetRefresh()}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 12,
  },
  flatlist: {
    marginBottom: 140,
    paddingBottom: 30,
  },
});

export default SearchResultsScreen;
