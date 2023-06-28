"use strict";
exports.__esModule = true;
var vector_icons_1 = require("@expo/vector-icons");
var bottom_tabs_1 = require("@react-navigation/bottom-tabs");
var stack_1 = require("@react-navigation/stack");
var React = require("react");
var Colors_1 = require("../constants/Colors");
var useColorScheme_1 = require("../hooks/useColorScheme");
var AlbumScreen_1 = require("../screens/AlbumScreen");
var HomeScreen_1 = require("../screens/HomeScreen");
var TabTwoScreen_1 = require("../screens/TabTwoScreen");
var LoginScreen_1 = require("../screens/LoginScreen");
var BottomTab = bottom_tabs_1.createBottomTabNavigator();
function BottomTabNavigator() {
    var colorScheme = useColorScheme_1["default"]();
    return (React.createElement(BottomTab.Navigator, { initialRouteName: "TabOne", tabBarOptions: { activeTintColor: Colors_1["default"][colorScheme].tint } },
        React.createElement(BottomTab.Screen, { name: "Home", component: TabOneNavigator, options: {
                tabBarIcon: function (_a) {
                    var color = _a.color;
                    return (React.createElement(vector_icons_1.Entypo, { name: "home", size: 30, style: { marginBottom: -3 }, color: color }));
                }
            } }),
        React.createElement(BottomTab.Screen, { name: "Login", component: LoginScreen_1["default"], options: {
                tabBarIcon: function (_a) {
                    var color = _a.color;
                    return (React.createElement(vector_icons_1.AntDesign, { name: "login", size: 30, style: { marginBottom: -3 }, color: color }));
                }
            } }),
        React.createElement(BottomTab.Screen, { name: "Your Library", component: TabTwoNavigator, options: {
                tabBarIcon: function (_a) {
                    var color = _a.color;
                    return (React.createElement(vector_icons_1.MaterialCommunityIcons, { name: "library-music-outline", size: 30, style: { marginBottom: -3 }, color: color }));
                }
            } }),
        React.createElement(BottomTab.Screen, { name: "Premium", component: TabTwoNavigator, options: {
                tabBarIcon: function (_a) {
                    var color = _a.color;
                    return (React.createElement(vector_icons_1.FontAwesome5, { name: "spotify", size: 30, style: { marginBottom: -3 }, color: color }));
                }
            } })));
}
exports["default"] = BottomTabNavigator;
// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
var TabOneStack = stack_1.createStackNavigator();
function TabOneNavigator() {
    return (React.createElement(TabOneStack.Navigator, null,
        React.createElement(TabOneStack.Screen, { name: "TabOneScreen", component: HomeScreen_1["default"], options: { headerTitle: "Home" } }),
        React.createElement(TabOneStack.Screen, { name: "AlbumScreen", component: AlbumScreen_1["default"], options: { headerTitle: "Album" } })));
}
var TabTwoStack = stack_1.createStackNavigator();
function TabTwoNavigator() {
    return (React.createElement(TabTwoStack.Navigator, null,
        React.createElement(TabTwoStack.Screen, { name: "TabTwoScreen", component: TabTwoScreen_1["default"], options: { headerTitle: "Tab Two Title" } })));
}
