requirejs.config({
    baseUrl: '../../',
    paths: {
        lib: 'lib'
    }
});

define(['jquery', 'lib/zz', 'lib/zzUtil', 'lib/zzInteraction', 'lib/zzDebug', 'lib/colorLab', 'lib/kindof'], function ($, zz, zzUtil, zzInteraction, zzDebug, colorLab, kindof) {

    var settings = {
               velocityX:0
    };
    window.settings = settings;


    Array.prototype.randItem = function () {
        return this[Math.floor(Math.random() * this.length)];
    }

    window.app = {
        run: runApp
    };

    function runApp(){
    
        zz.init($("#canvas1")[0], function (a) {
        });

        //zz.spriteEngine.spriteImageSrc = 'img/trees.png';

        //            var testItem = new zz.item();
        var
            ufo = [0, 0, 10, 0, 10, 10, 0, 10],
            bg = [0,0,zz.world.w,0,zz.world.w,zz.world.h,0,zz.world.h];

            
        zz.definitions.shapes.push(ufo);

        function seedUfo(x,y) {
            var s= new zz.stickFigure(x, y, 20, 20, "#333333", "#444444", ufo, 1, { x: 0, y: 0 });
            s.pathType = 'square';
            s.onRenderEnd = function renderEnd(renderedItem) {
                renderedItem.x +=settings.velocityX;
                //renderedItem.attachedForce.x = settings.dirX;
            }

            return s;
        }

        function seedMouseEventsDummy(){
            var s= new zz.stickFigure(0, 0, zz.world.w, zz.world.h, "#00ccff", "#778833", bg, 1, { x: 0, y: 0 });
            s.pathType = 'square';
            return s;
        }

        var bg2 = seedMouseEventsDummy();
        var you = seedUfo(300, 300);
//        zz.world.items.push(bg2);
        zz.world.items.push(you);
        zz.world.gravity.y = 0;
        zz.world.gravity.x = 0;


        var c = 0;

        zz.run(function (ctx) { //render callback som parameter. Anropas från animate. 
            c++;
            zz.world.items.forEach(function (stickFig) {
                //  if(stickFig)
                stickFig.render(stickFig.onRenderEnd);
            });
        });
        
       zzInteraction.bind(bg2, "mousedown", function (ev, zzItem) {
            var mousePosXOnCanvas = ev.pageX -  $("#canvas1")[0].offsetLeft;
            
            alert(mousePosXOnCanvas);
            alert(you.x);
            //moveItemSideways(-block);
        });
       
    };
    
});