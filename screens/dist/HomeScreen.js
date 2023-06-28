"use strict";
exports.__esModule = true;
var React = require("react");
var react_native_1 = require("react-native");
var Themed_1 = require("../components/Themed");
var AlbumCategory_1 = require("../components/AlbumCategory");
var albumCategories_1 = require("../data/albumCategories");
function TabOneScreen() {
    return (React.createElement(Themed_1.View, null,
        React.createElement(react_native_1.FlatList, { data: albumCategories_1["default"], renderItem: function (_a) {
                var item = _a.item;
                return React.createElement(AlbumCategory_1["default"], { title: item.title, albums: item.albums });
            }, keyExtractor: function (item) { return item.id; } })));
}
exports["default"] = TabOneScreen;
