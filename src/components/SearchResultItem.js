import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, View, Image, StyleSheet} from 'react-native';
import Sound from 'react-native-sound';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import uuid from 'react-uuid';
import {useNavigation} from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const SearchResultItem = ({
  albumArt,
  allData,
  title,
  audio,
  artist,
  refresh,
  type,
  recommendationPostData,
  playlistData,
}) => {
  const navigationUse = useNavigation();
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const [songOfTheDay, setSongOfTheDay] = useState(false);
  useEffect(() => {
    let active = true;
    Sound.setCategory('Playback');

    return () => {
      active = false;
    };
  }, []);

  const track = new Sound(audio, null, (e) => {
    if (e) {
      console.log('error', e);
    } else {
      // all good
    }
  });

  const onSelectSongRecommendation = () => {
    db.collection('posts').doc(recommendationPostData.docId).update({
      artist: allData.artist.name,
      title: allData.title,
      albumArt: allData.album.cover_xl,
      albumId: allData.album.id,
      artistId: allData.artist.id,
      artistTracklist: allData.artist.tracklist,
      albumTracklist: allData.album.tracklist,
      albumName: allData.album.title,
      trackId: allData.id,
      audio: allData.preview,
    });

    let newNotificationRef = db
      .collection('users')
      .doc(recommendationPostData.requestedById)
      .collection('notifications')
      .doc();

    newNotificationRef.set({
      notificationId: newNotificationRef.id,
      type: 'recommendationFulfilled',
      date: new Date().toDateString(),
      preciseDate: new Date(),
      fulfilledBy: currentUser.uid,
      fulfilledByUsername: currentUserData.username,
      fulfilledByProfilePicture: currentUserData.profilePictureUrl,
      fulfilledByVerified: currentUserData.verified,
      postId: recommendationPostData.docId,
      postData: recommendationPostData,
    });

    db.collection('users')
      .doc(recommendationPostData.requestedById)
      .collection('posts')
      .doc(recommendationPostData.docId)
      .update({
        artist: allData.artist.name,
        title: allData.title,
        albumArt: allData.album.cover_xl,
        albumId: allData.album.id,
        artistId: allData.artist.id,
        artistTracklist: allData.artist.tracklist,
        albumTracklist: allData.album.tracklist,
        albumName: allData.album.title,
        trackId: allData.id,
        audio: allData.preview,
      })
      .then(() => {
        navigationUse.navigate('HomeScreen');
      });
  };

  const onAddSongToPlaylist = () => {
    let newSongRef = db
      .collection('posts')
      .doc(playlistData.docId)
      .collection('songs')
      .doc();

    let newPostRef = db.collection('posts').doc();

    db.collection('posts')
      .doc(playlistData.docId)
      .collection('songs')
      .doc(newSongRef.id)
      .set({
        docId: newSongRef.id,
        playlistOwner: playlistData.creatorId,
        playlistId: playlistData.docId,
        artist: allData.artist.name,
        title: allData.title,
        albumArt: allData.album.cover_xl,
        albumId: allData.album.id,
        artistId: allData.artist.id,
        artistTracklist: allData.artist.tracklist,
        albumTracklist: allData.album.tracklist,
        albumName: allData.album.title,
        trackId: allData.id,
        audio: allData.preview,
        addedById: currentUser.uid,
        addedByUsername: currentUserData.username,
        addedByProfilePicture: currentUserData.profilePictureUrl,
        addedOnDate: new Date(),
      });

    newPostRef.set({
      docId: newPostRef.id,
      songAddId: newSongRef.id,
      playlistOwner: playlistData.creatorId,
      playlistId: playlistData.docId,
      artist: allData.artist.name,
      title: allData.title,
      albumArt: allData.album.cover_xl,
      albumId: allData.album.id,
      artistId: allData.artist.id,
      artistTracklist: allData.artist.tracklist,
      albumTracklist: allData.album.tracklist,
      albumName: allData.album.title,
      trackId: allData.id,
      audio: allData.preview,
      addedById: currentUser.uid,
      addedByUsername: currentUserData.username,
      addedByProfilePicture: currentUserData.profilePictureUrl,
      addedOnDate: new Date(),
      playlistName: playlistData.playlistName,
      playlistOwnerUsername: playlistData.creatorUsername,
      playlistOwnerProfilePicture: playlistData.profilePictureUrl,
      playlistDescription: playlistData.playlistDescription,
      followerIdList: [currentUser.uid, ...currentUserData.followerIdList],
      type: 'Playlist Add',
      addedByName: currentUserData.name,

      date: new Date().toDateString(),
      preciseDate: new Date(),
      addedByVerified: currentUserData.verified,
      profilePictureUrl: currentUserData.profilePictureUrl,
      userNotificationTokens: currentUserData.tokens,
      likes: [],
      comments: [],
    });

    let newNotificationRef = db
      .collection('users')
      .doc(playlistData.creatorId)
      .collection('notifications')
      .doc();

    newNotificationRef.set({
      notificationId: newNotificationRef.id,
      type: 'playlistAdd',
      date: new Date().toDateString(),
      preciseDate: new Date(),
      addedBy: currentUser.uid,
      addedByUsername: currentUserData.username,
      addedByProfilePicture: currentUserData.profilePictureUrl,
      addedByVerified: currentUserData.verified,
      postId: playlistData.docId,
    });

    newSongRef
      .update({
        docId: newSongRef.id,
        playlistId: playlistData.docId,
        playlistOwner: playlistData.creatorId,
        artist: allData.artist.name,
        title: allData.title,
        albumArt: allData.album.cover_xl,
        albumId: allData.album.id,
        artistId: allData.artist.id,
        artistTracklist: allData.artist.tracklist,
        albumTracklist: allData.album.tracklist,
        albumName: allData.album.title,
        trackId: allData.id,
        audio: allData.preview,
        addedById: currentUser.uid,
        addedByUsername: currentUserData.username,
        addedByProfilePicture: currentUserData.profilePictureUrl,
        addedOnDate: new Date(),
      })
      .then(() => {
        navigationUse.goBack();
      });
  };

  return (
    <View style={styles.container}>
      {type == 'Song Request' ? (
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={onSelectSongRecommendation}>
          <Image style={styles.albumArt} source={{uri: albumArt}} />
          <View style={styles.songInfoContainer}>
            <Text style={styles.title}>{title}</Text>

            <Text style={styles.artist}>{artist}</Text>
          </View>
        </TouchableOpacity>
      ) : type == 'Playlist' ? (
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={onAddSongToPlaylist}>
          <Image style={styles.albumArt} source={{uri: albumArt}} />
          <View style={styles.songInfoContainer}>
            <Text style={styles.title}>{title}</Text>

            <Text style={styles.artist}>{artist}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() =>
            navigationUse.navigate('SongDetailScreen', {data: allData})
          }>
          <Image style={styles.albumArt} source={{uri: albumArt}} />
          <View style={styles.songInfoContainer}>
            <Text style={styles.title}>{title}</Text>

            <Text style={styles.artist}>{artist}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 4,
    flexDirection: 'row',
  },
  albumArt: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    color: '#2BAEEC',
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
    color: '#c1c8d4',
  },
  songOfTheDayIcon: {
    fontSize: 30,
    color: '#2BAEEC',
    marginLeft: 10,
    marginTop: 8,
  },
  songInfoContainer: {
    marginLeft: 12,
  },
  songOfTheDayWarning: {
    fontSize: 8,
    color: '#c1c8d4',
  },
  stopIcon: {
    fontSize: 34,
    marginTop: 12,
    // marginLeft: 16,
    color: '#2BAEEC',
  },
});

export default SearchResultItem;
