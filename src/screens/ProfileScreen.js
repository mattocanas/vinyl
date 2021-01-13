import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Sound from 'react-native-sound';
import ProfilePicture from '../components/ProfilePicture';
import {useStateProviderValue} from '../../state/StateProvider';
import ProfileSongsOfTheDayFeed from '../components/ProfileSongOfTheDayFeed';
import ProfileLikesFeed from '../components/ProfileLikesFeed';
import ProfilePostsFeed from '../components/ProfilePostsFeed';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

const dimensions = Dimensions.get('screen');

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
        <LinearGradient
          colors={['#171818', '#171818', '#171818']}
          style={styles.container}>
          {/* <View style={styles.container}> */}
          <View
            style={{
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
            }}>
            <View style={styles.profileInfoContainer}>
              <View style={styles.photoNameContainer}>
                <ProfilePicture refresh={() => refreshScreen()} />
              </View>

              <View
                style={{
                  alignItems: 'center',
                }}>
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                marginTop: 8,
                marginLeft: 10,
              }}>
              <Text style={styles.usernameText}>{currentUser.displayName}</Text>
              {currentUserData.verified ? (
                <MaterialCommunityIcon
                  name="check-decagram"
                  style={styles.verifiedCheck}
                />
              ) : null}
            </View>
            <Text style={styles.bio}>{currentUserData.bio}</Text>
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
          {/* </View> */}
        </LinearGradient>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    alignItems: 'center',
    paddingTop: 70,
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
    alignItems: 'flex-start',
    marginRight: 40,
  },
  usernameText: {
    fontSize: 18,
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
  sectionsTabContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 30,
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(193, 200, 212, 0.1)',
    // paddingBottom: 8,
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
  bio: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c1c8d4',
    marginTop: 10,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  verifiedCheck: {
    fontSize: 20,
    color: '#1E8C8B',
    textAlign: 'center',
    marginTop: 8,
    marginLeft: 6,
  },
});

export default ProfileScreen;
