export const InputBox=({label,placeholder})=>{
    return(
        <div className="m-4 rounded-md ">
            <div className="text-md font-medium p-2 mx-3">
                  {label}
            </div>
            <div className="mx-7 rounded-md">
                <input placeholder={placeholder} className="border rounded-sm p-1 w-full"></input>
            </div>
        </div>
    )
}