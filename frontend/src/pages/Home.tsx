import axios from 'axios';
import React, { useState } from 'react';
import { BACKEND_URL } from '../config';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate= useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  

  const handleSubmit = async () => {

    axios.post(`${BACKEND_URL}/api/v1/blog`,{
        title,content},
     {headers:{ Authorization: localStorage.getItem("jwt")} })
        .then(response => {
            navigate(`/blog/${response.data.id}`)
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    setTitle('');
    setContent('');
  };

  return (
    <>
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tell Your Story</h1>
      <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter title"
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            placeholder="Enter content"
            rows={5}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
        <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Publish
        </button>
      </div>
    </div>
            </>
  );
};

export default Home;
