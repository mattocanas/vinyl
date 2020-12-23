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

const UserFollowingListScreen = ({route}) => {
  useEffect(() => {
    let active = true;
    getFollowing();
    return () => {
      active = false;
    };
  }, []);

  const {data} = route.params;

  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const [followingData, setFollowingData] = useState([]);

  const getFollowing = () => {
    let dataArray = [];
    data.followingIdList.map((id) => {
      db.collection('users')
        .doc(id)
        .onSnapshot((doc) => {
          dataArray.push(doc.data());
          setFollowingData(dataArray);
        });
    });
  };

  return (
    <View style={styles.container}>
      {followingData[0] != null ? (
        <FlatList
          style={styles.flatlist}
          data={followingData}
          keyExtractor={(item) => item.uid}
          renderItem={({item}) => <FollowingUserItem data={item} />}
        />
      ) : (
        <Text>You arent following anyone yet!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242525',
    alignItems: 'flex-start',
  },
  flatlist: {
    marginLeft: 20,
    marginTop: 30,
  },
});

export default UserFollowingListScreen;