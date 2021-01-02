import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useStateProviderValue} from '../../state/StateProvider';
import {auth, db} from '../../firebase/firebase';
import {useNavigation} from '@react-navigation/native';
import firebase from 'firebase';

const ReportPostScreen = ({route}) => {
  const {
    title,
    artist,
    audio,
    albumArt,
    profilePictureUrl,
    uid,
    username,
    date,
    likes,
    comments,
    type,
    description,
    docId,
  } = route.params;
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const navigation = useNavigation();
  const [reported, setReported] = useState(false);

  useEffect(() => {
    let active = true;
    checkIfReported();
    console.log(reported);
    return () => {
      active = false;
    };
  }, [reported]);

  const onReport = () => {
    const newDocRef = db.collection('reports').doc();

    newDocRef
      .set({
        reportId: newDocRef.id,
        reportedBy: currentUser.uid,
        title,
        artist,
        audio,
        albumArt,
        profilePictureUrl,
        uid,
        username,
        date,
        likes,
        comments,
        type,
        description,
        docId,
      })
      .then(() => {
        navigation.navigate('HomeScreen');
      });
  };

  const checkIfReported = () => {
    db.collection('reports')
      .where('reportedBy', '==', currentUser.uid)
      .where('docId', '==', docId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().docId == docId) {
            setReported(true);
          } else {
            setReported(false);
          }
        });
      });
  };

  return (
    <View style={styles.container}>
      {reported ? (
        <Text style={styles.reportedText}>
          You have already reported this post, and it is currently under review.
        </Text>
      ) : (
        <>
          <Text style={styles.labelText}>
            Report this post to Vinyl for review?
          </Text>
          <View style={{marginTop: 40}}>
            <TouchableOpacity
              style={styles.noButton}
              onPress={() => navigation.navigate('ProfileScreen')}>
              <Text>No, this post can stay.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.yesButton} onPress={onReport}>
              <Text>Yes, this post must go.</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a2b2b',
    alignItems: 'center',
  },

  labelText: {
    color: '#1E8C8B',
    fontSize: 18,
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
  },
  noButton: {
    backgroundColor: '#1E8C8B',
    color: '#242525',
    padding: 10,

    borderRadius: 30,

    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: '#c43b4c',
    color: '#242525',
    padding: 10,
    marginTop: 40,
    borderRadius: 30,

    alignItems: 'center',
  },
  reportedText: {
    color: '#c1c8d4',
    textAlign: 'center',
    fontSize: 24,
    marginTop: 20,
    padding: 10,
  },
});

export default ReportPostScreen;
