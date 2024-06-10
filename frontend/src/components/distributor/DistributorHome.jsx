import React, { useState, useEffect } from "react";
import DistributorBase from "./DistributorBase";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../functions/config";
import { Link, useNavigate } from "react-router-dom";

function DistributorHome() {

  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState({
    PaymentRequest: false,
    daysLeft: 0,
    endDate: '',
    alertMessage: false,
  });
  const ID = Cookies.get("Login_id");
  const user = Cookies.get('User');
  function fetchPaymentDetails() {
    axios
      .get(`${config.base_url}/check_distributor_payment_term/${ID}/`)
      .then((res) => {
        console.log("HOME RESPONSE==", res);
        if(res.data.status){
          const pData = {
            PaymentRequest: res.data.payment_request,
            daysLeft: res.data.days_left,
            endDate: res.data.endDate,
            alertMessage: res.data.alert_message,
          }
          setPaymentDetails(pData);
          showModal(res.data.alert_message);
        }
      })
      .catch((err) => {
        console.log("HOME ERROR==", err);
      });
  }

  function showModal(status){
    setTimeout(() => {
      if(status){
        try {
          document.getElementById('modalBtn').click()
        } catch (error) {
          
        }
      }
    }, 2000);
  }

  useEffect(()=>{
    fetchPaymentDetails();
  },[])

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
      <button style={{visibility:'hidden'}} id="modalBtn" data-bs-toggle='modal' data-bs-target='#myModal' ></button>
      </div>
      {!paymentDetails.PaymentRequest && (
        paymentDetails.alertMessage ? (
          <>
          <div className="modal fade" id="myModal" tabindex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content" style={{backgroundColor: "#213b52",border: "1px solid rgba(255, 255, 255, 0.3)"}}>
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">
                      <i className="fas fa-exclamation-triangle fa-lg text-danger ms-1"></i>
                      <span className="font-monospace">
                        Payment Term Ends
                        {paymentDetails.daysLeft != 0 ?
                        <span className="text-danger">in {paymentDetails.daysLeft} days</span>
                        :
                        <span className="text-danger">Today</span>
                        }
                      </span>
                    </h5>
                    <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body">
                    <h6 className="text-white mt-1 ">Your current plan is expiring on {paymentDetails.endDate}</h6>
                    <div className="row mb-3 mt-3 w-100 d-flex justify-content-center">
                        <button className="btn btn-sm btn-success" data-bs-dismiss='modal' onClick={()=>navigate('/distributor_profile')}><small>click to renew</small></button>
                    </div>
                  </div>

                </div>
              </div>
          </div>
          </>
        ):null
      )}
    </>
  );
}

export default DistributorHome;
