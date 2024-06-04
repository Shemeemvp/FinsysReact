import React from 'react'
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

function AdminPrivateRoutes() {
    const accessToken = Cookies.get("User") || "";
    if (accessToken !== "Admin") {
      var is_admin = false;
      return <Navigate to="/" />;
    } else {
      var is_admin = true;
    }
    // const is_staff = jwtDecode(accessToken).user_is_staff
    // const is_distributor = jwtDecode(accessToken).user_is_distributor
    
    return is_admin ? <Outlet /> : <Navigate to="/" />;
}

export default AdminPrivateRoutes;