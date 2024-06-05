import React, { useEffect } from "react";
import AdminBase from "./AdminBase";
import { Link } from "react-router-dom";

function Distributors() {
  return (
    <>
      <AdminBase />
      <div
        className="body-wrapper p-3"
        style={{ backgroundColor: "#2f516f", height: "100vh" }}
      >
        <div className="container-fluid">
          <div className="row p-4">
            <div className="col-md-4">
              <div className="card radius-15 p-3 mb-0 h-100">
                <Link to="/distributors_requests">
                  <div className="card-body">
                    <div className="card-title"></div>
                    <div className="row">
                      <div className="col-md-9">
                        <h5 className="card-title mb-9 fw-semibold">
                          <b>DISTRIBUTOR REQUESTS</b>
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
                <Link to="/all_distributors">
                  <div className="card-body">
                    <div className="card-title"></div>
                    <div className="row">
                      <div className="col-md-9">
                        <h5 className="card-title mb-9 fw-semibold">
                          <b>ALL DISTRIBUTORS</b>
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

            <div className="col-md-4">
              {/* <div className="card radius-15 p-3 mb-0 h-100">
                <a href="{% url 'Fin_Clients_under_distributors' %}">
                  <div className="card-body">
                    <div className="card-title"></div>
                    <div className="row">
                      <div className="col-md-9">
                        <h5 className="card-title mb-9 fw-semibold">
                          <b>CLIENTS UNDER</b>
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
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Distributors;
