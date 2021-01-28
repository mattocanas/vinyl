import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  FlatList,
  TouchableOpacity,
} from 'react-native';
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
  const navigationUse = useNavigation();

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
      {data[0] == null ? (
        <Text
          style={{
            fontSize: 18,
            color: '#c1c8d4',
            width: 300,
            alignSelf: 'center',
            textAlign: 'center',
          }}>
          You don't have any conversations yet! Search for a song, and send it
          to someone!
        </Text>
      ) : null}
      <FlatList
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{marginLeft: 20, flexDirection: 'row'}}
            onPress={() => {
              navigationUse.navigate('MessageScreen', {id: item.id});
            }}>
            <FastImage
              style={styles.profilePicture}
              source={{
                uri: item.profilePictureUrl,
                priority: FastImage.priority.normal,
              }}
              // resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    paddingTop: 30,
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
