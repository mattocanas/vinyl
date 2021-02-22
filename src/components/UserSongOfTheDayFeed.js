import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import ProfileSongOfTheDay from './ProfileSongOfTheDay';
import UserSongOfTheDay from './UserSongOfTheDay';
import {useFocusEffect} from '@react-navigation/native';

const UserSongOfTheDayFeed = ({id, playTrack, stopTrack}) => {
  const [
    {currentUser, currentUserPictureURI},
    dispatch,
  ] = useStateProviderValue();
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [limitNumber, setLimitNumber] = useState(12);

  // useEffect(() => {
  //   let active = true;
  //   getUsersSOTD();
  //   return () => {
  //     active = false;
  //   };
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      getUsersSOTD();
      return () => {
        active = false;
      };
    }, [id, limitNumber]),
  );

  const refreshComponent = () => {
    setRefresh(true);
  };

  const getUsersSOTD = () => {
    let dataArray = [];
    db.collection('users')
      .doc(id)
      .collection('posts')
      .where('type', '==', 'Song of the Day.')
      .limit(limitNumber)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          dataArray.push(doc.data());
          dataArray.sort((a, b) => {
            let a_date = new Date(a.date);
            let b_date = new Date(b.date);
            return b_date - a_date;
          });
        });
        setData(dataArray);
      });
    // .onSnapshot((snapshot) => {
    //   snapshot.forEach((doc) => {
    //     dataArray.push(doc.data());
    //     setData(dataArray);
    //   });
    // });
  };

  const handleLoadMore = () => {
    setLimitNumber(limitNumber + 20);
    getUsersSOTD();
  };

  return (
    <View style={styles.container}>
      {data[0] != null ? (
        <FlatList
          onEndReached={handleLoadMore}
          contentContainerStyle={{paddingBottom: 300, paddingRight: 30}}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.docId}
          data={data}
          renderItem={({item}) => (
            <UserSongOfTheDay
              refresh={() => refreshComponent()}
              data={item}
              playTrack={playTrack}
              stopTrack={stopTrack}
            />
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
    flex: 1,
  },
});

export default UserSongOfTheDayFeed;
