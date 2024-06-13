import React, { useEffect, useState } from "react";
import FinBase from "./FinBase";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../functions/config";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function StaffReq() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const user = Cookies.get("User");
  const ID = Cookies.get('Login_id');
  const fetchStaffRequests = () => {
    if (user === "Company") {
      axios
        .get(`${config.base_url}/get_staff_requests/${ID}/`)
        .then((res) => {
          console.log("RESPONSE==", res);
          if (res.data.status) {
            setRequests([])
            const distReq = res.data.data;
            distReq.map((req) => {
              const r = {
                name: req.name,
                email: req.email,
                contact: req.contact,
                username: req.username,
                id: req.id,
              };
              setRequests((prevState) => [...prevState, r]);
            });
          }
        })
        .catch((err) => {
          console.log("ERROR==", err);
          if (!err.response.data.status) {
            Swal.fire({
              icon: "error",
              title: `${err.response.data.message}`,
            });
          }
        });
    }
  };

  useEffect(() => {
    fetchStaffRequests();
  }, []);

  function handleAccept(id) {
    if (user === "Company") {
      axios
        .put(`${config.base_url}/Staff_Req_Accept/${id}/`)
        .then((res) => {
          console.log("RESPONSE==", res);
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Request Accepted",
            });
            // navigate('/staff_requests')
            setTimeout(() => {
              fetchStaffRequests();
            }, 2000);
          }
        })
        .catch((err) => {
          console.log("ERROR==", err);
          if (!err.response.data.status) {
            Swal.fire({
              icon: "error",
              title: `${err.response.data.message}`,
            });
          }
        });
    }
  }

  function handleReject(id) {
    if (user === "Company") {
      axios
        .delete(`${config.base_url}/Staff_Req_Reject/${id}/`)
        .then((res) => {
          console.log("RESPONSE==", res);
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Request Rejected",
            });
            setTimeout(() => {
              fetchStaffRequests();
            }, 2000);
          }
        })
        .catch((err) => {
          console.log("ERROR==", err);
          if (!err.response.data.status) {
            Swal.fire({
              icon: "error",
              title: `${err.response.data.message}`,
            });
          }
        });
    }
  }

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  return (
    <>
      <FinBase />
      <div
        className="body-wrapper p-3"
        style={{ backgroundColor: "#2f516f", height: "100vh" }}
      >
        <div className="container-fluid">
          <div className="card radius-15 h-20 mt-3">
            <div className="row w-100">
              <div className="col-md-12">
                <center><h2 className="mt-3">STAFF REQUESTS</h2></center>
                <hr/>
              </div>
            </div>
          </div>
          <div className="card radius-15">
            {/* <a href=""> */}
              <div className="card-body">
                <div className="card-title"></div>
                <table className="table table-responsive-md mt-4 table-hover">
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}
                      >
                        <b>ID</b>
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}
                      >
                        <b>Name</b>
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}
                      >
                        <b>Email</b>
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}
                      >
                        <b>Contact</b>
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}
                      >
                        <b>Username</b>
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}
                      >
                        <b>Action</b>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests &&
                      requests.map((req, index) => (
                        <tr>
                          <td style={{ textAlign: "center" }}>{index + 1}</td>
                          <td style={{ textAlign: "center" }}>
                            <Link to="#">
                              {req.name}
                            </Link>
                          </td>
                          <td style={{ textAlign: "center" }}>{req.email}</td>
                          <td style={{ textAlign: "center" }}>{req.contact}</td>
                          <td style={{ textAlign: "center" }}>{req.username}</td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              onClick={() => handleAccept(`${req.id}`)}
                              className="btn btn-success m-1"
                              style={{width:'80px', height:'40px'}}
                            >
                              Accept
                            </button>
                            <button
                              onClick={()=>handleReject(`${req.id}`)}
                              className="btn btn-danger m-1"
                              style={{width:'80px', height:'40px'}}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            {/* </a> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default StaffReq;
