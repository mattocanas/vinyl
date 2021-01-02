import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {get} from 'react-native/Libraries/Utilities/PixelRatio';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import ProfileLike from './ProfileLike';

const ProfileLikesFeed = ({refresh}) => {
  const [
    {currentUser, currentUserPictureURI},
    dispatch,
  ] = useStateProviderValue();
  const [data, setData] = useState([]);

  useEffect(() => {
    let active = true;
    getData();
    return () => {
      active = false;
    };
  }, []);

  const getData = () => {
    let dataArray = [];
    db.collection('users')
      .doc(currentUser.uid)
      .collection('likes')
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
  };

  return (
    <View style={{flex: 1}}>
      {data[0] != null ? (
        <FlatList
          style={styles.flatlist}
          keyExtractor={(item) => item.docId}
          data={data}
          renderItem={({item}) => <ProfileLike data={item} />}
        />
      ) : (
        <Text style={styles.textDNE}>You havent liked anything yet!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flatlist: {
    marginTop: 20,
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
