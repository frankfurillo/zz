define(['jquery'],function ($) {
    //var $ = require('jquery');
    var zzDebug = {
        debugItems: [],
        runOnce: false,
        debug: function (id, message) {
            var html = "<div id='zzDebugDiv' style='position:absolute;z-index:1000;top:20px;left:820px;font-family:courier;color:black;'><ul></ul></div>";
            if (!this.runOnce) {
                $("body").append(html);
                runOnce = true;
            }
            var exist = false;
            this.debugItems.forEach(function (d) {
                if (d.id == id) {
                    d.message = message; //update value
                    exist = true;
                }
            });
            if (!exist) { //insert new
                this.debugItems.push({ id: id, message: message });
            }
            this.debugItems.forEach(function (d) {
                html += "<li>DEBUG " + d.id + ": " + d.message;
            });
            html += "</li>";
            $("#zzDebugDiv ul").html(html);
        }
    }
    return zzDebug ;

});
