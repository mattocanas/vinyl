import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import ProfileSongOfTheDay from './ProfileSongOfTheDay';

const ProfileSongsOfTheDayFeed = () => {
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
      .doc(currentUser.uid)
      .collection('posts')
      .where('type', '==', 'Song of the Day.')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          dataArray.push(doc.data());
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
          keyExtractor={(item) => item.docId}
          data={data}
          renderItem={({item}) => (
            <ProfileSongOfTheDay
              refresh={() => refreshComponent()}
              data={item}
            />
          )}
        />
      ) : (
        <Text style={styles.textDNE}>
          You have't had a song of the day yet! Start listening to some music!
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

export default ProfileSongsOfTheDayFeed;
