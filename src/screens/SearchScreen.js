import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SearchBar from '../components/SearchBar';
import useResults from '../../hooks/useResults';
import SearchResultsScreen from '../components/SearchResults';

const SearchScreen = () => {
  const [term, setTerm] = useState('');
  const [searchApi, results, errorMessage] = useResults();
  return (
    <View style={styles.container}>
      <SearchBar
        term={term}
        onTermSubmit={() => searchApi(term)}
        onTermChange={setTerm}
      />
      <SearchResultsScreen searchResults={results} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242525',
  },
});

export default SearchScreen;
