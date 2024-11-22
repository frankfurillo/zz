import {app} from './components/app.js';
import { parseComponents,registerComponent } from './lib/reagera.js';
document.addEventListener('DOMContentLoaded', function() {
    init();
}, false);
const init = ()=>{
    registerComponent("app",app);
    parseComponents(document);

}

