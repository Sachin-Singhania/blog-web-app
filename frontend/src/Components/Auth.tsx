import axios from 'axios';
import { SignupType } from 'medium-blog-zods';
import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { userexist } from '../redux/reducer/userreducer';

const Auth = ({ type }: { type: "signin" | "signup" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setinputs] = useState<SignupType>({
    name: "",
    email: "",
    password: ""
  });

  async function sendreq() {
    try {
      if (inputs.email === "" || inputs.password === "" || (type === "signup" && inputs.name === "")) {
          toast.error('Enter Correct Credentials');
        return;
      }
      const { data} = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        { inputs }, {
        withCredentials: true
      }
      );
      const jwt = data.token;
      const userid = data.userId;
      if (jwt !== undefined) {
        localStorage.setItem("jwt", jwt);
        dispatch(userexist(userid));
        navigate("/");
        window.location.reload();
        toast.success("You're Welcome");
      }
    } catch (error) {
      toast.error("Something Went Wrong");
      return {message:"Something Went Wrong"}
    }
  }

  return (
    <>
      <div className='h-screen flex justify-center flex-col'>
        <div className='flex justify-center'>
          <div>
            <div>
              <div className='text-3xl font-bold text-left '>
                Create an Account
              </div>
              <div className='text-slate-400'>
                {type === "signup" ? " Already Have an Account?" : "Don't have an account?"}
                <Link className='pl-2 underline' to={type === "signin" ? "/signup" : "/signin"}>
                  {type === "signin" ? "Signup" : "Signin"}
                </Link>
              </div>
            </div>
            <div>
              {type === "signup" ?
                <Labelinput label="Name" placeholder='xyz' onChange={(e) => {
                  setinputs({ ...inputs, name: e.target.value });
                }} /> : null
              }
              <Labelinput label="Email" placeholder='xyz@gmail.com' onChange={(e) => {
                setinputs({ ...inputs, email: e.target.value });
              }} />
              <Labelinput type='password' label="Password" placeholder='minimum 6 letters' onChange={(e) => {
                setinputs({ ...inputs, password: e.target.value });
              }} />
              <button onClick={sendreq} type="button" className="mt-5 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                {type === "signup" ? "Signup" : "Signin"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface Labelinputtype {
  label: string,
  placeholder: string,
  type?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function Labelinput({ label, placeholder, onChange, type }: Labelinputtype) {
  return (
    <>
      <div>
        <label className="block mb-2 font-bold text-black text-2xl">{label}</label>
        <input onChange={onChange} type={type || "text"} id={label} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
      </div>
    </>
  )
}

export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="spinner border-t-4 border-b-4 border-gray-500 rounded-full w-12 h-12 animate-spin"></div>
    </div>
  );
};

export default Auth;
