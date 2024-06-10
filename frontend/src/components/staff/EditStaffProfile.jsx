import React, { useEffect, useState } from "react";
import FinBase from "../company/FinBase";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../functions/config";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

function EditStaffProfile() {
  const user = Cookies.get("User");
  const navigate = useNavigate();
  var is_company = false;
  if (user === "Company") {
    is_company = true;
  }

  const [personalData, setPersonalData] = useState([
    {
      userImage: false,
      firstName: "",
      lastName: "",
      email: "",
      userContact: "",
    },
  ]);

  const [file, setFile] = useState(null);

  const ID = Cookies.get("Login_id");
  const getProfileDetails = () => {
    axios
      .get(`${config.base_url}/get_profile_data/${ID}/`)
      .then((res) => {
        console.log("PROFILE_RESPONSE==", res);
        if (res.data.status) {
          const pers = res.data.personalData;
          if (pers.userImage) {
            var logoUrl = `${config.base_url}/${pers.userImage}`;
          }
          const p = {
            userImage: logoUrl,
            firstName: pers.firstName,
            lastName: pers.lastName,
            email: pers.email,
            userContact: pers.userContact,
          };
          setPersonalData(p);
        }
      })
      .catch((err) => {
        console.log("ERROR==", err);
      });
  };

  useEffect(() => {
    getProfileDetails();
  }, []);

  const handlePersonalDataChange = (e) => {
    setPersonalData({
      ...personalData,
      [e.target.name]: e.target.value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Id", ID);
    formData.append("First_name", personalData.firstName);
    formData.append("Last_name", personalData.lastName);
    formData.append("Email", personalData.email);
    formData.append("Contact", personalData.userContact);
    if (file) {
      formData.append("img", file);
    }

    axios
      .put(`${config.base_url}/edit_staff_profile/`, formData)
      .then((res) => {
        console.log("RESPONSE==", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Profile Updated",
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
        className="page-content"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="card radius-15">
          <div className="card-body">
            <div className="card-title">
              <form
                action="#"
                onSubmit={handleSubmit}
                method="post"
                encType="multipart/form-data"
              >
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

                  <div className="row w-100 d-flex justify-content-center">
                    <input
                      type="file"
                      name="img"
                      className="form-control"
                      style={{ backgroundColor: "#2f516f", color: "white" }}
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                </center>
                <hr className="text-white" />

                <h4 className="m-4 w-100">Personal Info</h4>
                <div className="row m-3 w-100">
                  <div className="col-md-6">
                    <label htmlFor="first_name">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      id="first_name"
                      value={personalData.firstName}
                      onChange={handlePersonalDataChange}
                      className="form-control"
                      style={{ backgroundColor: "#2f516f", color: "white" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      id="last_name"
                      value={personalData.lastName}
                      onChange={handlePersonalDataChange}
                      className="form-control"
                      style={{ backgroundColor: "#2f516f", color: "white" }}
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
                      onChange={handlePersonalDataChange}
                      className="form-control"
                      style={{ backgroundColor: "#2f516f", color: "white" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email">Contact</label>
                    <input
                      type="text"
                      name="userContact"
                      id="contact"
                      value={personalData.userContact}
                      onChange={handlePersonalDataChange}
                      pattern="[0-9]{10}"
                      className="form-control"
                      style={{ backgroundColor: "#2f516f", color: "white" }}
                    />
                  </div>
                </div>
                <div className="row m-3">
                  <div className="col-md-6"></div>
                </div>

                <center className="w-100">
                  <button
                    className="btn btn-outline-info rounded-pill text-light mt-4"
                    type="submit"
                    style={{ width: "40%" }}
                  >
                    Submit
                  </button>
                </center>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditStaffProfile;
