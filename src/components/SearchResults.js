import React, {useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import uuid from 'react-uuid';
import SearchResultItem from '../components/SearchResultItem';

const SearchResultsScreen = ({
  searchResults,
  type,
  recommendationPostData,
  playlistData,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onSetRefresh = () => {
    setRefreshing(true);
  };

  return (
    <View style={styles.container}>
      {searchResults[0] != null ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.flatlist}
          keyExtractor={(result) => uuid()}
          data={searchResults}
          renderItem={({item}) => {
            return (
              <SearchResultItem
                albumArt={item.album.cover_xl}
                title={item.title}
                audio={item.preview}
                artist={item.artist.name}
                allData={item}
                refresh={() => onSetRefresh()}
                recommendationPostData={recommendationPostData}
                playlistData={playlistData}
                type={type}
              />
            );
          }}
        />
      ) : (
        <Text style={styles.errorText}>Couldn't find anything.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 12,
  },
  flatlist: {
    marginBottom: 90,
    paddingBottom: 30,
    marginRight: 21,
  },
  errorText: {
    color: '#c1c8d4',
    fontSize: 20,
    alignSelf: 'center',
  },
});

export default SearchResultsScreen;
