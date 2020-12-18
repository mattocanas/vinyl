import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Sound from 'react-native-sound';
import ProfilePicture from '../components/ProfilePicture';
import {useStateProviderValue} from '../../state/StateProvider';

const ProfileScreen = ({navigation}) => {
  const [refresh, setRefresh] = useState(false);
  const [
    {currentUser, currentUserPictureURI},
    dispatch,
  ] = useStateProviderValue();

  const refreshScreen = () => {
    setRefresh(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileInfoContainer}>
        <View style={styles.photoNameContainer}>
          <ProfilePicture refresh={() => refreshScreen()} />
          <Text style={styles.usernameText}>{currentUser.displayName}</Text>
        </View>

        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.followingContainer}>
              <Text style={styles.followingNumber}>100</Text>

              <Text style={styles.followingText}>Following</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.followersContainer}>
              <Text style={styles.followersNumber}>100</Text>

              <Text style={styles.followersText}>Followers</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingsText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242525',
    alignItems: 'flex-start',
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 40,
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
});

export default ProfileScreen;
