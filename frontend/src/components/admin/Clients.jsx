import React, { useEffect } from "react";
import AdminBase from "./AdminBase";
import { Link } from "react-router-dom";

function Clients() {
  return (
    <>
      <AdminBase />
      <div
        className="body-wrapper p-3"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="container-fluid">
          <div className="row p-4">
            <div className="col-md-4">
              <div className="card radius-15 p-3 mb-0 h-100">
                <Link to="/clients_requests">
                  <div className="card-body">
                    <div className="card-title"></div>
                    <div className="row">
                      <div className="col-md-9">
                        <h5 className="card-title mb-9 fw-semibold">
                          <b>CLIENTS REQUESTS</b>
                        </h5>
                      </div>
                      <div className="col">
                        <i
                          className="fas fa-user-plus text-white"
                          style={{ fontSize: "2.5em" }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card radius-15 p-3 mb-0 h-100">
                <Link to="/all_clients">
                  <div className="card-body">
                    <div className="card-title"></div>
                    <div className="row">
                      <div className="col-md-9">
                        <h5 className="card-title mb-9 fw-semibold">
                          <b>ALL CLIENTS</b>
                        </h5>
                      </div>
                      <div className="col">
                        <i
                          className="fa fa-users text-white"
                          style={{ fontSize: "2.5em" }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="col-md-4"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Clients;
