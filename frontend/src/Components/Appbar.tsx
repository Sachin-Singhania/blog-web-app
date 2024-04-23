import { Link } from "react-router-dom"
import { Avatar } from "./BlogCard"

export const Appbar = () => {
    const logouthandle = () => {
        localStorage.clear();
    }
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
                        <Avatar name="Sachin" />
                    </Link>
                    <Link to={"/"}>
<button className=" bg-red-500 hover:bg-red-600  text-white  font-bold  py-1 px-3 rounded-full   shadow-lg  transition    duration-300  ease-in-out transform 
    focus:outline-none 
    focus:shadow-outline
  "
                            onClick={logouthandle}
                        >
                            Logout
                        </button>
                    </Link>
                </div>
            </div>
        </>
    )
}