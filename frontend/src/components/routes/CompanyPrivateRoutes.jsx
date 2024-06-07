import React from 'react'
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

function CompanyPrivateRoutes() {
    const accessToken = Cookies.get("User") || "";
    if (accessToken !== "Company" && accessToken !== 'Staff') {
      var is_company = false;
      return <Navigate to="/" />;
    } else {
      var is_company = true;
    }
    // const is_staff = jwtDecode(accessToken).user_is_staff
    // const is_distributor = jwtDecode(accessToken).user_is_distributor
    
    return is_company ? <Outlet /> : <Navigate to="/" />;
}

export default CompanyPrivateRoutes;