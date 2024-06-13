import React, { useEffect, useState } from "react";
import AdminBase from "./AdminBase";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import config from "../../functions/config";
import { Link } from "react-router-dom";
import axios from "axios";

function AllDistributors() {
  const [requests, setRequests] = useState([]);
  const user = Cookies.get("User");
  const fetchAllDistributor = () => {
    if (user === "Admin") {
      axios
        .get(`${config.base_url}/get_distributors/`)
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
                endDate: req.endDate,
                term: req.term,
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
    fetchAllDistributor();
  }, []);

  function cancelContract(id) {
    if (user === "Admin") {
      axios
        .delete(`${config.base_url}/DReq_Reject/${id}/`)
        .then((res) => {
          console.log("RESPONSE==", res);
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Deleted",
            });
            setTimeout(() => {
              fetchAllDistributor();
            }, 3000);
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
      <AdminBase />
      <div
        className="body-wrapper p-3"
        style={{ backgroundColor: "#2f516f", height: "100vh" }}
      >
        <div className="container-fluid">
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
                        <b>Payment Terms</b>
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}
                      >
                        <b>End Date</b>
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
                            <Link to={`/all_distributors_overview/${req.id}`}>
                              {req.name}
                            </Link>
                          </td>
                          <td style={{ textAlign: "center" }}>{req.email}</td>
                          <td style={{ textAlign: "center" }}>{req.contact}</td>
                          <td style={{ textAlign: "center" }}>{req.term}</td>
                          <td style={{ textAlign: "center" }}>{req.endDate}</td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              onClick={() => cancelContract(`${req.id}`)}
                              className="btn btn-danger m-1"
                            >
                              Cancel Contract
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

export default AllDistributors;
