
export const SendMoney = () => {
    return (
        <div className="h-screen bg-slate-200 flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="p-5 bg-white rounded-md justify-center w-96 h-max border-2 border-black">
                    <div className="text-center text-2xl font-bold mt-3">
                        Send Money
                    </div>

                    <div className="flex flex-row justify-center mt-5">
                            <div className="rounded-full w-8 h-8 bg-green-200 border-2 border-green-950 mr-3">
                                
                                <div className="text-xl px-2">
                                    A
                                </div>
                            </div>
                            <div className="text-xl font-semibold">
                                Sender's Name
                            </div>
                    </div>
                    <div className="text-xl mt-4">
                        Amount (in Rs)
                    </div>
                    <div className="mt-3">
                        <input placeholder="Enter friends name" className="p-2 rounded-md w-full">
                        </input>
                    </div>
                    <div className="mt-3">
                        <button type="button" className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full">Send Money</button>

                    </div>


                </div>
            </div>


        </div>
    )
}

