import React, { useState, useEffect } from "react";
import FinBase from "./FinBase";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../functions/config";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function CompanyProfile() {
  const user = Cookies.get("User");
  let is_company = false;
  if (user === "Company") {
    is_company = true;
  }

  const [personalData, setPersonalData] = useState([
    {
      companyLogo: false,
      userImage: false,
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      companyContact: "",
      userContact: "",
    },
  ]);

  const [companyData, setCompanyData] = useState([
    {
      businessName: "",
      companyName: "",
      companyType: "",
      industry: "",
      companyCode: "",
      companyEmail: "",
      panNumber: "",
      gstType: "",
      gstNo: "",
      paymentTerm: "",
      endDate: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
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
      .get(`${config.base_url}/get_profile_data/${ID}/`)
      .then((res) => {
        console.log("PROFILE_RESPONSE==", res);
        if (res.data.status) {
          const pers = res.data.personalData;
          const cmp = res.data.companyData;
          if (pers.companyLogo) {
            var logoUrl = `${config.base_url}/${pers.companyLogo}`;
          }
          if (pers.userImage) {
            var imgUrl = `${config.base_url}/${pers.userImage}`;
          }
          const p = {
            companyLogo: logoUrl,
            userImage: imgUrl,
            firstName: pers.firstName,
            lastName: pers.lastName,
            email: pers.email,
            username: pers.username,
            companyContact: pers.companyContact,
            userContact: pers.userContact,
          };
          const c = {
            businessName: cmp.businessName,
            companyName: cmp.companyName,
            companyType: cmp.companyType,
            industry: cmp.industry,
            companyCode: cmp.companyCode,
            companyEmail: cmp.companyEmail,
            panNumber: cmp.panNumber,
            gstType: cmp.gstType,
            gstNo: cmp.gstNo,
            paymentTerm: cmp.paymentTerm,
            endDate: cmp.endDate,
            address: cmp.address,
            city: cmp.city,
            state: cmp.state,
            pincode: cmp.pincode,
          };
          setPersonalData(p);
          setCompanyData(c);
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
      .post(`${config.base_url}/Change_payment_terms/`, termData)
      .then((res) => {
        console.log(res);
        if(res.data.status){
            Toast.fire({
            icon: "success",
            title: `${res.data.message}`,
            });
            navigate("/company_profile");
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
      <FinBase />
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
                {is_company ? (
                  personalData.companyLogo ? (
                    <img
                      src={personalData.companyLogo}
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
                  )
                ) : personalData.userImage ? (
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
                    {is_company ? (
                      <>
                        <label htmlFor="last_name">Company Code</label>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          value={companyData.companyCode}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </>
                    ) : null}
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
                    {is_company ? (
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={personalData.companyContact}
                        className="form-control"
                        style={{ backgroundColor: "#2f516f", color: "white" }}
                        readOnly
                      />
                    ) : (
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={personalData.userContact}
                        className="form-control"
                        style={{ backgroundColor: "#2f516f", color: "white" }}
                        readOnly
                      />
                    )}
                  </div>
                  <div className="col-md-6"></div>
                </div>

                <h4 className="m-4 w-100">Company Info</h4>
                {is_company ? (
                  <>
                    <div className="row m-3 w-100">
                      <div className="col-md-6">
                        <label htmlFor="cname">Company Name</label>
                        <input
                          type="text"
                          name="cname"
                          id="cname"
                          value={companyData.companyName}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="caddress">Company Address</label>
                        <input
                          type="text"
                          name="caddress"
                          id="caddress"
                          value={companyData.address}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row m-3 w-100">
                      <div className="col-md-6">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={companyData.city}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="state">State</label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={companyData.state}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row m-3 w-100">
                      <div className="col-md-6">
                        <label htmlFor="pincode">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          id="pincode"
                          value={companyData.pincode}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          value={personalData.companyContact}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="row m-3 w-100">
                      <div className="col-md-6">
                        <label htmlFor="bname">Legal Business Name</label>
                        <input
                          type="text"
                          name="bname"
                          id="bname"
                          value={companyData.businessName}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="ctype">Pan Number</label>
                        <input
                          type="text"
                          name="pannum"
                          id="pannum"
                          value={companyData.panNumber}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row m-3 w-100">
                      <div className="col-md-6">
                        <label htmlFor="industry">GST Type</label>
                        <input
                          type="text"
                          name="gsttype"
                          id="gsttype"
                          value={companyData.gstType}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6 gstrow">
                        {companyData.gstType ==
                          "Registered Business - Regular" ||
                        companyData.gstType ==
                          "Registered Business - Composition" ? (
                          <>
                            <label htmlFor="ctype">GST Number</label>
                            {companyData.gstNo != "" ? (
                              <input
                                type="text"
                                name="gstnum"
                                id="gstnum"
                                value={companyData.gstNo}
                                className="form-control "
                                style={{
                                  backgroundColor: "#2f516f",
                                  color: "white",
                                }}
                                readOnly
                              />
                            ) : (
                              <input
                                type="text"
                                name="gstnum"
                                id="gstnum"
                                value="Please provide your GST number in profile edit section to continue"
                                className="form-control "
                                style={{
                                  backgroundColor: "#2f516f",
                                  color: "white",
                                }}
                                readOnly
                              />
                            )}
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="row m-3 w-100">
                      <div className="col-md-6">
                        <label htmlFor="industry">Your Industry</label>
                        <input
                          type="text"
                          name="industry"
                          id="industry"
                          value={companyData.industry}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="ctype">Company Type</label>
                        <input
                          type="text"
                          name="ctype"
                          id="ctype"
                          value={companyData.companyType}
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
                          {companyData.paymentTerm != "" ? (
                            <input
                              type="text"
                              name="Payment_Term"
                              id="Payment_Term"
                              value={companyData.paymentTerm}
                              className="form-control"
                              style={{
                                borderRadius: "10px 0px 0px 10px",
                                backgroundColor: "#2f516f",
                                color: "white",
                              }}
                              readOnly
                            />
                          ) : (
                            <input
                              type="text"
                              name="Payment_Term"
                              id="Payment_Term"
                              value="Trial Period"
                              className="form-control"
                              style={{
                                borderRadius: "10px 0px 0px 10px",
                                backgroundColor: "#2f516f",
                                color: "white",
                              }}
                              readOnly
                            />
                          )}

                          {/* <!-- <button id="modal_closing" style="border-radius: 0px 10px 10px 0px;"
                                            title="change Payment Term" type="button" className="btn btn-info" data-bs-toggle="modal"
                                            data-bs-target="#partycreation" data-bs-whatever="@mdo"><i className="bx bx-plus"
                                                style="font-weight: bold;"></i></button> --> */}
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
                          value={companyData.endDate}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row mt-5 mb-3 w-100">
                      <div className="col-md-3"></div>
                      <div className="col-md-3">
                        <Link to="/edit_company_profile">
                          <button
                            className="btn btn-outline-info rounded-pill w-100 h-100 text-light"
                            type="button"
                          >
                            Edit Profile
                          </button>
                        </Link>
                      </div>
                      <div className="col-md-3">
                        <Link to="/edit_modules">
                          <button
                            className="btn btn-outline-danger rounded-pill w-100 h-100 text-light"
                            type="button"
                          >
                            Edit Modules
                          </button>
                        </Link>
                      </div>
                      <div className="col-md-3"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="row m-3 w-100">
                      <div className="col-md-6">
                        <label htmlFor="cname">Company Name</label>
                        <input
                          type="text"
                          name="cname"
                          id="cname"
                          value={companyData.companyName}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="caddress">Company Code</label>
                        <input
                          type="text"
                          name="caddress"
                          id="caddress"
                          value={companyData.companyCode}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row m-3 w-100">
                      <div className="col-md-6">
                        <label htmlFor="cname">Company Email</label>
                        <input
                          type="text"
                          name="cname"
                          id="cname"
                          value={companyData.companyEmail}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="caddress">Company Address</label>
                        <input
                          type="text"
                          name="caddress"
                          id="caddress"
                          value={companyData.address}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row m-3 w-100">
                      <div className="col-md-6">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={companyData.city}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="state">State</label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={companyData.state}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row m-3 w-100">
                      <div className="col-md-6">
                        <label htmlFor="pincode">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          id="pincode"
                          value={companyData.pincode}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          value={personalData.companyContact}
                          className="form-control"
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row mt-5 mb-3 w-100">
                      <div className="col-md-4"></div>
                      <div className="col-md-4">
                        <Link to="/edit_staff_profile">
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
                  </>
                )}
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

                {companyData.paymentTerm != "" ? (
                  <>
                    <input
                      className="w-100"
                      type="text"
                      value={companyData.paymentTerm}
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
                  value={companyData.endDate}
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
                      <option
                        value=""
                        style={{ backgroundColor: "white" }}
                      >
                        Choose
                      </option>
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
                      <option
                        value=""
                        style={{ backgroundColor: "white" }}
                      >
                        Choose
                      </option>
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

export default CompanyProfile;
