import zzSound from './zzSound.js';

document.addEventListener("DOMContentLoaded", function(event) { 
    init();
});
const init = ()=>{
  
  let  keyboard = new QwertyHancock({
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
                   //synth.jQuencer.tempoCalculator.changeTempo(400);
                });
                keyboard.keyDown = function (note, frequency) {
                      zzSound.playFreq(frequency);
                    // Your code here
                };

                keyboard.keyUp = function (note, frequency) {
                    zzSound.stopPlayFreq(frequency);

                    // Your code here
                };

  
};
