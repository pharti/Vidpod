"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var styles_1 = require("./styles");
var native_1 = require("@react-navigation/native");
var AlbumComponent = function (props) {
    var onPress = function () {
        navigation.navigate('AlbumScreen', { id: props.album.id, title: props.album.artistsHeadline });
        console.warn("Album Pressed : " + props.album.artistsHeadline);
    };
    var navigation = native_1.useNavigation();
    return (react_1["default"].createElement(react_native_1.TouchableWithoutFeedback, { onPress: onPress },
        react_1["default"].createElement(react_native_1.View, { style: styles_1["default"].container },
            react_1["default"].createElement(react_native_1.Image, { source: { uri: props.album.imageUri }, style: styles_1["default"].image }),
            react_1["default"].createElement(react_native_1.Text, { style: styles_1["default"].text }, props.album.artistsHeadline))));
};
exports["default"] = AlbumComponent;
