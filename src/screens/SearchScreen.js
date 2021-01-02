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
import ExploreScreen from './ExploreScreen';
import SearchDeezer from '../components/SearchDeezer';
const SearchScreen = () => {
  const [term, setTerm] = useState('');
  const [searchApi, results, errorMessage] = useResults();
  const [musicActive, setMusicActive] = useState(true);
  const [usersActive, setUsersActive] = useState(false);

  const onMusicSelect = () => {
    setMusicActive(true);
    setUsersActive(false);
  };

  const onUsersSelect = () => {
    setMusicActive(false);
    setUsersActive(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#2a2b2b', '#242525', '#242525']}
        style={styles.container}>
        {musicActive ? (
          <View style={styles.selectionContainer}>
            <Text style={styles.optionTextActive} onPress={onMusicSelect}>
              Music
            </Text>
            <Text style={styles.optionText} onPress={onUsersSelect}>
              Users
            </Text>
          </View>
        ) : (
          <View style={styles.selectionContainer}>
            <Text style={styles.optionText} onPress={onMusicSelect}>
              Music
            </Text>
            <Text style={styles.optionTextActive} onPress={onUsersSelect}>
              Users
            </Text>
          </View>
        )}

        {musicActive ? <SearchDeezer /> : <ExploreScreen />}
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242525',
    alignItems: 'center',
    paddingBottom: 60,
  },
  selectionContainer: {
    flexDirection: 'row',
    marginTop: 36,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  optionText: {
    fontSize: 30,
    color: '#c1c8d4',
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'center',
  },
  optionTextActive: {
    fontSize: 30,
    color: '#1E8C8B',
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'center',
  },
});

export default SearchScreen;
