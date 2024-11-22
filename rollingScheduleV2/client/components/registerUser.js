
import { post } from "../lib/api.js";
import { componentRegistry } from "../lib/componentRegistry.js";
export const registerUser= ()=>{
    let body = {
        saveUser:(e)=>{
            e.preventDefault();
            let userName = document.forms["regform"].username.value;
            let password= document.forms["regform"].pwd.value;
            post('saveuser',{username:userName, password: password}).then(id=>{
                alert(id);
            }).catch(err=>{
                alert(err); //do something nicer... 
            })
        },
        render:()=>{
            return`<div>
                <h2> Registrera användare </h2>
                <form id="regform" name="regform" onSubmit="window.componentRegistry.registerUser.saveUser(event)">
                <div>
                    <label for="username">Username</label>
                    <input name="username" type="text" id="username" value=""/>
                </div>
                <div>
                    <label for="pwd">Password</label>
                    <input name="pwd" type="password" id="pwd" value=""/>
                </div>

                <button>Save</button>
                </form>
                </div>`
        }
    }
    componentRegistry["registerUser"]=body;  //would be cool to automatize this.. 
    return body;
}

