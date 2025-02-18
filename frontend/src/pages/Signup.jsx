import { Heading } from "../components/Heading";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";
import { SubHeading } from "../components/subHeading";
import { InputBox } from "../components/InputBox";
import { useState } from "react";
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom";
import axios from "axios"




export const Signup = () => {
    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    return (
        <div className="h-screen bg-slate-200 flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="bg-white rounded-md justify-center w-96 h-max border-2 border-black">
                    <Heading label={"Sign up"}></Heading>
                    <SubHeading label={"Enter your information to create account"}></SubHeading>

                    <InputBox placeholder={"john"} label={"First Name"} onChange={e => 
                        setFirstName(e.target.value)
                    }></InputBox>
                    <InputBox placeholder={"watson"} label={"Last Name"} onChange={e => 
                        setLastName(e.target.value)
                    }></InputBox>
                    <InputBox placeholder={"john654@gmail.com"} label={"Email"} onChange={e => 
                        setEmail(e.target.value)
                    }></InputBox>
                    <InputBox placeholder={"123456"} label={"Password"} onChange={e => 
                        setPassword(e.target.value)
                    }></InputBox>
                    <InputBox placeholder={"john@123"} label={"Username"} onChange={e => 
                        setUsername(e.target.value)
                    }></InputBox>


                    <div className="pt-4">
                        <Button onClick={ async() => {
                            try {
                                const response =  await axios.post("http://localhost:8000/api/v1/user/signup", {
                                    firstName,
                                    lastName,
                                    email,
                                    username,
                                    password
                                },{
                                    headers:{
                                        'Content-Type':'application/json'
                                    }
                                })
                                Cookies.set("token", response.data.token, { expires: 1 / 24 });
                                navigate("/dashboard")
                            }
                            catch (err) {
                                console.log("error is " +JSON.stringify(err.response.data))
                            }


                        }} label={"SignUp"} ></Button>
                    </div>
                    <div>
                        <BottomWarning label="Already have an account?" text="SignIn" to="/Signin"></BottomWarning>
                    </div>

                </div>
            </div>


        </div>
    )
}

