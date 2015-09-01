requirejs.config({
    baseUrl: '../',
    paths: {
        lib: 'lib'
    }
});
define(['jquery', 'lib/zz', 'lib/zzUtil', 'lib/zzInteraction', 'lib/zzDebug', 'lib/letterbox', 'lib/zzSound', 'lib/kindof'], function ($, zz, zzUtil, zzInteraction, zzDebug, letterbox, zzSound, kindof) {
    function calcSize() {
        //$('#canvas1').css('width', $(document).width() - 50);
        //$('#canvas1').css('height', $(document).height() - 50);
        return zz.world.w / 11;
    }

    $("document").ready(function () {

        zz.init($("#canvas1")[0], function (c) {
            //zzSound.init({ tempo: 120 }, function (synth) {
            //    synth.playNotes(['A', 'B']);
            //});
            var origWidth = c.width;
            var origHeight = c.height;
            var widthToHeight = origWidth / origHeight;
            var newWidth = window.innerWidth;
            var newHeight = window.innerHeight - 20;
            var newWidthToHeight = newWidth / newHeight;
            if (newWidthToHeight > widthToHeight) {
                // window width is too wide relative to desired game width
                newWidth = newHeight * widthToHeight;
            }
            else { // window height is too high relative to desired game height
                newHeight = newWidth / widthToHeight;
            }
            syncGameAreaSizes(newWidth, newHeight);

            function syncGameAreaSizes(width, height) {
                document.getElementById('gameArea').style.width = width + 'px';
                document.getElementById('gameArea').style.height = height + 'px';
            }
            c.width = newWidth;
            c.height = newHeight;

        });
        var
            board = [11, 18],
            boardMap = [[]];
        block = calcSize(),
        lock = false,
        defaultBlockColor = '#505050',
        miniCube = [0, 0, 1, 0, 1, 1, 0, 1],
        longy = [[1, 0, 1, 1, 1, 2, 1, 3], [0, 0, 1, 0, 2, 0, 3, 0]],
        zed = [[0, 1, 1, 1, 1, 2, 2, 2], [2, 0, 1, 1, 2, 1, 1, 2]],
        zedReverse = [[0, 0, 0, 1, 1, 1, 1, 2], [1, 1, 2, 1, 0, 2, 1, 2]],
        cube = [[0, 0, 1, 0, 0, 1, 1, 1]],
        theL = [[0, 1, 0, 2, 1, 2, 2, 2], [1, 0, 2, 0, 1, 1, 1, 2], [0, 1, 1, 1, 2, 1, 2, 2], [1, 0, 1, 1, 1, 2, 0, 2]],
        halfPlus = [[0, 2, 1, 2, 2, 2, 1, 1], [1, 0, 1, 1, 1, 2, 2, 1], [0, 2, 1, 2, 2, 2, 1, 3], [1, 0, 1, 1, 1, 2, 0, 1]],
        theLReverse = [[1, 0, 1, 1, 1, 2, 2, 2], [0, 1, 1, 1, 2, 1, 0, 2], [0, 0, 1, 0, 1, 1, 1, 2], [0, 2, 1, 2, 2, 2, 2, 1]],
        button = [0, 0, block * 3, 0, block * 3, block, 0, block];
        footerBg = [0, 0, block * 12, 0, block * 12, block * 2, 0, block * 2];


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
            var bWidth = board[0];
            var bHeight = board[1];
            for (var i = 0; i < bWidth ; i++) {
                boardMap[i] = [];
                for (var a = 0; a < bHeight; a++) {
                    var boardBlock = new zz.stickFigure(
                        i * block,
                        a * block,
                        block,
                        block,
                        defaultBlockColor,
                        defaultBlockColor,
                        zzUtil.blockify(miniCube),
                        0,
                        {
                            x: 0,
                            y: 0
                        }
                    );
                    boardMap[i].push([]);
                    boardMap[i][a] = boardBlock;

                    zz.world.items.push(boardBlock)
                }
            }
        }

        drawBoard();



        //var buttons = [
        //    seedSimpleShape({
        //        x: zz.world.w - zzUtil.shapeSize(button).w,
        //        y: zz.world.h - zzUtil.shapeSize(button).h, shape: button, color: '#eeeeee', borderColor: '#666666'
        //    }),

        //    seedSimpleShape({ x: 0, y: zz.world.h - zzUtil.shapeSize(button).h, shape: button, color: '#eeeeee', borderColor: '#666666' }),
        //    seedSimpleShape({ x: (zz.world.w/2) - 40 , y: zz.world.h - zzUtil.shapeSize(button).h, shape: button, color: '#eeee11', borderColor: '#666666' })
        //];



        var gameControl = {
            state: -1, //all above zero is running, -1 notstarted, -2 gameovcer
            defaultBlockColor: defaultBlockColor,
            currentFallingItem: {
                variShape: null,
                rotation: 0, //index,
                offsetX: 0,
                offsetY: 0,
                color: '#ff2299',
                rotate: function () {
                    if (gameControl.isCollidingSideways(1) || gameControl.isCollidingSideways(-1)) { //TODO TEST THIS SHWAJT
                        return;
                    }

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
                if (this.state < 0) {
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
                for (var i = 0; i < boardMap.length ; i++) {
                    for (var a = 0 ; a < boardMap[i].length ; a++) {
                        if (!boardMap[i][a].blocked) {
                            boardMap[i][a].fillColor = this.defaultBlockColor;
                        }
                    }
                }
            }
            ,
            blockCurrentItemInBoard: function () {
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
                    if (boardMap[currShape[i] + x][currShape[i + 1] + y + 1].blocked) {
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
            checkScore: function () {
                //check one row in boardMap at a time, and check if all items are blocked,
                //then remove those and maybe move all above one step down
                //just wanna do reduce here....did nt work though l o l 
                for (var i = 0; i < boardMap[0].length; i++) {
                    var allblockedonrow = true;
                    for (var a = boardMap.length - 1; a >= 0; a--) {
                        if (boardMap[a][i].blocked === undefined || boardMap[a][i].blocked == false) { //CHECK THIS LAST ONE
                            allblockedonrow = false;
                        }
                    }
                    if (allblockedonrow) {
                        for (var a = boardMap.length - 1; a >= 0; a--) {
                            boardMap[a][i].fillColor = this.defaultBlockColor;
                            boardMap[a][i].blocked = false;

                            for (var s = i - 1; s >= 0; s--) {
                                if (s > 0 && boardMap[a][s].blocked) { //TODO mUSt chek ALL lines above, EVERYTHING SHALL MOVE DOWN
                                    //CHECK ABOVE COLS HERE AND MOVE DOWN (chg fillcolor)
                                    var blItem = boardMap[a][s];
                                    var foundItemColor = blItem.fillColor;
                                    blItem.fillColor = this.defaultBlockColor; //delite the one above
                                    blItem.blocked = false;
                                    boardMap[a][s + 1].fillColor = foundItemColor; //hilite the one were on
                                    boardMap[a][s + 1].blocked = true;

                                }

                            }

                        }
                        this.score.add();

                        //psuedo: go through the row with the hit. For each col check if there is an item attached to the correspondig col above - then move
                        //that item to where we are. Otherwise just delete it.
                    }
                }
                if (this.currentFallingItem.offsetY < 1) {
                    //alert("game over") //?
                    this.state = -2;
                    //renderStartScreen();
                    boardMap.forEach(function (a) {
                        a.forEach(function (b) {
                            b.mass = 0.13;
                        });
                    });
                    setTimeout(function () {
                        renderGameOver();
                    }, 1500);
                }



            },
            initFallingItem: function () {
                //  this.state = 1;
                this.currentFallingItem.variShape = [longy, zed, zedReverse, cube, theL, theLReverse,halfPlus].randItem();
                this.currentFallingItem.offsetX = 5;
                this.currentFallingItem.offsetY = 0;
                this.currentFallingItem.rotation = 0;
                this.currentFallingItem.color = ['#7d9dac', '#de7011', '#ff4f45', '#fbef29', '#a67c52', '#669e91'].randItem();
                this.seedFallingItem();

            },
            score: {
                value: 0,
                add: function () {
                    this.value++;
                    this.zzItem.text = this.constructText();
                },
                constructText: function () {
                    var digits = "";
                    if (this.value < 10) {
                        digits = "00" + this.value;
                    }
                    else if (this.value < 100) {
                        digits = "0" + this.value;
                    }
                    else {
                        digits = this.value;
                    }

                    this.scoreText = "LINES: " + digits;
                    //(this.value < 10 ? "00" + this.value : this.value < 100 ? "0" + this.value : this.value);
                    return this.scoreText;
                },
                init: function () {
                    this.value = 0;
                    this.constructText();
                    this.zzItem = new zz.textBlock(block * 0.4, (block * 19) + 4, 200, 30, this.scoreText, '#a67c52', { size: block * 0.7, font: 'arial', fontStyle: 'bold' });
                    zz.world.items.push(
                        this.zzItem
                        );

                }
            }



        }

        //buttons.forEach(function (b) {
        //    zz.world.items.push(b);
        //})



        //buttons.forEach(function (b) {
        //    zzInteraction.bind(b, "mouseover", function (ev, zzItem) {
        //        zzItem.fillColor = "#0000FF";
        //    });
        //    zzInteraction.bind(b, "mouseout", function (ev, zzItem) {
        //        zzItem.fillColor = "#EEEEEE";
        //    });
        //});

        //zzInteraction.bind(buttons[0], "mousedown", function (ev, zzItem) {
        //    //right
        //    gameControl.moveItemSideways(1);
        //});



        //zzInteraction.bind(buttons[1], "mousedown", function (ev, zzItem) {
        //    //left
        //    gameControl.moveItemSideways(-1);
        //});

        //zzInteraction.bind(buttons[2], "mousedown", function (ev, zzItem) {
        //    //rotate btn
        //  gameControl.currentFallingItem.rotate();
        //});

        var tmpDate = new Date().getTime();


        //draw some cool alphanums....

        function renderStaticItems() {

            var footer = seedSimpleShape({
                x: 0,
                y: block * 18.2, shape: footerBg, color: '#222222', borderColor: '#222222'
            });
            zz.world.items.push(footer);

        }




        function renderStartScreen() {

            gameControl.startScreenItems = [];
            var startButton = new zz.stickFigure(0, 0, block * 11, block * 18, '#333333', defaultBlockColor, zzUtil.blockify(miniCube, block * 18), 0, { x: 0, y: 0 })
            zz.world.items.push(
                startButton
                );
            //var tControl = new zz.textBlock((zz.world.w / 2) - block*3.5, block*4, 200, 30, "TETRIS", '#ff4f45', {size:block*2.5,font:'arial',fontStyle:'bold'});
            //var startText = new zz.textBlock((zz.world.w / 2) - block * 2.1, block * 8, 200, 30, "Start >", '#ff4f45', { size: block * 1.5, font: 'arial', fontStyle: 'bold' });

            gameControl.startScreenItems.push(startButton);

            var yposLetter = 5;
            letterbox.renderSentence('tetris', 14.5, 1, yposLetter, '#ff4f45').forEach(function (a) {
                a.forEach(function (b) {
                    //now in StickFigs
                    gameControl.startScreenItems.push(b);
                });
            });


            gameControl.startScreenItems.push(
                      new zz.image(
                      {
                          src: "../img/tetrisArrowsLeftRight.png",
                          x: block * 3,
                          y: block * 5,
                          w: block * 4.41,
                          h: block * 3
                      }
              ));
            gameControl.startScreenItems.push(
                      new zz.image(
                      {
                          src: "../img/tetrisRotate.png",
                          x: block * 3,
                          y: block * 9,
                          w: block * 4.41,
                          h: block * 2.5
                      }
              ));
            gameControl.startScreenItems.push(
                      new zz.image(
                      {
                          src: "../img/tetrisplay.png",
                          x: block * 2,
                          y: block * 13,
                          w: block * 6.55,
                          h: block * 3
                      }
              ));

            gameControl.startScreenItems.forEach(function (a) {
                zz.world.items.push(a);
            });



            zzInteraction.bind(startButton, "mousedown", function (ev, zzItem) {
                hideStartScreen();
                gameControl.state = 1;
                gameControl.initFallingItem();
            });


        }




        function renderGameOver() {

            gameControl.gameOverItems = [];
            var startButton = new zz.stickFigure(0, 0, block * 11, block * 18, '#333333', defaultBlockColor, zzUtil.blockify(miniCube, block * 18), 0, { x: 0, y: 0 })
            zz.world.items.push(
                startButton
                );
            //var tControl = new zz.textBlock((zz.world.w / 2) - block*3.5, block*4, 200, 30, "TETRIS", '#ff4f45', {size:block*2.5,font:'arial',fontStyle:'bold'});
            //var startText = new zz.textBlock((zz.world.w / 2) - block * 2.1, block * 8, 200, 30, "Start >", '#ff4f45', { size: block * 1.5, font: 'arial', fontStyle: 'bold' });

            gameControl.gameOverItems.push(startButton);

            var yposLetter = 5;
            letterbox.renderSentence('game', 15.5, 3, yposLetter, '#ff4f45').forEach(function (a) {
                a.forEach(function (b) {
                    //now in StickFigs
                    gameControl.gameOverItems.push(b);
                });
            });
            letterbox.renderSentence('over', 15.5, 3, 11, '#ff4f45').forEach(function (a) {
                a.forEach(function (b) {
                    //now in StickFigs
                    gameControl.gameOverItems.push(b);
                });
            });

            var scorecolor = '#de7011';
            letterbox.renderSentence('score', 15.5, 3, 23, scorecolor).forEach(function (a) {
                a.forEach(function (b) {
                    //now in StickFigs
                    gameControl.gameOverItems.push(b);
                });
            });
            var scoreText = new zz.textBlock(block * 1, (block * 12) + 4, 200, 60, gameControl.score.value, scorecolor, { size: block * 3, font: 'arial', fontStyle: 'bold' });
            gameControl.gameOverItems.push(scoreText);


            gameControl.gameOverItems.push(
              new zz.image(
                      {
                          src: "../img/tetrisplay.png",
                          x: block * 2,
                          y: block * 13,
                          w: block * 6.55,
                          h: block * 3
                      }
              ));

            gameControl.gameOverItems.forEach(function (a) {
                zz.world.items.push(a);
            });



            zzInteraction.bind(startButton, "mousedown", function (ev, zzItem) {
                hideGameOver();
                drawBoard();
                gameControl.state = 1;
                gameControl.score.value = 0;
                gameControl.initFallingItem();
            });


        }

        renderStaticItems();
        renderStartScreen();
        gameControl.score.init();

        function hideStartScreen() {
            gameControl.startScreenItems.forEach(function (a) {
                a.x = 1000;
            })
        }
        function hideGameOver() {
            gameControl.gameOverItems.forEach(function (a) {
                a.x = 1000;
            })
        }


        // zz.world.items.push(new zz.textBlock(10, 24, 200, 30, "Tetris by frankfurillo", 44));

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
                kds = "";
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
                    }, 30);
                }
            }
            if (event.keyCode === 38) {
                gameControl.currentFallingItem.rotate();
            }
        });

        //TODO move this crap out to a module... 
        var mobileInput = {
            accelerometer: [0, 0, 0], //x,y,z
            deltaX: 0,
            deltaY: 0,
            touchStartX: 0,
            touchStartY: 0,
            touchEndX: 0,
            touchEndY: 0,
            isTap: false,
            isTouching: false,
            swipeAngle: 0,
            swipeDirection: "left",
            calculateAngle: function () {
                var X = this.touchStartX - this.touchEndX;
                var Y = this.touchEndY - this.touchStartY;
                var Z = Math.round(Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2))); //the distance - rounded - in pixels
                var r = Math.atan2(Y, X); //angle in radians (Cartesian system)
                this.swipeAngle = Math.round(r * 180 / Math.PI); //angle in degrees
                if (this.swipeAngle < 0) { this.swipeAngle = 360 - Math.abs(this.swipeAngle); }
            },
            setTouchEnd: function (event) {
                var orig = event.originalEvent;
                this.touchEndX = orig.touches[0].pageX;
                this.touchEndY = orig.touches[0].pageY;
            },
            calculateSwipeDirection: function () {
                if ((this.swipeAngle <= 45) && (this.swipeAngle >= 0)) {
                    this.swipeDirection = 'left';
                } else if ((this.swipeAngle <= 360) && (this.swipeAngle >= 315)) {
                    this.swipeDirection = 'left';
                } else if ((this.swipeAngle >= 135) && (this.swipeAngle <= 225)) {
                    this.swipeDirection = 'right';
                } else if ((this.swipeAngle > 45) && (this.swipeAngle < 135)) {
                    this.swipeDirection = 'down';
                } else {
                    this.swipeDirection = 'up';
                }
            },
            calcIsTap: function () {
                if (this.touchEndX == 0) {
                    return true;
                }
                return false;
                /*				var x = this.touchStartX - this.touchEndX;
                                var y = this.touchEndY - this.touchStartY;
                                this.isTap= (x < 3 && y < 3);
                                */
            }
        }
        $(document).bind("touchstart", function (event) {
            //
            if (gameControl.state < 0) {
                return;
            }

            var orig = event.originalEvent;
            mobileInput.touchEndX = 0;
            mobileInput.touchEndY = 0;
            mobileInput.touchStartY = orig.touches[0].pageY;
            mobileInput.touchStartX = orig.touches[0].pageX;
            mobileInput.isTouching = true;
        });


        $(document).bind("touchend", function (event) {
            //event.preventDefault();
            if(mobileInput.calcIsTap()){ //need no angles or direction on a tap..
                gameControl.currentFallingItem.rotate();
            }
            else {
                mobileInput.calculateAngle();
                mobileInput.calculateSwipeDirection();
                if (mobileInput.swipeDirection == "left") {
                    gameControl.moveItemSideways(-1);

                }
                else if (mobileInput.swipeDirection == "right") {
                    gameControl.moveItemSideways(1);

                }
                else if (mobileInput.swipeDirection == "down") {
                    handleFallingItem();
                }
            }
            mobileInput.isTouching = false;
            //    killKeyDownAction();

        });



        $(document).bind("touchmove", function (event) {
            event.preventDefault();
            mobileInput.setTouchEnd(event);

        });


    });
});
