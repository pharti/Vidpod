"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var styles_1 = require("./styles");
var AlbumHeader = function (props) {
    var album = props.album;
    return (react_1["default"].createElement(react_native_1.View, { style: styles_1["default"].container },
        react_1["default"].createElement(react_native_1.Image, { source: { uri: album.imageUri }, style: styles_1["default"].image }),
        react_1["default"].createElement(react_native_1.Text, { style: styles_1["default"].name }, album.name),
        react_1["default"].createElement(react_native_1.View, { style: styles_1["default"].creatorContainer },
            react_1["default"].createElement(react_native_1.Text, { style: styles_1["default"].by },
                "By: ",
                album.by),
            react_1["default"].createElement(react_native_1.Text, { style: styles_1["default"].likes },
                "By: ",
                album.numberOfLikes,
                " Likes")),
        react_1["default"].createElement(react_native_1.TouchableOpacity, null,
            react_1["default"].createElement(react_native_1.View, { style: styles_1["default"].button },
                react_1["default"].createElement(react_native_1.Text, { style: styles_1["default"].buttonText }, "PLAY")))));
};
exports["default"] = AlbumHeader;
