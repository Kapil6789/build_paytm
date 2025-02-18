

export const Balance=({label})=>{
    return(
        <div className="flex mt-5">
        <div className="flex flex-col justify-center ml-5  font-semibold text-xl mx-3">
                  Your Balance 
        </div>
        <div className="flex flex-col">
            <div className="font-medium text-xl" >
              Rs {label}

            </div>
        </div>
    
    </div>
    )
  
}