import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Sound from 'react-native-sound';
import ProfilePicture from '../components/ProfilePicture';
import {useStateProviderValue} from '../../state/StateProvider';
import ProfileSongsOfTheDayFeed from '../components/ProfileSongOfTheDayFeed';
import ProfileLikesFeed from '../components/ProfileLikesFeed';
import ProfilePostsFeed from '../components/ProfilePostsFeed';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

const ProfileScreen = ({navigation}) => {
  const navigationUse = useNavigation();
  const [refresh, setRefresh] = useState(false);
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();

  const [showSOTD, setShowSOTD] = useState(true);
  const [showLikeFeed, setShowLikeFeed] = useState(false);
  const [SOTDActive, setSOTDActive] = useState(true);
  const [likesActive, setLikesActive] = useState(false);
  const [postsActive, setPostsActive] = useState(false);
  const [showPosts, setShowPosts] = useState(false);

  const refreshScreen = () => {
    setRefresh(true);
  };

  const showSOTDFeed = () => {
    setShowSOTD(true);
    setShowLikeFeed(false);
    setSOTDActive(true);
    setLikesActive(false);
    setShowPosts(false);
    setPostsActive(false);
  };

  const showPostsFeed = () => {
    setShowPosts(true);
    setPostsActive(true);
    setShowSOTD(false);
    setShowLikeFeed(false);
    setLikesActive(false);
    setSOTDActive(false);
  };

  const showLikesFeed = () => {
    setShowLikeFeed(true);
    setShowSOTD(false);
    setLikesActive(true);
    setSOTDActive(false);
    setShowPosts(false);
    setPostsActive(false);
  };

  return (
    <>
      {currentUser ? (
        <View style={styles.container}>
          <View style={styles.profileInfoContainer}>
            <View style={styles.photoNameContainer}>
              <ProfilePicture refresh={() => refreshScreen()} />
              <Text style={styles.usernameText}>{currentUser.displayName}</Text>
              <Text style={styles.bio}>{currentUserData.bio}</Text>
            </View>

            <View style={{alignItems: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={styles.followingContainer}
                  onPress={() =>
                    navigationUse.navigate('ProfileFollowingListScreen')
                  }>
                  <Text style={styles.followingNumber}>
                    {currentUserData.followingIdList.length.toString()}
                  </Text>

                  <Text style={styles.followingText}>Following</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.followersContainer}
                  onPress={() =>
                    navigationUse.navigate('ProfileFollowerListScreen')
                  }>
                  <Text style={styles.followersNumber}>
                    {currentUserData.followerIdList.length.toString()}
                  </Text>

                  <Text style={styles.followersText}>Followers</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.settingButton}
                onPress={() => navigationUse.navigate('SettingsScreen')}>
                <Text style={styles.settingsText}>Settings</Text>
              </TouchableOpacity>
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
          <View>
            {showSOTD ? (
              <ProfileSongsOfTheDayFeed refresh={() => showLikesFeed()} />
            ) : null}
            {showLikeFeed ? (
              <ProfileLikesFeed refresh={() => showSOTDFeed()} />
            ) : null}
            {showPosts ? (
              <ProfilePostsFeed refresh={() => showSOTDFeed()} />
            ) : null}
          </View>
        </View>
      ) : null}
    </>
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
    marginLeft: 10,
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
    marginTop: 20,
  },
  settingsText: {
    fontSize: 16,
    color: '#c1c8d4',
  },
  sectionsTabContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 14,
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
  bio: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c1c8d4',
    marginTop: 10,
  },
});

export default ProfileScreen;
