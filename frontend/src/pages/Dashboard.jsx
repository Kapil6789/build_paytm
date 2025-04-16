import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Button } from "../components/Button";
import { Users } from "../components/Users";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export const Dashboard = () => {
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();


    return (
        <div>
            <Appbar />
            <div className="m-8">
                <Balance label={users.balance} />
                <Users users={users} />
            </div>

            <Button
                onClick={async () => {
                    try{
                           await  axios.get("http://localhost:8000/api/v1/user/find")
                                .then(response => {
                                    console.log("Fetched user:", response.data);
                                    setUsers([response.data.user]); 
                                })
                                .catch(error => {
                                    console.error("Error fetching user:", error);
                                });
                                if(user){
                    navigate(`/sendmoney?id=${users.id}&name=${users.username}`);

                                }
                    }
                    catch(err){
                        console.log(err)
                    }
                        
                    
                }}
                label="Send Money"
            />
        </div>
    );
}
