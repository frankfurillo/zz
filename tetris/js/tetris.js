requirejs.config({
    baseUrl: '../../',
    paths: {
        lib: 'lib'
    }
});
define(['jquery', 'lib/zz', 'lib/zzUtil', 'lib/zzInteraction','lib/zzDebug'], function ($, zz, zzUtil, zzInteraction,zzDebug) {
    $("document").ready(function () {
        zz.init($("#canvas1")[0]);

        var
            block = 40,
            cube = [0, 0, block * 2, 0, block * 2, block * 2, 0, block * 2],
            longy = [0, 0, block, 0, block, block * 4, 0, block * 4],
            zShape = [block, 0, block * 2, 0, block * 2, block * 2, block, block * 2, block, block * 3, 0, block * 3, 0, block, block, block],
            button = [0, 0, block * 3, 0, block * 3, block, 0, block],
            tetriColors = ['#F5ccdd', '#e59acc', '#00ddff'];


        Array.prototype.randItem = function () {
            return this[Math.floor(Math.random() * this.length)];
        }

        zz.definitions.shapes.push(cube);

        function seedSimpleShape(options) {
            var
                x = options.x || 0,
                y = options.y || 0,
                shape = options.shape || cube,
                dirX = options.dirX || 0,
                dirY = options.dirY || 0;

            var s = new zz.stickFigure(
                x,
                y,
                zzUtil.shapeSize(shape).w,
                zzUtil.shapeSize(shape).h,
                options.color,
                options.borderColor,
                shape,
                0,
                {
                    x: dirX,
                    y: dirY
                }
            );
            s.onRenderEnd = function (item) {
            };
            return s;

        }

        function seedTetriShape(options) {
            var
                x = options.x || 0,
                y = options.y || 0,
                shape = options.shape || cube,
                dirX = options.dirX || 0,
                dirY = options.dirY || 0,
                angle = options.angle || 0;

            var tetri = new zz.stickFigure(
                x,
                y,
                zzUtil.shapeSize(shape).w,
                zzUtil.shapeSize(shape).h,
                tetriColors.randItem(),
                tetriColors.randItem(),
                shape,
                0,
                {
                    x: dirX,
                    y: dirY
                }
            );
            tetri.onRenderEnd = function (item) {
                if (item.y > (zz.world.h - item.h)) {
                    item.attachedForce.y = 0; //drop speed when hitting flor
                }
            };
            return tetri;

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
        //zz.world.items.push(seedCube());
        var buttons = [
            seedSimpleShape({
                x: zz.world.w - zzUtil.shapeSize(button).w,
                y: zz.world.h - zzUtil.shapeSize(button).h, shape: button, color: '#eeeeee', borderColor: '#666666'
            }),

            seedSimpleShape({ x: 0, y: zz.world.h - zzUtil.shapeSize(button).h, shape: button, color: '#eeeeee', borderColor: '#666666' })
        ];

        function seedFallingItem() {
            //randomize shapes later...
            var zzItem =seedTetriShape({ x: 5*block, y: block, shape: longy, dirX: 0, dirY: 0 });
            zz.world.items.push(zzItem);
            return zzItem;
        }
        zz.world.items.push(
            //seedTetriShape({ x: 200, y: 100, shape: longy, dirX: 0, dirY: 0 }),
            //seedTetriShape({ x: 300, y: 10, shape: cube, dirX: 0, dirY: 0 }),
            //seedTetriShape({ x: 400, y: 50, shape: zShape, dirX: 0, dirY: 0 }),
            buttons[0],
            buttons[1]
            );

        var c = 0;
        var currentFallingItem = seedFallingItem();
        buttons.forEach(function (b) {
            zzInteraction.bind(b, "mouseover", function (ev, zzItem) {
                zzItem.fillColor = "#00FFFF";
                
            });
            zzInteraction.bind(b, "mouseout", function (ev, zzItem) {
                zzItem.fillColor = "#eeeeee";
            });
        });

        zzInteraction.bind(buttons[0], "mousedown", function (ev, zzItem) {
            moveItemSideways(block);
        });

        zzInteraction.bind(buttons[1], "mousedown", function (ev, zzItem) {
            moveItemSideways(-block);
        });

        function moveItemSideways(x) {
            //alert(zz.world.w)
            if ((currentFallingItem.x + x ) >= 0 && ((currentFallingItem.x + x) <= (zz.world.w - block))){ 
                currentFallingItem.x += x;
            }
        }
        var tmpDate = new Date().getTime();
        zz.run(function (ctx) { //render callback som parameter. Anropas från animate. 
            c++;
            var elapsed = new Date().getTime() - tmpDate;
            if ((elapsed / 1000) > 1) {
                zzDebug.debug("counter", elapsed);
                tmpDate = new Date().getTime();
                currentFallingItem.y += block;
            }
            zz.world.items.forEach(function (stickFig) {
                //  if(stickFig)
                //if(new Date()
                stickFig.render(stickFig.onRenderEnd);
                lastTime = Date.now();
            });
        });
        

    });
});
