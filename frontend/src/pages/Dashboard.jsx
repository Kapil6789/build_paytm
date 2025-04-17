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
                    try {
                        const token = localStorage.getItem("token");
                        const response = await axios.get("http://localhost:8000/api/v1/user/", {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        console.log("Fetched user:", response.data);
                        console.log(token)
                        const user = response.data.user;
                        if (user) {
                            navigate(`/sendmoney?id=${user.id}&name=${user.username}`);
                        } else {
                            console.error("No user found");
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }}
                label="Send Money" />

        </div>
    );
}
