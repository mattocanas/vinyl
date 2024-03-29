import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {db, storage, auth} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import FastImage from 'react-native-fast-image';

const ProfilePicture = ({refresh}) => {
  useEffect(() => {
    db.collection('users')
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        const data = doc.data();
        dispatch({
          type: 'SET_CURRENTUSERPICTUREURI',
          currentUserPictureURI: data.profilePictureUrl,
        });
      });
  }, []);
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  let url;

  const setUserProfilePicture = (imageUrl) => {
    db.collection('users')
      .doc(currentUser.uid)
      .update({
        profilePictureUrl: imageUrl,
      })
      .then(() => {
        refresh();
      });
  };

  const changeImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
    }).then((image) => {
      console.log(image);
      url = image.sourceURL;
      uploadFile();
    });
  };

  const uploadFile = async () => {
    const file = await uriToBlob(url);
    storage
      .ref(`profilePictures/${currentUser.uid}.png`)
      .put(file)
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((imageUrl) => (url = imageUrl))
      .then((imageUrl) => setUserProfilePicture(imageUrl))
      .catch((error) => {
        console.log(error);
      });
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        reject(new Error('Error on upload image'));
      };

      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  return (
    <View style={styles.container}>
      {currentUser ? (
        <>
          <TouchableOpacity
            style={styles.editProfilePicture}
            onPress={changeImage}>
            <FastImage
              style={styles.profilePicture}
              source={{
                uri: currentUserPictureURI,
                priority: FastImage.priority.normal,
              }}
              // resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 75,
    borderColor: '#2BAEEC',
    borderWidth: 1,
  },
  // editProfilePicture: {
  //   marginTop: 40,
  // },
});

export default ProfilePicture;
