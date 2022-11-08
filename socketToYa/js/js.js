requirejs.config({
    baseUrl: '../../',
    paths: {
      es6: "node_modules/requirejs-babel/es6",
      babel: "node_modules/requirejs-babel/babel-4.6.6.min",
      lib: 'lib'
    }
});

define(['jquery',  'lib/kindof', 'lib/zzSound'], function ($, kindof,zzSound) {
  var keyboard;
  
  $(document).ready(function(){
    keyboard = new QwertyHancock({
                     id: 'keys',
                     width: 600,
                     height: 150,
                     octaves: 2,
                     startNote: 'A3',
                     whiteNotesColour: 'white',
                     blackNotesColour: 'black',
                     hoverColour: '#f3e939'
                });
                zzSound.init({},function(synth){
                   window.synth = synth;
                   synth.jQuencer.tempoCalculator.changeTempo(400);
                });
                keyboard.keyDown = function (note, frequency) {
                      zzSound.playFreq(frequency);
                    // Your code here
                };

                keyboard.keyUp = function (note, frequency) {
                    zzSound.stopPlayFreq(frequency);

                    // Your code here
                };

  });
});
