define(['jquery'], function ($) {
    "use strict"

	var jQuencer = {
		ctx: null,
		pause: true,
		vca:null,
		st: "",
		bufferSize: 2048,
		defaults : {
			maxFrequency: 2000
		},

		//EXE http://localhost/AngularSpa3/jQuencer/index.html?{%22command%22:%22sequence%22,%22notes%22:[12,24]}
		init:function(ctx,connectionNode,loadedFunction) {
			this.pause=false;
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			this.ctx = ctx;
      this.vca = connectionNode;
			this.sequencer.run();
				loadedFunction(this.ctx);
		},

		tempoCalculator : {
			msFromBpm: function (bpm) {
				return 60000 / bpm;
			},
			defaultTempo: 120.0,
			changeTempo: function (bpm) {
				jQuencer.sequencer.tempo= bpm;
			}
		}
		,
		sequencer : {
			startTime:null,              // The start time of the entire sequence.

			tempo :120.0,      	    // tempo (in beats per minute)
			lookahead : 25.0,       // How frequently to call scheduling function
			//(in milliseconds)
			scheduleAheadTime : 0.1,    // How far ahead to schedule audio (sec)
			// This is calculated from lookahead, and overlaps
			// with next interval (in case the timer is late)
			nextNoteTime : 0.0,     // when the next note is due.
			timerID : 0,            // setInterval identifier.
			notesInQueue : [],      // the notes that have been put into the web audio,

			globalDecay: 0.2,
			globalAttack: 0.01,

			stepStarted: $.Event("StepStarted"),
			stepStopped: $.Event("StepStopped"),
			currentIndex: 0,
			steps : [],
			stopPreviousStep: function () {
				//return;
				if (this.steps.length == 0) {
					return;
				}
				if (this.currentIndex < 0) {
					return;
				}
				var workOnIndex = this.currentIndex - 1;
				if (this.currentIndex == 0) {
					workOnIndex = this.steps.length - 1; //take last in list if firstIsPlaying
				}
				var oList = this.steps[workOnIndex].oscillators;
				oList.forEach(function (osc) {
					if (typeof (osc.oscillator) != "undefined") {

						//osc.oscillator.stop(0);
						//osc.oscillator.disconnect();
					}
				});

			}
			,
			getOscillator:function(stepIndex,oscillatorIndex){
				return this.steps[stepIndex].oscillators[oscillatorIndex];
			},
			addStep: function (oscillatorList) {
				this.steps.push(new jQuencer.sequenceStep(oscillatorList));
				return this.steps.length - 1; //index of added step
			},
			addToStep:function(index,type,freq){
				//if (index > this.steps.length - 1) { throw "step out of range"; }
				var newOsc={ type: type, freq: freq };
				if (index > this.steps.length - 1) { //add one if missing
					this.steps.push(new jQuencer.sequenceStep([newOsc]));
					return 0;
				}
				this.steps[index].oscillators.push(newOsc);
				return this.steps[index].oscillators.length-1; //return index of added oscillator
			},
			removeFromStep:function(stepIndex,oscillatorIndex){
				this.steps[stepIndex].oscillators.splice(oscillatorIndex,1);
			},

			scheduler:function() {
				// while there are notes that will need to play before the next interval,
				// schedule them and advance the pointer.
				while (this.nextNoteTime < jQuencer.ctx.currentTime + this.scheduleAheadTime ) {
					this.scheduleNote( this.currentIndex, this.nextNoteTime );
					this.nextNote();
				};
				this.timerID = window.setTimeout( function(){
					jQuencer.sequencer.scheduler();
				}, this.lookahead );
			},

			nextNote:function() {
				// Advance current note and time by a 16th note...
				var secondsPerBeat = 60.0 / this.tempo;    // Notice this picks up the CURRENT
				// tempo value to calculate beat length.
				this.nextNoteTime += 0.75 * secondsPerBeat;    // Add beat length to last beat time

				this.currentIndex++;    // Advance the beat number, wrap to zero
				if (this.currentIndex== this.steps.length ) {
					this.currentIndex = 0;
				}
			},
			scheduleNote:function ( beatNumber, time ) {
				// push the note on the queue, even if we're not playing.
				this.notesInQueue.push( { note: beatNumber, time: time } );

				// create an oscillator
				//var osc = jQuencer.ctx.createOscillator();
				//osc.connect( jQuencer.ctx.destination );
				//osc.frequency.value = 220.0;

				//osc.start( time );
				//osc.stop(time + 0.2);

				var oList = this.steps[this.currentIndex].oscillators;
				oList.forEach(function (osc) {

					var n = time;
					jQuencer.vca.gain.cancelScheduledValues(n);
					jQuencer.vca.gain.setValueAtTime(0, n);
					var topVol = 0.1 / oList.length; //
					if (jQuencer.pause) {
						topVol = 0;
					}
					jQuencer.vca.gain.linearRampToValueAtTime(topVol, n + jQuencer.sequencer.globalAttack);
					//		        var decay = 0.2;
					jQuencer.vca.gain.linearRampToValueAtTime(0.0, n + jQuencer.sequencer.globalAttack+ jQuencer.sequencer.globalDecay);
					//jQuencer.vca.connect(jQuencer.ctx.destination);

					var o = jQuencer.ctx.createOscillator();
					o.type = osc.type;
					o.frequency.value = osc.freq;
					o.connect(jQuencer.vca);
					o.start(0);
					o.stop(n + jQuencer.sequencer.globalAttack+  jQuencer.sequencer.globalDecay + 0.0001);
					o.onended = function () {
						o.disconnect();
						// $("body").trigger(jQuencer.sequencer.stepStopped);

					};
					osc.oscillator = o;

				});
				$("body").trigger(jQuencer.sequencer.stepStarted);



			},

			timerCount:0,

			run: function () {

				this.isPlaying = !this.isPlaying;
				if (this.isPlaying) { // start playing
					this.currentIndex = 0;
					this.nextNoteTime = jQuencer.ctx.currentTime;
					this.scheduler();    // kick off scheduling
					return "stop";
				} else {
					window.clearTimeout( timerID );
					return "play";
				}


				clearTimeout(this.st);
				this.st = setTimeout(function () {
					if (jQuencer.sequencer.currentIndex > jQuencer.sequencer.steps.length - 1) {
						jQuencer.sequencer.currentIndex = 0;
					}
					jQuencer.sequencer.run();

				}, jQuencer.tempoCalculator.defaultTempo);

			}

		},



		sequenceStep:function(arrOscillatorList) {
			this.oscillators = arrOscillatorList || [];
			this.index = jQuencer.sequencer.currentIndex;
			//this.type = type;
			//this.freq = freq;
		}

		,

		stop:function() {
			this.pause=true;//not implemented
		},

		start:function() {
			this.pause=false;

		},

	}
  return jQuencer;
});
