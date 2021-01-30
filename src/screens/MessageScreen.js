import React, {useState, useEffect} from 'react';
import {View, FlatList, TouchableOpacity, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import {useNavigation} from '@react-navigation/native';
import Moment from 'react-moment';
import Sound from 'react-native-sound';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const MessageScreen = ({route}) => {
  const {id} = route.params;
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const [docIdArray, setDocIdArray] = useState([]);
  const [messages, setMessages] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [song, setSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const navigationUse = useNavigation();

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  useEffect(() => {
    let active = true;
    getMessages();
    console.log(messages);
    return () => {
      active = false;
    };
  }, [refresh]);

  const getMessages = () => {
    // let idArray = [];
    // db.collection('users')
    //   .doc(currentUser.uid)
    //   .collection('messages')
    //   .get()
    //   .then((snapshot) => {
    //     snapshot.forEach((doc) => {
    //       idArray.push(doc.id);
    //     });
    //     setDocIdArray(idArray);
    //     docIdArray.map((id) => {
    //       let messageArray = [];

    //     });
    let messageArray = [];
    db.collection('users')
      .doc(currentUser.uid)
      .collection('messages')
      .doc(id)
      .collection('message')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          messageArray.push(doc.data());
        });
        setMessages(
          messageArray.sort((a, b) => {
            let a_date = new Date(a.preciseDate.toDate());
            let b_date = new Date(b.preciseDate.toDate());
            return b_date - a_date;
          }),
        );
      });
    reload();
  };

  const reload = () => {
    setRefresh(true);
  };

  const handleAudio = (url) => {
    track = new Sound(url, null, (e) => {
      if (e) {
        console.log('error', e);
      } else {
        setSong(track);
        track.play();
        setPlaying(true);
      }
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40, paddingLeft: 10}}
        data={messages}
        keyExtractor={(item) => item.messageId}
        renderItem={({item}) => (
          <View style={{marginTop: 10}}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  navigationUse.navigate('FeedUserDetailScreen', {
                    data: item.senderId,
                  });
                }}>
                <FastImage
                  style={styles.profilePicture}
                  source={{
                    uri: item.senderProfilePicture,
                    priority: FastImage.priority.normal,
                  }}
                  // resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>

              <Text style={styles.username}>{item.senderUsername} </Text>
              <Text style={{fontSize: 8, marginLeft: 4, alignSelf: 'center'}}>
                ⚪️
              </Text>
              <Moment element={Text} format="LL" style={styles.dateText}>
                {item.preciseDate.toDate()}
              </Moment>
            </View>
            <Text style={styles.message}>{item.message}</Text>
            <FastImage
              style={styles.albumArt}
              source={{
                uri: item.albumArt,
                priority: FastImage.priority.normal,
              }}
              // resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.artistText}>{item.artist}</Text>
            {playing ? (
              <IonIcon
                name="stop"
                style={styles.stopIcon}
                onPress={() => {
                  ReactNativeHapticFeedback.trigger(
                    'notificationWarning',
                    options,
                  );
                  song.stop();
                  setPlaying(false);
                }}
              />
            ) : (
              <IonIcon
                name="play"
                style={styles.playIcon}
                onPress={() => {
                  ReactNativeHapticFeedback.trigger(
                    'notificationSuccess',
                    options,
                  );
                  handleAudio(item.audio);
                }}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
  },
  profilePicture: {
    height: 34,
    width: 34,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2BAEEC',
  },
  username: {
    color: '#c1c8d4',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 10,
    alignSelf: 'center',
  },
  albumArt: {
    height: 220,
    width: 220,
    borderRadius: 8,
    marginLeft: 0,
    marginTop: 20,
    alignSelf: 'center',
    // marginRight: 6,
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
    alignSelf: 'center',

    marginLeft: 10,
  },
  titleText: {
    color: '#2BAEEC',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 14,
    marginTop: 10,
    width: 156,
    textAlign: 'center',
    alignSelf: 'center',
  },
  artistText: {
    color: '#a3adbf',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 14,
    marginTop: 4,
    width: 156,
    textAlign: 'center',
    alignSelf: 'center',
  },
  message: {
    fontSize: 18,
    color: '#c1c8d4',
    marginTop: 12,
    marginLeft: 10,
    marginRight: 20,
    fontWeight: '400',
    alignSelf: 'center',
  },
  stopIcon: {
    fontSize: 36,
    marginTop: 6,
    marginLeft: 8,
    color: '#a3adbf',
    alignSelf: 'center',
  },
  playIcon: {
    fontSize: 36,
    marginTop: 6,
    marginLeft: 14,
    color: '#a3adbf',
    alignSelf: 'center',
  },
});

export default MessageScreen;
