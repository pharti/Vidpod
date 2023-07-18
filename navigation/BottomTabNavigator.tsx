import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useScrollToTop } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useColorScheme from '../hooks/useColorScheme';
// import AlbumScreen from '../screens/AlbumScreen';
import AlbumScreen from '../screens/new/AlbumScreen';
import { Text } from 'react-native';
import EpisodeScreen from '../screens/EpisodeScreen';
import TabOneScreen from '../screens/HomeScreen';
import Feed from '../screens/new/FeedScreen';
import LibraryScreen from '../screens/new/LibraryScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import {
  BottomTabParamList,
  LibraryParamsList,
  TabOneParamList,
  TabTwoParamList,
} from '../types';

import { Platform, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import SettingsButton from '../components/SettingsButton';
import SettingsScreen from '../screens/SettingsScreen';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { setShow } from '../features/currentSongSlice';
import { userSelector } from '../features/userSlice';
import LatestEpisodesScreen from '../screens/LatestEpisodesScreen';
import CategoriesScreen from '../screens/new/CategoryScreen';
import SearchScreen from '../screens/new/SearchScreen';
import SpecialCategoryScreen from '../screens/SpecialCategoryScreen';
import MyTabBar from './bottomTabBar';
import { DonateScreen } from '../screens/new/DonateScreen';
import { MoreEpisodesScreen } from '../screens/MoreEpisodesScreen';
import { SubmitPodcastScreen } from '../screens/SubmitPodcastScreen';
import { EmailScreen } from '../screens/EmailScreen';
import { ContactUsScreen } from '../screens/ContactUsScreen';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 2,
    restSpeedThreshold: 2,
  },
};
export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const marginBottom = useSafeAreaInsets().bottom;
  const dispatch = useDispatch();
  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBar={props => <MyTabBar {...props} />}
      tabBarOptions={{
        activeTintColor: '#09B94F',
        inactiveBackgroundColor: '#1C1E22',

        activeBackgroundColor: '#1C1E22',
        labelStyle: {},
        tabStyle: {
          // flex: 1,
          // padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: Platform.OS == 'android' ? 5 : marginBottom,
          padding: 5,
        },
        iconStyle: {
          backgroundColor: 'red',
        },

        style: {
          // paddingTop: 5,
          // backgroundColor: 'yellow',
          paddingBottom: 0,
          // marginBottom: marginBottom,
          // borderTopWidth: 0,
          // paddingTop: Platform.OS == 'ios' ? 10 : 0,
          // paddingTop: Platform.OS == 'ios' ? 10 : 0,
          // : Platform.OS == 'ios' ? 25 : 5,

          // position: 'absolute',
          backgroundColor: '#1C1E22',
        },
      }}>
      <BottomTab.Screen
        name="Browse"
        component={TabOneNavigator}
        options={{
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                dispatch(setShow(true));
                props.onPress();
              }}
            />
          ),

          tabBarIcon: ({ color }) => (
            <View>
              <Entypo name="home" size={25} color={color} />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="MyFeed"
        component={FeedNavigator}
        options={{
          tabBarLabel: 'Feed',
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                {
                  dispatch(setShow(true));
                  props.onPress();
                }
              }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome name="feed" size={24} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Shows"
        component={LibaryStack}
        options={{
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                dispatch(setShow(true));
                props.onPress();
              }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="music-box-multiple-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                dispatch(setShow(true));
                props.onPress();
              }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="search"
              size={24}
              color={color}
            // style={{ padding: 10, backgroundColor: 'red' }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Donate"
        component={DonateScreen}
        options={{
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                dispatch(setShow(true));
                props.onPress();
              }}
            />
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="heart"
              size={24}
              color={color}

            // style={{ padding: 10, backgroundColor: 'red' }}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();
const transitionForPlayer = {
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};
function TabOneNavigator() {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const user = useSelector(userSelector);
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="HomeScreen"
        component={TabOneScreen}
        options={{
          headerTitle: 'Browse',

          headerRight: () => <SettingsButton />,
        }}
      />
      <TabOneStack.Screen
        name="CategoriesScreen"
        component={CategoriesScreen}
        options={(props: { route: any; navigation: any }) => {
          return { headerTitle: props.route.params.name };
        }}
      />
      <TabOneStack.Screen
        name="SpecialCategoryScreen"
        component={SpecialCategoryScreen}
        options={(props: { route: any; navigation: any }) => {
          return { headerTitle: props.route.params.term };
        }}
      />
      <TabOneStack.Screen
        name="MoreEpisodesScreen"
        component={MoreEpisodesScreen}
        options={(props: { route: any; navigation: any }) => {
          return { headerTitle: props.route.params.name };
        }}
      />
      <TabOneStack.Screen
        name="LatestEpisodesScreen"
        component={LatestEpisodesScreen}
        options={(props: { route: any; navigation: any }) => {
          return { headerTitle: 'Latest Episodes' };
        }}
      />
      <TabOneStack.Screen
        name="AlbumScreen"
        component={AlbumScreen}
        getId={({ params }) => {
          return params.id;
        }}
        options={(props: { route: any; navigation: any }) => {
          return { headerTitle: props.route.params.name };
        }}
      />
      <TabOneStack.Screen
        name="EpisodeScreen"
        component={EpisodeScreen}
        getId={({ params }) => {
          return params.id;
        }}
        options={(props: { route: any; navigation: any }) => {
          return {
            headerTitle: props.route.params.name ? props.route.params.name : '',
          };
        }}
      />

      <TabOneStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          header: () => null,
          ...transitionForPlayer,
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 250,
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 250,
              },
            },
          },
        }}
      />
      <TabOneStack.Screen
        name="SubmitPodcastScreen"
        component={SubmitPodcastScreen}
        options={(props: { route: any; navigation: any }) => {
          return { headerTitle: 'Submit a Podcast to Yidpod' };
        }}
      />
      <TabOneStack.Screen
        name="ContactUsScreen"
        component={ContactUsScreen}
        options={(props: { route: any; navigation: any }) => {
          return { headerTitle: 'Contact Us' };
        }}
      />
      <TabOneStack.Screen
        name="EmailScreen"
        component={EmailScreen}
        options={(props: { route: any; navigation: any }) => {
          return { headerTitle: '' };
        }}
      />
    </TabOneStack.Navigator>
  );
}

