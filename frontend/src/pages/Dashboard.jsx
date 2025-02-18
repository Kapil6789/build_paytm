import { Appbar } from "../components/Appbar" 
import {Users} from "../components/Users"
import {Balance} from "../components/Balance"



export const Dashboard=()=>{
  return(
    <div className="m-3">
        <div>
        <Appbar/>
        </div>
        
        <div>
        <Balance label={"2000"}/>
        </div>

        <div>
            <Users/>
        </div>
   
       
    </div>
  )
}