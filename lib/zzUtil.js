define(function () {
    "use strict"
    return {
        shapeSize: function (shape) {
            // returns largest number in shapeArr, for x coord which are at odd indexes, 
            // and for y coord which are on even indexes. width of obj is largest x - smallest x
            var
                odd = shape.filter(function (e, ind) {
                    return ind % 2 == 0;
                }),
                even = shape.filter(function (e, ind) {
                    return ind % 2 != 0;
                });

            var
                maxvals = {
                    w: Math.max.apply(null, odd),
                    h: Math.max.apply(null, even)
                },
                minvals = {
                    w: Math.min.apply(null, odd),
                    h: Math.min.apply(null, even)
                };

            return {
                w: maxvals.w - minvals.w,
                h: maxvals.h - minvals.h
            };
        },
        blockify:function(shape,blockSize) {
            return  shape.map(function (a) {
                return a *( blockSize|| block);
            });
        }

    };
});

