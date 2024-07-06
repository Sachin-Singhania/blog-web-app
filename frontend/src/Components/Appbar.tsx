import { Link, useNavigate } from "react-router-dom";
import weblogs from "./../assets/weblog.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useDispatch } from 'react-redux';
import { userexist, usernotexist } from "../redux/reducer/userreducer"; // Assuming you have a usernotexist action

export const Appbar = () => {
  const dispatch = useDispatch();
  const [loggedin, setLoggedin] = useState(false);
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/user/auth-status`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })
      .then(response => {
        if (response.data.userid) {
          dispatch(userexist(response.data.userid));
          setLoggedin(true);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the auth status!", error);
        setLoggedin(false);
      });
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(usernotexist());
    localStorage.removeItem("jwt");
    setLoggedin(false);
  };

  return (
    <div className="border-b flex justify-between px-10 py-3 border shadow-sm items-center">
      <Link to={"/"}>
        <div className="flex flex-col justify-center cursor-pointer font-semibold">
          <img src={weblogs} alt="" className="w-20" />
        </div>
      </Link>
      <div className="flex items-center">
        <Link to={"/new"} className="mx-3 text-blue-900 hover:text-gray-900 font-bold">
          New
        </Link>
        <Link to={"/"} className="mx-3 text-blue-900 hover:text-gray-900 font-bold">
          Home
        </Link>
        <LogoutButton loggedin={loggedin} handleLogout={handleLogout} />
      </div>
    </div>
  );
};

const LogoutButton = ({ loggedin, handleLogout }:{loggedin :boolean,handleLogout:any}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (loggedin) {
      handleLogout();
    } else {
      navigate("/signin");
    }
  };

  return (
    <button onClick={handleClick} className="mx-3 text-blue-900 hover:text-gray-900 font-bold">
      {loggedin ? "Logout" : "Login"}
    </button>
  );
};
