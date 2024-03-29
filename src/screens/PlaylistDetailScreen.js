import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import firebase from 'firebase';
import {useNavigation} from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import CommentsScreen from './CommentsScreen';
import Moment from 'react-moment';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import PlaylistSong from '../components/PlaylistSong';
import Sound from 'react-native-sound';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const PlaylistDetailScreen = ({route}) => {
  const {
    profilePictureUrl,
    uid,
    username,
    name,
    date,
    data,
    likes,
    comments,
    type,
    description,
    playlistName,
    playlistDescription,
    navigateBackTo,
    docId,
    verified,
  } = route.params;

  const navigationUse = useNavigation();
  const [songs, setSongs] = useState([]);
  const [limitNumber, setLimitNumber] = useState(4);

  const [song, setSong] = useState(null);
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      getSongs();
      return () => {
        active = false;
      };
    }, [limitNumber]),
  );

  const handleAudio = (url) => {
    if (song) {
      song.stop();
      track = new Sound(url, null, (e) => {
        if (e) {
          console.log('error', e);
        } else {
          // setReady(true);

          setSong(track);
          track.play();
          // setPlaying(true);
        }
      });
    } else {
      track = new Sound(url, null, (e) => {
        if (e) {
          console.log('error', e);
        } else {
          // setReady(true);

          setSong(track);
          track.play();
          // setPlaying(true);
        }
      });
    }
  };

  const stopTrack = () => {
    if (song) {
      song.stop();
    }
  };

  const getSongs = () => {
    let songArray = [];
    db.collection('posts')
      .doc(docId)
      .collection('songs')
      .orderBy('addedOnDate', 'desc')
      .limit(limitNumber)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          songArray.push(doc.data());
        });
        setSongs(songArray);
      });
  };

  const handleLoadMore = () => {
    setLimitNumber(limitNumber + 10);
    getSongs();
  };

  const rightAction = () => (
    <View style={styles.swipeContainer}>
      <MaterialCommunityIcon name="delete" style={styles.deleteIcon} />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {/* <ScrollView
        contentContainerStyle={{alignItems: 'center'}}
        showsVerticalScrollIndicator={false}> */}
      <MaterialIcon
        onPress={() => {
          navigationUse.goBack();
        }}
        name="arrow-back-ios"
        color="white"
        style={{
          fontSize: 30,
          position: 'absolute',
          marginTop: 50,
          alignSelf: 'flex-start',
          marginLeft: 30,
        }}
      />
      <View style={styles.profileContainer}>
        <TouchableOpacity
          onPress={() =>
            navigationUse.navigate('FeedUserDetailScreen', {data: uid})
          }>
          <FastImage
            style={styles.profilePicture}
            source={{
              uri: profilePictureUrl,
              priority: FastImage.priority.normal,
            }}
            // resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
        <Text style={styles.usernameText}>{username}</Text>
        {verified ? (
          <MaterialCommunityIcon
            name="check-decagram"
            style={styles.verifiedCheck}
          />
        ) : null}
        <Text style={styles.usernameText}></Text>
        <Text style={{fontSize: 6, alignSelf: 'center', marginRight: 1}}>
          ⚪️
        </Text>
        <Moment
          date={data.preciseDate.toDate()}
          fromNow
          element={Text}
          style={styles.dateText}>
          {date}
        </Moment>
      </View>

      <View style={{width: 320, alignItems: 'center', marginTop: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <IonIcon
            name="ios-disc"
            style={{fontSize: 30, color: '#2BAEEC', marginRight: 2}}
          />
          <Text style={styles.playlistName}>{playlistName}</Text>
        </View>
        <Text style={styles.playlistDescription}>{playlistDescription}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigationUse.navigate('PlaylistAddSearchScreen', {data: data})
          }>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>

        <FlatList
          style={{height: 400, marginTop: 10}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 0, paddingTop: 10}}
          data={songs}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0}
          keyExtractor={(item) => item.docId}
          renderItem={({item}) => (
            <>
              {item.addedById || item.playlistOwner == currentUser.uid ? (
                <Swipeable
                  rightThreshold={30}
                  renderRightActions={rightAction}
                  onSwipeableRightOpen={() => {
                    navigationUse.navigate('DeletePlaylistSongScreen', {
                      uid: item.playlistOwner,
                      songId: item.docId,
                      playlistId: item.playlistId,
                    });
                  }}>
                  <PlaylistSong
                    albumArt={item.albumArt}
                    title={item.title}
                    artist={item.artist}
                    addedById={item.addedById}
                    profilePictureUrl={item.addedByProfilePicture}
                    addedByUsername={item.addedByUsername}
                    addedOnDate={item.addedOnDate}
                    audio={item.audio}
                    playTrack={(track) => {
                      handleAudio(track);
                    }}
                    stopTrack={() => {
                      stopTrack();
                    }}
                  />
                </Swipeable>
              ) : (
                <PlaylistSong
                  albumArt={item.albumArt}
                  title={item.title}
                  artist={item.artist}
                  addedById={item.addedById}
                  profilePictureUrl={item.addedByProfilePicture}
                  addedByUsername={item.addedByUsername}
                  addedOnDate={item.addedOnDate}
                  audio={item.audio}
                  playTrack={(track) => {
                    handleAudio(track);
                  }}
                  stopTrack={() => {
                    stopTrack();
                  }}
                />
              )}
            </>
          )}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <TouchableOpacity
          onPress={() =>
            navigationUse.navigate('LikeListScreen', {data: likes})
          }>
          <Text style={styles.likesNumber}>{likes.length} likes</Text>
        </TouchableOpacity>
        <IonIcon
          name="chatbubble-outline"
          style={styles.commentIcon}
          onPress={() =>
            navigationUse.navigate('PostCommentScreen', {
              uid: uid,
              docId: docId,
              data: {
                title: playlistName,
                profilePictureUrl,
                uid,
                username: username,
                date,
                likes,
                likesNumber: likes.length,
                comments,
                type,

                navigateBackTo,
                docId,
                verified,
              },
            })
          }
        />
        <Text style={styles.commentsNumber}>{comments.length} comments</Text>
        <TouchableOpacity
          onPress={() =>
            navigationUse.navigate('ReportPostScreen', {
              title: playlistName,
              artist,
              audio,
              albumArt,
              profilePictureUrl,
              uid,
              username: requestedByUsername,
              date,
              likes,
              comments,
              type,
              description,
              docId,
            })
          }>
          <MaterialIcon name="report" style={styles.reportButton} />
        </TouchableOpacity>
      </View>
      <CommentsScreen docId={docId} uid={uid} />
      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#171818',
    alignItems: 'center',
  },
  profilePicture: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginLeft: 30,

    borderColor: '#2BAEEC',
    borderWidth: 1,
    alignItems: 'center',
  },
  usernameText: {
    color: '#c1c8d4',
    fontWeight: 'bold',
    marginLeft: 8,
    // marginTop: 4,
    fontSize: 16,
    alignSelf: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 100,
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
    color: 'gray',
    alignSelf: 'center',
  },

  likesNumber: {
    // marginTop: 14,
    fontSize: 18,
    fontWeight: '500',
    color: '#c1c8d4',
    marginRight: 30,
  },
  reportButton: {
    color: '#c1c8d4',
    fontSize: 28,
    // marginTop: 14,
    marginLeft: 0,
    // position: 'relative',
    // left: 230,
  },
  commentIcon: {
    fontSize: 26,
    color: '#c1c8d4',
    marginRight: 4,
    // marginTop: 12,
  },
  verifiedCheck: {
    fontSize: 12,
    color: '#2BAEEC',
    textAlign: 'center',
    marginLeft: 4,
    marginRight: 4,
    marginTop: 1,
    alignSelf: 'center',
  },
  commentsNumber: {
    fontSize: 18,
    fontWeight: '500',
    color: '#c1c8d4',
    marginRight: 30,
  },
  playlistName: {
    fontSize: 30,
    color: '#2BAEEC',
    textAlign: 'center',
    fontWeight: '600',
  },
  playlistDescription: {
    fontSize: 22,
    color: '#c1c8d4',
    textAlign: 'center',
  },
  addButton: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    width: 160,
    borderWidth: 2,
    borderColor: '#c1c8d4',
    borderRadius: 10,
    marginTop: 20,
  },
  addText: {
    fontSize: 16,
    color: '#c1c8d4',
  },
  swipeContainer: {
    width: 40,
    alignItems: 'center',
    alignSelf: 'center',
  },
  deleteIcon: {
    color: '#c43b4c',
    alignSelf: 'center',
    marginTop: 70,
    fontSize: 20,
  },
});

export default PlaylistDetailScreen;
