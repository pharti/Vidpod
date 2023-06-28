"use strict";
exports.__esModule = true;
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var SongListItem_1 = require("../components/SongListItem");
var albumDetails_1 = require("../data/albumDetails");
var AlbumHeader_1 = require("../components/AlbumHeader");
var AlbumScreen = function () {
    var route = native_1.useRoute();
    react_1.useEffect(function () {
        console.log(route.params.title);
    }, []);
    return (react_1["default"].createElement(react_native_1.View, null,
        react_1["default"].createElement(react_native_1.FlatList, { data: albumDetails_1["default"].songs, renderItem: function (_a) {
                var item = _a.item;
                return react_1["default"].createElement(SongListItem_1["default"], { song: item });
            }, keyExtractor: function (item) { return item.id; }, ListHeaderComponent: function () { return react_1["default"].createElement(AlbumHeader_1["default"], { album: albumDetails_1["default"] }); } })));
};
exports["default"] = AlbumScreen;
