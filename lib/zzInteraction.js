define(function (zz) {
    var zz = require('lib/zz');
    "use strict"
    var interaction={
        boundEvents: [],
        bind: function (zzItem, evtType, callBack) { //any obj with w,h,x,y
            var origType = evtType;
            if (evtType == 'mouseover') {
                evtType = 'mousemove';
            }

            if (!this.eventTypeExist(evtType)) { //do not add eventListener for mouseout, overwrites mouseover
                zz.canvas.addEventListener(evtType, function (event) {
                    var rect = zz.canvas.getBoundingClientRect();
                    var psuedoClickObj = { x: event.pageX - 1 - rect.left, y: event.pageY - 1 - rect.top, w: 2, h: 2 };
                    
                    //iterate handlers
                    var boundForType = interaction.boundEvents.filter(function (be) {
                        return be.eventType == evtType;
                    })
                    boundForType.forEach(function (h) {
                        if (zz.isCollide(h.item, psuedoClickObj)) {
                            if (h.origType == 'mouseover') {
                                h.item.mouseover = true;
                            }
                            h.callBack(event, h.item);
                        }
                        else {
                            var outEvent = interaction.getBoundEvents('mouseout', h.item);
                            if (outEvent.length > 0) {//mouseout exist for h.item
                                if (h.item.mouseover) {
                                    outEvent[0].callBack(event, h.item);
                                }
                            }
                        }
                    });

                }, false);

            }
            this.boundEvents.push({
                item: zzItem,
                eventType: evtType,
                callBack: callBack,
                origType: origType
            });

        },
        getBoundEvents: function (evtType,zzItem) {
            return interaction.boundEvents.filter(function (a) {
                return a.eventType == evtType && a.item.path==zzItem.path && a.item.x == zzItem.x;
            });
        },
        eventTypeExist: function (evtType) {
            var exist = false;
            this.boundEvents.forEach(function (b) {
                if (b.eventType == evtType) {
                    exist = true;
                }
            });
            return exist;
        }

        

    };
    return interaction;
});

