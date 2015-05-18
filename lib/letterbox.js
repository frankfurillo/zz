/// <reference path="jquery-1.9.1.min.js" />

define(function jsLetters(zz) {
    var zz = require('lib/zz');
    var zzUtil = require('lib/zzUtil');
    var kindof = require('lib/kindof');
    var letterBox = {
        renderLetter:function(letter, letterBlockSize, x, y) {
            var renderedLetters = [];
            letter.forEach(function (row, rowIndex) {
                row.forEach(function (item, colIndex) {
                    if (item == 1) {
                        var letterBlock = new zz.stickFigure(
                                colIndex * letterBlockSize + (x * letterBlockSize),
                                rowIndex * letterBlockSize + (y * letterBlockSize),
                                letterBlockSize * 4,
                                letterBlockSize * 5,
                                kindof('#ff4f45', 0.2),
                                kindof('#ff4f45', 0.2),
                                zzUtil.blockify(miniCube, letterBlockSize),
                                0,
                                {
                                    x: 0,
                                    y: 0
                                }
                            );
                        renderedLetters.push(letterBlock);
                        //zz.world.items.push(letterBlock);
                    }
                }); // would be nice to return a list of added items, - as a group which could be operated on later.
            });
            return renderedLetters;
        },
        renderSentence:function(sentence,letterBlockSize,x,y,color){
            //letterBox.renderLetter(letterBox.alphabet.g, 10, 2, 10);
            var renderedLetters = [];
            sentence.split('').forEach(function (c, index) {
                //var p = ((x + letterBlockSize) + index * letterBlockSize);
                //alert (p)
                renderedLetters.push(letterBox.renderLetter(letterBox.alphabet[c], letterBlockSize, (x + (index * letterBlockSize*0.34)), y));
            });
            return renderedLetters;
        },

         alphabet: {
             a:
            [[0, 1, 1, 1, 0],
             [1, 0, 0, 0, 1],
             [1, 1, 1, 1, 1],
             [1, 0, 0, 0, 1],
             [1, 0, 0, 0, 1]]
             ,
             b:
            [[1, 1, 1, 0, 0],
             [1, 0, 0, 1, 0],
             [1, 1, 1, 1, 0],
             [1, 0, 0, 1, 0],
             [1, 1, 1, 1, 0]],
             c:
[[0, 1, 1, 1],
[1, 0, 0, 1],
[1, 0, 0, 0],
[1, 0, 0, 0],
[0, 1, 1, 1]]
,
             d:
[[1, 1, 1, 0],
[1, 0, 0, 1],
[1, 0, 0, 1],
[1, 0, 0, 1],
[1, 1, 1, 0]]
,
             e:
[[1, 1, 1, 1],
[1, 0, 0, 0],
[1, 1, 1, 1],
[1, 0, 0, 0],
[1, 1, 1, 1]]
,
             f:
[[1, 1, 1, 1],
[1, 0, 0, 0],
[1, 1, 1, 1],
[1, 0, 0, 0],
[1, 0, 0, 0]]
,
             g:
[[1, 1, 1, 1],
[1, 0, 0, 0],
[1, 0, 1, 1],
[1, 0, 0, 1],
[1, 1, 1, 1]]
,
             h:
[[1, 0, 0, 1],
[1, 0, 0, 1],
[1, 1, 1, 1],
[1, 0, 0, 1],
[1, 0, 0, 1]]
             ,
             i:
[[0, 1, 1, 0],
[0, 0, 0, 0],
[0, 1, 1, 0],
[0, 1, 1, 0],
[0, 1, 1, 0]]
,
             j:
[[0, 1, 1, 0],
[0, 0, 1, 0],
[0, 0, 1, 0],
[1, 0, 1, 0],
[1, 1, 1, 0]]

             , k:
[[1, 0, 1, 0],
[1, 1, 0, 0],
[1, 1, 1, 0],
[1, 0, 0, 1],
[1, 0, 0, 1]]

             , l:
[[1, 0, 0, 0],
[1, 0, 0, 0],
[1, 0, 0, 0],
[1, 0, 0, 0],
[1, 1, 1, 1]]

             , m:
[[1, 0, 0, 0, 1],
[1, 1, 0, 1, 1 ],
[1, 0, 1, 0 , 1],
[1, 0, 0, 0 , 1],
[1, 0, 0, 0, 1]]
             , n:
[[1, 0, 0, 1],
[1, 1, 0, 1],
[1, 0, 1, 1],
[1, 0, 0, 1],
[1, 0, 0, 1]]

, o:
[[0, 1, 1, 0],
[1, 0, 0, 1],
[1, 0, 0, 1],
[1, 0, 0, 1],
[0, 1, 1, 0]]
, p:
[[1, 1, 1, 0],
[1, 0, 0, 1],
[1, 1, 1, 0],
[1, 0, 0, 0],
[1, 0, 0, 0]]
, q:
[[0, 1, 1, 0],
[1, 0, 0, 1],
[1, 0, 0, 1],
[1, 0, 1, 0],
[0, 1, 0, 1]]
, r:
[[1, 1, 1, 0],
[1, 0, 0, 1],
[1, 1, 1, 0],
[1, 0, 1, 0],
[1, 0, 0, 1]]
, s:
[[0, 1, 1, 1],
[1, 0, 0, 0],
[0, 1, 1, 0],
[0, 0, 0, 1],
[1, 1, 1, 0]]
, t:
[[1, 1, 1, 1,1],
[0, 0, 1, 0,0],
[0, 0, 1, 0,0],
[0, 0, 1, 0,0],
[0, 0, 1, 0,0]]
, u:
[[1, 0, 0, 1],
[1, 0, 0, 1],
[1, 0, 0, 1],
[1, 0, 0, 1],
[0, 1, 1, 0]]
, v:
[[1, 0, 0, 1],
[1, 0, 0, 1],
[0, 1, 0, 1],
[0 ,1, 1, 0],
[0, 1, 1, 0]]
, w:
[[1, 0, 0, 0,1],
[1, 0, 0, 0,1],
[1, 0, 1, 0,1],
[1, 1, 0, 1,1],
[1, 0, 0, 0,1]]
, x:
[[1, 0, 0, 1],
[0, 1, 1, 0],
[0, 1, 1, 0],
[0, 1, 1, 0],
[1, 0, 0, 1]]
, y:
[[1, 0, 0, 1],
[1, 0, 0, 1],
[0, 1, 1, 1],
[0, 0, 0, 1],
[0, 0, 1, 1]]
, z:
[[1, 1, 1, 1],
[0, 0, 1, 0],
[0, 1, 0, 0],
[1, 0, 0, 0],
[1, 1, 1, 1]]
, space:
[[0,0,0,0],
[0, 0, 0, 0],
[0, 0, 0, 0],
[0, 0, 0, 0],
[0, 0, 0, 0]]
, dot:
[[0, 0, 0, 0],
[0, 0, 0, 0],
[0, 0, 0, 0],
[1, 1, 0, 0],
[1, 1, 0, 0]]
, exclamation:
[[0, 1, 1, 0],
[0, 1, 1, 0],
[0, 1, 1, 0],
[0, 0, 0, 0],
[0, 1, 1, 0]]

             
         },

     }
     return letterBox;
 });