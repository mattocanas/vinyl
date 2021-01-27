import React, {useState} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import SearchScreen from '../screens/SearchScreen';

const SearchBar = ({term, onTermChange, onTermSubmit}) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <View style={styles.container}>
      {/* <Text style={styles.headerText}>
        Search for a track, artist, or album to share
      </Text> */}
      <TextInput
        placeholder="Search for a track, artist, or album"
        placeholderTextColor="rgba(193, 200, 212, 0.3)"
        returnKeyType="search"
        spellCheck={false}
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
    marginTop: 16,
    height: 30,
    width: 300,
    borderColor: 'gray',
    borderWidth: 2,
    color: '#c1c8d4',
    marginBottom: 20,
    borderRadius: 20,
    paddingLeft: 8,
  },
  headerText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#2BAEEC',
    textAlign: 'center',
    marginLeft: 14,
    marginRight: 14,
  },
  container: {
    alignItems: 'center',
  },
});

export default SearchBar;
