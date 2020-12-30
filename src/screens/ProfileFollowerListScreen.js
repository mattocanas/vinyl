import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import FollowingUserItem from '../components/FollowingUserItem';

const ProfileFollowerListScreen = () => {
  useEffect(() => {
    let active = true;
    getFollowers();
    return () => {
      active = false;
    };
  }, []);

  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const [followerData, setFollowerData] = useState([]);

  const getFollowers = () => {
    let dataArray = [];
    currentUserData.followerIdList.map((id) => {
      db.collection('users')
        .doc(id)
        .onSnapshot((doc) => {
          dataArray.push(doc.data());
          setFollowerData(dataArray);
        });
    });
  };

  return (
    <View style={styles.container}>
      {followerData[0] != null ? (
        <FlatList
          style={styles.flatlist}
          data={followerData}
          keyExtractor={(item) => item.uid}
          renderItem={({item}) => <FollowingUserItem data={item} />}
        />
      ) : (
        <Text style={styles.noneText}>
          Nobody follows you yet! Search for friends and they'll probably follow
          you back!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a2b2b',
    alignItems: 'flex-start',
  },
  flatlist: {
    marginLeft: 20,
    marginTop: 30,
  },
  noneText: {
    fontSize: 18,
    color: '#c1c8d4',
    padding: 16,
    textAlign: 'center',
    alignSelf: 'center',
  },
});

export default ProfileFollowerListScreen;
