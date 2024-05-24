// import logo from './logo.svg';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate, BrowserRouter as Router } from "react-router-dom";
import './App.css';
import Admin from './Admin';
import Auth from './Auth';
import PageNotFound from './PageNotFound';
import { useCookies } from 'react-cookie';

export const PrivateRoute = ({ children }) => {
  const [cookies] = useCookies(['token']);

  if (cookies.token) {
    return children;
  }
  return <Navigate to="/auth/sign-in" />
}

function App() {
  if(window?.location?.pathname === '/') {
    window.location.href = '/dashboard';
  }

  return (
    <Router basename={"dashboard"}>
      <Routes>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/*" element={<PrivateRoute><Admin /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
