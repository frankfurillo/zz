import { scheduleOptions } from "../models/schedule";

export const renderSchedule= (data:scheduleOptions, targetElemName:string)=>{
    let target = document.querySelector(`#${targetElemName}`);
    target!.innerHTML+=template(data);
}

const template = (data:scheduleOptions)=>{
    return `<div> 
        <h2>Name:${data.name}</h2>
        <p>Medlemmar</p>
        
        ${
            data.members.map(m=>
                `<div>${m}</div>`
            )
        }
    </div>
    `
}