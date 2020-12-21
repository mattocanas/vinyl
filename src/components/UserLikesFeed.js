import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {get} from 'react-native/Libraries/Utilities/PixelRatio';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import ProfileLike from './ProfileLike';
import UserLike from './UserLike';

const UserLikesFeed = ({id}) => {
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
      .doc(id)
      .collection('likes')
      .get()
      .then((snapshot) => {
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
          style={styles.flatlist}
          keyExtractor={(item) => item.docId}
          data={data}
          renderItem={({item}) => <UserLike data={item} />}
        />
      ) : (
        <Text style={styles.textDNE}>Nothing has been liked anything yet!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flatlist: {
    marginTop: 20,
    marginLeft: 20,
  },
  textDNE: {
    textAlign: 'center',
    color: '#c1c8d4',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 40,
  },
});

export default UserLikesFeed;
