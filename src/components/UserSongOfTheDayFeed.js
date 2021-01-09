import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import ProfileSongOfTheDay from './ProfileSongOfTheDay';
import UserSongOfTheDay from './UserSongOfTheDay';

const UserSongOfTheDayFeed = ({id}) => {
  const [
    {currentUser, currentUserPictureURI},
    dispatch,
  ] = useStateProviderValue();
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    let active = true;
    getUsersSOTD();
    return () => {
      active = false;
    };
  }, []);

  const refreshComponent = () => {
    setRefresh(true);
  };

  const getUsersSOTD = () => {
    let dataArray = [];
    db.collection('users')
      .doc(id)
      .collection('posts')
      .where('type', '==', 'Song of the Day.')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          dataArray.push(doc.data());
          dataArray.sort((a, b) => {
            let a_date = new Date(a.date);
            let b_date = new Date(b.date);
            return b_date - a_date;
          });
          setData(dataArray);
        });
      });
    // .onSnapshot((snapshot) => {
    //   snapshot.forEach((doc) => {
    //     dataArray.push(doc.data());
    //     setData(dataArray);
    //   });
    // });
  };

  return (
    <View style={styles.container}>
      {data[0] != null ? (
        <FlatList
          contentContainerStyle={{paddingBottom: 300}}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.docId}
          data={data}
          renderItem={({item}) => (
            <UserSongOfTheDay refresh={() => refreshComponent()} data={item} />
          )}
        />
      ) : (
        <Text style={styles.textDNE}>
          This user hasn't had a song of the day yet!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textDNE: {
    textAlign: 'center',
    color: '#c1c8d4',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 40,
  },
  container: {
    alignItems: 'flex-start',
    flex: 1,
  },
});

export default UserSongOfTheDayFeed;
