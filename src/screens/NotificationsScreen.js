import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useStateProviderValue} from '../../state/StateProvider';
import {db} from '../../firebase/firebase';
import Notification from '../components/Notification';

const NotificationsScreen = () => {
  const [
    {currentUser, currentUserPictureURI, currentUserData},
    dispatch,
  ] = useStateProviderValue();
  const [data, setData] = useState([]);
  const [refreshController, setRefreshController] = useState(false);

  useEffect(() => {
    let active = true;
    load();
    return () => {
      active = false;
    };
  }, []);

  const refreshComponent = () => {
    setRefreshController(true);
    load();
  };

  const load = () => {
    getNotifications();
    setRefreshController(false);
  };

  const getNotifications = () => {
    let dataArray = [];
    db.collection('users')
      .doc(currentUser.uid)
      .collection('notifications')
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
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshController}
              onRefresh={refreshComponent}
              title="Pull for new notifications."
              titleColor="#1E8C8B"
              tintColor="#1E8C8B"
            />
          }
          data={data}
          keyExtractor={(item) => item.notificationId}
          renderItem={({item}) => <Notification data={item} />}
        />
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
