import { useBlog } from '../hooks';
import { useParams } from 'react-router-dom';
import { Blog } from '../Components/Blog';

const Blogid = () => {
  const params= useParams();
  {/* @ts-ignore */}
  const {loading,blog}= useBlog(params.id);
  return loading ? <div>Loading.....</div>:  (
    <>
    {/* @ts-ignore */}
    <Blog blog={blog}/>
    </>
  )
}

export default Blogid