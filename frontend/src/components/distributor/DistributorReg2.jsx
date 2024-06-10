import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../styles/CompanyReg2.css";
import axios from "axios";
import config from "../../functions/config";
import Swal from "sweetalert2";

function DistributorReg2() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();

  const [distributorData, setDistributorData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");
  const [file, setFile] = useState(null);

  const [terms, setTerms] = useState([
    {
      value: "",
      text: "Choose Payment terms",
    },
  ]);

  function fetchPaymentTerms() {
    axios
      .get(`${config.base_url}/get_payment_terms/`)
      .then((res) => {
        const trms = res.data;
        setTerms([
          {
            value: "",
            text: "Choose Payment terms",
          },
        ]);
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
        alert("Something went wrong.!");
      });
  }

  function fetchDistributorData() {
    axios
      .get(`${config.base_url}/get_distributor_data/${ID}/`)
      .then((res) => {
        const distData = res.data;
        console.log("DISTRIBUTOR==", distData);
        if (distData.status) {
          var details = distData.data;
          var det = {
            firstName: details.fName,
            lastName: details.lName,
            userName: details.uName,
            email: details.email,
          };
          setDistributorData(det);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchDistributorData();
  }, []);

  useEffect(() => {
    fetchPaymentTerms();
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
    formData.append("Contact", phoneNumber);
    formData.append("Payment_Term", paymentTerm);
    if (file) {
      formData.append("Image", file);
    }

    axios
      .put(`${config.base_url}/Distributor_Registration_Action2/`, formData)
      .then((res) => {
        console.log("RESPONSE==", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Registered successfully",
          });
          navigate("/distributor_registration");
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
              <input
                type="text"
                name=""
                placeholder="First Name"
                value={distributorData.firstName}
                readOnly
              />
              <input
                type="text"
                name=""
                placeholder="last name"
                value={distributorData.lastName}
                readOnly
              />
              <input
                type="text"
                name=""
                placeholder="username"
                value={distributorData.userName}
                readOnly
              />

              <input
                type="email"
                name="cemail"
                placeholder="Email"
                value={distributorData.email}
                readOnly
              />
              <input
                type="number"
                name="phone"
                placeholder="Phone Number"
                id="ph"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onInput={validatePhoneNumber}
              />
              <select
                name="payment_term"
                id=""
                onChange={(e) => setPaymentTerm(e.target.value)}
                style={{ fontWeight: "500" }}
              >
                {terms &&
                  terms.map((term) => (
                    <option value={term.value}>{term.text}</option>
                  ))}
              </select>
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

export default DistributorReg2;
