import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, StyleSheet} from 'react-native';
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
        <View
          style={{
            paddingTop: 42,
            backgroundColor: '#1E8C8B',
            paddingBottom: 36,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 46,
            borderColor: 'white',
            borderBottomWidth: 1,
            borderRightWidth: 1,
          }}>
          {currentUserData ? (
            <>
              <View style={{flexDirection: 'row'}}>
                <MaterialCommunityIcon
                  name="disc-player"
                  style={styles.welcomeIcon}
                />
                <Text style={styles.welcomeText}>Welcome, </Text>
              </View>

              <Text style={styles.nameText}>{currentUserData.name}</Text>
            </>
          ) : null}
        </View>

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
              // borderBottomWidth: 1,
              // borderBottomColor: 'rgba(193, 200, 212, 0.1)',
              marginTop: 16,
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
    marginTop: 20,
    fontSize: 24,
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  container: {
    // marginBottom: 30,

    backgroundColor: '#171818',
  },
  welcomeText: {
    color: '#171818',
    fontSize: 30,
    fontWeight: '800',
    marginLeft: 4,
    marginTop: 40,
  },
  nameText: {
    fontSize: 26,
    color: '#c1c8d4',
    fontWeight: '700',
    marginTop: 4,
    marginLeft: 80,
  },
  welcomeIcon: {
    color: '#171818',
    fontSize: 30,
    fontWeight: '800',
    marginLeft: 22,
    marginTop: 40,
  },
});

export default DailyMusic;
