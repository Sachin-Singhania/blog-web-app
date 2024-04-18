import { Link } from "react-router-dom"
import { Avatar } from "./BlogCard"

export const Appbar  = () =>{
    const header = localStorage.getItem("jwt");
    return (
        <>
        <div className="border-b flex justify-between px-10 py-3">
            <Link to={"/blogs"}>
            <div className="flex flex-col justify-center cursor-pointer">
                Medium
            </div>
            </Link>
            <div>
                <Link to={"/home"}>
                <Avatar name="Sachin"/>
                </Link>
            </div>
        </div>
        </>
    )
}