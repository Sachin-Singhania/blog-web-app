import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Blogs from './pages/Blogs';
import Blogid from './pages/Blogid';
import Home from './pages/Home';
import { Appbar } from './Components/Appbar';

const ConditionalAppbar = () => {
  const location = useLocation();
  const hideAppbarPaths = ["/", "/signin"];
  return hideAppbarPaths.includes(location.pathname) ? null : <Appbar />;
};

function App() {
  return (
    <BrowserRouter>
      <ConditionalAppbar />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:id" element={<Blogid />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
