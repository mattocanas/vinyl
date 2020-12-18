import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
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
      .where('name', '==', searchTerm)
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
    <View style={styles.container}>
      <Text>Find Friends</Text>
      <TextInput
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242525',
    alignItems: 'center',
  },
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
  flatlist: {
    marginTop: 20,
  },
});

export default ExploreScreen;
