import { useState } from "react"
export const Users = () => {
    const [user, setUser] = useState([{
        firstName: "Kapil",
        lastName: "pandey",
        id: 1
    }])
    return (
        <>
            <div className="font-bold mt-5 ml-5">
                Users
            </div>
            <div className="rounded-md mt-5 mx-5">
                <input placeholder="Search Users ..." className="w-full border-1 border-black p-2"></input>
            </div>
            <div className="mt-5">
                {user.map(user => <User user={user} />)}
            </div>

        </>
    )
}

function User({ user }) {
    return (
        <div className="flex  justify-between">
            <div className="flex ml-5">
                <div className="rounded-full h-7 w-7 mt-3 bg-slate-400 justify-center border-2  border-slate-600">
                <div className="flex flex-col ml-2 justify-center h-full ">{user.firstName[0]}</div>
                </div>
              <div className="flex flex-col justify-center font-semibold ml-5">{user.firstName} {user.lastName}</div>
            </div>
            <div className="flex flex-col justify-center">
            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mr-5 ">Send Money</button>

            </div>
           
        </div>
    )
}