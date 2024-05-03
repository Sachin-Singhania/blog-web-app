import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Blogs from './pages/Blogs';
import Blogid from './pages/Blogid';
import Home from './pages/Home';
import { Appbar } from './Components/Appbar';
import { ReactNode } from 'react';

const ConditionalAppbar = () => {
  const location = useLocation();
  const hideAppbarPaths = ["/", "/signin"];
  return hideAppbarPaths.includes(location.pathname) ? null : <Appbar />;
};
const ProtectedRoute = ({ children }:{children: ReactNode}) => {
  const token = localStorage.getItem('jwt');
  return token === null ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <BrowserRouter>
    <ConditionalAppbar />
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/blogs" element={
          <ProtectedRoute>
            <Blogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog/:id"
        element={
          <ProtectedRoute>
            <Blogid />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
