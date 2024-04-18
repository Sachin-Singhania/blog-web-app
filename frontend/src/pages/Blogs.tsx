import { Appbar } from '../Components/Appbar';
import { BlogCard } from '../Components/BlogCard'
import { useBlogs } from '../hooks'
const Blogs = () => {
  const {blogs}= useBlogs();
  return(
    <>
<Appbar/>
    <div className='flex flex-wrap '>
  <div className="flex-shrink-0 flex-grow justify-center items-center mt-40 ml-96 ">
    {
      blogs?.map((blog)=>(
        <BlogCard 
        id={blog.id}
      authorname={blog.author.name ?  blog.author.name : 'Anonymous'}
      content={blog.content} 
      publishedDate={new Date().toLocaleString()}
      title={blog.title} 
      key={blog.id}
    />
      ))
    }
    
  </div>
    </div>
    </>
  )
}

export default Blogs