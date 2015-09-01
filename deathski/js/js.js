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
            testCloud = [0, 5, 20, 0, 20, 20, 0, 20, 0, 10],
            skier = [0, 0, 10, 0, 10, 10, 0, 10];
            
        zz.definitions.shapes.push(noSquare);

        function seedCloud(x, y, forceX) {
            var cloud = new zz.stickFigure(x, y, 100, 30, "#669966", "#cccccc", testCloud, 1, { x: forceX, y: -8 });
            cloud.pathType = 'curvy';
            //cloud.onRenderEnd = addBounceForce; //should check collision with other figures, that could be a floor for instance...
            return cloud;
        }


        function seedTrees() {
            var maxy = 500;
            var deltaH = 70;
            for (var i = 0; i < maxy; i++) {
                var randW = (Math.random() * zz.world.w);
                zz.world.items.push(seedCloud(randW, i * deltaH, 0));
            }
        }
        function seedSkier(x,y) {
            var s= new zz.stickFigure(x, y, 100, 30, "#333333", "#444444", skier, 1, { x: 0, y: 0 });
            s.pathType = 'square';
            return s;
        }

        seedTrees();
        zz.world.items.push(seedSkier(300, 300));
        //        zz.world.items.push(seedCloud(310, 10, 0));
        zz.world.gravity.y = 0;
        zz.world.gravity.x = -3;

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