import { SetStateAction, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogCard } from '../Components/BlogCard';
import Pagination from '../Components/Pagination';
import { Blogtypes, useBlogs, useCategories, useTop } from '../hooks';
import searchIcon from "./../assets/search.png";
import { Loading } from '../Components/Auth';

const Blogs = () => {
  const { blogs,loading } = useBlogs();
  const { categories } = useCategories();
  const { toppost } = useTop();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentpage, setcurrentpage] = useState(1);
  const postPerPage = 6;
  const initialCategoryCount = 6;
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSelectedCategory, setIsSelectedCategory] = useState(false);

  const handleSearchChange = (e: { target: { value: any; }; }) => {
    const { value } = e.target;
    setSearchQuery(value);
    setcurrentpage(1);
  };

  const categoryfetch = async (category: SetStateAction<string>) => {
    setSelectedCategory(category);
    setIsSelectedCategory(true);
  };

  const lastPostIndex = currentpage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author.name.toLowerCase().includes(searchQuery.toLowerCase())||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(blog => !selectedCategory || blog.category === selectedCategory);

  const displayedCategories = showAllCategories ? categories : categories.slice(0, initialCategoryCount);

  const clear = () => {
    setIsSelectedCategory(false);
    setSelectedCategory('');
  };

  return ( loading? <Loading/>:
    <div className="w-full min-h-screen">
      <div className="flex justify-center px-4 lg:px-0">
        <div className="w-full lg:w-4/5 flex flex-col lg:flex-row gap-4">
          {/* Left side - Categories and Top Posts */}
          <div className="w-full lg:w-1/4 p-4">
            {/* Search Bar */}
            <div className="mb-4 relative bg-categories rounded-full shadow-md">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-2 border border-gray-300 bg-categories rounded-full pl-10 focus:outline-none"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <img src={searchIcon} className='w-6' alt="Search" />
              </div>
            </div>
            {/* Categories */}
            <div className="mb-4 bg-categories rounded-lg shadow-md">
              <div className='p-4'>
                <h2 className="text-xl font-bold mb-2 text-blue-900">Categories</h2>
                {isSelectedCategory && (
                  <button onClick={clear} className="text-blue-500 hover:underline mb-2">Clear Selection</button>
                )}
                <div className='text-blue-900 font-semibold'>
                  {displayedCategories.map((category, index) => (
                    <div
                      key={index}
                      onClick={() => categoryfetch(category)}
                      className={`mb-1 border-b border-black pt-2 pb-2 ${selectedCategory === category ? 'font-bold' : ''}`}
                    >
                      <a href="#">{category}</a>
                    </div>
                  ))}
                  {!showAllCategories && categories.length > initialCategoryCount && (
                    <button className="text-black hover:underline" onClick={() => setShowAllCategories(true)}>
                      Show More
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* Top Posts */}
            <div className="mb-4 bg-categories rounded-lg shadow-md">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-blue-900">Top Posts</h2>
                <ul>
                  {toppost.map((post:Blogtypes, index) => (
                    <li className="mb-2 flex items-center" key={post.id}>
                      <Link to={`/blog/${post.id}`} className="flex items-center w-full">
                        <span className="text-blue-900 text-2xl font-extrabold mr-2">{index + 1}</span>
                        <span className="text-blue-900 font-semibold overflow-hidden overflow-ellipsis flex-1 border-b border-black" dangerouslySetInnerHTML={{ __html: post.content.slice(0, 100) }}></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* Right side - Blogs */}
          <div className="w-full lg:w-3/4 p-4">
            <div className="flex flex-wrap -mx-2">
              {filteredBlogs.slice(firstPostIndex, lastPostIndex).map((blog) => (
                <div key={blog.id} className="w-full lg:w-1/2 px-2 mb-4">
                  <BlogCard
                    id={blog.id}
                    authorname={blog.author.name || 'Anonymous'}
                    content={blog.content}
                    title={blog.title}
                    category={blog.category}
                    photo={blog.photo}
                  />
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <Pagination
                postperpage={postPerPage}
                totalpost={filteredBlogs.length}
                setcurrentpage={setcurrentpage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
