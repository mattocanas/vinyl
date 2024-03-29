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
import DailyMusic from '../components/DailyMusic';
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
    <>
      {/* <DailyMusic /> */}

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#171818', '#171818', '#171818']}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    alignItems: 'center',
    paddingBottom: 60,
    paddingTop: 80,
  },
  selectionContainer: {
    flexDirection: 'row',
    marginTop: 10,
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
    color: '#2BAEEC',
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'center',
  },
});

export default SearchScreen;
