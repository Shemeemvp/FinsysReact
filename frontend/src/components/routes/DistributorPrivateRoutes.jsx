import React from 'react'
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

function DistributorPrivateRoutes() {
    const accessToken = Cookies.get("User") || "";
    if (accessToken !== "Distributor") {
      var is_distributor = false;
      return <Navigate to="/" />;
    } else {
      var is_distributor = true;
    }
    // const is_staff = jwtDecode(accessToken).user_is_staff
    // const is_distributor = jwtDecode(accessToken).user_is_distributor
    
    return is_distributor ? <Outlet /> : <Navigate to="/" />;
}

export default DistributorPrivateRoutes;