"use strict";
exports.__esModule = true;
var react_native_1 = require("react-native");
var imageBox = 75;
var styles = react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'row',
        margin: 10
    },
    rightContainer: {
        justifyContent: 'space-around',
        marginLeft: 15
    },
    title: {
        color: 'white',
        fontSize: 24
    },
    artist: {
        color: 'lightgray',
        fontSize: 20
    },
    image: {
        width: imageBox,
        height: imageBox
    }
});
exports["default"] = styles;
