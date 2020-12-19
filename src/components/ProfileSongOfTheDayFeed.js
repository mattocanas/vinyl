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

  useEffect(() => {
    let active = true;
    getUsersSOTD();
    return () => {
      active = false;
    };
  }, []);

  const getUsersSOTD = () => {
    let dataArray = [];
    db.collection('users')
      .doc(currentUser.uid)
      .collection('songsOfTheDay')
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          dataArray.push(doc.data());
          setData(dataArray);
        });
      });
  };

  return (
    <View>
      {data[0] != null ? (
        <FlatList
          keyExtractor={(item) => item.docId}
          data={data}
          renderItem={({item}) => <ProfileSongOfTheDay data={item} />}
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
});

export default ProfileSongsOfTheDayFeed;
