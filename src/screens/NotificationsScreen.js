import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import Notification from '../components/Notification';
import IonIcon from 'react-native-vector-icons/Ionicons';

const NotificationsScreen = () => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const [data, setData] = useState([]);
  const [refreshController, setRefreshController] = useState(false);
  const [limitNumber, setLimitNumber] = useState(10);

  useEffect(() => {
    let active = true;

    load();

    return () => {
      active = false;
    };
  }, [limitNumber]);

  const refreshComponent = () => {
    setRefreshController(true);
    load();
  };

  const load = () => {
    getNotifications();
    setRefreshController(false);
  };

  const handleLoadMore = () => {
    setLimitNumber(limitNumber + 10);
    load();
  };

  const getNotifications = () => {
    let dataArray = [];
    db.collection('users')
      .doc(currentUser.uid)
      .collection('notifications')
      .orderBy('preciseDate', 'desc')
      .limit(limitNumber)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          dataArray.push(doc.data());
          setRefreshController(false);
        });
        if (dataArray.length >= 3) {
          setData(
            dataArray.sort((a, b) => {
              let a_date = new Date(a.preciseDate.toDate());
              let b_date = new Date(b.preciseDate.toDate());
              return b_date - a_date;
            }),
          );
        } else {
          setData(dataArray);
        }
      });
  };

  return (
    <View style={styles.container}>
      {data[0] != null ? (
        <>
          <View style={{flexDirection: 'row'}}>
            <IonIcon
              name="notifications"
              size={30}
              color="#2BAEEC"
              style={{marginTop: 42, marginLeft: 4, marginRight: 4}}
            />
            <Text
              style={{
                fontSize: 30,
                color: '#c1c8d4',
                marginTop: 40,
                marginBottom: 10,
              }}>
              Notifications
            </Text>
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshController}
                onRefresh={refreshComponent}
                title="Pull for new notifications."
                titleColor="#2BAEEC"
                tintColor="#2BAEEC"
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0}
            data={data}
            keyExtractor={(item) => item.notificationId}
            renderItem={({item}) => <Notification data={item} />}
          />
        </>
      ) : (
        <Text
          style={{
            alignSelf: 'center',
            marginTop: 60,
            fontSize: 20,
            color: '#c1c8d4',
          }}>
          You're all caught up!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171818',
    alignItems: 'flex-start',
    paddingTop: 30,
    paddingLeft: 10,
  },
});

export default NotificationsScreen;
