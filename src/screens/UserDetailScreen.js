import React from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {useStateProviderValue} from '../../state/StateProvider';

const UserDetailScreen = ({route}) => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const {data} = route.params;
  return (
    <View style={styles.container}>
      <View style={styles.profileInfoContainer}>
        <View style={styles.photoNameContainer}>
          <Image
            style={styles.profilePicture}
            source={{uri: data.profilePictureUrl}}
          />
          <Text style={styles.usernameText}>{data.username}</Text>
        </View>

        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={styles.followingContainer}>
              <Text style={styles.followingNumber}>
                {data.followingIdList.length.toString()}
              </Text>

              <Text style={styles.followingText}>Following</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.followersContainer}>
              <Text style={styles.followersNumber}>
                {data.followerIdList.length.toString()}
              </Text>

              <Text style={styles.followersText}>Followers</Text>
            </TouchableOpacity>
          </View>
          {currentUserData.followingIdList.includes(data.uid) ? (
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>Following</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          )}
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
});

export default UserDetailScreen;
