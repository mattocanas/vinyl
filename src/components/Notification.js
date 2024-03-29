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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const dimensions = Dimensions.get('screen');

const Notification = ({data}) => {
  const navigationUse = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 20,
        paddingBottom: 10,
        alignItems: 'center',

        // borderBottomColor: 'white',
        // borderBottomWidth: StyleSheet.hairlineWidth,
        // width: dimensions.width - 40,
        width: dimensions.width - 30,
      }}>
      {data.type == 'comment' ? (
        <IonIcon name="chatbubble-outline" style={styles.commentIcon} />
      ) : null}
      {data.type == 'reply' ? (
        <FontAwesomeIcon name="reply" style={styles.commentIcon} />
      ) : null}
      {data.type == 'message' ? (
        <IonIcon name="paper-plane" style={styles.commentIcon} />
      ) : null}
      {data.type == 'follow' ? (
        <MaterialIcon name="person-add" style={styles.commentIcon} />
      ) : null}
      {data.type == 'like' ? (
        <AntIcon name="heart" style={styles.likeButton} />
      ) : null}
      {data.type == 'recommendationFulfilled' ? (
        <FontAwesomeIcon name="star" style={styles.commentIcon} />
      ) : null}
      {data.type == 'playlistAdd' ? (
        <MaterialIcon name="playlist-add" style={styles.commentIcon} />
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
          navigationUse.navigate('FeedUserDetailScreen', {
            data: data.followedBy,
          })
        }>
        {data.type == 'reply' ? (
          <FastImage
            style={styles.profilePicture}
            source={{
              uri: data.replyByProfilePicture,
              priority: FastImage.priority.normal,
            }}
            // resizeMode={FastImage.resizeMode.contain}
          />
        ) : null}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigationUse.navigate('FeedUserDetailScreen', {
            data: data.addedBy,
          })
        }>
        {data.type == 'playlistAdd' ? (
          <FastImage
            style={styles.profilePicture}
            source={{
              uri: data.addedByProfilePicture,
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

      <TouchableOpacity
        onPress={() =>
          navigationUse.navigate('FeedUserDetailScreen', {
            data: data.fulfilledBy,
          })
        }>
        {data.type == 'recommendationFulfilled' ? (
          <FastImage
            style={styles.profilePicture}
            source={{
              uri: data.fulfilledByProfilePicture,
              priority: FastImage.priority.normal,
            }}
            // resizeMode={FastImage.resizeMode.contain}
          />
        ) : null}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigationUse.navigate('FeedUserDetailScreen', {
            data: data.messageFrom,
          })
        }>
        {data.type == 'message' ? (
          <FastImage
            style={styles.profilePicture}
            source={{
              uri: data.messageFromProfilePicture,
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
      {data.type == 'message' ? (
        <>
          <Text style={styles.username}>{data.messageFromUsername}</Text>
          <Text style={styles.likedText}> sent you a song.</Text>
        </>
      ) : null}

      {data.type == 'follow' ? (
        <>
          <Text style={styles.username}>{data.followedByUsername}</Text>
          <Text style={styles.likedText}>followed you.</Text>
        </>
      ) : null}

      {data.type == 'playlistAdd' ? (
        <>
          <Text style={styles.username}>{data.addedByUsername}</Text>
          <Text style={styles.likedText}>added to your playlist.</Text>
        </>
      ) : null}

      {data.type == 'comment' ? (
        <>
          <Text style={styles.usernameComment}>{data.commentByUsername}</Text>
          <View style={{alignSelf: 'flex-start'}}>
            <Text style={styles.commentIntroText}>commented on your post:</Text>
            <Text style={styles.commentText}>{data.comment}</Text>
          </View>
        </>
      ) : null}

      {data.type == 'reply' ? (
        <>
          <Text style={styles.usernameComment}>{data.replyByUsername}</Text>
          <View style={{alignSelf: 'flex-start'}}>
            <Text style={styles.commentIntroText}>
              replied to your comment:
            </Text>
            <Text style={styles.commentText}>{data.comment}</Text>
          </View>
        </>
      ) : null}

      {data.type == 'recommendationFulfilled' ? (
        <>
          <Text style={styles.username}>{data.fulfilledByUsername}</Text>

          <Text style={styles.likedText}>recommended a song to you!</Text>
        </>
      ) : null}

      {data.postData ? (
        <>
          {data.postData.title != '' &&
          (data.postData.type == 'Song of the Day.' ||
            data.postData.type == 'Post') ? (
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
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  profilePicture: {
    height: 30,
    width: 30,
    borderRadius: 20,
    marginRight: 6,
  },
  albumArt: {
    height: 40,
    width: 40,
    borderRadius: 6,
    marginLeft: 4,
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
    color: '#2BAEEC',
    fontSize: 22,
    marginRight: 10,
  },
  commentText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#c1c8d4',
    width: 190,
  },
  commentIcon: {
    fontSize: 22,
    color: '#2BAEEC',
    marginRight: 6,
  },
  commentIntroText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#c1c8d4',
    marginLeft: 4,
  },
});

export default Notification;
