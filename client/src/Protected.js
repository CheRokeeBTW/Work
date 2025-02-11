import { Navigate, Outlet, useLocation, useNavigate} from "react-router-dom";
import { useState } from "react";
import useToken from './useToken';
import Login from './Auth/Login'

const Protected = () => {
  const { token, setToken } = useToken();
  const location = useLocation;

  if(!token) {
    return <Login setToken={setToken} />
  }

  return token ? <Outlet /> : <Navigate to="/login" replace state = {{from: location}}/>;
};

export default Protected;