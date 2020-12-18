import React, {useState} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import SearchScreen from '../screens/SearchScreen';

const SearchBar = ({term, onTermChange, onTermSubmit}) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Search for a track, artist, or album to share
      </Text>
      <TextInput
        style={styles.searchBar}
        value={term}
        onChangeText={(newTerm) => onTermChange(newTerm)}
        onSubmitEditing={() => onTermSubmit()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    paddingTop: 4,

    marginTop: 20,
    height: 30,
    width: 300,
    borderColor: 'gray',
    borderWidth: 2,
    color: '#c1c8d4',
    marginBottom: 20,
  },
  container: {
    alignItems: 'center',
  },
  header: {
    fontSize: 16,
    color: '#c1c8d4',
    marginTop: 12,
  },
});

export default SearchBar;
