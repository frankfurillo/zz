requirejs.config({
    baseUrl: '../../',
    paths: {
        lib: 'lib'
    }
});

define(['jquery', 'lib/zz', 'lib/zzUtil', 'lib/zzInteraction', 'lib/zzDebug',
'lib/colorLab', 'lib/kindof'], function ($, zz, zzUtil, zzInteraction, zzDebug, colorLab, kindof) {

    var settings = {
        speed:4,
        dirX: 0,
        yForce: -5,
        yForceInitial : -5,
        arrVals: [-2.5,-2, 0, 2,2.5],
        arrAcc : [-0.1,0,0.05,0,-0.1],
        maxAcc : 0.1,
        maxVal : 2.5,
        currentSpeedIndex : 2,
        origo : window.innerWidth / 2,
        mouseX:0,

        setDirectionXFloating: function(x){
            this.mouseX = x;
            var pVal = this.maxVal / this.origo;
            var deltaVal = (x - this.origo) * pVal;
            this.dirX = deltaVal;
            zz.world.gravity.x = -this.dirX * 0.6;
            var forcedPositive = this.dirX < 0 ? this.dirX * -1 : this.dirX;
            //this.yForce = this.yForceInitial + (forcedPositive * 0.8);
        },
        setDirectionX: function (v) {
            if (v === 'left' && this.currentSpeedIndex > 0) {
                this.currentSpeedIndex--;
            }
            else if (v === 'right' && this.currentSpeedIndex < 4) {
                this.currentSpeedIndex++;
            }
            this.dirX = this.arrVals[this.currentSpeedIndex];
            zz.world.gravity.x = -this.dirX;
            var forcedPositive = this.dirX < 0 ? this.dirX * -1 : this.dirX;
            this.yForce = this.yForceInitial + (forcedPositive * 0.8);
        },
        getAcc: function(){
          return -0.6;
          var pMAx = this.maxAcc / this.origo; //0.1 / 1240

          var delta =  (this.mouseX - this.origo) * pMAx;

          return delta < 0 ? delta * -1 : delta;

//          return this.arrAcc[this.currentSpeedIndex];
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
            skier = [0, 0, 10, 0, 10, 20, 0, 20];
            bgArea = [0,0,zz.world.w,0,zz.world.w,zz.world.h,0,zz.world.h];

        var treeSpritePositions = [[10, 10, 28, 24], [68, 8, 90, 54],[34,52,61,115], [98,16,121,54]];

        zz.definitions.shapes.push(noSquare);



        function getSpriteMeasure(coords) {
            return {
                w: coords[2] - coords[0],
                h: coords[3] - coords[1]
            };
        }

        function handleAcceleration(itemForce){
            itemForce.y = settings.getAcc();
        }

        function seedSpriteTree(x, y, forceX) {
            var randTree = treeSpritePositions.randItem();
            var mess = getSpriteMeasure(randTree);

            var sprite = new zz.sprite(x, y, mess.w, mess.h, randTree[0],randTree[1]);
            sprite.onRenderEnd = function (item) {
                handleAcceleration(item.attachedForce);
                if (zz.isCollide(item, you)) {
/*                    you.fillColor = "#ff0000";
                    zz.world.gravity.x = 0;
                    settings.yForce = 0;
                    settings.dirX = 0;*/
                } else {
                    //you.fillColor = "#000000";
                }
            }; //should check collision with other figures, that could be a floor for instance...
            return sprite;
        }

        function seedTrees() {
            var maxy = 500;
            var startOffsetY = 600;
            var deltaH = 70;
            for (var i = 0; i < maxy; i++) {
                var randW = (Math.random() * zz.world.w);
                zz.world.items.push(seedSpriteTree(randW, (i * deltaH)+startOffsetY, 0));
            }
        }
        function seedSkier(x,y) {
            var s= new zz.stickFigure(x, y, 20, 20, "#333333", "#444444", skier, 1, { x: 0, y: 0 });
            s.pathType = 'square';
            s.onRenderEnd = function renderEnd(renderedItem) {
                renderedItem.attachedForce.x = settings.dirX;
                bg.attachedForce.x = settings.dirX; // must follow

            }

            return s;
        }

        var ss= setTimeout(function(){seedTrees()},2000) ;
        var you = seedSkier(300, 300);
        var bg = new zz.stickFigure(0, 0, zz.world.w, zz.world.h, "#ccaa33", "#df0000", bgArea, 1, { x: 0, y: 0 });
        var inter="";
        zzInteraction.bind(bg, "mouseover", function (ev, zzItem) {
                if(inter !=""){
                  clearInterval(inter);
                }
                inter = setInterval(function(){
                  settings.setDirectionXFloating(ev.pageX);
                },200);

        });
        zz.world.items.push(bg);
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
