import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Blogs from './pages/Blogs';
import Blogid from './pages/Blogid';
import { Appbar } from './Components/Appbar';
import New from './pages/New';
import { Toaster } from 'react-hot-toast';


function App() {

  return (
    <>
    <BrowserRouter>
      <Appbar />
      <Routes>
        <Route path="/new" element={<New />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/blog/:id" element={<Blogid/>} />
        <Route path="/" element={<Blogs/>} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  </>
  );
}

export default App;
