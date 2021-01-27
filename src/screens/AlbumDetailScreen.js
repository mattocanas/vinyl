import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import useResults from '../../hooks/useResults';
import axios from 'axios';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Moment from 'react-moment';
import {useNavigation} from '@react-navigation/native';

const dimensions = Dimensions.get('screen');

const AlbumDetailScreen = ({route}) => {
  const navigationUse = useNavigation();
  const {id} = route.params;

  const [data, setData] = useState('');

  useEffect(() => {
    let active = true;
    axios.get(`https://api.deezer.com/album/${id}`).then((response) => {
      setData(response.data);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {data ? (
        <View style={styles.container}>
          <Image source={{uri: data.cover_xl}} style={styles.albumArt} />
          <MaterialIcon
            onPress={() => navigationUse.goBack()}
            name="arrow-back-ios"
            color="white"
            style={{
              fontSize: 40,
              position: 'absolute',
              marginTop: 50,
              alignSelf: 'flex-start',
              marginLeft: 30,
            }}
          />
          <Image
            source={{uri: data.artist.picture_xl}}
            style={styles.artistPhoto}
          />
          <Text style={styles.titleText}>{data.title}</Text>
          <Text style={styles.artistNameText}>{data.artist.name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.genreText}>Genre:</Text>
            <Text style={styles.genreNameText}>{data.genres.data[0].name}</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
            <MaterialIcon name="album" style={styles.labelText} />
            <Text style={styles.labelNameText}>{data.label}</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
            <Text style={styles.releasedText}>Released: </Text>
            <Moment element={Text} format="LL" style={styles.dateText}>
              {data.release_date}
            </Moment>
          </View>
          <View style={styles.headerContainer}>
            <Text style={styles.tracksHeader}>Tracks</Text>
          </View>
          <FlatList
            contentContainerStyle={{alignItems: 'center', paddingBottom: 80}}
            showsVerticalScrollIndicator={false}
            style={styles.flatlist}
            data={data.tracks.data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
              <Text
                onPress={() =>
                  navigationUse.navigate('SongDetailFromAlbumScreen', {
                    id: item.id,
                  })
                }
                style={styles.songTitle}>
                {item.title}
              </Text>
            )}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    alignItems: 'center',
    paddingBottom: 30,
  },
  albumArt: {
    height: dimensions.height / 2.5,
    width: dimensions.width,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  titleText: {
    fontSize: 34,
    color: '#2BAEEC',
    fontWeight: '500',
    width: 300,
    textAlign: 'center',
    marginTop: 8,
    width: dimensions.width - 80,
  },
  artistNameText: {
    fontSize: 22,
    color: '#2BAEEC',
    fontWeight: '300',
    width: 300,
    textAlign: 'center',
    marginTop: 0,
  },
  genreText: {
    color: '#c1c8d4',
    fontSize: 16,
  },
  genreNameText: {
    fontSize: 18,
    color: '#2BAEEC',
    marginLeft: 4,
  },
  labelText: {
    fontSize: 22,
    color: '#c1c8d4',
  },
  labelNameText: {
    color: '#c1c8d4',
    fontSize: 18,
    fontWeight: '300',
    marginLeft: 4,
  },
  releasedText: {
    color: '#c1c8d4',
    fontSize: 18,
    fontWeight: '300',
  },
  dateText: {
    color: '#c1c8d4',
    fontSize: 18,
    fontWeight: '300',
    marginLeft: 2,
  },
  flatlist: {
    marginTop: 2,
    width: dimensions.width,
  },
  songTitle: {
    color: '#B8CBCC',
    fontSize: 20,
    fontWeight: '300',
    padding: 6,
    textAlign: 'center',
    width: 300,
  },
  tracksHeader: {
    fontSize: 28,
    color: '#2BAEEC',
    marginTop: 10,
    fontWeight: '300',
  },
  headerContainer: {
    width: dimensions.width,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    alignItems: 'center',
  },
  artistPhoto: {
    height: 90,
    width: 90,
    borderRadius: 60,
    marginTop: -50,
    borderColor: '#2BAEEC',
    borderWidth: 2,
  },
});

export default AlbumDetailScreen;
