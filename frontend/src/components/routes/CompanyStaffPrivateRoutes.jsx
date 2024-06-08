import React from 'react'
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

function CompanyStaffPrivateRoutes() {
    const accessToken = Cookies.get("User") || "";
    if (accessToken !== "Company" && accessToken !== 'Staff') {
      var is_companyOrStaff = false;
      return <Navigate to="/" />;
    } else {
      var is_companyOrStaff = true;
    }
    // const is_staff = jwtDecode(accessToken).user_is_staff
    // const is_distributor = jwtDecode(accessToken).user_is_distributor
    
    return is_companyOrStaff ? <Outlet /> : <Navigate to="/" />;
}

export default CompanyStaffPrivateRoutes;