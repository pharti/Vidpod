"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var Album_1 = require("../Album");
var styles_1 = require("./styles");
var AlbumCategory = function (props) { return (react_1["default"].createElement(react_native_1.View, { style: styles_1["default"].container },
    react_1["default"].createElement(react_native_1.Text, { style: styles_1["default"].title }, props.title),
    react_1["default"].createElement(react_native_1.FlatList, { data: props.albums, renderItem: function (_a) {
            var item = _a.item;
            return react_1["default"].createElement(Album_1["default"], { album: item });
        }, keyExtractor: function (item) { return item.id; }, horizontal: true }))); };
exports["default"] = AlbumCategory;
