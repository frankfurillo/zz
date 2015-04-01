define(function (w) {
    var sortof = {
        kindof: function (v, ishness) {
            var i = ishness || 0.1 ;//10 %
            //var s = v * ishness;
            if (isNaN(v) && v.indexOf('#') === 0) {
                //color probably
                //var stripped = v.substring(1);
                var rgb=   [1, 3, 5].map(function (o) {
                    return parseInt(v.slice(o, o + 2),16) ; //this is maybe the coolest thing i have ever seen.
                });
                return '#'+ rgb.map(function (a) {
                    return sortof.convertToHex(sortof.kindof(a, i));
                }).join('');

            }
            //DEFAULT, assume number
            return ((Math.random() * (v * i)) + v - ((v * ishness) / 2));
        },
        closeEnough: function (v, ceil) {
            return (v > (ceil - 1)) ? ceil : v;
        },
        convertToHex: function (v) {
            var h = sortof.closeEnough(v, 255).toString(16).substring(0, 2);
            return (h.length < 2) ? '0' + h : h;
        }
        
    };
    return sortof.kindof;
});