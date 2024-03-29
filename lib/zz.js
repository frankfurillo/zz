﻿/// <reference path="jquery-2.1.1.min.js" />
/// <reference path="vendor/curve.js" />
define(['jquery','curve'], function ($) {
    "use strict"
    var ctx, canvas;
    var TO_RADIANS = Math.PI / 180;
    var ids = 0;
    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    var zz = {
        canvas: null,
        renderCallback: null,
        startTime:null,
        init: function (_canvas,resizeCallback) {
            canvas = _canvas;
            this.canvas = canvas;
            if(resizeCallback!=="undefined"){
                resizeCallback(this.canvas);
            }
            //this.canvas.style.width = this.canvas.width;
            this.world.h = _canvas.height;
            this.world.w = _canvas.width;
            ctx = canvas.getContext('2d');

        },
        spriteEngine: {
            spriteImageSrc: null
        },
        run: function (_renderCallback) {
            this.renderCallback = _renderCallback;
            this.startTime = (new Date()).getTime();
            this.animate(this.startTime);
        },

        definitions: {
            shapes: []
        }
        ,
        world: {
            w: 0,
            h: 0,
            items: [],
            wind: {
                x: 30,
                y: 0
            },
            friction: {
                global: 0
            },
            gravity: {
                x: 0,
                y: 4,
            },
            adjustItemsToGravity: function () {
                var objRef = this;
                this.items.forEach(function (it) {
                    if (it.speedY === undefined)
                        return;

                    it.speedY += 0.1; //accelerate
                    it.y = it.y + it.attachedForce.y + objRef.gravity.y * it.speedY * it.mass;
                    it.x = it.x + it.attachedForce.x + objRef.gravity.x + 1000 * it.speedX;
                });
            }
        },


        isCollide: function (a, b) {
            return !(
            ((a.y + a.h) < (b.y)) ||
            (a.y > (b.y + b.h)) ||
            ((a.x + a.w) < b.x) ||
            (a.x > (b.x + b.w))
            );
        },
        stickFigure: function (x, y, w, h, fillColor, strokeColor, path, mass, attachedForce) {
            this.x = x;
            this.y = y;
            this.h = h;
            this.w = w;
            this.speedY = 0;
            this.speedX = 0;

            this.fillColor = fillColor || '#000000';
            this.strokeColor = strokeColor || '#000000';
            this.path = path;
            this.pathType = "square"
            this.mass = mass || 0; //viktlös
            this.attachedForce = attachedForce || { x: 0, y: 0 };
            this.original = {};
            jQuery.extend(this.original, this);
            this.id = Math.random();

        },
        textBlock:function(x,y,w,h,text,fillColor,textOptions){
            this.x = x;
            this.y = y;
            this.h = h;
            this.w = w;
            this.speedY = 0;
            this.speedX = 0;
            this.fontStyle = textOptions.fontStyle || 'normal';
            this.size = textOptions.size|| 12;
            this.fillColor = fillColor || '#000000';
            this.original = {};
            this.text = text;
            this.family =textOptions.font ||"Arial";
            this.mass =  0; //viktlös
            this.attachedForce = { x: 0, y: 0 };
            jQuery.extend(this.original, this);
        },


        animate: function (startTime) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw
            this.world.adjustItemsToGravity();
            this.renderCallback(ctx);
            //try {
            //    this.world.adjustItemsToGravity();
            //    this.renderCallback(ctx);
            //}
            //catch (e) {
            //    alert("No callback defined, or bad callback");
            //    alert(e.message);
            //}

            //skier.render();
            // request new frame
            requestAnimFrame(function () {
                zz.animate(startTime);
            });
        },

        calcBezierPoint: function (t, p0, p1, p2, p3) {
            var data = [p0, p1, p2, p3];
            var at = 1 - t;
            for (var i = 1; i < data.length; i++) {
                for (var k = 0; k < data.length - i; k++) {
                    data[k] = {
                        x: data[k].x * at + data[k + 1].x * t,
                        y: data[k].y * at + data[k + 1].y * t
                    };
                }
            }
            return data[0];
        },

        sprite: function (x, y, w, h, spriteX, spriteY) {
            this.x = x;
            this.y = y;
            var tmp = new Image();
            tmp.src = zz.spriteEngine.spriteImageSrc == null ? new Error("Sprite image undefined") : zz.spriteEngine.spriteImageSrc;
            this.charImage = tmp;
            this.w = w || 22;
            this.h = h || 28;
            this.speedY = 0;
            this.speedX = 0;
            this.spriteX = spriteX || 0;
            this.spriteY = spriteY || 0;
            this.mass = 0; //viktlös
            this.attachedForce = { x: 0, y: 0 };
            this.original = {};
            jQuery.extend(this.original, this);
            this.angle = 0;
            this.moveDir = 0;

        },

        image : function(imageOpts){
            this.options = imageOpts;
            var tmp = new Image();
            tmp.src = imageOpts.src;
            this.image = tmp;
            convertOpts(this, imageOpts);
        },



        resetAllProps: function (avoid) {
            for (var key in this) {
                if (this.hasOwnProperty(key) && key != "original") {
                    if (avoid != key) {
                        this[key] = this.original[key];
                    }
                }
            }
        },


        ctxDirty: false,
        saveContext: function () {
            ctx.save();
            this.ctxDirty = true;
        },
        restoreContext: function () {
            if (this.ctxDirty) {
                ctx.restore();
                this.ctxDirty = false;
            }
        }
    }

    zz.stickFigure.prototype.reset = zz.resetAllProps;
    zz.sprite.prototype.reset = zz.resetAllProps;
    zz.sprite.prototype.render = function (onRenderEnd) {
        if (this.angle != 0) {
            saveContext();
            doRestore = true;
            ctx.translate(this.x + (this.w / 2), this.y + (this.h / 2));
            ctx.rotate(this.presentationAngle * TO_RADIANS);
            ctx.translate(-1 * (this.x + (this.w / 2)), -1 * (this.y + (this.h / 2)));
        }
        ctx.drawImage(this.charImage, this.spriteX, this.spriteY, this.w, this.h, this.x, this.y, this.w, this.h);
        zz.restoreContext();
        if (typeof onRenderEnd != "undefined") {
            onRenderEnd(this);
        }

    }

    function convertOpts(o,opts) {
        o.x = opts.x;
        o.y = opts.y;
        o.w = opts.w;
        o.h = opts.h;
    }

    zz.textBlock.prototype.render = function () {
        ctx.font = this.fontStyle +' '+  this.size + 'px ' + this.family ;
        ctx.fillStyle = this.fillColor;

        ctx.fillText(this.text, this.x, this.y);
    }

    zz.image.prototype.render = function () {
            ctx.drawImage(this.image, this.x, this.y, this.w, this.h);

    }

    zz.stickFigure.prototype.render = function (onRenderEnd) { //[[x,y],[x,y]...]
        var doRestore = false;
        if (this.angle != 0) {
            zz.saveContext();
            doRestore = true;
            ctx.translate(this.x + (this.w / 2), this.y + (this.h / 2));
            ctx.rotate(this.angle * TO_RADIANS);
            ctx.translate(-1 * (this.x + (this.w / 2)), -1 * (this.y + (this.h / 2)));
        }
        ctx.beginPath();
        ctx.moveTo(this.path[0] + this.x, this.path[1] + this.y);
        if (this.pathType == "square") {
            for (var i = 2; i < this.path.length; i += 2) {
                ctx.lineTo(this.path[i] + this.x, this.path[i + 1] + this.y);
            }
        }
        else { //
            var newPath = ctx.curve(this.path, 0.5, 10, false, this.x, this.y);
        }
        ctx.closePath();
        ctx.lineWidth = this.lineWidth | 1;
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        ctx.stroke();
        ctx.fill();
        zz.restoreContext();
        if (typeof onRenderEnd != "undefined")
            onRenderEnd(this);
    };


    return zz;
});