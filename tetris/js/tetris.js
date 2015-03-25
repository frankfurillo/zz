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
            board = [14, 19],
            boardMap = [[]];
            block = 30,
            miniCube = [0, 0, 1, 0, 1, 1, 0, 1],
            longy = [[0, 0, 0, 1, 0, 2, 0, 3], [0, 0, 1,0, 2, 0, 3, 0]],
            button = [0, 0, block * 3, 0, block * 3, block, 0, block],
            tetriColors = ['#F5ccdd', '#e59acc', '#00ddff'];

        function blockify(shape) {
            return  shape.map(function (a) {
                return a * 40;
            });
        }

        Array.prototype.randItem = function () {
            return this[Math.floor(Math.random() * this.length)];
        }


      



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

     

        function drawBoard() {
            var bWidth= board[0];
            var bHeight = board[1];
            for (var i = 0; i < bWidth ; i++) {
                boardMap.push([]);
                for (var a = 0; a < bHeight; a++) {
                    var boardBlock = new zz.stickFigure(
                        i * block,
                        a * block,
                        block,
                        block,
                        '#bbbbbb',
                        '#555555',
                        blockify(miniCube),
                        0,
                        {
                            x: 0,
                            y: 0
                        }
                    );
                    boardMap[i].push([]);
                    boardMap[i][a]=boardBlock;
                    zz.world.items.push(boardBlock)
                }
            }
        }

        drawBoard();


        //zz.world.items.push(seedCube());
        var buttons = [
            seedSimpleShape({
                x: zz.world.w - zzUtil.shapeSize(button).w,
                y: zz.world.h - zzUtil.shapeSize(button).h, shape: button, color: '#eeeeee', borderColor: '#666666'
            }),

            seedSimpleShape({ x: 0, y: zz.world.h - zzUtil.shapeSize(button).h, shape: button, color: '#eeeeee', borderColor: '#666666' }),
            seedSimpleShape({ x: zz.world.w/2, y: zz.world.h - zzUtil.shapeSize(button).h, shape: button, color: '#eeee11', borderColor: '#666666' })
            ];

        var gameControl = {
                defaultBlockColor : '#aaaaaa',
                currentFallingItem:{
                    variShape: null,
                    rotation: 0, //index,
                    offsetX:0,
                    offsetY: 0,
                    rotate: function () {
                        if (this.rotation < this.variShape.length - 1) {
                            this.rotation++;
                        }
                        else {
                            this.rotation = 0;
                        }
                    }
                }
            ,
                seedFallingItem: function () {
                    //clearPrevious first
                    this.clearAllNonBlocked();
                    var currShape = this.currentFallingItem.variShape[this.currentFallingItem.rotation]; //cant do this here if we shall repeat this function....
                    var x = this.currentFallingItem.offsetX;
                    var y = this.currentFallingItem.offsetY;

                    for (var i = 0; i < currShape.length; i += 2) {
                        boardMap[currShape[i] + x][currShape[i + 1] + y].fillColor = "#ff2299";
                    }

                }
            ,
                clearAllNonBlocked: function () {
                    for(var i=0;i < boardMap.length ;i++){
                        for (var a = 0 ; a< boardMap[i].length ; a++){
                            boardMap[i][a].fillColor = this.defaultBlockColor;
                        }
                    }
                }
            ,
                moveItemSideways: function (xDir) {
                    this.currentFallingItem.offsetX += xDir;
                }

        }

        buttons.forEach(function (b) {
            zz.world.items.push(b);
        })


        

        buttons.forEach(function (b) {
            zzInteraction.bind(b, "mouseover", function (ev, zzItem) {
                zzItem.fillColor = "#00FFFF";
                
            });
            zzInteraction.bind(b, "mouseout", function (ev, zzItem) {
                zzItem.fillColor = "#eeeeee";
            });
        });

        zzInteraction.bind(buttons[0], "mousedown", function (ev, zzItem) {
            gameControl.moveItemSideways(1);
        });

        zzInteraction.bind(buttons[1], "mousedown", function (ev, zzItem) {
            gameControl.moveItemSideways(-1);
        });

        zzInteraction.bind(buttons[2], "mousedown", function (ev, zzItem) {
            //rotate btn

            gameControl.currentFallingItem.rotate();
        });

        var tmpDate = new Date().getTime();

        gameControl.currentFallingItem.variShape = longy;
        gameControl.currentFallingItem.offsetX = 5;
        gameControl.seedFallingItem();

        zz.run(function (ctx) { //render callback som parameter. Anropas från animate. 
            var elapsed = new Date().getTime() - tmpDate;
            zz.world.items.forEach(function (stickFig) {
                //  if(stickFig)
                //if(new Date()
                stickFig.render(stickFig.onRenderEnd);
                lastTime = Date.now();
            });
            gameControl.seedFallingItem();
            if ((elapsed / 1000) > 0.3) {
                tmpDate = new Date().getTime();
                handleFallingItem();
            }
        });
        

        function handleFallingItem() {
            gameControl.currentFallingItem.offsetY++;
        }

    });
});
