import { scheduleOptions } from './models/schedule';
"use strict";
//import store from './lib/store.js'
//import niceLink from './components/niceLink.js';
//import banana from './banana.js';
import { renderSchedule } from "./schedule";
import { post,get } from "./api";
import { collapse } from './collapse';
async function init(){
    //get all 
    const allSchedules = await listSchedules();
    allSchedules.forEach(s=> {
        renderSchedule(s,'schedule-container');    
    });

  // parseComponents();

    // const response = await fetch("/schedule/6638ded53a2ba614550c04bd");
    // let schedule = await response.json();
    // renderSchedule(schedule.members,'schedule-container');

}
const listSchedules = async()=>{
    return  (await get('schedulez')) as scheduleOptions[] ;
}

const addSchedule = async(name:string,members:string[])=>{
    let data= {
        name: name,
        members : members
    } 
    return await post("schedule",data);
}

declare global {
    interface Window {
        addSchedule:any;
    }
}
window.addSchedule = addSchedule;


document?.addEventListener("DOMContentLoaded", function(event) { 
    init();
});

//components...
const componentRegistry: Record<string, any> = {
    "collapse": collapse
};

export const render= (templateFunc:Function,data:any,targetElement:Element)=>{
    //let target = document.querySelector(`#${targetElemName}`);
    targetElement!.innerHTML+= templateFunc(data);
}

const parseComponents = () => {
    document.querySelectorAll('[data-component]').forEach(x=>{
            let data =  x.getAttribute("data-component-data");
            let jsonData = data && JSON.parse(data);
            let componentName = x.getAttribute("data-component");
            if(componentName===null){
                throw new Error("No component name specified");
            }
            let component = componentRegistry[componentName];
            render(component,jsonData,x);

        }
    )
    throw new Error('Function not implemented.');
}
