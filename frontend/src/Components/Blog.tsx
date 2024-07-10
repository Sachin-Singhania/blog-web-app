import axios from "axios"
import { Blogtypes } from "../hooks"
import { BACKEND_URL } from "../config"
import { useRef, useState } from "react"
import {useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"
import JoditEditor from "jodit-react"
import cross from "./../assets/cross.svg"
import toast from "react-hot-toast"
export const Blog=({blog}:{blog:Blogtypes})=>{
    return (
        <div>
            <div>
            <Showblog blog={blog}/>
            </div>
        </div>
    )
}
export const Button=({id,title,content,category}:{id:string,title:string,content:string,category:string})=>{
       const navigate= useNavigate();
    const handleSubmit = async () => {
        axios.put(`${BACKEND_URL}/api/v1/blog/${id}`,{
            title,content,category
        },
         {headers:{ Authorization: localStorage.getItem("jwt")} })
            .then(() => {
                navigate(`/`);
                  toast.success("Blog Updated")
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
      };
    return (
    <button onClick={handleSubmit} className="text-xl ml-3 border border-card bg-card rounded-full p-3 shadow-md">Update</button>
    )
}

const Showblog = ({ blog }: { blog: Blogtypes }) => {
  const { user } = useSelector(
    (state: { userReducer: any }) => state.userReducer
  );
  const isAuthor = user === blog.author.id;
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [category] = useState(blog.category);
  const [isModified, setIsModified] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const editor = useRef(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsModified(true);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsModified(true);
  };

  const config = {
    readonly: !isAuthor,
    height: 400,
    style: {
      font: '20px Arial',
      backgroundColor: "#e9e9e9ff",
      color: '#0c0c0c',
      borderColor: "#e9e9e9ff"
    },
    toolbar: showToolbar,
    statusbar: false,
  };

  const toggleToolbar = () => {
    setShowToolbar(prevState => !prevState);
  };
  const cancel= ()=>{
    setIsModified(false);
  }

  return (
   <div className="flex justify-center pt-20">
  <div className="flex flex-col lg:flex-row gap-4 px-4 sm:px-6 lg:px-10 w-full max-w-screen-2xl">
    <div className="lg:w-1/3 order-1 lg:order-2">
      <span className="mx-4 sm:mx-6 lg:mx-8 font-thin">Author</span>
      <div className="flex">
        <div>
          <div className="text-lg sm:text-xl font-bold ml-4 sm:ml-6 lg:ml-7 text-blue-900">
            {blog.author.name ? blog.author.name.toUpperCase() : 'Anonymous'}
            <br />
          </div>
        </div>
      </div>
    </div>

    <div className="lg:w-2/3 order-2 lg:order-1">
      <div className="flex text-3xl sm:text-4xl lg:text-5xl font-extrabold h-28">
        <textarea 
          value={title}
          //@ts-ignore
          onChange={handleTitleChange}
          className={`no-scrollbar h-28 w-full bg-transparent border-b border-black outline-none resize-none ${!isAuthor ? 'pointer-events-none' : ''}`}
          rows={1}
        />
      </div>
      <div className="flex mt-3">
        {isModified && isAuthor ? (
          <>
            <button onClick={cancel} className="ml-3">
              <img src={cross} alt="" className="w-6 sm:w-8 shadow-sm" />
            </button>
            <Button id={blog.id} title={title} content={content} category={blog.category} />
            <button onClick={toggleToolbar} className="text-sm sm:text-xl ml-3 border border-card bg-card rounded-full p-2 sm:p-3 shadow-md">
              {showToolbar ? 'Hide Toolbar' : 'Show Toolbar'}
            </button>
          </>
        ) : null}
      </div>
      <div className="pt-4">
        <p className="font-semibold">CATEGORY :-</p>
        <span className="w bg-transparent text-blue-900 text-lg sm:text-2xl border-l pl-1 border-black outline-none">
          {category}
        </span>
      </div>
      <div className="pt-4">
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={handleContentChange}
        />
      </div>
    </div>
  </div>
</div>

  );
};

export default Showblog;
