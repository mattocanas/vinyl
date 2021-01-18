import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const dimensions = Dimensions.get('screen');

const Notification = ({data}) => {
  const navigationUse = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 40,
        paddingBottom: 10,
        alignItems: 'center',
        marginLeft: 0,
        // borderBottomColor: 'white',
        // borderBottomWidth: StyleSheet.hairlineWidth,
        width: dimensions.width - 40,
      }}>
      {data.type == 'comment' ? (
        <IonIcon name="chatbubble-outline" style={styles.commentIcon} />
      ) : null}
      {data.type == 'follow' ? (
        <MaterialIcon name="person-add" style={styles.commentIcon} />
      ) : null}
      {data.type == 'like' ? (
        <AntIcon name="heart" style={styles.likeButton} />
      ) : null}
      <TouchableOpacity
        onPress={() =>
          navigationUse.navigate('FeedUserDetailScreen', {data: data.likedBy})
        }>
        {data.type == 'like' ? (
          <FastImage
            style={styles.profilePicture}
            source={{
              uri: data.likedByProfilePicture,
              priority: FastImage.priority.normal,
            }}
            // resizeMode={FastImage.resizeMode.contain}
          />
        ) : null}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigationUse.navigate('FeedUserDetailScreen', {
            data: data.followedBy,
          })
        }>
        {data.type == 'follow' ? (
          <FastImage
            style={styles.profilePicture}
            source={{
              uri: data.followedByProfilePicture,
              priority: FastImage.priority.normal,
            }}
            // resizeMode={FastImage.resizeMode.contain}
          />
        ) : null}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigationUse.navigate('FeedUserDetailScreen', {data: data.commentBy})
        }>
        {data.type == 'comment' ? (
          <FastImage
            style={styles.profilePicture}
            source={{
              uri: data.commentByProfilePicture,
              priority: FastImage.priority.normal,
            }}
            // resizeMode={FastImage.resizeMode.contain}
          />
        ) : null}
      </TouchableOpacity>

      {data.type == 'like' ? (
        <>
          <Text style={styles.username}>{data.likedByUsername}</Text>
          <Text style={styles.likedText}>liked your post.</Text>
        </>
      ) : null}

      {data.type == 'follow' ? (
        <>
          <Text style={styles.username}>{data.followedByUsername}</Text>
          <Text style={styles.likedText}>followed you.</Text>
        </>
      ) : null}

      {data.type == 'comment' ? (
        <>
          <Text style={styles.usernameComment}>{data.commentByUsername}</Text>
          <View style={{alignSelf: 'flex-start'}}>
            <Text style={styles.likedText}>commented on your post:</Text>
            <Text style={styles.commentText}>{data.comment}</Text>
          </View>
        </>
      ) : null}
      {data.type != 'follow' ? (
        <TouchableOpacity
          onPress={() =>
            navigationUse.navigate('PostDetailScreen', {
              title: data.postData.title,
              artist: data.postData.artist,
              audio: data.postData.audio,
              albumArt: data.postData.albumArt,
              profilePictureUrl: data.postData.profilePictureUrl,
              uid: data.postData.uid,
              username: data.postData.username,
              date: data.postData.date,
              //   likesNumber,
              likes: data.postData.likes,
              comments: data.postData.comments,
              type: data.postData.type,
              description: data.postData.description,
              albumId: data.postData.albumId,
              albumName: data.postData.albumName,
              albumTracklist: data.postData.albumTracklist,
              artistId: data.postData.artistId,
              artistTracklist: data.postData.artistTracklist,
              trackId: data.postData.trackId,
              navigateBackTo: 'NotificationsScreen',
              docId: data.postData.docId,
              verified: data.postData.verified,
            })
          }>
          <FastImage
            style={styles.albumArt}
            source={{
              uri: data.postData.albumArt,
              priority: FastImage.priority.normal,
            }}
            // resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  profilePicture: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 6,
  },
  albumArt: {
    height: 40,
    width: 40,
    borderRadius: 6,
    marginLeft: 6,
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
    color: '#c1c8d4',
  },
  usernameComment: {
    fontSize: 14,
    fontWeight: '700',
    color: '#c1c8d4',
    alignSelf: 'flex-start',
  },
  likedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#c1c8d4',
    marginLeft: 4,
  },
  likeButton: {
    color: '#1E8C8B',
    fontSize: 30,
    marginRight: 10,
  },
  commentText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#c1c8d4',
    width: 200,
  },
  commentIcon: {
    fontSize: 30,
    color: '#1E8C8B',
    marginRight: 10,
  },
});

export default Notification;
