import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from "./pages/Signup"
import  Signin  from './pages/Signin'
import Blogs from './pages/Blogs'
import Blogid from './pages/Blogid'
import Home from './pages/Home'
import { Appbar } from './Components/Appbar'

function App() {

  return (
    <>
      <BrowserRouter>
        <Appbar/>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blogid/>} />
          <Route path="/blogs" element={<Blogs/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App