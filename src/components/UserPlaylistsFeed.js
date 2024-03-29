import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';

const UserPlaylistsFeed = ({id}) => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const navigationUse = useNavigation();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    let active = true;
    getUsersPlaylists();
    console.log(playlists);
    return () => {
      active = false;
    };
  }, []);

  const getUsersPlaylists = () => {
    let dataArray = [];
    db.collection('users')
      .doc(id)
      .collection('posts')
      .where('type', '==', 'Playlist')
      .orderBy('preciseDate', 'desc')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          dataArray.push(doc.data());
        });
        setPlaylists(dataArray);
      });
  };

  return (
    <View style={styles.container}>
      {playlists[0] ? (
        <FlatList
          style={{marginTop: 40}}
          contentContainerStyle={{marginBottom: 10}}
          data={playlists}
          keyExtractor={(item) => item.docId}
          renderItem={({item}) => (
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigationUse.navigate('PlaylistDetailScreen', {
                    profilePictureUrl: item.profilePictureUrl,
                    uid: item.creatorId,
                    username: item.creatorUsername,
                    playlistName: item.playlistName,
                    playlistDescription: item.playlistDescription,
                    date: item.date,
                    likes: item.likes,
                    comments: item.comments,
                    docId: item.docId,
                    navigateBackTo: 'HomeScreen',
                    type: item.type,
                    data: item,
                    verified: item.verified,
                  })
                }>
                <Text style={styles.playlistName}>{item.playlistName}</Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',

                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Text style={styles.byText}>by</Text>
                <Text style={styles.usernameText}>{item.creatorUsername}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.textDNE}>
          This user hasn't created any playlists yet!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  createButton: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    width: 160,
    borderWidth: 2,
    borderColor: '#c1c8d4',
    borderRadius: 10,
    marginTop: 20,
  },
  createText: {
    fontSize: 16,
    color: '#c1c8d4',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  playlistName: {
    fontSize: 26,
    fontWeight: '500',
    color: '#c1c8d4',
    width: 300,
    textAlign: 'center',
    marginTop: 20,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#2BAEEC',
    textAlign: 'center',
  },
  byText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#2BAEEC',
    marginRight: 8,
    textAlign: 'center',
  },
  textDNE: {
    textAlign: 'center',
    color: '#c1c8d4',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 40,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export default UserPlaylistsFeed;
