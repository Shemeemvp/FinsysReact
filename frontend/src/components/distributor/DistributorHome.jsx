import React from "react";
import DistributorBase from "./DistributorBase";
import { Link } from "react-router-dom";

function DistributorHome() {
  return (
    <>
      <DistributorBase />
      <div
        className="body-wrapper p-3"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="container-fluid">
          <div className="row p-4">
            <div className="col"></div>
            <div className="col-md-5">
              <div className="card radius-15 p-3">
                <Link to="/DClient_req">
                  <div className="card-body">
                    <div className="card-title"></div>
                    <div className="row">
                      <div className="col-md-9">
                        <h5 className="card-title mb-9 fw-semibold">
                          <b>CLIENT REQUESTS</b>
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
            <div className="col-md-5">
              <div className="card radius-15 p-3">
                <Link to="/DClients">
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
            <div className="col"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DistributorHome;
