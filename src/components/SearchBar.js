import React, {useState} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import SearchScreen from '../screens/SearchScreen';

const SearchBar = ({term, onTermChange, onTermSubmit}) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Search for a track, artist, or album to share
      </Text>
      <TextInput
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
    marginTop: 20,
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
    marginTop: 40,
    fontSize: 16,
    fontWeight: '700',
    color: '#1E8C8B',
    textAlign: 'center',
    marginLeft: 14,
    marginRight: 14,
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
