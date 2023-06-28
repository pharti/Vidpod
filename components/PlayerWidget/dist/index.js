"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var vector_icons_1 = require("@expo/vector-icons");
var styles_1 = require("./styles");
var song = {
    id: '1',
    imageUri: 'https://cache.boston.com/resize/bonzai-fba/Globe_Photo/2011/04/14/1302796985_4480/539w.jpg',
    title: 'High on You',
    artist: 'Helen'
};
var PlayerWidget = function () {
    return (react_1["default"].createElement(react_native_1.View, { style: styles_1["default"].container },
        react_1["default"].createElement(react_native_1.Image, { source: { uri: song.imageUri }, style: styles_1["default"].image }),
        react_1["default"].createElement(react_native_1.View, { style: styles_1["default"].rightContainer },
            react_1["default"].createElement(react_native_1.View, { style: styles_1["default"].nameContainer },
                react_1["default"].createElement(react_native_1.Text, { style: styles_1["default"].title }, song.title),
                react_1["default"].createElement(react_native_1.Text, { style: styles_1["default"].artist }, song.artist)),
            react_1["default"].createElement(react_native_1.View, { style: styles_1["default"].iconsContainer },
                react_1["default"].createElement(vector_icons_1.AntDesign, { name: "hearto", size: 30, color: 'white' }),
                react_1["default"].createElement(vector_icons_1.FontAwesome, { name: "play", size: 30, color: 'white' })))));
};
exports["default"] = PlayerWidget;
