import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import UserSearchResult from '../components/UserSearchResult';
import {FlatList} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

const ExploreScreen = ({navigation}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [
    {currentUser, currentUserPictureURI},
    dispatch,
  ] = useStateProviderValue();

  const searchForUser = () => {
    let usersArray = [];
    db.collection('users')
      .where(
        'lowercaseName',
        '==',
        searchTerm.split(' ').join('').toLowerCase(),
      )
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.data());
          usersArray.push(doc.data());
          setResults(usersArray);
        });
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#171818', '#171818', '#171818']}
        style={styles.container}>
        {/* <View style={styles.container}> */}
        {/* <Text style={styles.headerText}>Search for people to follow</Text> */}
        <TextInput
          placeholder="Search for people to follow"
          placeholderTextColor="rgba(193, 200, 212, 0.3)"
          enablesReturnKeyAutomatically={true}
          returnKeyType="search"
          style={styles.searchBar}
          value={searchTerm}
          onChangeText={(newTerm) => setSearchTerm(newTerm)}
          onSubmitEditing={searchForUser}
          autoCapitalize="none"
        />

        <FlatList
          style={styles.flatlist}
          keyExtractor={(item) => item.uid}
          data={results}
          renderItem={({item}) => (
            <UserSearchResult data={item} navigation={navigation} />
          )}
        />
        {/* </View> */}
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    alignItems: 'center',
  },
  searchBar: {
    marginTop: 16,
    height: 30,
    width: 300,
    borderColor: 'gray',
    borderWidth: 2,
    color: '#c1c8d4',

    borderRadius: 20,
    paddingLeft: 8,
  },
  flatlist: {
    marginTop: 20,
  },
  headerText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '600',
    color: '#2BAEEC',
    textAlign: 'center',
  },
});

export default ExploreScreen;
