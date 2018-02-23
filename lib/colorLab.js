define(function (w) {
    "use strict";
    var colorLab = {
        getRandomColor: function () {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
    };
    return colorLab;
});