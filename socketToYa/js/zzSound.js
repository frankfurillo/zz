import {noteToFrequency, numberedArrayFrom} from './Qutils.js'; 
import kindof from './kindof.js';
export  default  {
        self:this,
        ossis:[],
        ctx:null,
        farmSize:10,
        detune:0.01,
        //jQuencer:jQuencer,
        init: function (opts, loadedFunction) {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx  = new AudioContext();
            this.vca = this.ctx.createGain();
            this.vca.gain.value=0.3;
            this.vca.connect(this.ctx.destination);
            if (typeof (opts.tempo) != "undefined") {
                this.tempoCalculator.defaultTempo = this.tempoCalculator.msFromBpm(opts.tempo);
            }
            //query.notes.forEach(function (note) {
            //    seq.addStep("sawtooth", note);
            //});
            //seq.run();

            loadedFunction(this);
        }
        ,
        tempoCalculator: {
            msFromBpm: function (bpm) {
                return 60000 / bpm;
            }
            ,
            defaultTempo: 700
        },
        // playSequence:function(notes){
        //   var freqSeq = notes.map(function (n) {
        //       return noteToFrequency(n);
        //   });
        //   this.playSequenceOfFreqs(freqSeq);
        // },
        // playSequenceOfFreqs(freqSeq){
        //   freqSeq.forEach(function(f){
        //     var newOsc={ type: 'square', freq: f };
        //     jQuencer.sequencer.addStep([newOsc]);
        //   });
          
        //   jQuencer.init(this.ctx, this.vca, function(ctx){
        //         //return jQuencer;
        //   });
        //   console.log(freqSeq);
            
        // },
        playNotes: function (notes, opts) { //a,b,c,h,h,...
            var freqSeq = notes.map(function (n) {
                return qutils.noteToFrequency(n);
            });
        },
        playFreq:function(freq){
            //let oscFarm = [];
            let test = numberedArrayFrom(this.farmSize);
            let oscFarm =numberedArrayFrom(this.farmSize).map(x=>
                {
                let oscillator = this.ctx.createOscillator();
                oscillator.frequency.value =  kindof.kindof(freq,this.detune);
                oscillator.type='square';
                oscillator.connect(this.vca);
                oscillator.start(0);
                return oscillator;
                }
              );
            this.ossis.push({
              freq:freq,
              oFarm:oscFarm
            });


        },
        stopPlayFreq:function(freq){
          var new_nodes = [];

           for (var i = 0; i < this.ossis.length; i++) {
               if (Math.round(this.ossis[i].freq) === Math.round(freq)) {
                   this.ossis[i].oFarm.forEach(function(o){o.stop(0)});
                   this.ossis[i].oFarm.forEach(function(o){o.disconnect()});
               } else {
                   new_nodes.push(this.ossis[i]);
               }
           }
           this.ossis = new_nodes;          //remove dups¨
        },


  }


