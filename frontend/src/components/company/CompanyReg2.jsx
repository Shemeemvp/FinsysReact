import React, { useState } from "react";
import "../styles/CompanyReg2.css";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
// import $ from "jquery";
import axios from "axios";
import config from "../../functions/config";
import { useNavigate } from "react-router-dom";

function CompanyReg2() {
  const navigate = useNavigate();
  const ID = Cookies.get("Login_id");

  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("Accounting Services");
  const [companyType, setCompanyType] = useState("Private Limited Company");
  const [accountant, setAccountant] = useState("yes");
  const [payment, setPayment] = useState("Cash");
  const [registerMode, setRegisterMode] = useState("self");
  const [distributorId, setDistributorId] = useState("");
  const [file, setFile] = useState(null);

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

  function dcode() {
    var r = document.getElementById("reg").value;
    if (r == "self") {
      document.getElementById("dc").style.display = "none";
    } else {
      document.getElementById("dc").style.display = "block";
    }
  }

  function showSecondFieldset() {
    document.getElementById("fieldset1").style.display = "none";
    document.getElementById("fieldset2").style.display = "block";
  }

  function showFirstFieldset() {
    document.getElementById("fieldset2").style.display = "none";
    document.getElementById("fieldset1").style.display = "block";
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("DATA==");
    const formData = new FormData();
    formData.append('Id', ID);
    formData.append('Company_name', companyName);
    formData.append('Address', companyAddress);
    formData.append('City', city);
    formData.append('State', state);
    formData.append('Pincode', pincode);
    formData.append('Country', country);
    formData.append('Contact', phoneNumber);
    formData.append('Business_name', businessName);
    formData.append('Industry', industry);
    formData.append('Company_Type', companyType);
    formData.append('Accountant', accountant);
    formData.append('Payment_Type', payment);
    formData.append('Registration_Type', registerMode);
    formData.append('distId', distributorId);
    if (file) {
      formData.append('Image', file);
    }

    axios
      .put(`${config.base_url}/CompanyReg2_action2/`, formData)
      .then((res) => {
        console.log("RESPONSE==", res);
        if (res.data.status) {
          navigate("/modules_list");
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
  
  // Toast.fire({
  //   icon: "success",
  //   title: "Registered successfully",
  // });
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
            {/* {% for message in messages %}
            {% if message %}
            <div className="alert" onclick="this.parentElement.style.display='none';">
              <div className="row d-flex">
                <div className="col-md-12">
                  <center>
                    <h5 style={{color: "goldenrod"}}>{{ message }}</h5>
                  </center>
                </div>
              </div>
            </div>
            {% endif %}
            {% endfor %} */}
            <fieldset className="w-100 active_fieldset" id="fieldset1">
              <h2 className="mb-4">Try it free for 30 days !</h2>
              <input
                type="text"
                name="cname"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <input
                type="text"
                name="caddress"
                placeholder="Company Address"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
              <input
                type="text"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
              <select
                type="text"
                id="plosu"
                name="state"
                onChange={(e) => setState(e.target.value)}
                style={{ backgroundColor: "white" }}
              >
                <option value="" selected>
                  Choose
                </option>
                <option value="Andaman and Nicobar Islads">
                  Andaman and Nicobar Islads
                </option>
                <option value="Andhra Predhesh">Andhra Predhesh</option>
                <option value="Arunachal Predesh">Arunachal Predesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Dadra and Nagar Haveli">
                  Dadra and Nagar Haveli
                </option>
                <option value="Damn anad Diu">Damn anad Diu</option>
                <option value="Delhi">Delhi</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Predesh">Himachal Predesh</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Madhya Predesh">Madhya Predesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Puducherry">Puducherry</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Predesh">Uttar Predesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Other Territory">Other Territory</option>
              </select>
              <input
                type="number"
                name="pincode"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <input
                type="text"
                name="ccountry"
                placeholder="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                id="ph"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onInput={validatePhoneNumber}
                required
              />

              <input type="file" name="img1" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />

              <input
                type="button"
                name="next"
                className="next action-button"
                value="Next"
                onClick={showSecondFieldset}
              />
            </fieldset>
            <fieldset className="w-100" id="fieldset2">
              <h2 className="mb-4">Let's Start Building Your FinsYs</h2>
              <input
                type="text"
                name="bname"
                placeholder="Legal Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
              <label htmlFor="industry" style={{ float: "left" }}>
                Your Industry
              </label>
              <select
                name="industry"
                id="industry"
                className="was-validated"
                onChange={(e) => setIndustry(e.target.value)}
                required
              >
                <option value="Accounting Services">Accounting Services</option>
                <option value="Consultants, doctors, Lawyers and similar">
                  Consultants, doctors, Lawyers and similar
                </option>
                <option value="Information Tecnology">
                  Information Tecnology
                </option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Professional Scientific and Technical Services">
                  Professional, Scientific and Technical Services
                </option>
                <option value="Restaurant/Bar and similar">
                  Restaurant/Bar and similar
                </option>
                <option value="Retail and Smilar">Retail and Smilar</option>
                <option value="Other Finanacial Services">
                  Other Finanacial Services
                </option>
              </select>
              <label htmlFor="ctype" style={{ float: "left" }}>
                Company type
              </label>
              <select
                name="ctype"
                id="ctype"
                className="was-validated"
                onChange={(e) => setCompanyType(e.target.value)}
                required
              >
                <option value="Private Limited Company">
                  Private Limited Company
                </option>
                <option value="Public Limited Company">
                  Public Limited Company
                </option>
                <option value="Joint-Venture Company">
                  Joint-Venture Company
                </option>
                <option value="Partnership Firm Company">
                  Partnership Firm Company
                </option>
                <option value="One Person Company">One Person Company</option>
                <option value="Branch Office Company">
                  Branch Office Company
                </option>
                <option value="Non Government Organization">
                  Non Government Organization
                </option>
              </select>
              <label htmlFor="abt" style={{ float: "left" }}>
                Do you have an Accountant, Bookkeeper or Tax Pro ?
              </label>

              <select
                name="staff"
                id=""
                onChange={(e) => setAccountant(e.target.value)}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {/* <!-- <input type="radio" id="abt" name="abt" value="Yes" style="position: absolute;" required/>
                <label htmlFor="" style="">Yes</label>
                <input type="radio" id="abt" name="abt" value="No" style="" required/>
                <label htmlFor="" style="">No</label> --> */}

              <label style={{ float: "left" }}>
                How do you like to get paid?
              </label>
              <select
                name="paid"
                className="was-validated"
                onChange={(e) => setPayment(e.target.value)}
                required
              >
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Credit card/Debit card">
                  Credit card/Debit card
                </option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Paypal/Other service">
                  Paypal/Other service
                </option>
              </select>

              <label style={{ float: "left" }}>How do you Register?</label>
              <select
                name="reg_type"
                id="reg"
                onChange={(e) => {
                  dcode();
                  setRegisterMode(e.target.value);
                }}
              >
                <option value="self">By Self</option>
                <option value="distributor">By The Distributor</option>
              </select>

              <input
                type="text"
                name="dis_code"
                id="dc"
                value={distributorId}
                onChange={(e) => setDistributorId(e.target.value)}
                placeholder="Enter Distributor Code"
                style={{ display: "none" }}
              />

              <input
                type="button"
                name="previous"
                className="previous action-button-previous"
                value="Previous"
                onClick={showFirstFieldset}
              />
              <input
                type="submit"
                className="action-button"
                value="Start Trial"
              />
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}

export default CompanyReg2;
