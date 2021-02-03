import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import ProfileSongOfTheDay from './ProfileSongOfTheDay';
import ProfilePost from './ProfilePost';
import UserPost from './UserPost';

const UserPostsFeed = ({id}) => {
  const [
    {currentUser, currentUserPictureURI},
    dispatch,
  ] = useStateProviderValue();
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [limitNumber, setLimitNumber] = useState(4);

  useEffect(() => {
    let active = true;
    getUsersPosts();
    return () => {
      active = false;
    };
  }, [limitNumber]);

  const refreshComponent = () => {
    setRefresh(true);
  };

  const getUsersPosts = () => {
    let dataArray = [];
    db.collection('users')
      .doc(id)
      .collection('posts')
      .where('type', '==', 'Post')
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
  };

  const handleLoadMore = () => {
    setLimitNumber(limitNumber + 20);
    getUsersPosts();
  };

  return (
    <View style={styles.container}>
      {data[0] != null ? (
        <FlatList
          onEndReached={handleLoadMore}
          contentContainerStyle={{paddingBottom: 300}}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.docId}
          data={data}
          renderItem={({item}) => (
            <UserPost
              id={item.uid}
              refresh={() => refreshComponent()}
              data={item}
            />
          )}
        />
      ) : (
        <Text style={styles.textDNE}>
          This user hasnt posted anything yet! They must hate music!
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
    padding: 12,
  },
  container: {
    alignItems: 'flex-start',
    flex: 1,
  },
});

export default UserPostsFeed;
