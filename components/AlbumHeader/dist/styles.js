"use strict";
exports.__esModule = true;
var react_native_1 = require("react-native");
var styles = react_native_1.StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20
    },
    image: {
        width: 300,
        height: 300,
        margin: 15
    },
    name: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold'
    },
    creatorContainer: {
        flexDirection: 'row',
        margin: 10
    },
    by: {
        margin: 5,
        color: 'lightgray',
        fontSize: 20
    },
    likes: {
        margin: 5,
        color: 'lightgray',
        fontSize: 20
    },
    button: {
        backgroundColor: '#1CD05D',
        height: 50,
        width: 150,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'lightgray',
        fontSize: 24,
        fontWeight: 'bold'
    }
});
exports["default"] = styles;
