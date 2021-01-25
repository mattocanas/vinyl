import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {db} from '../../firebase/firebase';
import {useStateProviderValue} from '../../state/StateProvider';
import {useNavigation} from '@react-navigation/native';

const MessageListScreen = () => {
  return (
    <View>
      <Text>Message List</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default MessageListScreen;
