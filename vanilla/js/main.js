"use strict";
//import store from './lib/store.js'
//import niceLink from './components/niceLink.js';
import banana from './banana.js';

function init(){
    //init elements  -move this to more generic set
    customElements.define('banana-control',banana);
    
    //  window.shout = shout;
    //hook up shouter

}

document.addEventListener("DOMContentLoaded", function(event) { 
    init();
});