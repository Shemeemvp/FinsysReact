import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../styles/CompanyReg2.css";
import axios from "axios";
import config from "../../functions/config";
import Swal from "sweetalert2";

function StaffReg2() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();

  const [staffData, setStaffData] = useState({
    name: "",
    userName: "",
    email: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [file, setFile] = useState(null);

  function fetchStaffData() {
    axios
      .get(`${config.base_url}/get_staff_data/${ID}/`)
      .then((res) => {
        const stafData = res.data;
        console.log("STAFF==", stafData);
        if (stafData.status) {
          var details = stafData.data;
          var det = {
            name: details.name,
            userName: details.uName,
            email: details.email
          };
          setStaffData(det);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchStaffData();
  }, []);

  function validatePhoneNumber() {
    var phoneNumberInput = document.getElementById("ph");
    var phoneNumberVal = phoneNumberInput.value;
    var regPhoneNumber = /^\d{10}$/;

    if (regPhoneNumber.test(phoneNumberVal)) {
      phoneNumberInput.style.border = "2px solid green";
    } else {
      phoneNumberInput.style.border = "2px solid red";
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Id", ID);
    formData.append("contact", phoneNumber);
    if (file) {
      formData.append("img", file);
    }

    axios
      .put(`${config.base_url}/StaffReg2_Action/`, formData)
      .then((res) => {
        console.log("RESPONSE==", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Registered successfully",
          });
          navigate("/staff_registration");
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
      <div className="row">
        <div className="col-md-7 mx-auto">
          <form
            id="msform"
            action="#"
            encType="multipart/form-data"
            method="post"
            onSubmit={handleSubmit}
          >
            {/* <!-- fieldsets --> */}
            <fieldset className="active_fieldset">
              <h2 className="mb-4">We're Happy you're Here!</h2>
              <label htmlFor="" style={{float: "left",marginTop: "20px"}}>Name</label>
              <input
                type="text"
                name=""
                placeholder="Name"
                value={staffData.name}
                readOnly
              />

                <label htmlFor="" style={{float:"left",marginTop:"10px"}}>User Name</label>
              <input
                type="text"
                name=""
                placeholder="username"
                value={staffData.userName}
                readOnly
              />

                <label htmlFor="" style={{float:"left",marginTop:"10px"}}>Email</label>
              <input
                type="email"
                name="cemail"
                placeholder="Email"
                value={staffData.email}
                readOnly
              />

              <label htmlFor="" style={{float:"left",marginTop:"10px"}}>Contact</label>
              <input
                type="number"
                name="phone"
                placeholder="Phone Number"
                id="ph"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onInput={validatePhoneNumber}
              />
              
              <label htmlForhtmlFor="" style={{float:"left",marginTop:"10px"}}>Image</label>
              <input
                type="file"
                name="img"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <input
                type="submit"
                name="submit"
                className="next action-button"
                style={{ marginTop: "30px" }}
                value="Submit"
              />
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}

export default StaffReg2;
