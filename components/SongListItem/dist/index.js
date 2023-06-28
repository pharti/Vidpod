"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var styles_1 = require("./styles");
var SongListItem = function (props) {
    var song = props.song;
    return (react_1["default"].createElement(react_native_1.View, { style: styles_1["default"].container },
        react_1["default"].createElement(react_native_1.Image, { source: { uri: song.imageUri }, style: styles_1["default"].image }),
        react_1["default"].createElement(react_native_1.View, { style: styles_1["default"].rightContainer },
            react_1["default"].createElement(react_native_1.Text, { style: styles_1["default"].title }, song.title),
            react_1["default"].createElement(react_native_1.Text, { style: styles_1["default"].artist }, song.artist))));
};
exports["default"] = SongListItem;
