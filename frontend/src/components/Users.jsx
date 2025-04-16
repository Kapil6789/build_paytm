import { useState } from "react";
import { InputBox } from "./InputBox";
export const Users = ({ users }) => {
    const [search, setSearch] = useState("");

    const filteredUsers = (users ?? []).filter(user =>
        `${user.firstName ?? ""} ${user.lastName ?? ""}`.toLowerCase().includes(search.toLowerCase())
    );
    

    return (
        <>
            <div className="my-2">
                <InputBox
                    onChange={(e) => {
                        setSearch(e.target.value);
                    
                    }}
                    type="text"
                    placeholder={"Search users..."}
                    className="w-full px-2 py-1 border rounded border-slate-200"
                    label={"Search User"}
                />
            </div>
            <div className="space-y-4">
                {filteredUsers.map(user => (
                    <User key={user.id} user={user} />
                ))}
            </div>
        </>
    );
};

function User({ user }) {

    return (
        <div className="flex justify-between items-center p-2 border rounded shadow-sm">
            <div className="flex items-center">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex items-center justify-center mr-2 text-xl">
                {(user?.firstName?.[0] ?? "?").toUpperCase()}
                </div>
                <div>
                    <div>{user.firstName} {user.lastName}</div>
                </div>
            </div>
        
        </div>
    );
}
