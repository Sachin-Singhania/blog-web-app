import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { BACKEND_URL } from '../config';
import { Loading } from '../Components/Auth';
import { useCategories } from '../hooks';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const New = () => {
  const { user } = useSelector(
    (state: { userReducer: any }) => state.userReducer
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      toast.error("You Are Not Logged In Returing To Home Page");
      navigate("/")
    }
  }, [user])
  
 
  const { categories } = useCategories();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const editor = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const handleTitleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (title === "" || content === "" || category === "") {
        if (title === "" ) {
          toast.error("Forget to add title")
        }
        if (content === "" ) {
          toast.error("Forget to add content")
        }
        if (category === "" ) {
          toast.error("Forget to add category")
        }
        setLoading(false);
        return;
      }
      const token = localStorage.getItem("jwt");

      const headers = {
        Authorization: `${token}`,
      };
      
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        { title, content, category },
        { headers, withCredentials: true }
      );
      
      if (response.data.id) {
        navigate(`/blog/${response.data.id}`);
        toast.success("Blog Posted");
      } else {
        navigate("/");
        toast.success("Blog wasn't posted due to some error");
      }
    } catch (error) {
      toast.error('Error creating blog post:');
      navigate("/");
      return {message:"Error creating blog post:"};
    }
    setLoading(false);
    setTitle('');
    setContent('');
    setCategory('');
  };

  const config = {
    readonly: false,
    height: 400,
    style: {
      font: '20px Arial',
      backgroundColor:"#e9e9e9ff",
      color: '#0c0c0c',
      borderColor:"#e9e9e9ff"
     },
     toolbar:showToolbar,
     statusbar:false,
  };
  const toggleToolbar = () => {
    setShowToolbar(prevState => !prevState);
  };
  
  return (
    loading ? <Loading /> :
      <div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-10 w-full pt-20 max-w-screen-2xl">
            <div className="col-span-1 lg:col-span-4 order-1 lg:order-2">
              <div className="flex">
                <div>
                  <div className="text-xl font-bold ml-7">
                    <br />
                  </div>
                </div>
              </div>
            </div>

            {/* Title, categories, section, and content block */}
            <div className="col-span-1 lg:col-span-8 order-2 lg:order-1">
              <div className="text-5xl font-extrabold">
                <input
                  type="text"
                  required
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter title"
                  className="bg-transparent border-b border-black outline-none"
                />
                <button onClick={handleSubmit} className="text-xl ml-3 border border-card bg-card rounded-full p-3">Publish</button>
                <button onClick={toggleToolbar} className="text-xl ml-3 border border-card bg-card rounded-full p-3">
                  {showToolbar ? 'Hide Toolbar' : 'Show Toolbar'}
                </button>
              </div>
              <div className="pt-4">
                {/* Dropdown menu for selecting category */}
                <select
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                  className="w bg-transparent rounded-full shadow-md border border-black outline-none"
                >
                  <option value="">Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div> 
              <div className="pt-4">
               <JoditEditor
			ref={editor}
			value={content}
			config={config}
			onBlur={newContent => setContent(newContent)}
      className='' // preferred to use only this option to update the content for performance reasons
		/>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default New;
