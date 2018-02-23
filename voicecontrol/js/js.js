  "use strict"

requirejs.config({
    baseUrl: '../../',
    paths: {
    },
    paths: {
      lib: 'lib'
    }
});

define(['jquery'], function ($) {
    var activateMic = function() {
    console.log("started...");
    //$('#micbtn').html('S&auml;g n&aring;got p&aring; svenska');
        var recognizer = new webkitSpeechRecognition();
        recognizer.lang = "sv";
        recognizer.continous = true;
        recognizer.onresult = function(event) {
            if (event.results.length > 0) {
                var result = event.results[event.results.length-1];
                if(result.isFinal) {
                    say(result[0].transcript,{reverse:true});
                    $('#output').append(result[0].transcript+'<br>');
                    //setTimeout(function(){activateMic()},1000);
                }
            }
        };
            recognizer.onend = function(event){
            setTimeout(function(){activateMic()},2000);

        }
        recognizer.start();
    };

  $(document).ready(function(){
      activateMic();

  });
});
