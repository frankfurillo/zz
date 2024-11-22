import { InitRouter } from "../lib/reageraRouter.js";
import { login } from "./login.js";
import { registerUser } from "./registerUser.js";

export const app= ()=>{
    const routes={
      "login": login,
      "register": registerUser
    }
    InitRouter(routes,'#routing-root');
    return {
        render:()=>{
            return `<div> 
                        <ul>
                            <li>
                               <a href="/login">Logga in...</a>
                             </li>
                            <li>
                               <a href="/register">Registrera...</a>
                             </li>
                        </ul>
                       
                        </ul>
                        eller... <br/>
                        <div id="routing-root">
                        </div>
                    </div>`
        }

    }
    
}
