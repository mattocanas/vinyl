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

const FeedUserDetailScreen = ({route}) => {
  useEffect(() => {
    let active = true;
    getUserData();
    console.log(data);
    console.log(userData);
    return () => {
      active = false;
    };
  }, [userData]);

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

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <View style={styles.profileInfoContainer}>
            <View style={styles.photoNameContainer}>
              <Image
                style={styles.profilePicture}
                source={{uri: userData.profilePictureUrl}}
              />
              <Text style={styles.usernameText}>{userData.username}</Text>
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
            </View>
          </View>
          <View style={styles.sectionsTabContainer}>
            <TouchableOpacity
              style={styles.songOfTheDaySection}
              onPress={showSOTDFeed}>
              {SOTDActive ? (
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommunityIcon
                    name="calendar-month"
                    style={styles.songOfTheDayIconTextActive}
                  />
                  <Text style={styles.songOfTheDayTextActive}>
                    Songs of the day
                  </Text>
                </View>
              ) : (
                <View style={{flexDirection: 'row', textAlign: 'center'}}>
                  <MaterialCommunityIcon
                    name="calendar-month"
                    style={styles.songOfTheDayIconText}
                  />
                  <Text style={styles.songOfTheDayText}>Songs of the day</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.likesSection}
              onPress={showPostsFeed}>
              {postsActive ? (
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommunityIcon
                    name="comment-text"
                    style={styles.songOfTheDayIconTextActive}
                  />
                  <Text style={styles.postsTextActive}>Posts</Text>
                </View>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommunityIcon
                    name="comment-text"
                    style={styles.songOfTheDayIconText}
                  />
                  <Text style={styles.postsText}>Posts</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.likesSection}
              onPress={showLikesFeed}>
              {likesActive ? (
                <View style={{flexDirection: 'row'}}>
                  <AntIcon
                    name="heart"
                    style={styles.songOfTheDayIconTextActive}
                  />
                  <Text style={styles.likesTextActive}>Likes</Text>
                </View>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <AntIcon name="heart" style={styles.songOfTheDayIconText} />
                  <Text style={styles.likesText}>Likes</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          {showSOTD ? <UserSongOfTheDayFeed id={userData.uid} /> : null}
          {showLikeFeed ? <UserLikesFeed id={userData.uid} /> : null}
          {showPosts ? <UserPostsFeed id={userData.uid} /> : null}
        </>
      ) : (
        <>
          <ActivityIndicator size="large" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242525',
    alignItems: 'center',
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // marginLeft: 40,
    marginTop: 36,
    // borderBottomWidth: 2,
    // borderBottomColor: 'gray',
    // // paddingBottom: 8,
  },
  followingContainer: {
    alignItems: 'center',
  },
  followersContainer: {
    alignItems: 'center',
    marginLeft: 40,
  },
  photoNameContainer: {
    alignItems: 'center',
    marginRight: 40,
  },
  usernameText: {
    fontSize: 20,
    color: '#c1c8d4',
    fontWeight: 'bold',
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
    marginTop: 10,
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
    marginTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
    // paddingBottom: 8,
  },
  songOfTheDaySection: {
    marginRight: 12,
  },
  songOfTheDayText: {
    color: '#c1c8d4',
    fontSize: 16,

    fontWeight: '700',
  },
  songOfTheDayIconText: {
    color: '#c1c8d4',
    fontSize: 16,
    marginTop: 2.8,
    fontWeight: '700',
  },
  likesSection: {
    marginLeft: 4,
  },
  likesText: {
    color: '#c1c8d4',
    fontSize: 16,

    fontWeight: '700',
  },
  songOfTheDayTextActive: {
    color: '#1E8C8B',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  songOfTheDayIconTextActive: {
    color: '#1E8C8B',
    fontSize: 16,
    // textDecorationLine: 'underline',
    fontWeight: '700',
    marginTop: 2.8,
  },
  likesTextActive: {
    color: '#1E8C8B',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  postsText: {
    color: '#c1c8d4',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 16,
  },
  postsTextActive: {
    color: '#1E8C8B',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '700',
    marginRight: 16,
  },
});

export default FeedUserDetailScreen;
