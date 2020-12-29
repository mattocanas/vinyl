import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import {StateProvider} from './state/StateProvider';
import reducer, {initialState} from './state/reducer';
import {NavigationContainer} from '@react-navigation/native';

//screens
import HomeScreen from './src/screens/HomeScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import SignupScreen from './src/screens/SignupScreen';
import SigninScreen from './src/screens/SigninScreen';
import PasswordResetScreen from './src/screens/PasswordResetScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import ProfileFollowingListScreen from './src/screens/ProfileFollowingListScreen';
import ProfileFollowerListScreen from './src/screens/ProfileFollowerListScreen';
import UserDetailScreen from './src/screens/UserDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SongDetailScreen from './src/screens/SongDetailScreen';
import PostFormScreen from './src/screens/PostFormScreen';
import LikeListScreen from './src/screens/LikeListScreen';
import UserFollowingListScreen from './src/screens/UserFollowingListScreen';
import UserFollowerListScreen from './src/screens/UserFollowerListScreen';
import ArtistDetailScreen from './src/screens/ArtistDetailScreen';
import FeedUserDetailScreen from './src/screens/FeedUserDetailScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import DeleteAccountConfirmationScreen from './src/screens/DeleteAccountConfirmationScreen';
import PostDetailScreen from './src/screens/PostDetailScreen';
import ReportPostScreen from './src/screens/ReportPostScreen';
import UserSettingsScreen from './src/screens/UserSettingsScreen';

//icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import OcticonIcon from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// create bottom nav bar
const Tabs = createMaterialBottomTabNavigator();

function MyBottomTabs() {
  return (
    <Tabs.Navigator
      barStyle={{backgroundColor: '#1E1C1C', shadowRadius: 0}}
      activeColor="#1E8C8B"
      inactiveColor="#c1c8d4"
      initialRouteName="Home">
      <Tabs.Screen
        options={{
          tabBarLabel: '',
          tabBarColor: '#1E1C1C',
          tabBarIcon: ({color}) => (
            <MaterialIcon name="album" size={26} color={color} />
          ),
        }}
        name="HomeScreen"
        component={HomeScreen}
      />

      <Tabs.Screen
        options={{
          tabBarLabel: '',
          tabBarColor: '#1E1C1C',
          tabBarIcon: ({color}) => (
            <OcticonIcon name="telescope" size={26} color={color} />
          ),
        }}
        name="SearchScreen"
        component={SearchScreen}
      />

      <Tabs.Screen
        options={{
          tabBarLabel: '',
          tabBarColor: '#1E1C1C',
          tabBarIcon: ({color}) => (
            <MaterialIcon name="search" size={26} color={color} />
          ),
        }}
        name="ExploreScreen"
        component={ExploreScreen}
      />
      <Tabs.Screen
        options={{
          tabBarLabel: '',

          tabBarColor: '#1E1C1C',
          tabBarIcon: ({color}) => (
            <MaterialIcon name="account-circle" size={26} color={color} />
          ),
        }}
        name="ProfileScreen"
        component={ProfileScreen}
      />
    </Tabs.Navigator>
  );
}

// screens not auth and not on tab bar
const MainStack = createStackNavigator();

function myMainStack() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="vinyl"
        component={MyBottomTabs}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="UserDetailScreen"
        component={UserDetailScreen}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="SettingsScreen"
        component={SettingsScreen}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="UserSettingsScreen"
        component={UserSettingsScreen}
      />
      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="ProfileFollowingListScreen"
        component={ProfileFollowingListScreen}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="ProfileFollowerListScreen"
        component={ProfileFollowerListScreen}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="EditProfileScreen"
        component={EditProfileScreen}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="DeleteAccountConfirmationScreen"
        component={DeleteAccountConfirmationScreen}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="SongDetailScreen"
        component={SongDetailScreen}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="PostDetailScreen"
        component={PostDetailScreen}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="PostFormScreen"
        component={PostFormScreen}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="LikeListScreen"
        component={LikeListScreen}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="ReportPostScreen"
        component={ReportPostScreen}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="UserFollowingListScreen"
        component={UserFollowingListScreen}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="UserFollowerListScreen"
        component={UserFollowerListScreen}
      />

      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="ArtistDetailScreen"
        component={ArtistDetailScreen}
      />
      <MainStack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1E1C1C',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            color: '#c1c8d4',
            fontSize: 30,
            fontWeight: '700',
          },
          title: 'vinyl',
          headerTintColor: '#c1c8d4',
          headerBackTitleVisible: false,
        }}
        name="FeedUserDetailScreen"
        component={FeedUserDetailScreen}
      />
    </MainStack.Navigator>
  );
}

//stack for authorization
const AuthStack = createStackNavigator();

function myAuthStack() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Signin"
        options={{
          // headerStyle: {
          //   backgroundColor: "#1E1C1C",
          //   borderBottomWidth: 0,
          // },
          // headerTitleStyle: {
          //   color: "#c1c8d4",
          // },
          headerShown: false,
        }}
        tabBarLabel="listen"
        component={SigninScreen}
      />
      <AuthStack.Screen
        name="Signup"
        options={{
          // headerStyle: {
          //   backgroundColor: "#1E1C1C",
          //   borderBottomWidth: 0,
          // },
          // headerTitleStyle: {
          //   color: "#c1c8d4",
          // },
          headerShown: false,
        }}
        tabBarLabel="listen"
        component={SignupScreen}
      />

      <AuthStack.Screen
        name="PasswordResetScreen"
        options={{
          headerStyle: {
            backgroundColor: '#1E1C1C',
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            color: '#c1c8d4',
          },
        }}
        tabBarLabel="listen"
        component={PasswordResetScreen}
      />
    </AuthStack.Navigator>
  );
}

const switchNavigator = createSwitchNavigator(
  {
    Loading: LoadingScreen,
    App: myMainStack,
    Auth: myAuthStack,
  },
  {
    initialRouteName: 'Loading',
  },
);

//create the app
const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </StateProvider>
  );
};
