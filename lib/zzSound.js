define(['lib/Qutils'], function zzSound() {
    var qutils = require('lib/Qutils');
    var synth = {
        //EXE http://localhost/AngularSpa3/urlSynth/index.html?{%22command%22:%22sequence%22,%22notes%22:[12,24]}

        init: function (opts, loadedFunction) {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = ctx = new AudioContext();
            vca = ctx.createGain();

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
            defaultTempo: 500
        },
        playNotes: function (notes, opts) { //a,b,c,h,h,...
            var freqSeq = notes.map(function (n) {
                return qutils.noteToFrequency(n);
            });
            alert(freqSeq);
        }
    }


    return synth;

});