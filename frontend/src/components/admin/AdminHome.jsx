import React from "react";
import AdminBase from "./AdminBase";

function AdminHome() {
  return (
    <>
      <AdminBase />
      <div className="body-wrapper p-3">
        <div className="container-fluid">
          <div className="row p-3">
            <div className="col-md-4">
              <div className="card radius-15 p-3">
                <a href="{% url 'Fin_ADistributor' %}">
                  <div className="card-body">
                    <div className="card-title"></div>
                    <div className="row">
                      <div className="col-md-9">
                        <h5 className="card-title mb-9 fw-semibold">
                          <b className="text-white">DISTRIBUTORS</b>
                        </h5>
                      </div>
                      <div className="col">
                        <i
                          className="fa fa-users text-white"
                          style={{ fontSize: "2em" }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card radius-15 p-3">
                <a href="{% url 'Fin_AClients' %}">
                  <div className="card-body">
                    <div className="card-title"></div>
                    <div className="row">
                      <div className="col-md-9">
                        <h5 className="card-title mb-9 fw-semibold">
                          <b className="text-white">CLIENTS</b>
                        </h5>
                      </div>
                      <div className="col">
                        <i
                          className="fa fa-users text-white"
                          style={{ fontSize: "2em" }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className="col-md-4"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
