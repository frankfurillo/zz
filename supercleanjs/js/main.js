"use strict";
import store from './lib/store.js'
import niceLink from './components/niceLink.js';
import navigationMenu from './components/navigationMenu.js';
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
    //init elements  -move this to more generic set
    customElements.define('navigation-menu',navigationMenu);
    customElements.define('nice-link',niceLink);
    
    //  window.shout = shout;
    //hook up shouter

}

document.addEventListener("DOMContentLoaded", function(event) { 
    init();
    store.updateState("idiots","pug");    
});