import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, StyleSheet} from 'react-native';
import DailyMusicItem from './DailyMusicItem';
import {db} from '../../firebase/firebase';
import LinearGradient from 'react-native-linear-gradient';
import {useStateProviderValue} from '../../state/StateProvider';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

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
            backgroundColor: 'transparent',
            paddingBottom: 0,
            borderBottomLeftRadius: 0,
            // borderBottomRightRadius: 40,
            borderBottomLeftRadius: 40,
            borderColor: '#a3adbf',
            borderBottomWidth: 3,
            // borderRightWidth: 3,
            borderLeftWidth: 3,
          }}>
          {currentUserData ? (
            <>
              <View style={{flexDirection: 'row'}}>
                <FontAwesomeIcon
                  name="compact-disc"
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
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(193, 200, 212, 0.1)',
              marginTop: 6,
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
    marginTop: 10,
    fontSize: 24,
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  container: {
    // marginBottom: 30,

    backgroundColor: '#171818',
  },
  welcomeText: {
    color: '#1E8C8B',
    fontSize: 30,
    fontWeight: '800',
    marginLeft: 4,
    marginTop: 30,
  },
  nameText: {
    fontSize: 26,
    color: '#c1c8d4',
    fontWeight: '700',
    marginTop: 4,
    marginLeft: 88,
  },
  welcomeIcon: {
    color: '#1E8C8B',
    fontSize: 30,
    fontWeight: '800',
    marginLeft: 30,
    marginTop: 30,
  },
});

export default DailyMusic;
