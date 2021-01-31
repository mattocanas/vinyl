import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, StyleSheet, Animated} from 'react-native';
import DailyMusicItem from './DailyMusicItem';
import {db} from '../../firebase/firebase';
import LinearGradient from 'react-native-linear-gradient';
import {useStateProviderValue} from '../../state/StateProvider';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const DailyMusic = () => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const [dailyMusicData, setDailyMusicData] = useState([]);
  useEffect(() => {
    let active = true;
    db.collection('DailyMusic')
      .where('date', '==', new Date().toDateString())
      .get()
      .then((snapshot) => {
        setDailyMusicData(snapshot.docs.map((doc) => doc.data()));
      });
    console.log(dailyMusicData);
    return () => {
      active = false;
    };
  }, [currentUserData]);

  return (
    <>
      <View>
        <View style={styles.container}>
          <Text style={styles.pageTitle}>Today in music</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={dailyMusicData}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <DailyMusicItem
                title={item.title}
                artist={item.artist}
                description={item.description}
                albumArt={item.albumArt}
                likes={item.likes}
                audio={item.audio}
                date={item.date}
                id={item.id}
              />
            )}
          />
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(193, 200, 212, 0.1)',
              marginTop: 10,
            }}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    color: '#c1c8d4',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 70,
    fontSize: 24,
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  container: {
    // marginBottom: 30,
    // paddingBottom: 10,
    backgroundColor: '#171818',
  },
});

export default DailyMusic;
