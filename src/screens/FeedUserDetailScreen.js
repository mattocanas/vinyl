import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
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
import FastImage from 'react-native-fast-image';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Moment from 'react-moment';

const FeedUserDetailScreen = ({route}) => {
  useEffect(() => {
    let active = true;
    getUserData();
    checkIfBlocked();
    // console.log(data);
    // console.log(userData);
    return () => {
      active = false;
    };
  }, [userData, blocked, blocked2]);

  const getUserData = () => {
    db.collection('users')
      .doc(data)
      .get()
      .then((doc) => {
        setUserData(doc.data());
      });
  };

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
  const [userData, setUserData] = useState(null);
  const navigationUse = useNavigation();
  const [blocked, setBlocked] = useState(false);
  const [blocked2, setBlocked2] = useState(false);

  const checkIfBlocked = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.data().blockedUsersIdList.includes(data)) {
          setBlocked(true);
        } else {
          setBlocked(false);
        }
      });
    db.collection('users')
      .doc(data)
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
        followingIdList: firebase.firestore.FieldValue.arrayUnion(data),
      });

    db.collection('users')
      .doc(data)
      .update({
        followerIdList: firebase.firestore.FieldValue.arrayUnion(
          currentUser.uid,
        ),
      });
  };

  const onUnfollow = () => {
    db.collection('users')
      .doc(currentUser.uid)
      .update({
        followingIdList: firebase.firestore.FieldValue.arrayRemove(data),
      });

    db.collection('users')
      .doc(data)
      .update({
        followerIdList: firebase.firestore.FieldValue.arrayRemove(
          currentUser.uid,
        ),
      });
  };

  const showSOTDFeed = () => {
    setShowSOTD(true);
    setShowLikeFeed(false);
    setSOTDActive(true);
    setLikesActive(false);
    setPostsActive(false);
    setShowPosts(false);
  };

  const showLikesFeed = () => {
    setShowLikeFeed(true);
    setShowSOTD(false);
    setLikesActive(true);
    setSOTDActive(false);
    setPostsActive(false);
    setShowPosts(false);
  };

  const showPostsFeed = () => {
    setShowLikeFeed(false);
    setShowSOTD(false);
    setLikesActive(false);
    setSOTDActive(false);
    setPostsActive(true);
    setShowPosts(true);
  };

  const rennder = () => {
    if (blocked) {
      return <Text>This user is currently unavailable.</Text>;
    } else if (blocked2) {
      return <Text>This user is currently unavailable.</Text>;
    } else {
      return (
        <>
          <View
            style={{
              alignItems: 'flex-start',
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
            }}>
            <View style={styles.profileInfoContainer}>
              <View style={styles.photoNameContainer}>
                <FastImage
                  style={styles.profilePicture}
                  source={{
                    uri: userData.profilePictureUrl,
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
                        data: userData,
                      })
                    }>
                    <Text style={styles.followingNumber}>
                      {userData.followingIdList.length.toString()}
                    </Text>

                    <Text style={styles.followingText}>Following</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.followersContainer}
                    onPress={() =>
                      navigationUse.navigate('UserFollowerListScreen', {
                        data: userData,
                      })
                    }>
                    <Text style={styles.followersNumber}>
                      {userData.followerIdList.length.toString()}
                    </Text>

                    <Text style={styles.followersText}>Followers</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {currentUserData.followingIdList.includes(userData.uid) ? (
                    <TouchableOpacity
                      style={styles.followButton}
                      onPress={onUnfollow}>
                      <Text style={styles.followText}>Following</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.followButton}
                      onPress={onFollow}>
                      <Text style={styles.followText}>Follow</Text>
                    </TouchableOpacity>
                  )}
                  {userData.uid != currentUser.uid ? (
                    <MaterialCommunityIcon
                      onPress={() =>
                        navigationUse.navigate('UserSettingsScreen', {
                          usersId: data,
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
              <Text style={styles.usernameText}>{userData.username}</Text>
              {userData.verified ? (
                <MaterialCommunityIcon
                  name="check-decagram"
                  style={styles.verifiedCheck}
                />
              ) : null}
            </View>
            <Text style={styles.bio}>{userData.bio}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                alignItems: 'center',
              }}>
              <IonIcon name="ios-today" style={styles.joinIcon} />
              <Text style={styles.joinedText}>Joined </Text>
              <Moment format="LL" element={Text} style={styles.joinedText}>
                {userData.dateJoined}
              </Moment>
            </View>
          </View>
          <View style={styles.sectionsTabContainer}>
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
                  <Text style={styles.songOfTheDayText}>Songs of the day</Text>
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
          </View>
          {showSOTD ? <UserSongOfTheDayFeed id={userData.uid} /> : null}
          {showLikeFeed ? <UserLikesFeed id={userData.uid} /> : null}
          {showPosts ? <UserPostsFeed id={userData.uid} /> : null}
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      {userData ? (
        rennder()
      ) : (
        <>
          <Text style={styles.blockedText}>User Unavailable.</Text>
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
    color: '#1E8C8B',
  },
  followersText: {
    fontSize: 14,
    color: '#1E8C8B',
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
    borderColor: '#1E8C8B',
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
  followText: {
    fontSize: 16,
    color: '#c1c8d4',
  },
  sectionsTabContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },
  songOfTheDaySection: {
    marginRight: 12,
  },
  songOfTheDayText: {
    color: '#c1c8d4',
    fontSize: 22,

    fontWeight: '700',
  },

  likesSection: {
    marginLeft: 4,
  },
  likesText: {
    color: '#c1c8d4',
    fontSize: 22,

    fontWeight: '700',
  },
  songOfTheDayTextActive: {
    color: '#1E8C8B',
    fontSize: 22,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },

  likesTextActive: {
    color: '#1E8C8B',
    fontSize: 22,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  postsText: {
    color: '#c1c8d4',
    fontSize: 22,
    fontWeight: '700',
    marginRight: 16,
  },
  postsTextActive: {
    color: '#1E8C8B',
    fontSize: 22,
    textDecorationLine: 'underline',
    fontWeight: '700',
    marginRight: 16,
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
    width: 350,
  },
  verifiedCheck: {
    fontSize: 20,
    color: '#1E8C8B',
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
});

export default FeedUserDetailScreen;
