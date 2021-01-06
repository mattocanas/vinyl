import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {db} from '../../firebase/firebase';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const LikeListScreen = ({route}) => {
  const {data} = route.params;
  const [likesData, setLikesData] = useState([]);
  const navigationUse = useNavigation();

  useEffect(() => {
    let active = true;
    getLikes();
    return () => {
      active = false;
    };
  }, []);

  const getLikes = () => {
    let dataArray = [];
    data.map((user) => {
      db.collection('users')
        .doc(user.uid)
        .get()
        .then((doc) => {
          dataArray.push(doc.data());
          setLikesData(dataArray);
        });
    });
  };

  return (
    <>
      {likesData[0] != null ? (
        <View style={styles.container}>
          <FlatList
            style={styles.flatlist}
            data={likesData}
            keyExtractor={(item) => item.uid}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  navigationUse.navigate('UserDetailScreen', {data: item})
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 10,
                    marginBottom: 20,
                  }}>
                  <FastImage
                    style={styles.profilePicture}
                    source={{
                      uri: item.profilePictureUrl,
                      priority: FastImage.priority.normal,
                    }}
                    // resizeMode={FastImage.resizeMode.contain}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.name}>{item.name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <View style={styles.container2}>
          <Text style={styles.DNEText}>
            This post doesn't have any likes yet.
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a2b2b',
    alignItems: 'flex-start',
  },
  container2: {
    flex: 1,
    backgroundColor: '#2a2b2b',
    alignItems: 'center',
  },
  profilePicture: {
    height: 40,
    width: 40,
    borderRadius: 30,
  },
  flatlist: {
    marginTop: 20,
    marginLeft: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#c1c8d4',
  },
  name: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(193, 200, 212, 0.6)',
  },
  DNEText: {
    color: '#c1c8d4',
    fontSize: 16,

    marginTop: 60,
  },
});

export default LikeListScreen;
