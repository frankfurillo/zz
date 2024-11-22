
import { post } from "../lib/api.js";
import { componentRegistry } from "../lib/componentRegistry.js";
export const login= ()=>{
    let body = {
        login:(e)=>{
            e.preventDefault();
            let userName = document.forms["loginform"].username.value;
            let pwd= document.forms["loginform"].pwd.value;
            post('login',{username:userName, password: pwd}).then(id=>{
                alert(id);
            })
        },
        render:()=>{
            return`<div>
                <h2> Logga in...</h2>
                <form id="loginform" name="loginform" onSubmit="window.componentRegistry.registerUser.saveUser(event)">
                <div>
                    <label for="username">Username</label>
                    <input name="username" type="text" id="username" value=""/>
                </div>
                <div>
                    <label for="pwd">Password</label>
                    <input name="pwd" type="password" id="pwd" value=""/>
                </div>

                <button>Login</button>
                </form>
                </div>`
        }
    }
    componentRegistry["registerUser"]=body;
    return body;
}

