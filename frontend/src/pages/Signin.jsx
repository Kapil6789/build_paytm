import { Heading } from "../components/Heading";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";
import { SubHeading } from "../components/subHeading";
import { InputBox } from "../components/InputBox";

export const Signin=()=>{
    return(
        <div className="h-screen bg-slate-200 flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="bg-white rounded-md justify-center w-96 h-max border-2 border-black">
                   <Heading label={"Sign In"}></Heading>
                   <SubHeading label={"Enter your information to create account"}></SubHeading>
                   <InputBox placeholder={"john654@gmail.com"} label={"Email"}></InputBox>
                   <InputBox placeholder={"123456"} label={"Password"}></InputBox>
                    <div className="pt-4">
                        <Button label="SignIn"></Button>
                    </div>
                    <div>
                          <BottomWarning label={"Already have an account?"} text={"SignUp"} to={"/Signup"}></BottomWarning>
                    </div>

                </div>
            </div>
        
        
        </div>
    )
}

