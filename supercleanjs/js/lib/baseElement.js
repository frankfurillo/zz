export default class BaseElement extends HTMLElement{
    constructor(htmlContent){
        super();
        this.htmlContent = htmlContent;
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(document.createRange().createContextualFragment(this.htmlContent));
    }
    
};
