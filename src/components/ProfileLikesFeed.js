import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {get} from 'react-native/Libraries/Utilities/PixelRatio';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import ProfileLike from './ProfileLike';

const ProfileLikesFeed = ({refresh, stopTrack, playTrack}) => {
  const [
    {currentUser, currentUserPictureURI},
    dispatch,
  ] = useStateProviderValue();
  const [data, setData] = useState([]);
  const [limitNumber, setLimitNumber] = useState(20);

  useEffect(() => {
    let active = true;
    getData();
    return () => {
      active = false;
    };
  }, [limitNumber]);

  const getData = () => {
    let dataArray = [];
    db.collection('users')
      .doc(currentUser.uid)
      .collection('likes')
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
    setLimitNumber(limitNumber + 40);
    getData();
  };

  return (
    <>
      {data[0] != null ? (
        <SafeAreaView style={styles.container}>
          <FlatList
            onEndReached={handleLoadMore}
            contentContainerStyle={{paddingBottom: 300}}
            showsVerticalScrollIndicator={false}
            style={styles.flatlist}
            keyExtractor={(item) => item.docId}
            data={data}
            renderItem={({item}) => (
              <ProfileLike
                data={item}
                stopTrack={stopTrack}
                playTrack={playTrack}
              />
            )}
          />
        </SafeAreaView>
      ) : (
        <Text style={styles.textDNE}>You havent liked anything yet!</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  flatlist: {
    marginBottom: 1,
  },
  container: {
    flex: 1,
  },
  textDNE: {
    textAlign: 'center',
    color: '#c1c8d4',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 40,
  },
});

export default ProfileLikesFeed;
