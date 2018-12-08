"use strict";
import store from './lib/store.js'

class StupidGrid extends HTMLElement{
    constructor(){
        super();
        const shadow = this.attachShadow({mode: 'open'});
        let wrapper = document.createElement('span');
        let text = this.getAttribute('text');
        wrapper.title = text;
        wrapper.innerHTML='<strong>text</strong>';
        shadow.appendChild(wrapper);
    }
};

function init(){
    customElements.define('stupid-grid',StupidGrid);
}

document.addEventListener("DOMContentLoaded", function(event) { 
    init();
    store.updateState("idiots","pug");    
});