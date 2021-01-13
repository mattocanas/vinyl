import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
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

const CommentsScreen = ({route}) => {
  const [text, setText] = useState('');
  const {docId, uid} = route.params;
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [{currentUser, currentUserData}, dispatch] = useStateProviderValue();
  const navigationUse = useNavigation();

  useEffect(() => {
    let active = true;

    if (docId !== postId) {
      db.collection('users')
        .doc(uid)
        .collection('posts')
        .doc(docId)
        .collection('comments')
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

    return () => {
      active = false;
    };
  }, [postId]);

  const onCommentPost = () => {
    let newCommentRef = db
      .collection('users')
      .doc(uid)
      .collection('posts')
      .doc(docId)
      .collection('comments')
      .doc();

    newCommentRef
      .set({
        commentId: newCommentRef.id,
        creator: currentUser.uid,
        comment: text,
        date: new Date().toDateString(),
      })
      .then(() => navigationUse.goBack());
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: 'white',
          alignSelf: 'center',
          marginTop: 20,
          fontSize: 20,
        }}>
        Coming soon... :)
      </Text>
      {/* <View>
        <FlatList
          data={comments}
          renderItem={({item}) => (
            <View
              style={{
                alignItems: 'flex-start',
                marginTop: 30,
                paddingLeft: 20,
              }}>
              <Comment
                uid={item.creator}
                commentText={item.comment}
                commentId={item.commentId}
              />
            </View>
          )}
        />
      </View>

      <IonIcon
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
    color: '#1E8C8B',
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  commentIcon: {
    fontSize: 24,
    color: '#c1c8d4',
    marginLeft: 30,
    marginTop: 20,
  },
});

export default CommentsScreen;
