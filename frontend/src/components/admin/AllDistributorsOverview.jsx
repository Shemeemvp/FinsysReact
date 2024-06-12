import React, { useEffect, useState } from "react";
import AdminBase from "./AdminBase";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../functions/config";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AllDistributorsOverview() {
  const { id } = useParams();
  const user = Cookies.get("User");
  const navigate = useNavigate();

  const [distributorData, setDistributorData] = useState({
    name: "",
    email: "",
    contact: "",
    endDate: "",
    image: "",
    term: "",
    username: "",
    code: "",
    id: "",
  });
  const fetchDistributorData = () => {
    if (user === "Admin") {
      axios
        .get(`${config.base_url}/get_distributors_overview_data/${id}/`)
        .then((res) => {
          console.log("RESPONSE==", res);
          if (res.data.status) {
            const distReq = res.data.data;
            const img = distReq.image;
            var imageUrl = null
            if(distReq.image){
              imageUrl = `${config.base_url}/${distReq.image}`;
            }
            const r = {
              name: distReq.name,
              image: imageUrl,
              email: distReq.email,
              contact: distReq.contact,
              endDate: distReq.endDate,
              term: distReq.term,
              username: distReq.username,
              code: distReq.code,
              id: distReq.id,
            };
            setDistributorData(r);
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
    fetchDistributorData();
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
              title: "Contract cancelled",
            });
            navigate("/all_distributors");
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
        className="body-wrapper"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="container-fluid">
          <div className="card radius-15">
            <div className="card-body">
              <div className="card-title">
                <h2 className="card-title mb-9 fw-semibold text-center">
                  <b>DISTRIBUTOR DETAILS</b>
                </h2>
                <hr />
              </div>
              <center>
                {distributorData.image ? (
                  <img
                    className="img-thumbnail"
                    width="20%"
                    src={distributorData.image}
                    alt=""
                  />
                ) : (
                  <img
                    src={`${process.env.PUBLIC_URL}/static/assets/images/user-1.jpg`}
                    width="20%"
                    className="img-thumbnail"
                  />
                )}
              </center>
              <h3 className="h3 text-center">
                <b>{distributorData.name} </b>
              </h3>
              {/* <!-- <h3 className="h3 text-center"><b>AthulMon Gp</b></h3> --> */}

              <hr />
              <div className="row  pb-2 pt-2 p-5">
                <div className="col-md-6">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b>Distributor Code{" "}
                  </h5>
                </div>
                <div className="col-md-6">
                  <h4 className="h4">
                    <b>: {distributorData.code}</b>
                  </h4>
                </div>
              </div>

              <div className="row  pb-2 pt-2 p-5">
                <div className="col">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b> Email{" "}
                  </h5>
                </div>
                <div className="col">
                  <h4 className="h4">
                    <b>: {distributorData.email}</b>
                  </h4>
                </div>
              </div>
              <div className="row p-5 pt-3 pb-3">
                <div className="col">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b> User Name
                  </h5>
                </div>
                <div className="col">
                  <h4 className="h4">
                    <b> : {distributorData.username}</b>
                  </h4>
                </div>
              </div>
              <div className="row p-5 pt-3 pb-3">
                <div className="col">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b> Contact{" "}
                  </h5>
                </div>
                <div className="col">
                  <h4 className="h4">
                    {" "}
                    <b>: {distributorData.contact}</b>
                  </h4>
                </div>
              </div>
              <div className="row p-5 pt-3 pb-3">
                <div className="col">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b> Payment Terms{" "}
                  </h5>
                </div>
                <div className="col">
                  <h4 className="h4">
                    {" "}
                    <b>: {distributorData.term}</b>
                  </h4>
                </div>
              </div>
              <div className="row p-5 pt-3 pb-3">
                <div className="col">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b> End Date
                  </h5>
                </div>
                <div className="col">
                  <h4 className="h4">
                    {" "}
                    <b> : {distributorData.endDate}</b>
                  </h4>
                </div>
              </div>
              <hr />

              <center>
                <button
                  onClick={()=>cancelContract(`${distributorData.id}`)}
                  class="btn btn-danger"
                  style={{width: "40%"}}
                >
                  Cancel Contract
                </button>
              </center>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllDistributorsOverview;
