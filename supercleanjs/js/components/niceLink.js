export default class NiceLink extends HTMLElement{
    constructor(){
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(document.createRange().createContextualFragment(this.getContent()));
    }
    getContent() {
        return `<a href="${this.getAttribute("href")}">
        <h2>${this.getAttribute("text")}</h2>
        </a>
        `;

    }
    
};
