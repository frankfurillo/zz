requirejs.config({
    baseUrl: '../../',
    paths: {
        lib: 'lib'
    }
});

define(['jquery', 'lib/zz', 'lib/zzUtil', 'lib/zzInteraction','lib/zzDebug','lib/colorLab','lib/kindof'], function ($, zz, zzUtil, zzInteraction,zzDebug,colorLab,kindof) {

    var settings = {
        popcornMass: 0.3
        ,
        setMass: function (v) {
            this.popcornMass = parseFloat(v);
        }
    };
    window.settings = settings;
    function spawnBackgroundTerrainLayer(distance, width) {
        //returnera en path med rand
        var maxHeight = 200;
        var maxDeltaX = 100;
        var h = maxHeight / distance;
        var deltaX = maxDeltaX / distance;
        var noOfDots = width / deltaX;
        noOfDots = 14;
        var path = [0, h];
        var lastDotX;
        for (var i = 1; i < noOfDots; i++) {
            var randH = Math.random() * h;
            lastDotX = i * deltaX;
            path.push(lastDotX, randH);
        }
        path.push((lastDotX) + deltaX, h); //add closing point at the bottom
        return path;
    }

    function spawnSquare(w) {
        return [kindof(0, 1), 0, kindof(w, 1), 0, kindof(w, 1), kindof(w, 2), 0, w];

    }


    $("document").ready(function () {


        zz.init($("#canvas1")[0]);
        //            var testItem = new zz.item();
        var noSquare = [10, 10, 100, 10, 110, 40, 10, 50];
        var curvy1 = [10, 10, 30, 30, 50, 0, 70, 50];

        var star = [0, 10, 3, 7, 6, 10, 3, 13],
            square = [0, 0, 10, 0, 10, 10, 0, 10],
            testCloud = [0,20,40,0,80,20,81,21,120,0,160,20,120,40,80,30,79,29,40,40]
        ;
        zz.definitions.shapes.push(noSquare);
        function seedRandomPopcorn() {
            var randW = Math.random() * 100 + (zz.world.w / 2);
            var randH = Math.random() * 200 + 200;
            var randForceY = (Math.random() * 20) * -1;
            var randForceX = (Math.random() * 30) - 15;
            var popColor = colorLab.getRandomColor();
            var stickfig = new zz.stickFigure(randW, randH, 8, 8, popColor, popColor, spawnSquare(kindof(10, 0.8)), settings.popcornMass, { x: randForceX, y: randForceY });
            stickfig.onRenderEnd = function renderEnd(renderedItem) {
                if (renderedItem.y > zz.world.h || renderedItem.x > zz.world.w) {
                    renderedItem.reset(avoid = "onRenderEnd");
                    var newRand = seedRandomPopcorn();
                    //  zzDebug.debug("mass", newRand.mass);

                    renderedItem.x = newRand.x;
                    renderedItem.y = zz.world.h - 100;
                    renderedItem.mass = newRand.mass; //get new mass val
                    renderedItem.attachedForce = newRand.attachedForce;
                    delete newRand;
                };
            };


            return stickfig;
        }

        function seedCurvyFig() {
            var col = "#000000";
            var curvyTerrain = spawnBackgroundTerrainLayer(1, 400);
            var curvy = new zz.stickFigure(200, 250, 4000, 200, col, col, curvyTerrain, 0, { x: -8, y: 0 });
            curvy.pathType = "curvy";
            curvy.onRenderEnd = startOverX;
            return curvy;

        }

        function seedCloud(x, y, forceX) {
            var cloud = new zz.stickFigure(x, y, 100, 30, "#FEFEFE", "#FFFFFF", testCloud, 0, { x: forceX, y: 0 });
            cloud.pathType = 'curvy';
            cloud.onRenderEnd = startOverX;
            return cloud;
        }

        function seedBgLayers(distance, color, offLeft, offTop) {
            var topSpeed = 1.8
            var bgLayer1 = spawnBackgroundTerrainLayer(distance, 3000);
            var cloud = new zz.stickFigure(offLeft, offTop, 3000, 200, color, color, bgLayer1, 0, { x: -getSpeed(), y: 0 });

            cloud.onRenderEnd = startOverX;
            function getSpeed() {
                return topSpeed / distance;
            }
            cloud.onRenderEnd = startOverX;
            return cloud;

        }

        function startOverX(item) {
            if (item.attachedForce.x < 0) {
                if (item.x < -item.w) {
                    item.x = zz.world.w;
                }
            }
            else {
                if (item.x > zz.world.w) {
                    item.x = 0;
                }

            }
        }

        zz.world.items.push(seedBgLayers(5, "#aaee99", 0, 40));
        zz.world.items.push(seedBgLayers(3, "#77ee88", 0, 50));
        zz.world.items.push(seedBgLayers(1, "#44dd44", 0, 30));
        zz.world.items.push(seedCloud(210, 40, -1.5));
        zz.world.items.push(seedCloud(10, 10, 2));
        zz.world.items.push(seedCurvyFig());
        for (var i = 0; i < 100; i++) {
            zz.world.items.push(seedRandomPopcorn());
        }

        //zz.world.items.push(new zz.stickFigure(10, 320, 100, 100, "#DDFF66", "#FFCC00", noSquare, 2, { x: 0, y: -10.11 }));
        //zz.world.items.push(new zz.stickFigure(110, 130, 100, 100, "#11aF66", "#00CC00", noSquare, 0.5));
        //zz.world.items.push(new zz.stickFigure(300, 40, 100, 100, "#55aa66", "#F0CC00", noSquare));

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