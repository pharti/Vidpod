"use strict";
exports.__esModule = true;
var react_native_1 = require("react-native");
var imageBox = 75;
var styles = react_native_1.StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 45,
        backgroundColor: '#131313',
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center'
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        color: 'white',
        fontSize: 20,
        margin: 10,
        fontWeight: 'bold'
    },
    artist: {
        color: 'lightgray',
        fontSize: 20,
        marginRight: 10
    },
    image: {
        width: imageBox,
        height: imageBox,
        marginRight: 10
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: 100
    }
});
exports["default"] = styles;
