requirejs.config({
    baseUrl: '../',
    paths: {
        lib: 'lib'
    }
});
define(['jquery', 'lib/zz', 'lib/zzUtil', 'lib/zzInteraction','lib/zzDebug','lib/letterbox'], function ($, zz, zzUtil, zzInteraction,zzDebug,letterbox) {
    function calcSize() {
        //$('#canvas1').css('width', $(document).width() - 50);
        //$('#canvas1').css('height', $(document).height() - 50);
        return zz.world.w / 12;
    }

    $("document").ready(function () {
        zz.init($("#canvas1")[0], function (c) {
            if (window.innerWidth < 960) {
                var origWidth = c.width;
                var origHeight = c.height;
                var deltaW = window.innerWidth / origWidth;
                c.width = window.innerWidth;
                c.height = origHeight * deltaW;
            }
        });
        var
            board = [12, 17],
            boardMap = [[]];
        block = calcSize(),
        lock =false,
        miniCube = [0, 0, 1, 0, 1, 1, 0, 1],
        longy = [[0, 0, 0, 1, 0, 2, 0, 3], [0, 0, 1,0, 2, 0, 3, 0]],
        zed = [[0, 1, 1, 1, 1, 2, 2, 2], [2, 0, 1, 1, 2, 1, 1, 2]],
        zedReverse = [[0, 0, 0, 1, 1, 1, 1, 2], [1, 1, 2, 1, 0, 2, 1, 2]],
        cube = [[0, 0, 1, 0, 0, 1, 1, 1]],
        theL = [[0, 1, 0, 2, 1, 2, 2, 2], [1, 0, 2, 0, 1, 1, 1, 2], [0, 1, 1, 1, 2, 1, 2, 2], [1, 0, 1, 1, 1, 2, 0, 2]],
        theLReverse = [[1, 0, 1, 1, 1, 2, 2, 2], [0, 1, 1, 1, 2, 1, 0, 2], [0, 0, 1, 0, 1, 1, 1, 2], [0, 2, 1, 2, 2, 2, 2, 1]],
        button = [0, 0, block * 3, 0, block * 3, block, 0, block],
        tetriColors = ['#F5ccdd', '#e59acc', '#00ddff'];


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
                boardMap[i]=[];
                for (var a = 0; a < bHeight; a++) {
                    var boardBlock = new zz.stickFigure(
                        i * block,
                        a * block,
                        block,
                        block,
                        '#bbbbbb',
                        '#555555',
                        zzUtil.blockify(miniCube),
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


        var buttons = [
            seedSimpleShape({
                x: zz.world.w - zzUtil.shapeSize(button).w,
                y: zz.world.h - zzUtil.shapeSize(button).h, shape: button, color: '#eeeeee', borderColor: '#666666'
            }),

            seedSimpleShape({ x: 0, y: zz.world.h - zzUtil.shapeSize(button).h, shape: button, color: '#eeeeee', borderColor: '#666666' }),
            seedSimpleShape({ x: (zz.world.w/2) - 40 , y: zz.world.h - zzUtil.shapeSize(button).h, shape: button, color: '#eeee11', borderColor: '#666666' })
        ];

       

        var gameControl = {
            state:-1, //all above zero is running, -1 notstarted, -2 gameovcer
            defaultBlockColor: '#aaaaaa',
            currentFallingItem:{
                variShape: null,
                rotation: 0, //index,
                offsetX:0,
                offsetY: 0,
                color: '#ff2299',
                rotate: function () {
                    if (this.rotation < (this.variShape.length - 1)) {
                        this.rotation++;
                    }
                    else {
                        this.rotation = 0;
                    }
                },
                getShape: function () {
                    return this.variShape[this.rotation];
                }
            }
            ,
            seedFallingItem: function () {
                if (this.state <0 ) {
                    return;
                }
                //clearPrevious first
                //zzDebug.debug("rotation", this.currentFallingItem.rotation);
                //zzDebug.debug("shapelength", this.currentFallingItem.variShape.length);
                this.clearAllNonBlocked();
                var currShape = this.currentFallingItem.getShape(); 
                var x = this.currentFallingItem.offsetX;
                var y = this.currentFallingItem.offsetY;

                for (var i = 0; i < currShape.length; i += 2) {
                    if ((currShape[i] + x) < boardMap.length && (currShape[i + 1] + y) < boardMap[0].length) {
                        boardMap[currShape[i] + x][currShape[i + 1] + y].fillColor = this.currentFallingItem.color;
                    }
                }

            }
            ,
            clearAllNonBlocked: function () {
                for(var i=0;i < boardMap.length ;i++){
                    for (var a = 0 ; a < boardMap[i].length ; a++) {
                        if (!boardMap[i][a].blocked) {
                            boardMap[i][a].fillColor = this.defaultBlockColor;
                        }
                    }
                }
            }
            ,
            blockCurrentItemInBoard:function(){
                var currShape = this.currentFallingItem.getShape();//cant do this here if we shall repeat this function....
                var x = this.currentFallingItem.offsetX;
                var y = this.currentFallingItem.offsetY;
                for (var i = 0; i < currShape.length; i += 2) {
                    boardMap[currShape[i] + x][currShape[i + 1] + y].blocked = true;
                }
            },
            moveItemSideways: function (xDir) {
                if (!this.isCollidingSideways(xDir)) {
                    this.currentFallingItem.offsetX += xDir;
                }
            }

            ,
            isColliding: function () {
                //check reach bottom
                //on each stickfig item in boardMap that matches the currentFalling item in its NEXT position, that is y+1, 
                //side collision tests must be carried out on events moveItemLeft/right. 
                var currShape = this.currentFallingItem.getShape(); //cant do this here if we shall repeat this function....
                var x = this.currentFallingItem.offsetX;
                var y = this.currentFallingItem.offsetY;

                for (var i = 0; i < currShape.length; i += 2) {
                    var boardHeight = boardMap[0].length;
                    if (currShape[i + 1] + y == boardHeight - 1) {
                        //shouldve reached bottom
                        return true;
                    }
                    if(boardMap[currShape[i] + x][currShape[i + 1] + y +1].blocked){
                        return true;
                    }
                }

                // check collision with blocked item

                return false;

            },
            isCollidingSideways: function (dirX) {
                //side collision tests must be carried out on events moveItemLeft/right. 
                var currShape = this.currentFallingItem.getShape();//cant do this here if we shall repeat this function....
                var x = this.currentFallingItem.offsetX;
                var y = this.currentFallingItem.offsetY;
                var boardWidth = boardMap.length;
                for (var i = 0; i < currShape.length; i += 2) {
                    //check board edges
                    if (dirX > 0) {
                        if ((currShape[i] + x + dirX) == boardWidth) {
                            return true;
                        }
                    }
                    else {
                        if ((currShape[i] + x + dirX) == -1) {
                            return true;
                        }
                    }

                    if (boardMap[currShape[i] + x + dirX][currShape[i + 1] + y].blocked) {
                        return true;
                    }
                }
                return false;
            },
            checkScore:function(){
                //check one row in boardMap at a time, and check if all items are blocked,
                //then remove those and maybe move all above one step down
                //just wanna do reduce here....did nt work though l o l 
                for (var i = 0; i < boardMap[0].length; i++) {
                    var allblockedonrow = true;
                    for (var a = boardMap.length-1; a >= 0; a--) {
                        if (boardMap[a][i].blocked===undefined || boardMap[a][i].blocked == false) { //CHECK THIS LAST ONE
                            allblockedonrow = false;
                        }
                    }
                    if (allblockedonrow) { //NON WORKING
                        for (var a = boardMap.length - 1; a >= 0; a--) {
                            boardMap[a][i].fillColor = this.defaultBlockColor;
                            boardMap[a][i].blocked = false;
                            for (var s = i-1; s >= 0; s--) {
                                if (s > 0 && boardMap[a][s].blocked) { //TODO mUSt chek ALL lines above, EVERYTHING SHALL MOVE DOWN
                                    //CHECK ABOVE COLS HERE AND MOVE DOWN (chg fillcolor)
                                    var blItem = boardMap[a][s];
                                    var foundItemColor = blItem.fillColor;
                                    blItem.fillColor = this.defaultBlockColor; //delite the one above
                                    blItem.blocked = false;
                                    boardMap[a][s+1].fillColor = foundItemColor; //hilite the one were on
                                    boardMap[a][s+1].blocked = true;

                                }

                            }

                        }

                        //psuedo: go through the row with the hit. For each col check if there is an item attached to the correspondig col above - then move
                        //that item to where we are. Otherwise just delete it.
                    }
                }
                if (this.currentFallingItem.offsetY < 1) {
                    //alert("game over") //?
                    this.state = -2;
                    renderStartScreen();

                }
                  

                
            },
            initFallingItem: function () {
              //  this.state = 1;
                this.currentFallingItem.variShape = [longy, zed, zedReverse, cube, theL, theLReverse].randItem();
                this.currentFallingItem.offsetX = 5;
                this.currentFallingItem.offsetY = 0;
                this.currentFallingItem.rotation = 0;
                this.currentFallingItem.color = ['#55ffcc', '#fe44d6', '#fefe55', '#cc56ab', '#ba26eb'].randItem();
                this.seedFallingItem();

            }


        }

        buttons.forEach(function (b) {
            zz.world.items.push(b);
        })


        

        buttons.forEach(function (b) {
            zzInteraction.bind(b, "mouseover", function (ev, zzItem) {
                zzItem.fillColor = "#0000FF";
            });
            zzInteraction.bind(b, "mouseout", function (ev, zzItem) {
                zzItem.fillColor = "#EEEEEE";
            });
        });

        zzInteraction.bind(buttons[0], "mousedown", function (ev, zzItem) {
            //right
            gameControl.moveItemSideways(1);
        });
        


        zzInteraction.bind(buttons[1], "mousedown", function (ev, zzItem) {
            //left
            gameControl.moveItemSideways(-1);
        });

        zzInteraction.bind(buttons[2], "mousedown", function (ev, zzItem) {
            //rotate btn
          gameControl.currentFallingItem.rotate();
        });

        var tmpDate = new Date().getTime();


        //draw some cool alphanums....
        
        function renderStaticItems() {
            var yposLetter = 59;
            letterbox.renderLetter(letterbox.alphabet.t, 10, 2, yposLetter);
            letterbox.renderLetter(letterbox.alphabet.e, 10, 9, yposLetter);
            letterbox.renderLetter(letterbox.alphabet.t, 10, 14, yposLetter);
            letterbox.renderLetter(letterbox.alphabet.r, 10, 21, yposLetter);
            letterbox.renderLetter(letterbox.alphabet.i, 10, 25, yposLetter);
            letterbox.renderLetter(letterbox.alphabet.s, 10, 30, yposLetter);

        }

        function renderStartScreen() {
            
            gameControl.startScreenItems = [];
            var startButton = new zz.stickFigure(150, 120, 100, 100, "#FEFEFE", "#FFFFFF", zzUtil.blockify(miniCube, 90), 0, { x: 0, y: 0 })
            zz.world.items.push(
                startButton
                );
            gameControl.startScreenItems.push(startButton);
            var tControl = new zz.textBlock(175, 160, 200, 30, "START", 44);


            zz.world.items.push(tControl);
            gameControl.startScreenItems.push(tControl);
            zzInteraction.bind(startButton, "mousedown", function (ev, zzItem) {
                hideStartScreen();
                gameControl.state = 1;
                gameControl.initFallingItem();
            });


        }
        renderStaticItems();
        renderStartScreen();

        function hideStartScreen() {
            gameControl.startScreenItems.forEach(function (a) {
                a.x = 1000;
            })
        }


        zz.world.items.push(new zz.textBlock(10, 24, 200, 30, "Tetris by frankfurillo", 44));

        zz.run(function (ctx) { //render callback som parameter. Anropas från animate. 
            var elapsed = new Date().getTime() - tmpDate;
            zz.world.items.forEach(function (stickFig) {
                stickFig.render(stickFig.onRenderEnd);
            });

            if (gameControl.state > 0) {
                gameControl.seedFallingItem();
                if ((elapsed / 1000) > 0.3) {
                    tmpDate = new Date().getTime();
                    handleFallingItem();
                }
            }
        });
        

        function handleFallingItem() {
            if (!lock) {
                lock = true;
                //check collision before moving
                if (!gameControl.isColliding()) {
                    gameControl.currentFallingItem.offsetY++;
                }
                else {
                    gameControl.blockCurrentItemInBoard();
                    gameControl.checkScore();

                    gameControl.initFallingItem();
                }
                lock = false;
            }
        }

        kds = "";
        var k40down = false;
        function killKeyDownAction() {
            if (kds != "") {
                clearInterval(kds);
                kds="";
            }
        }
        $(document).bind("keyup", function (event) {
            killKeyDownAction();
        });

        $(document).bind("keydown", function (event) {
            if (gameControl.state < 0) {
                return;
            }
            killKeyDownAction();
            if (event.keyCode === 37) {
                gameControl.moveItemSideways(-1)
            }
            if (event.keyCode === 39) {
                gameControl.moveItemSideways(1)
            }
            if (event.keyCode === 40) {
                if (kds == "") {
                    kds = setInterval(function () {
                        handleFallingItem();
                    }, 50);
                }
            }
            if (event.keyCode === 38) {
                gameControl.currentFallingItem.rotate();
            }
        });

    });
});
