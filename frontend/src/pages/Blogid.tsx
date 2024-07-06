import { useBlog } from '../hooks';
import { useParams } from 'react-router-dom';
import { Blog } from '../Components/Blog';
import { Loading } from '../Components/Auth';

const Blogid = () => {
  const params= useParams();
  {/* @ts-ignore */}
  const {loading,blog}= useBlog(params.id);
  return loading ? <Loading/>:  (
    <>
    {/* @ts-ignore */}
    <Blog blog={blog}/>
    </>
  )
}

export default Blogid