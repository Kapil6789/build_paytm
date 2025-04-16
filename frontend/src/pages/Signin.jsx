import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios";
import { useNavigate } from "react-router-dom"

export const Signin = () => {
  const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
  const navigate = useNavigate();
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox placeholder="kapil@5465" label={"username"} onChange={e=>{setUsername(e.target.value)}} />
        <InputBox placeholder="123456" label={"Password"} onChange={e=>{setPassword(e.target.value)}}/>
        <div className="pt-4">
         
        <Button onClick={async () => {
            try{
              const response = await axios.post("http://localhost:8000/api/v1/user/signin", {
                username,
                password,
              },   
              {
                headers: {
                  "Content-Type": "application/json", 
                },
              }
              )

              if(response.status === 401||response.status === 404){
                alert("Invalid credentials")
                return
              }
            
              const token = response.data.token;
              if (token) {
                localStorage.setItem('token', token);
                navigate("/dashboard")
              } else {
                console.error('No token received');
              }
            }
            catch(err){
              console.log(err)
            }
            
          }} label={"Sign up"} />
          
         
        </div>
        <BottomWarning label={"Don't have an account?"} text={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}