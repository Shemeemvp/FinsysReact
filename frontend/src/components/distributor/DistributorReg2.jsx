import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../styles/CompanyReg2.css";
import axios from "axios";
import config from "../../functions/config";

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
      value:"",
      text: "Choose Payment terms"
    }
  ]);

  function fetchPaymentTerms(){
    axios
        .get(`${config.base_url}/get_payment_terms/`)
        .then((res) => {
          const trms = res.data
          trms.map((term, index)=>{
            var obj = {
              value:term.id,
              text:term.payment_terms_number +" "+ term.payment_terms_value,
            }
            setTerms((prevState) => [...prevState,obj]);
          })

        })
        .catch((err) => {
          console.log(err)
        });
  }

  function fetchDistributorData(){
    axios
        .get(`${config.base_url}/get_distributor_data/${ID}/`)
        .then((res) => {
          const trms = res.data

        })
        .catch((err) => {
          console.log(err)
        });
  }

  useEffect(()=>{
    fetchPaymentTerms();
  },[])

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
  return (
    <>
      <div className="row">
        <div className="col-md-7 mx-auto">
          <form
            id="msform"
            action="#"
            encType="multipart/form-data"
            method="post"
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
                onInput={validatePhoneNumber}
              />
              <select name="payment_term" id="" style={{ fontWeight: "500" }}>
                {terms && terms.map((term)=>(
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