const FeedStack = createStackNavigator<TabTwoParamList>();

function FeedNavigator() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen
        name="FeedScreen"
        component={Feed}
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Text
              style={{
                color: 'white',
                paddingLeft: 20,
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              My Feed
            </Text>
          ),
          // headerStatusBarHeight: 100,
          // headerStyle: {
          //   zIndex: 9000,
          //   elevation: 9000,
          // },
          // headerRight: () => <FilterButton />,
        }}
      />
      <FeedStack.Screen
        name="AlbumScreen"
        component={AlbumScreen}
        options={(props: { route: any; navigation: any }) => {
          return { headerTitle: props.route.params.name };
        }}
      />
      <FeedStack.Screen
        name="EpisodeScreen"
        component={EpisodeScreen}
        getId={({ params }) => {
          return params.id;
        }}
        options={(props: { route: any; navigation: any }) => {
          return {
            headerTitle: props.route.params.name ? props.route.params.name : '',
          };
        }}
      />
    </FeedStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: 'Tab Two Title' }}
      />
    </TabTwoStack.Navigator>
  );
}
const LibraryStackNavigator = createStackNavigator<LibraryParamsList>();

function LibaryStack() {
  return (
    <LibraryStackNavigator.Navigator>
      <LibraryStackNavigator.Screen
        name="LibraryScreen"
        component={LibraryScreen}
        options={{ headerTitle: 'My Shows' }}
      />
      <LibraryStackNavigator.Screen
        name="AlbumScreen"
        component={AlbumScreen}
        options={(props: { route: any; navigation: any }) => {
          return { headerTitle: props.route.params.name };
        }}
      />
      <LibraryStackNavigator.Screen
        name="EpisodeScreen"
        component={EpisodeScreen}
        getId={({ params }) => {
          return params.id;
        }}
        options={(props: { route: any; navigation: any }) => {
          return {
            headerTitle: props.route.params.name ? props.route.params.name : '',
          };
        }}
      />
    </LibraryStackNavigator.Navigator>
  );
}
const SearchStackNavigator = createStackNavigator<LibraryParamsList>();

function SearchStack() {
  return (
    <SearchStackNavigator.Navigator>
      <SearchStackNavigator.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerTitle: 'Search', header: () => null }}
      />
      <SearchStackNavigator.Screen
        name="CategoriesScreen"
        component={CategoriesScreen}
        options={(props: { route: any; navigation: any }) => {
          return { headerTitle: props.route.params.name };
        }}
      />
      <SearchStackNavigator.Screen
        name="AlbumScreen"
        component={AlbumScreen}
        options={(props: { route: any; navigation: any }) => {
          return { headerTitle: props.route.params.name };
        }}
      />
      <SearchStackNavigator.Screen
        name="EpisodeScreen"
        component={EpisodeScreen}
        getId={({ params }) => {
          return params.id;
        }}
        options={(props: { route: any; navigation: any }) => {
          return {
            headerTitle: props.route.params.name ? props.route.params.name : '',
          };
        }}
      />
    </SearchStackNavigator.Navigator>
  );
}
