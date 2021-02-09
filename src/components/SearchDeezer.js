import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import useResults from '../../hooks/useResults';
import SearchResultsScreen from '../components/SearchResults';
import LinearGradient from 'react-native-linear-gradient';

const SearchDeezer = ({type, recommendationPostData}) => {
  const [term, setTerm] = useState('');
  const [searchApi, results, errorMessage] = useResults();
  return (
    <>
      <SearchBar
        term={term}
        onTermSubmit={() => searchApi(term)}
        onTermChange={setTerm}
      />
      {results ? (
        <SearchResultsScreen
          searchResults={results}
          type={type}
          recommendationPostData={recommendationPostData}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({});

export default SearchDeezer;
