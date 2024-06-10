import React, { useState, useEffect } from "react";
import DistributorBase from "./DistributorBase";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../functions/config";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function DistributorProfile() {
  const user = Cookies.get("User");

  const [personalData, setPersonalData] = useState([
    {
      userImage: false,
      distributorCode: "",
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      userContact: "",
      joinDate: "",
      paymentTerm: "",
      endDate: "",
    },
  ]);

  const [paymentRequest, setPaymentRequest] = useState(false);
  const [terms, setTerms] = useState([]);

  function fetchPaymentTerms() {
    axios
      .get(`${config.base_url}/get_payment_terms/`)
      .then((res) => {
        const trms = res.data;
        setTerms([]);
        trms.map((term, index) => {
          var obj = {
            value: term.id,
            text: term.payment_terms_number + " " + term.payment_terms_value,
          };
          setTerms((prevState) => [...prevState, obj]);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    fetchPaymentTerms();
  }, []);

  const ID = Cookies.get("Login_id");
  const getProfileDetails = () => {
    axios
      .get(`${config.base_url}/get_distributor_profile_data/${ID}/`)
      .then((res) => {
        console.log("PROFILE_RESPONSE==", res);
        if (res.data.status) {
          const pers = res.data.personalData;
          if (pers.userImage) {
            var imgUrl = `${config.base_url}/${pers.userImage}`;
          }
          const p = {
            userImage: imgUrl,
            distributorCode: pers.distributorCode,
            firstName: pers.firstName,
            lastName: pers.lastName,
            email: pers.email,
            username: pers.username,
            userContact: pers.userContact,
            joinDate: pers.joinDate,
            paymentTerm: pers.paymentTerm,
            endDate: pers.endDate
          };
          setPersonalData(p);
          setPaymentRequest(res.data.payment_request);
        }
      })
      .catch((err) => {
        console.log("ERROR==", err);
      });
  };
  const navigate = useNavigate();
  const [paymentTerm, setPaymentTerm] = useState("");
  
  const handlePaymentTermSubmit = (e) => {
    e.preventDefault();

    var termData = {
      ID: ID,
      payment_term: paymentTerm,
    };

    axios
      .post(`${config.base_url}/Change_distributor_payment_terms/`, termData)
      .then((res) => {
        console.log(res);
        if(res.data.status){
            Toast.fire({
            icon: "success",
            title: `${res.data.message}`,
            });
            getProfileDetails();
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
  };

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

  useEffect(() => {
    getProfileDetails();
  }, []);
  return (
    <>
      <DistributorBase />
      <div
        className="page-content"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="card radius-15">
          <div className="card-body">
            <div className="card-title">
              <center>
                <h3 className="mb-0" style={{ fontWeight: "bolder" }}>
                  MY PROFILE
                </h3>
                {personalData.userImage ? (
                    <img
                      src={personalData.userImage}
                      className="img img-fluid m-3"
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <img
                      src={`${process.env.PUBLIC_URL}/static/assets/images/user-1.jpg`}
                      className="img img-fluid m-3"
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                      }}
                    />
                  )}

                <div className="row">
                  <div className="col-md-4"></div>
                  <div className="col-md-4 col-md-offset-3">
                      <label htmlFor="">Distributor Code</label>
                      <input
                        type="text"
                        name=""
                        id=""
                        value={personalData.distributorCode}
                        className="form-control"
                        style={{ backgroundColor: "#2f516f", color: "white" }}
                        readOnly
                      />
                  </div>
                  <div className="col-md-4"></div>
                </div>
              </center>
              <hr />
              <form method="post" action="#" className="mb-5" noValidate>
                <h4 className="m-4 w-100">Personal Info</h4>
                <div className="row m-3 w-100">
                  <div className="col-md-6">
                    <label htmlFor="first_name">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={personalData.firstName}
                      className="form-control"
                      style={{ backgroundColor: "#2f516f", color: "white" }}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={personalData.lastName}
                      className="form-control"
                      style={{ backgroundColor: "#2f516f", color: "white" }}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row m-3 w-100">
                  <div className="col-md-6">
                    <label htmlFor="email">E-mail</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={personalData.email}
                      className="form-control"
                      style={{ backgroundColor: "#2f516f", color: "white" }}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={personalData.username}
                      className="form-control"
                      style={{ backgroundColor: "#2f516f", color: "white" }}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row m-3 w-100">
                  <div className="col-md-6">
                    <label htmlFor="email">Contact</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={personalData.userContact}
                      className="form-control"
                      style={{ backgroundColor: "#2f516f", color: "white" }}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="ctype">Join Date</label>
                    <input
                        type="text"
                        name="end"
                        id="end"
                        value={personalData.joinDate}
                        className="form-control"
                        style={{ backgroundColor: "#2f516f", color: "white" }}
                        readOnly
                    />
                  </div>
                </div>
                <div className="row m-3 w-100">
                    <div className="col-md-6">
                    <label htmlFor="industry">Payment Term</label>
                    <div className="d-flex align-items-center">
                        <input
                            type="text"
                            name="Payment_Term"
                            id="Payment_Term"
                            value={personalData.paymentTerm}
                            className="form-control"
                            style={{
                            borderRadius: "10px 0px 0px 10px",
                            backgroundColor: "#2f516f",
                            color: "white",
                            }}
                            readOnly
                        />
                        <button
                        type="button"
                        style={{
                            borderRadius: "0px 10px 10px 0px",
                            margin: "0",
                        }}
                        title="change Payment Term"
                        typeof="button"
                        className="btn btn-info"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        >
                        <i className="bx bx-right-arrow-circle"></i>
                        </button>
                    </div>
                    </div>
                    <div className="col-md-6">
                    <label htmlFor="ctype">End Date</label>
                    <input
                        type="text"
                        name="end"
                        id="end"
                        value={personalData.endDate}
                        className="form-control"
                        style={{ backgroundColor: "#2f516f", color: "white" }}
                        readOnly
                    />
                    </div>
                </div>
                <div className="row mt-5 mb-3 w-100">
                      <div className="col-md-4"></div>
                      <div className="col-md-4">
                        <Link to="/edit_distributor_profile">
                          <button
                            className="btn btn-outline-info rounded-pill w-100 h-100 text-light"
                            type="button"
                          >
                            Edit Profile
                          </button>
                        </Link>
                      </div>

                      <div className="col-md-4"></div>
                    </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: "white" }}>
            <div
              className="modal-header"
              style={{ borderBottom: "1px solid gray" }}
            >
              <h5
                className="modal-title fs-5 "
                id="exampleModalLabel"
                style={{ color: "black" }}
              >
                <b>Change Payment Terms</b>
              </h5>
              <button
                type="button"
                className="text-danger"
                data-bs-dismiss="modal"
                style={{ backgroundColor: "white", border: "none" }}
              >
                <i
                  className="bx bx-right-arrow-circle"
                  style={{ fontSize: "22px" }}
                ></i>
              </button>
            </div>

            <div className="modal-body">
              <form
                action="#"
                method="post"
                onSubmit={handlePaymentTermSubmit}
                style={{ padding: "10px" }}
              >
                <label
                  className="w-100"
                  for=""
                  style={{ color: "black", marginLeft: "20px" }}
                >
                  current Payment Term
                </label>
                <br />

                {personalData.paymentTerm != "" ? (
                  <>
                    <input
                      className="w-100"
                      type="text"
                      value={personalData.paymentTerm}
                      style={{
                        border: "1px solid gray",
                        borderRadius: "8px",
                        fontWeight: "500",
                        width: "90%",
                        marginLeft: "20px",
                        padding: "8px",
                        marginBottom: "10px",
                      }}
                      readOnly
                    />{" "}
                    <br />
                  </>
                ) : (
                  <>
                    <input
                      className="w-100"
                      type="text"
                      value="Trial Period"
                      style={{
                        border: "1px solid gray",
                        borderRadius: "8px",
                        fontWeight: "500",
                        width: "90%",
                        marginLeft: "20px",
                        padding: "8px",
                        marginBottom: "10px",
                      }}
                      readOnly
                    />{" "}
                    <br />
                  </>
                )}

                <label
                  className="w-100"
                  for=""
                  style={{ color: "black", marginLeft: "20px" }}
                >
                  End Date
                </label>
                <br />
                <input
                  className="w-100"
                  type="text"
                  value={personalData.endDate}
                  style={{
                    border: "1px solid gray",
                    borderRadius: "8px",
                    fontWeight: "500",
                    width: "90%",
                    marginLeft: "20px",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                  readOnly
                />
                {paymentRequest ? (
                  <>
                    <label
                      className="w-100"
                      for=""
                      style={{ color: "black", marginLeft: "20px" }}
                    >
                      Choose New
                    </label>
                    <br />
                    <select
                      className="w-100"
                      onChange={(e) => setPaymentTerm(e.target.value)}
                      name="payment_term"
                      id=""
                      style={{
                        marginBottom: "20px",
                        border: "1px solid gray",
                        borderRadius: "8px",
                        fontWeight: "500",
                        width: "90%",
                        marginLeft: "20px",
                        padding: "8px",
                      }}
                    >
                      {terms.map((term) => (
                        <option
                          value={term.value}
                          style={{ backgroundColor: "white" }}
                        >
                          {term.text}
                        </option>
                      ))}
                    </select>
                    <p className="text-center text-danger">
                      You have a pending request, Please wait for approval.
                    </p>
                    <center className="w-100">
                      <button
                        type="submit"
                        className="btn btn-info"
                        style={{ borderRadius: "30px", width: "50%" }}
                        disabled
                      >
                        <b>Submit</b>
                      </button>
                    </center>
                  </>
                ) : (
                  <>
                    <label
                      className="w-100"
                      for=""
                      style={{ color: "black", marginLeft: "20px" }}
                    >
                      Choose New
                    </label>
                    <br />
                    <select
                      className="w-100"
                      onChange={(e) => setPaymentTerm(e.target.value)}
                      name="payment_term"
                      id=""
                      style={{
                        marginBottom: "20px",
                        border: "1px solid gray",
                        borderRadius: "8px",
                        fontWeight: "500",
                        width: "90%",
                        marginLeft: "20px",
                        padding: "8px",
                      }}
                    >
                      {terms.map((term) => (
                        <option
                          value={term.value}
                          style={{ backgroundColor: "white" }}
                        >
                          {term.text}
                        </option>
                      ))}
                    </select>
                    <center className="w-100">
                      <button
                        type="submit"
                        className="btn btn-info"
                        data-bs-dismiss='modal'
                        onClick={handlePaymentTermSubmit}
                        style={{ borderRadius: "30px", width: "50%" }}
                      >
                        <b>Submit</b>
                      </button>
                    </center>
                  </>
                )}
              </form>
            </div>
            <div
              className="modal-footer"
              style={{ borderTop: "1px solid black" }}
            >
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DistributorProfile;

