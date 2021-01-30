import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FlatList} from 'react-native-gesture-handler';
import Comment from '../components/Comment';
import FastImage from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';

const dimensions = Dimensions.get('screen');

const CommentsScreen = ({docId, uid}) => {
  const [text, setText] = useState('');
  // const {docId, uid} = route.params;
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [{currentUser, currentUserData}, dispatch] = useStateProviderValue();
  const navigationUse = useNavigation();

  useEffect(() => {
    let active = true;

    return () => {
      active = false;
    };
  }, [postId]);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      if (docId !== postId) {
        db.collection('users')
          .doc(uid)
          .collection('posts')
          .doc(docId)
          .collection('comments')
          .orderBy('date', 'desc')
          .get()
          .then((snapshot) => {
            let comments = snapshot.docs.map((doc) => {
              const data = doc.data();
              const id = doc.id;
              return {id, ...data};
            });
            setComments(comments);
          });
        setPostId(docId);
        setRefresh(false);
      }

      return () => (active = false);
    }, []),
  );

  const navigateBack = () => {
    navigationUse.goBack();
  };

  return (
    <View style={styles.container}>
      {/* <Text
        style={{
          color: 'white',
          alignSelf: 'center',
          marginTop: 20,
          fontSize: 20,
        }}>
        Coming soon... :)
      </Text> */}
      <View>
        {comments[0] != null ? (
          <FlatList
            data={comments}
            contentContainerStyle={{paddingBottom: 30}}
            renderItem={({item}) => (
              <View
                style={{
                  alignItems: 'flex-start',
                  marginTop: 20,
                  // paddingLeft: 20,
                }}>
                <Comment
                  uid={item.creator}
                  commentText={item.comment}
                  commentId={item.commentId}
                  postOwner={item.postOwner}
                  postId={item.postId}
                  postData={item.postData}
                  nav={() => navigateBack()}
                />
              </View>
            )}
          />
        ) : (
          // <Text style={styles.DNEText}>Be the first to comment!</Text>
          <Text></Text>
        )}
      </View>

      {/* <IonIcon
        name="chatbubble-outline"
        style={styles.commentIcon}
        onPress={() =>
          navigationUse.navigate('PostCommentScreen', {uid: uid, docId: docId})
        }
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    borderTopColor: 'rgba(193, 200, 212, 0.2)',
    borderTopWidth: 1,
    marginTop: 8,
    width: dimensions.width,
    marginBottom: 40,
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    width: 400,
    // marginTop: 440,
    color: 'white',
    position: 'absolute',
  },
  postButton: {
    fontSize: 16,
    color: '#2BAEEC',
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  commentIcon: {
    fontSize: 30,
    color: '#2BAEEC',
    marginLeft: 20,
    marginTop: 30,
  },
  DNEText: {
    color: '#c1c8d4',
    alignSelf: 'center',
    fontSize: 24,
    marginTop: 20,
  },
});

export default CommentsScreen;
