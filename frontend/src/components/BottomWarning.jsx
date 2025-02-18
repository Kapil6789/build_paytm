import { Link } from "react-router-dom"


export const BottomWarning=({label,text,to})=>{
    return(
      <div className="text-center mb-3">
        {label}
        <Link className="cursor-pointer underline" to={to}>
           {text}
        </Link>
      </div>
    )
}