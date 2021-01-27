import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated, FlatList} from 'react-native';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const MessageListScreen = () => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
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
      .collection('messages')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          dataArray.push(doc.data());
        });
        setData(dataArray);
      });
  };
  return (
    <View style={styles.container}>
      <Text>Message List</Text>
      <FlatList
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={({item}) => (
          <View style={{marginLeft: 20, flexDirection: 'row'}}>
            <FastImage
              style={styles.profilePicture}
              source={{
                uri: item.profilePictureUrl,
                priority: FastImage.priority.normal,
              }}
              // resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.username}>{item.username}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
  },
  profilePicture: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2BAEEC',
  },
  username: {
    color: '#c1c8d4',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default MessageListScreen;
