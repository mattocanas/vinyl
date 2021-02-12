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
import IonIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Moment from 'react-moment';
import ProfileRecommendationsFeed from '../components/ProfileRecommendationsFeed';
import ProfilePlaylistsFeed from '../components/ProfilePlaylistsFeed';

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
  const [playlistsActive, setPlaylistsActive] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [recommendationsActive, setRecommendationsActive] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [song, setSong] = useState(null);

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

  return (
    <>
      {currentUser ? (
        <LinearGradient
          colors={['#171818', '#171818', '#171818']}
          style={styles.container}>
          {/* <View style={styles.container}> */}
          <View
            style={{
              // alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
              width: dimensions.width,
              paddingLeft: 20,
              paddingBottom: 2,
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
                // marginLeft: 10,
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
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                alignItems: 'center',
              }}>
              <IonIcon name="ios-today" style={styles.joinIcon} />
              <Text style={styles.joinedText}>Joined </Text>
              <Moment format="LL" element={Text} style={styles.joinedText}>
                {currentUserData.dateJoined}
              </Moment>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: 14,
                marginRight: 30,
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
          </View>

          <View style={styles.sectionsTabContainer}></View>
          <View>
            {showSOTD ? (
              <ProfileSongsOfTheDayFeed
                refresh={() => showLikesFeed()}
                playTrack={(track) => {
                  handleAudio(track);
                }}
                stopTrack={() => {
                  stopTrack();
                }}
              />
            ) : null}
            {showLikeFeed ? (
              <ProfileLikesFeed
                refresh={() => showSOTDFeed()}
                playTrack={(track) => {
                  handleAudio(track);
                }}
                stopTrack={() => {
                  stopTrack();
                }}
              />
            ) : null}
            {showPosts ? (
              <ProfilePostsFeed
                refresh={() => showSOTDFeed()}
                playTrack={(track) => {
                  handleAudio(track);
                }}
                stopTrack={() => {
                  stopTrack();
                }}
              />
            ) : null}
            {showRecommendations ? (
              <ProfileRecommendationsFeed
                refresh={() => showSOTDFeed()}
                playTrack={(track) => {
                  handleAudio(track);
                }}
                stopTrack={() => {
                  stopTrack();
                }}
              />
            ) : null}

            {showPlaylists ? (
              <ProfilePlaylistsFeed
                refresh={() => showSOTDFeed()}
                playTrack={(track) => {
                  handleAudio(track);
                }}
                stopTrack={() => {
                  stopTrack();
                }}
              />
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
    // alignItems: 'flex-start',
    marginRight: 64,
  },
  usernameText: {
    fontSize: 20,
    color: '#c1c8d4',
    fontWeight: '600',
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
    fontSize: 12,
    marginBottom: -5,
    fontWeight: '400',
  },

  likesSection: {
    marginLeft: 4,
  },
  likesText: {
    color: '#c1c8d4',
    fontSize: 12,
    marginBottom: -5,
    fontWeight: '400',
  },
  songOfTheDayTextActive: {
    color: '#2BAEEC',
    fontSize: 12,
    textDecorationLine: 'underline',
    fontWeight: '400',
    marginBottom: -5,
  },

  likesTextActive: {
    color: '#2BAEEC',
    fontSize: 12,
    textDecorationLine: 'underline',
    fontWeight: '400',
    marginBottom: -5,
  },
  recommendationsText: {
    color: '#c1c8d4',
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 10,
    marginBottom: -5,
  },
  recommendationsTextActive: {
    color: '#2BAEEC',
    fontSize: 12,
    textDecorationLine: 'underline',
    fontWeight: '400',
    marginBottom: -5,
    marginLeft: 10,
  },
  postsText: {
    color: '#c1c8d4',
    fontSize: 12,
    fontWeight: '400',
    marginRight: 10,
    marginBottom: -5,
  },
  postsTextActive: {
    color: '#2BAEEC',
    fontSize: 12,
    textDecorationLine: 'underline',
    fontWeight: '400',
    marginRight: 10,
    marginBottom: -5,
  },
  bio: {
    fontSize: 14,
    fontWeight: '500',
    color: '#c1c8d4',
    marginTop: 10,
    alignSelf: 'flex-start',
    marginBottom: 4,
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
  },
  joinedText: {
    color: '#a3adbf',
    fontSize: 10,
  },
});

export default ProfileScreen;
