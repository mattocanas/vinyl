import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import FeedItem from '../components/FeedItem';

const GlobalFeedScreen = () => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();

  useEffect(() => {
    let active = true;
    getData();
    return () => {
      active = false;
    };
  }, []);

  let uidArray = [];
  let dataArray = [];

  const [allData, setData] = useState([]);
  const [uidData, setUidData] = useState([]);
  const [refreshController, setRefreshController] = useState(false);

  const refreshComponent = () => {
    setRefreshController(true);
    getData();
  };

  const getData = () => {
    db.collection('users')
      .get()
      .then((snapshot) =>
        snapshot.forEach((doc) => {
          uidArray.push(doc.data().uid);
        }),
      )
      .then(() => {
        getPosts();
        setRefreshController(false);
      });
  };

  const getPosts = () => {
    let postsArray = [];
    uidArray.map((id) => {
      db.collection('users')
        .doc(id)
        .collection('posts')
        .where('type', '==', 'Song of the Day.')
        .limit(120)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            postsArray.push(doc.data());
            postsArray.sort((a, b) => {
              let a_date = new Date(a.date);
              let b_date = new Date(b.date);
              return b_date - a_date;
            });
            setData(postsArray);
          });
        });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Discover music from all over! 🌎</Text>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshController}
            onRefresh={refreshComponent}
            title="Pull for new tunes."
            titleColor="#1E8C8B"
            tintColor="#1E8C8B"
          />
        }
        data={allData}
        keyExtractor={(item) => item.docId}
        renderItem={({item}) => (
          <FeedItem
            title={item.title}
            artist={item.artist}
            albumArt={item.albumArt}
            audio={item.audio}
            username={item.username}
            uid={item.uid}
            profilePictureUrl={item.profilePictureUrl}
            likes={item.likes}
            comments={item.comments}
            date={item.date}
            docId={item.docId}
            type={item.type}
            description={item.description}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a2b2b',
  },
  headerText: {
    fontSize: 18,
    color: '#c1c8d4',
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 14,
    fontWeight: 'bold',
  },
});

export default GlobalFeedScreen;
