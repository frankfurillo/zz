requirejs.config({
    baseUrl: '../../',
    paths: {
        lib: 'lib'
    }
});

define(['jquery', 'lib/zz', 'lib/zzUtil', 'lib/zzInteraction', 'lib/zzDebug', 'lib/colorLab', 'lib/kindof'], function ($, zz, zzUtil, zzInteraction, zzDebug, colorLab, kindof) {

    var settings = {
        dirX: 0,
        yForce: -8,
        arrVals: [-4, 0, 4],
        currentSpeedIndex : 1,
        setDirectionX: function (v) {
            if (v === 'left' && this.currentSpeedIndex > 0) {
                this.currentSpeedIndex--;
            }
            else if (v === 'right' && this.currentSpeedIndex < 2) {
                this.currentSpeedIndex++;
            }
            this.dirX = this.arrVals[this.currentSpeedIndex];
            zz.world.gravity.x = -this.dirX;
            var forcedPositive = this.dirX < 0 ? this.dirX * -1 : this.dirX;
            this.yForce = -8 + (forcedPositive * 0.5);
        }
    };
    window.settings = settings;


    Array.prototype.randItem = function () {
        return this[Math.floor(Math.random() * this.length)];
    }

    window.skiApp = {
        run: runApp
    };

    function runApp(){

//    $("document").ready(function () {
    
        zz.init($("#canvas1")[0], function (a) {
        });

        zz.spriteEngine.spriteImageSrc = 'img/trees.png';

        //            var testItem = new zz.item();
        var
            noSquare = [10, 10, 100, 10, 110, 40, 10, 50],
            testCloud = [0, 5, 20, 0, 20, 20, 0, 20, 0, 10],
            skier = [0, 0, 10, 0, 10, 10, 0, 10];

        var treeSpritePositions = [[10, 10, 28, 24], [68, 8, 90, 54],[34,52,61,115], [98,16,121,54]];
            
        zz.definitions.shapes.push(noSquare);

        function seedCloud(x, y, forceX) {
            var cloud = new zz.stickFigure(x, y, 30, 30, "#669966", "#cccccc", testCloud, 1, { x: forceX, y: -8 });
            cloud.pathType = 'curvy';
            cloud.onRenderEnd = function(item) {
                item.attachedForce.y = settings.yForce;
                if (zz.isCollide(item, you)) {
                    you.fillColor = "#ff0000";
                    zz.world.gravity.x = 0;
                    settings.yForce = 0;
                    settings.dirX = 0;
                } else {
                    //you.fillColor = "#000000";
                }
            }; //should check collision with other figures, that could be a floor for instance...
            return cloud;
        }


        function getSpriteMeasure(coords) {
            return {
                w: coords[2] - coords[0],
                h: coords[3] - coords[1]
            };
        }



        function seedSpriteTree(x, y, forceX) {
            var randTree = treeSpritePositions.randItem();
            var mess = getSpriteMeasure(randTree);

            var sprite = new zz.sprite(x, y, mess.w, mess.h, randTree[0],randTree[1]);
            sprite.onRenderEnd = function (item) {
                item.attachedForce.y = settings.yForce;
                if (zz.isCollide(item, you)) {
                    you.fillColor = "#ff0000";
                    zz.world.gravity.x = 0;
                    settings.yForce = 0;
                    settings.dirX = 0;
                } else {
                    //you.fillColor = "#000000";
                }
            }; //should check collision with other figures, that could be a floor for instance...
            return sprite;
        }

        function seedTrees() {
            var maxy = 500;
            var deltaH = 70;
            for (var i = 0; i < maxy; i++) {
                var randW = (Math.random() * zz.world.w);
                //zz.world.items.push(seedCloud(randW, i * deltaH, 0));
                zz.world.items.push(seedSpriteTree(randW, i * deltaH, 0));
            }
        }
        function seedSkier(x,y) {
            var s= new zz.stickFigure(x, y, 20, 20, "#333333", "#444444", skier, 1, { x: 3, y: 0 });
            s.pathType = 'square';
            s.onRenderEnd = function renderEnd(renderedItem) {
                renderedItem.attachedForce.x = settings.dirX;
            }

            return s;
        }

        seedTrees();
        var you = seedSkier(300, 300);
        zz.world.items.push(you);
        //        zz.world.items.push(seedCloud(310, 10, 0));
        zz.world.gravity.y = 0;
        zz.world.gravity.x = 0;

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
        $("body").on("keydown", function (evt) {
            if (evt.which === 37) {
                settings.setDirectionX('left');
            }
            if (evt.which === 39) {
                settings.setDirectionX('right');
            }
        });

    };
});