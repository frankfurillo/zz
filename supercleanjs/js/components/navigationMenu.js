export default class NavigationMenu extends HTMLElement{
    constructor(){
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(document.createRange().createContextualFragment(this.getContent()));

        window.shout.subscribe("knapptrycket",()=>{
            alert("fick shout");
        });
    }
    getContent() {
        return `<nav>
        <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#somewhere" onclick="alert('fisk')">Else</a>
            </li>
            <li>
            <nice-link text="muppapa" href="http://www.dn.se"></nice-link>
            </li>
        </ul>
        </nav>
        `;

    }
    
};
