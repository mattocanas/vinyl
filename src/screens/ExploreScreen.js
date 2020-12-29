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
      <View style={styles.container}>
        <Text style={styles.headerText}>Search for people to follow!</Text>
        <TextInput
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
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242525',
    alignItems: 'center',
  },
  searchBar: {
    marginTop: 20,
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
    marginTop: 40,
    fontSize: 24,
    fontWeight: '700',
    color: '#1E8C8B',
    textAlign: 'center',
  },
});

export default ExploreScreen;
