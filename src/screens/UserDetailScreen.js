import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import firebase from 'firebase';
import UserSongOfTheDayFeed from '../components/UserSongOfTheDayFeed';
import UserLikesFeed from '../components/UserLikesFeed';
import {useNavigation} from '@react-navigation/native';
import UserPostsFeed from '../components/UserPostsFeed';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Moment from 'react-moment';
import UserRecommendationsFeed from '../components/UserRecommendationsFeed';
import UserPlaylistsFeed from '../components/UserPlaylistsFeed';

const UserDetailScreen = ({route}) => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();

  const {data} = route.params;
  const [showSOTD, setShowSOTD] = useState(true);
  const [showLikeFeed, setShowLikeFeed] = useState(false);
  const [SOTDActive, setSOTDActive] = useState(true);
  const [likesActive, setLikesActive] = useState(false);
  const [postsActive, setPostsActive] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [blocked2, setBlocked2] = useState(false);
  const [songRequested, setSongRequested] = useState(false);
  const [playlistsActive, setPlaylistsActive] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [recommendationsActive, setRecommendationsActive] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const navigationUse = useNavigation();

  useEffect(() => {
    let active = true;
    checkIfBlocked();

    return () => {
      active = false;
    };
  }, [blocked, blocked2]);

  const checkIfBlocked = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.data().blockedUsersIdList.includes(data.uid)) {
          setBlocked(true);
        } else {
          setBlocked(false);
        }
      });
    db.collection('users')
      .doc(data.uid)
      .get()
      .then((doc) => {
        if (doc.data().blockedUsersIdList.includes(currentUser.uid)) {
          setBlocked2(true);
        } else {
          false;
        }
      });
  };

  const onFollow = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .update({
        followingIdList: firebase.firestore.FieldValue.arrayUnion(data.uid),
      });

    db.collection('users')
      .doc(data.uid)
      .update({
        followerIdList: firebase.firestore.FieldValue.arrayUnion(
          currentUser.uid,
        ),
      });

    let newNotificationRef = db
      .collection('users')
      .doc(data.uid)
      .collection('notifications')
      .doc();
    newNotificationRef.set({
      notificationId: newNotificationRef.id,
      type: 'follow',
      date: new Date().toDateString(),
      preciseDate: new Date(),
      followedBy: currentUser.uid,
      followedByUsername: currentUser.displayName,
      followedByProfilePicture: currentUserData.profilePictureUrl,
      followedByVerified: currentUserData.verified,
      userFollowed: data.uid,
    });
  };

  const onUnfollow = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .update({
        followingIdList: firebase.firestore.FieldValue.arrayRemove(data.uid),
      });

    db.collection('users')
      .doc(data.uid)
      .update({
        followerIdList: firebase.firestore.FieldValue.arrayRemove(
          currentUser.uid,
        ),
      });

    db.collection('users')
      .doc(data.uid)
      .collection('notifications')
      .where('userFollowed', '==', data.uid)
      .where('followedBy', '==', currentUser.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  };

  const showSOTDFeed = () => {
    setShowSOTD(true);
    setShowLikeFeed(false);
    setSOTDActive(true);
    setLikesActive(false);
    setShowPosts(false);
    setPostsActive(false);
    setShowRecommendations(false);
    setRecommendationsActive(false);
    setPlaylistsActive(false);
    setShowPlaylists(false);
  };

  const showLikesFeed = () => {
    setShowLikeFeed(true);
    setShowSOTD(false);
    setLikesActive(true);
    setSOTDActive(false);
    setShowPosts(false);
    setPostsActive(false);
    setShowRecommendations(false);
    setRecommendationsActive(false);
    setPlaylistsActive(false);
    setShowPlaylists(false);
  };

  const showPostsFeed = () => {
    setShowPosts(true);
    setPostsActive(true);
    setShowSOTD(false);
    setShowLikeFeed(false);
    setLikesActive(false);
    setSOTDActive(false);
    setShowRecommendations(false);
    setRecommendationsActive(false);
    setPlaylistsActive(false);
    setShowPlaylists(false);
  };

  const showRecommendationsFeed = () => {
    setShowRecommendations(true);
    setRecommendationsActive(true);
    setShowLikeFeed(false);
    setShowSOTD(false);
    setLikesActive(false);
    setSOTDActive(false);
    setShowPosts(false);
    setPostsActive(false);
    setPlaylistsActive(false);
    setShowPlaylists(false);
  };

  const showPlaylistsFeed = () => {
    setShowLikeFeed(false);
    setShowSOTD(false);
    setLikesActive(false);
    setSOTDActive(false);
    setShowPosts(false);
    setPostsActive(false);
    setShowRecommendations(false);
    setRecommendationsActive(false);
    setPlaylistsActive(true);
    setShowPlaylists(true);
  };

  const onRequestSong = () => {
    setSongRequested(true);

    let newPostRef = db.collection('posts').doc();
    let newUserPostRef = db
      .collection('users')
      .doc(currentUser.uid)
      .collection('posts')
      .doc(newPostRef.id);

    newPostRef.set({
      docId: newPostRef.id,
      profilePictureUrl: currentUserData.profilePictureUrl,
      requestedById: currentUser.uid,
      requestedByName: currentUserData.name,
      requestedByUsername: currentUserData.username,
      date: new Date().toDateString(),
      preciseDate: new Date(),
      verified: currentUserData.verified,
      userNotificationTokens: currentUserData.tokens,
      likes: [],
      comments: [],
      description: '',
      type: 'Song Request',
      followerIdList: [currentUser.uid, ...currentUserData.followerIdList],
      requestedId: data.uid,
      requestedUsername: data.username,
      requestedName: data.name,
      artist: '',
      title: '',
      albumArt: '',
      albumId: '',
      artistId: '',
      artistTracklist: '',
      albumTracklist: '',
      albumName: '',
      trackId: '',
      audio: '',
    });

    newUserPostRef.set({
      docId: newPostRef.id,
      profilePictureUrl: currentUserData.profilePictureUrl,
      requestedById: currentUser.uid,
      requestedByName: currentUserData.name,
      requestedByUsername: currentUserData.username,
      date: new Date().toDateString(),
      preciseDate: new Date(),
      verified: currentUserData.verified,
      userNotificationTokens: currentUserData.tokens,
      likes: [],
      comments: [],
      description: '',
      type: 'Song Request',
      followerIdList: [currentUser.uid, ...currentUserData.followerIdList],
      requestedId: data.uid,
      requestedUsername: data.username,
      requestedName: data.name,
      artist: '',
      title: '',
      albumArt: '',
      albumId: '',
      artistId: '',
      artistTracklist: '',
      albumTracklist: '',
      albumName: '',
      trackId: '',
      audio: '',
    });
  };

  return (
    <View style={styles.container}>
      {(blocked != true) & (blocked2 != true) ? (
        <>
          <View
            style={{
              alignItems: 'flex-start',
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
              width: Dimensions.get('screen').width,
              paddingLeft: 12,
            }}>
            <View style={styles.profileInfoContainer}>
              <View style={styles.photoNameContainer}>
                <FastImage
                  style={styles.profilePicture}
                  source={{
                    uri: data.profilePictureUrl,
                    priority: FastImage.priority.normal,
                  }}
                  // resizeMode={FastImage.resizeMode.contain}
                />
              </View>

              <View style={{alignItems: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={styles.followingContainer}
                    onPress={() =>
                      navigationUse.navigate('UserFollowingListScreen', {
                        data: data,
                      })
                    }>
                    <Text style={styles.followingNumber}>
                      {data.followingIdList.length.toString()}
                    </Text>

                    <Text style={styles.followingText}>Following</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.followersContainer}
                    onPress={() =>
                      navigationUse.navigate('UserFollowerListScreen', {
                        data: data,
                      })
                    }>
                    <Text style={styles.followersNumber}>
                      {data.followerIdList.length.toString()}
                    </Text>

                    <Text style={styles.followersText}>Followers</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {currentUserData.followingIdList.includes(data.uid) ? (
                    <TouchableOpacity
                      style={styles.followingButton}
                      onPress={onUnfollow}>
                      <Text style={styles.followingButtonText}>Following</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.followButton}
                      onPress={onFollow}>
                      <Text style={styles.followText}>Follow</Text>
                    </TouchableOpacity>
                  )}
                  {data.uid != currentUser.uid ? (
                    <MaterialCommunityIcon
                      onPress={() =>
                        navigationUse.navigate('UserSettingsScreen', {
                          usersId: data.uid,
                        })
                      }
                      name="dots-horizontal"
                      style={{
                        fontSize: 30,
                        color: '#c1c8d4',
                        marginRight: 10,
                        marginTop: 20,
                        marginLeft: 12,
                      }}
                    />
                  ) : null}
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                marginTop: 8,
                marginLeft: 10,
              }}>
              <Text style={styles.usernameText}>{data.username}</Text>
              {data.verified ? (
                <MaterialCommunityIcon
                  name="check-decagram"
                  style={styles.verifiedCheck}
                />
              ) : null}
            </View>
            <Text style={styles.bio}>{data.bio}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                alignItems: 'center',
              }}>
              <IonIcon name="ios-today" style={styles.joinIcon} />
              <Text style={styles.joinedText}>Joined </Text>
              <Moment format="LL" element={Text} style={styles.joinedText}>
                {data.dateJoined}
              </Moment>
            </View>

            {songRequested ? (
              <TouchableOpacity style={styles.requestButtonActive}>
                <Text style={styles.requestTextActive}>
                  You requested a song!
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.requestButton}
                onPress={onRequestSong}>
                <Text style={styles.requestText}>Request a song</Text>
              </TouchableOpacity>
            )}

            <ScrollView
              style={{alignSelf: 'center', marginTop: 8}}
              contentContainerStyle={{paddingBottom: 2}}
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: 14,
                  marginRight: 0,
                }}>
                <TouchableOpacity
                  style={styles.songOfTheDaySection}
                  onPress={showSOTDFeed}>
                  {SOTDActive ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.songOfTheDayTextActive}>
                        Songs of the day
                      </Text>
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row', textAlign: 'center'}}>
                      <Text style={styles.songOfTheDayText}>
                        Songs of the day
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.likesSection}
                  onPress={showPostsFeed}>
                  {postsActive ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.postsTextActive}>Posts</Text>
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.postsText}>Posts</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.likesSection}
                  onPress={showLikesFeed}>
                  {likesActive ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.likesTextActive}>Likes</Text>
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.likesText}>Likes</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.likesSection}
                  onPress={showRecommendationsFeed}>
                  {recommendationsActive ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.recommendationsTextActive}>
                        Recommendations
                      </Text>
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.recommendationsText}>
                        Recommendations
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.likesSection}
                  onPress={showPlaylistsFeed}>
                  {playlistsActive ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.recommendationsTextActive}>
                        Playlists
                      </Text>
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.recommendationsText}>Playlists</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          <View style={styles.sectionsTabContainer}></View>
          {showSOTD ? <UserSongOfTheDayFeed id={data.uid} /> : null}
          {showLikeFeed ? <UserLikesFeed id={data.uid} /> : null}
          {showPosts ? <UserPostsFeed id={data.uid} /> : null}
          {showRecommendations ? (
            <UserRecommendationsFeed id={data.uid} />
          ) : null}
          {showPlaylists ? <UserPlaylistsFeed id={data.uid} /> : null}
        </>
      ) : (
        <>
          <Text style={styles.blockedText}>User Unavailable</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    alignItems: 'center',
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    marginTop: 36,
  },
  followingContainer: {
    alignItems: 'center',
  },
  followersContainer: {
    alignItems: 'center',
    marginLeft: 40,
  },
  photoNameContainer: {
    alignItems: 'flex-start',
    marginRight: 30,
    marginLeft: 10,
  },
  usernameText: {
    fontSize: 16,
    color: '#c1c8d4',
    fontWeight: '700',
    marginTop: 6,
  },
  followingNumber: {
    fontWeight: '600',
    fontSize: 24,
    color: '#c1c8d4',
  },
  followersNumber: {
    fontWeight: '600',
    fontSize: 24,
    color: '#c1c8d4',
  },
  followingText: {
    fontSize: 14,
    color: '#2BAEEC',
  },
  followersText: {
    fontSize: 14,
    color: '#2BAEEC',
  },
  settingButton: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    width: 160,
    borderWidth: 2,
    borderColor: '#c1c8d4',
    borderRadius: 10,
    marginTop: 20,
  },
  settingsText: {
    fontSize: 16,
    color: '#c1c8d4',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 75,
    borderColor: '#2BAEEC',
    borderWidth: 1,
  },
  followButton: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    width: 160,
    borderWidth: 2,
    borderColor: '#c1c8d4',
    borderRadius: 10,
    marginTop: 20,
  },
  followingButton: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    width: 160,
    borderWidth: 2,
    borderColor: '#2BAEEC',
    borderRadius: 10,
    marginTop: 20,
  },
  followingButtonText: {
    fontSize: 16,
    color: '#2BAEEC',
  },
  followText: {
    fontSize: 16,
    color: '#c1c8d4',
  },
  sectionsTabContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(193, 200, 212, 0.4)',
    paddingBottom: 0,
  },
  songOfTheDaySection: {
    marginRight: 12,
  },
  songOfTheDayText: {
    color: '#c1c8d4',
    fontSize: 18,
    marginBottom: -2,
    fontWeight: '400',
  },

  likesSection: {
    marginLeft: 4,
  },
  likesText: {
    color: '#c1c8d4',
    fontSize: 18,
    marginBottom: -2,
    fontWeight: '400',
  },
  songOfTheDayTextActive: {
    color: '#2BAEEC',
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: '400',
    marginBottom: -2,
  },

  likesTextActive: {
    color: '#2BAEEC',
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: '400',
    marginBottom: -2,
  },
  recommendationsText: {
    color: '#c1c8d4',
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 10,
    marginBottom: -2,
  },
  recommendationsTextActive: {
    color: '#2BAEEC',
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: '400',
    marginBottom: -2,
    marginLeft: 10,
  },
  postsText: {
    color: '#c1c8d4',
    fontSize: 18,
    fontWeight: '400',
    marginRight: 10,
    marginBottom: -2,
  },
  postsTextActive: {
    color: '#2BAEEC',
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: '400',
    marginRight: 10,
    marginBottom: -2,
  },
  menuButton: {
    color: '#c1c8d4',
    fontSize: 16,
  },
  blockedText: {
    color: '#c1c8d4',
    fontSize: 24,
    padding: 16,
  },
  bio: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c1c8d4',
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 4,
    marginRight: 2,
    width: 330,
  },
  verifiedCheck: {
    fontSize: 20,
    color: '#2BAEEC',
    textAlign: 'center',
    marginTop: 8,
    marginLeft: 6,
  },
  joinIcon: {
    fontSize: 14,
    color: '#a3adbf',
    marginRight: 6,
    marginLeft: 10,
  },
  joinedText: {
    color: '#a3adbf',
    fontSize: 10,
  },
  requestButton: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    width: 160,
    borderWidth: 2,
    borderColor: '#c1c8d4',
    borderRadius: 10,
    marginTop: 12,
    alignSelf: 'center',
  },
  requestText: {
    fontSize: 16,
    color: '#c1c8d4',
  },
  requestButtonActive: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    width: 210,
    borderWidth: 2,
    borderColor: '#2BAEEC',
    borderRadius: 10,
    marginTop: 12,
    alignSelf: 'center',
  },
  requestTextActive: {
    fontSize: 16,
    color: '#2BAEEC',
    textAlign: 'center',
  },
});

export default UserDetailScreen;
