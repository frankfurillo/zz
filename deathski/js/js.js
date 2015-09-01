requirejs.config({
    baseUrl: '../../',
    paths: {
        lib: 'lib'
    }
});

define(['jquery', 'lib/zz', 'lib/zzUtil', 'lib/zzInteraction', 'lib/zzDebug', 'lib/colorLab', 'lib/kindof'], function ($, zz, zzUtil, zzInteraction, zzDebug, colorLab, kindof) {




    $("document").ready(function () {

        zz.init($("#canvas1")[0], function (a) {

        });
        //            var testItem = new zz.item();
        var
            noSquare = [10, 10, 100, 10, 110, 40, 10, 50],
            testCloud = [0, 5, 40, 0, 40, 40, 0, 40, 0, 20];

        zz.definitions.shapes.push(noSquare);

        function seedCloud(x, y, forceX) {
            var cloud = new zz.stickFigure(x, y, 100, 30, "#FEFEFE", "#FFFFFF", testCloud, 1, { x: forceX, y: 0 });
            cloud.lastSpeedY = -3;
            cloud.pathType = 'curvy';
            //cloud.onRenderEnd = addBounceForce; //should check collision with other figures, that could be a floor for instance...
            return cloud;
        }



        zz.world.items.push(seedCloud(10, 10, 0));
        zz.world.gravity = 0;
        //for (var i = 0; i < 100; i++) {
        //    zz.world.items.push(seedRandomPopcorn());
        //}


        var c = 0;

        zz.run(function (ctx) { //render callback som parameter. Anropas från animate. 
            c++;
            zz.world.items.forEach(function (stickFig) {
                //  if(stickFig)

                stickFig.render(stickFig.onRenderEnd);
            });
        });
    });

});