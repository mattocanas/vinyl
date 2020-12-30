import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, StyleSheet} from 'react-native';
import DailyMusicItem from './DailyMusicItem';
import {db} from '../../firebase/firebase';
import LinearGradient from 'react-native-linear-gradient';

const DailyMusic = () => {
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
  }, []);

  return (
    <>
      <LinearGradient colors={['#2a2b2b', '#242525', '#242525']}>
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
              marginTop: 16,
            }}
          />
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    color: '#c1c8d4',
    textAlign: 'center',
    fontWeight: '900',
    marginTop: 14,
    fontSize: 20,
  },
  container: {
    // marginBottom: 30,
  },
});

export default DailyMusic;
