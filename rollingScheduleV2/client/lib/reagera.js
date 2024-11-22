import { componentRegistry } from "./componentRegistry.js";



export const registerComponent = (name,component) => {
    if(window.componentRegistry ===undefined) {
        window.componentRegistry = componentRegistry;
    }
    componentRegistry[name] = component;
}
const render= (templateFunc,data,targetElement)=>{
    //let target = document.querySelector(`#${targetElemName}`);
    targetElement.innerHTML+= templateFunc(data);
    //parseComponents(targetElement);
}

export const parseComponents = (fromElement) => {
    fromElement.querySelectorAll('[data-component]').forEach(x=>{
            let data =  x.getAttribute("data-component-data");
            let jsonData =   data && data.length >0 && JSON.parse(data);
            let componentName = x.getAttribute("data-component");
            if(componentName===null){
                throw new Error("No component name specified");
            }
            let component = componentRegistry[componentName];
            render(component().render,jsonData,x);
        }
    )
}