let visible = true;
const toggle=()=>{
    visible = !visible;
}
export const collapse = (data:any)=>{
    return `<div onClick="toggle()" className="collapsible ${visible?'':'hide'}"> 
            <span>TITEL:${data.name}</span>
    </div>
    `
}