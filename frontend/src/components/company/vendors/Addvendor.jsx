import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";


function Addvendor () {
    const ID = Cookies.get("Login_id");
    const navigate = useNavigate();
    const [terms, setTerms] = useState([]);
    const [lists, setLists] = useState([]);

    const fetchPaymentTerms = () => {
      axios
        .get(`${config.base_url}/get_company_payment_terms/${ID}/`)
        .then((res) => {
          console.log("PTERMS==", res);
          if (res.data.status) {
            let pTrms = res.data.terms;
            setTerms([]);
            pTrms.map((i) => {
              setTerms((prevState) => [...prevState, i]);

            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  
    useEffect(() => {
      fetchPaymentTerms();
    }, []);
  
    const fetchSalesPriceLists = () => {
      axios
        .get(`${config.base_url}/get_sales_price_lists/${ID}/`)
        .then((res) => {
          console.log("lists==", res);
          if (res.data.status) {
            let acc = res.data.salesPriceLists;
            setLists([]);
            acc.map((i) => {
              setLists((prevState) => [...prevState, i]);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  
    useEffect(() => {
      fetchSalesPriceLists();
    }, []);

    const [title, setTitle] = useState("Mr");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [company, setCompany] = useState("");
    const [location, setLocation] = useState("");
    const [placeOfSupply, setPlaceOfSupply] = useState("");
    const [gstType, setGstType] = useState("");
    const [gstIn, setGstIn] = useState("");
    const [panNo, setPanNo] = useState("");
    const [oBalType, setOBalType] = useState("");
    const [oBal, setOBal] = useState("");
    const [creditLimit, setCreditLimit] = useState("");
    const [paymentTerm, setPaymentTerm] = useState("");
    const [priceList, setPriceList] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [mobile, setMobile] = useState("");
    const [currency, setCurrency] = useState("");
    const [bStreet, setBStreet] = useState("");
    const [bCity, setBCity] = useState("");
    const [bState, setBState] = useState("");
    const [bPincode, setBPincode] = useState("");
    const [bCountry, setBCountry] = useState("");
  
    const [sStreet, setSStreet] = useState("");
    const [sCity, setSCity] = useState("");
    const [sState, setSState] = useState("");
    const [sPincode, setSPincode] = useState("");
    const [sCountry, setSCountry] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
  
      var dt = {
        Id: ID,
        Title:title,
        Firstname:firstName,
        Lastname:lastName,
        Company:company,
        Location:location,
        Email:email,
        Website:website,
        Mobile:mobile,
        Gsttype:gstType,
        Gstno:gstIn,
        Panno:panNo,
        Placeofsupply:placeOfSupply,
        Currency:currency,
        Openingbalance:oBal,
        Openingbalatype:oBalType,
        Creditlimit:creditLimit,
        Payment:paymentTerm,
        Billingstreet:bStreet,
        Billingcity:bCity,
        Billingcountry:bCountry,
        Billingstate:bState,
        Billingpin:bPincode,
        Shipstreet:sStreet,
        Shipcity:sCity,
        Shipstate:sState,
        Shippin:sPincode,
        Shipcountry:sCountry,
        status: "Active",
      };
  
      axios
        .post(`${config.base_url}/add_vendor_new/`, dt)
        .then((res) => {
          console.log("ITM RES=", res);
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Vendor Added",
            });
            navigate("/vendors");
          }
          if (!res.data.status && res.data.message != "") {
            Swal.fire({
              icon: "error",
              title: `${res.data.message}`,
            });
          }
        })
        .catch((err) => {
          console.log("ERROR=", err);
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

    const [newPaymentTerm, setNewPaymentTerm] = useState("");
  const [newPaymentTermDays, setNewPaymentTermDays] = useState("");
  function handlePaymentTermModalSubmit(e) {
    e.preventDefault();
    var name = newPaymentTerm;
    var dys = newPaymentTermDays;
    if (name != "" && dys != "") {
      var u = {
        Id: ID,
        term_name: newPaymentTerm,
        days: newPaymentTermDays,
      };
      axios
        .post(`${config.base_url}/create_new_company_payment_term/`, u)
        .then((res) => {
          console.log("PTRM RES=", res);
          if (!res.data.status && res.data.message != "") {
            Swal.fire({
              icon: "error",
              title: `${res.data.message}`,
            });
          }
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Term Created",
            });
            fetchPaymentTerms();
            setPaymentTerm(res.data.data.id);
            setNewPaymentTerm("");
            setNewPaymentTermDays("");
            document.getElementById("dismissPaymentTermModal").click();
          }
        })
        .catch((err) => {
          console.log("ERROR=", err);
          if (!err.response.data.status) {
            Swal.fire({
              icon: "error",
              title: `${err.response.data.message}`,
            });
          }
        });
    } else {
      alert("Invalid");
    }
  }



    function placeShipAddress() {
        var chkbtn = document.getElementById("shipAddress");
        if (chkbtn.checked == true) {
          document.getElementById("shipstreet").value = document.getElementById("street").value;
          document.getElementById("shipcity").value =document.getElementById("city").value;
          document.getElementById("shippinco").value = document.getElementById("pinco").value;
          document.getElementById("shipcountry").value = document.getElementById("country").value;
          document.getElementById("shipState").value = document.getElementById("state").value;
          var ss = document.getElementById("shipstreet").value;
          setSStreet(ss);
          var sc = document.getElementById("shipcity").value;
          setSCity(sc);
          var sp = document.getElementById("shippinco").value;
          setSPincode(sp);
          var sco = document.getElementById("shipcountry").value;
          setSCountry(sco);
          var sst = document.getElementById("shipState").value;
          setSState(sst);
        } else {
          document.getElementById("shipstreet").value = "";
          document.getElementById("shipcity").value = "";
          document.getElementById("shippinco").value = "";
          document.getElementById("shipcountry").value = "";
          document.getElementById("shipState").value = "";
        }
      }
    function handleGstType(value) {
        setGstType(value);
        checkGstType(value);
      }
    
      function handleGstIn(value) {
        setGstIn(value);
        checkgst(value);
      }
    
      function handlePanNo(value) {
        setPanNo(value);
        checkpan(value);
      }
      function handleWebSite(value) {
        setWebsite(value);
        checkweb(value);
      }
    
      function handleEmail(value) {
        setEmail(value);
        checkemail(value);
      }
    
      function handlePhone(value) {
        setMobile(value);
        checkphone(value);
      }
      function checkGstType(value) {
        var gstTypeElement = document.getElementById("gstType");
        var gstINElement = document.getElementById("gstIN");
        var gstRowElements = document.getElementsByClassName("gstrow");
    
        var x = value;
        if (x === "Unregistered Business" || x === "Overseas" || x === "Consumer") {
          Array.prototype.forEach.call(gstRowElements, function (element) {
            element.classList.remove("d-block");
            element.classList.add("d-none");
          });
          gstINElement.required = false;
        } else {
          gstINElement.required = true;
          Array.prototype.forEach.call(gstRowElements, function (element) {
            element.classList.remove("d-none");
            element.classList.add("d-block");
          });
        }
      }
    
      function checkgst(val) {
        var gstinput = val;
        var gstregexp =
          "[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}";
    
        if (gstinput.length === 15) {
          if (gstinput.match(gstregexp)) {
            document.getElementById("warngst").innerHTML = "";
            checkCustomerGSTIN(val);
          } else {
            document.getElementById("warngst").innerHTML =
              "Please provide a valid GST Number";
            alert("Please provide a valid GST Number");
          }
        } else {
          document.getElementById("warngst").innerHTML =
            "Please provide a valid GST Number";
          alert("Please provide a valid GST Number");
        }
      }
    
      function checkpan(val) {
        var paninput = val;
        var panregexp = ["[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}"];
        if (paninput.match(panregexp)) {
          document.getElementById("warnpan").innerHTML = "";
          checkCustomerPAN(val);
        } else {
          document.getElementById("warnpan").innerHTML =
            "Please provide a valid PAN Number";
          alert("Please provide a valid PAN Number");
        }
      }
    
      function checkweb(val) {
        var webinput = val;
        var webregexp = "www.";
        if (webinput.startsWith(webregexp)) {
          document.getElementById("warnweb").innerHTML = "";
        } else {
          document.getElementById("warnweb").innerHTML =
            "Please provide a valid Website Address";
          alert("Please provide a valid Website Address");
        }
      }
    
      function checkphone(val) {
        var phoneinput = val;
        var phoneregexp = /^\d{10}$/;
        if (phoneinput.match(phoneregexp)) {
          document.getElementById("warnphone").innerHTML = "";
          checkCustomerPhone(val);
        } else {
          document.getElementById("warnphone").innerHTML =
            "Please provide a valid Phone Number";
          alert("Please provide a valid Phone Number");
        }
      }
    
      function checkemail(val) {
        var emailinput = val;
        var emailregexp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (emailinput.match(emailregexp)) {
          document.getElementById("warnemail").innerHTML = "";
          checkCustomerEmail(val);
        } else {
          document.getElementById("warnemail").innerHTML =
            "Please provide a valid Email ID";
          alert("Please provide a valid Email id");
        }
      }
      function checkCustomerName(fname, lname) {
        if (fname != "" && lname != "") {
          var u = {
            Id: ID,
            fName: fname,
            lName: lname,
          };
          axios
            .get(`${config.base_url}/check_customer_name/`, { params: u })
            .then((res) => {
              console.log(res);
              if (res.data.is_exist) {
                Swal.fire({
                  icon: "error",
                  title: `${res.data.message}`,
                });
              }
            })
            .catch((err) => {
              console.log("ERROR=", err);
              if (!err.response.data.status && err.response.data.message) {
                Swal.fire({
                  icon: "error",
                  title: `${err.response.data.message}`,
                });
              }
            });
        }
      }
    
      function checkCustomerGSTIN(gstin) {
        var gstNo = gstin;
        if (gstNo != "") {
          var u = {
            Id: ID,
            gstin: gstNo,
          };
          axios
            .get(`${config.base_url}/check_gstin/`, { params: u })
            .then((res) => {
              console.log(res);
              if (res.data.is_exist) {
                Swal.fire({
                  icon: "error",
                  title: `${res.data.message}`,
                });
              }
            })
            .catch((err) => {
              console.log("ERROR=", err);
              if (!err.response.data.status && err.response.data.message) {
                Swal.fire({
                  icon: "error",
                  title: `${err.response.data.message}`,
                });
              }
            });
        }
      }
    
      function checkCustomerPAN(pan) {
        var panNo = pan;
        if (panNo != "") {
          var u = {
            Id: ID,
            pan: panNo,
          };
          axios
            .get(`${config.base_url}/check_pan/`, { params: u })
            .then((res) => {
              console.log(res);
              if (res.data.is_exist) {
                Swal.fire({
                  icon: "error",
                  title: `${res.data.message}`,
                });
              }
            })
            .catch((err) => {
              console.log("ERROR=", err);
              if (!err.response.data.status && err.response.data.message) {
                Swal.fire({
                  icon: "error",
                  title: `${err.response.data.message}`,
                });
              }
            });
        }
      }
    
      function checkCustomerPhone(phone) {
        var phoneNo = phone;
        if (phoneNo != "") {
          var u = {
            Id: ID,
            phone: phoneNo,
          };
          axios
            .get(`${config.base_url}/check_phone/`, { params: u })
            .then((res) => {
              console.log(res);
              if (res.data.is_exist) {
                Swal.fire({
                  icon: "error",
                  title: `${res.data.message}`,
                });
              }
            })
            .catch((err) => {
              console.log("ERROR=", err);
              if (!err.response.data.status && err.response.data.message) {
                Swal.fire({
                  icon: "error",
                  title: `${err.response.data.message}`,
                });
              }
            });
        }
      }
    
      function checkCustomerEmail(email) {
        var custEmail = email;
        if (custEmail != "") {
          var u = {
            Id: ID,
            email: custEmail,
          };
          axios
            .get(`${config.base_url}/check_email/`, { params: u })
            .then((res) => {
              console.log(res);
              if (res.data.is_exist) {
                Swal.fire({
                  icon: "error",
                  title: `${res.data.message}`,
                });
              }
            })
            .catch((err) => {
              console.log("ERROR=", err);
              if (!err.response.data.status && err.response.data.message) {
                Swal.fire({
                  icon: "error",
                  title: `${err.response.data.message}`,
                });
              }
            });
        }
      }
    
    
      function setOpeningBalanceValue(value){
    
      }
    
      function handleOpenBalType(val) {
        setOBalType(val);
        changeOpenBalType(val);
      }
      function changeOpenBalType(type) {
        var openbal = oBal;
        if (openbal != "") {
          if (type == "credit") {
            if (parseFloat(openbal) != 0) {
              setOBal(-1 * openbal);
            } else {
              setOBal(openbal);
            }
          } else {
            setOBal(oBal);
          }
        }
      }

    return (
        <>
        <FinBase />
        <div
        className="page-content"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="card radius-15 h-20">
          <div className="row">
            <div className="col-md-12">
              <center>
                <h2 className="mt-3">ADD VENDOR</h2>
              </center>
              <hr />
            </div>
          </div>
        </div>

        <div className="card radius-15" style={{ backgroundColor: "#243e54" }}>
          <div className="card-body">
            <div className="card-title">
              <h4 className="mb-0">Vendor Details</h4>
            </div>
            <hr />
            <form className="needs-validation px-1" onSubmit={handleSubmit}>
              <div className="row mt-3 w-100">
                <div className="col-md-3">
                  <label htmlFor="title">Title</label>
                  <select
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                  >
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </select>
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    style={{ backgroundColor: "#43596c", color: "white" }}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    style={{ backgroundColor: "#43596c", color: "white" }}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="companyName">Company</label>
                  <input
                    type="text"
                    className="form-control"
                    id="companyName"
                    name="company_name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{ backgroundColor: "#43596c", color: "white" }}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>
              </div>

              <div className="row mt-3 w-100">
                
                <div className="col-md-3">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ backgroundColor: "#43596c", color: "white" }}
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="custEmail">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    id="custEmail"
                    name="email"
                    value={email}
                    onChange={(e) => handleEmail(e.target.value)}
                    style={{ backgroundColor: "#43596c", color: "white" }}
                    placeholder="finsys@gmail.com"
                  />
                  <div className="invalid-feedback">
                    Please provide a valid Email
                  </div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="custWebsite">Website</label>
                  <input
                    type="text"
                    className="form-control"
                    id="custWebsite"
                    placeholder="www.finsys.com"
                    value={website}
                    onChange={(e) => handleWebSite(e.target.value)}
                    name="website"
                    style={{ backgroundColor: "#43596c", color: "white" }}
                  />
                  <div id="warnweb" className="text-danger"></div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="custMobile">Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    id="custMobile"
                    required
                    value={mobile}
                    onChange={(e) => handlePhone(e.target.value)}
                    name="mobile"
                    style={{ backgroundColor: "#43596c", color: "white" }}
                  />
                  <div className="text-danger m-2" id="warnphone"></div>
                </div>
                <hr style={{position:'relative',top:'15px'}}/>
                <div className="card-title">
              <h4 className="mt-4">Other Options</h4>
            </div>
                <hr style={{position:'relative',top:'10px'}}/>

              <div className="row mt-4 w-100">
                <div className="col-md-3">
                  <label htmlFor="gstType">GST Type</label>
                  <select
                    className="form-control"
                    id="gstType"
                    name="gst_type"
                    value={gstType}
                    onChange={(e) => handleGstType(e.target.value)}
                    style={{ backgroundColor: "#43596c", color: "white" }}
                    required
                  >
                    <option selected value="">
                      Select GST Type
                    </option>
                    <option value="Registered Business - Regular">
                      Registered Business - Regular{" "}
                      <span>
                        <i>(Business that is registered under gst)</i>
                      </span>
                    </option>
                    <option value="Registered Business - Composition">
                      Registered Business - Composition (Business that is
                      registered under composition scheme in gst)
                    </option>
                    <option value="Unregistered Business">
                      Unregistered Business (Business that has not been
                      registered under gst)
                    </option>
                    <option value="Overseas">
                      Overseas (Import/Export of supply outside india)
                    </option>
                    <option value="Consumer">Consumer</option>
                    <option value="Special Economic Zone (SEZ)">
                      Special Economic Zone (SEZ) (Business that is located in a
                      special economic zone of india or a SEZ developer)
                    </option>
                    <option value="Demed Exports">
                      Demed Exports (Supply of woods to an exports oriented unit
                      or againsed advanced authorization or export promotion
                      capital woods)
                    </option>
                    <option value="Tax Deductor">
                      Tax Deductor (State of central gov,government agencies or
                      local authority)
                    </option>
                    <option value="SEZ Developer">
                      SEZ Developer (A person or organization who owns atleast
                      26% equality in creating business units in special
                      economic zone)
                    </option>
                  </select>
                  <div className="invalid-feedback">
                    Please select a valid registration type.
                  </div>
                </div>
                <div className="col-md-3 gstrow d-block" id="gstInValue" style={{position:'relative',left:'10px'}}>
                  <div>
                    <label htmlFor="gstIN">GSTIN</label>
                    <input
                      type="text"
                      className="form-control"
                      value={gstIn}
                      onChange={(e) => handleGstIn(e.target.value)}
                      id="gstIN"
                      name="gstin"
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      placeholder="29APPCK7465F1Z1"
                    />
                    <a
                      data-toggle="modal"
                      href="#exampleModal"
                      style={{ color: "#3dd5f3" }}
                    >
                      Get Taxpayer Details
                    </a>
                    <div className="text-danger m-2" id="warngst"></div>
                  </div>
                </div>
                <div className="col-md-3" style={{position:'relative',left:'15px'}}>
                  <label htmlFor="panNo">PAN No.</label>
                  <input
                    type="text"
                    className="form-control"
                    id="panNo"
                    name="pan_no"
                    style={{ backgroundColor: "#43596c", color: "white" }}
                    required
                    value={panNo}
                    onChange={(e) => handlePanNo(e.target.value)}
                    placeholder="APPCK7465F"
                  />
                  <div className="text-danger m-2" id="warnpan"></div>
                </div>
                <div className="col-md-3" style={{position:'relative',left:'18px'}}>
                  <label htmlFor="placeOfSupply">Place of Supply</label>
                  <select
                    className="custom-select form-control"
                    id="placeOfSupply"
                    name="place_of_supply"
                    value={placeOfSupply}
                    onChange={(e) => setPlaceOfSupply(e.target.value)}
                    style={{ backgroundColor: "#43596c", color: "white" }}
                    required
                  >
                    <option selected value="">
                      Select Place of Supply
                    </option>
                    <option value="Andaman and Nicobar Islads">
                      Andaman and Nicobar Islands
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
                  <div className="invalid-feedback">
                    Please select a valid registration type.
                  </div>
                </div>
              </div>
              <div className="row w-100">
              <div className="col-md-3">
                  <label htmlFor="currency">Currency</label>
                  <select
                    name="currency"
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="form-control"
                  >
                    <option value="INR - Indian Rupee">INR - Indian Rupee</option>
                    <option value="$ - Dollar">$ - Dollar</option>
                  </select>
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="col-md-3" style={{position:'relative',left:'10px'}}>
                  <label htmlFor="validationCustom05">Opening Balance</label>
                  <div className="d-flex">
                    <select
                      name="balance_type"
                      id="bal"
                      className="form-select text-white mr-1 px-1"
                      value={oBalType}
                      onChange={(e) => handleOpenBalType(e.target.value)}
                      style={{
                        backgroundColor: "#243e54",
                        width: "25%",
                        borderRadius: "5px",
                      }}
                    >
                      <option value="debit">Debit</option>
                      <option value="credit">Credit</option>
                    </select>
                    <input
                      type="text"
                      className="form-control"
                      name="open_balance"
                      id="openbalance"
                      step="any"
                      value={oBal}
                      onChange={(e) => setOBal(e.target.value)}
                      style={{ backgroundColor: "#43596c", color: "white" }}
                    />
                    <div className="text-danger m-2"></div>
                  </div>
                </div>

                <div className="col-md-3" style={{position:'relative',left:'13px'}}>
                  <label htmlFor="creditLimit">Credit Limit</label>
                  <input
                    type="text"
                    className="form-control"
                    name="credit_limit"
                    style={{ backgroundColor: "#43596c", color: "white" }}
                    step="any"
                    id="creditLimit"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                  />
                  <div className="text-danger m-2"></div>
                </div>
                <div className="col-md-3" style={{position:'relative',left:'15px'}}>
                  <label htmlFor="paymentTerms">Payment Terms</label>
                  <div className="d-flex align-items-center" style={{position:'relative',bottom:'8px'}}>
                    <select
                      name="payment_terms"
                      id="paymentTerms"
                      value={paymentTerm}
                      onChange={(e) => setPaymentTerm(e.target.value)}
                      className="form-control"
                    >
                      <option value="" selected>
                        Choose
                      </option>
                      {terms &&
                        terms.map((p) => (
                          <option value={p.id}>{p.term_name}</option>
                        ))}
                    </select>
                    <a
                      href="#newPaymentTerm"
                      data-toggle="modal"
                      className="btn btn-outline-secondary ml-1"
                      style={{ width: "fit-content", height: "fit-content" }}
                    >
                      +
                    </a>
                  </div>
                </div>

                <div className="col-md-3 mt-3">
                  <label htmlFor="priceList">Price List</label>
                  <select
                    name="price_list"
                    id="priceList"
                    value={priceList}
                    onChange={(e) => setPriceList(e.target.value)}
                    className="form-control"
                  >
                    <option value="" selected>
                      Choose
                    </option>
                    {lists &&
                      lists.map((l) => <option value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>

              <hr style={{position:'relative',top:'10px'}}/>
              <div className="row mt-5 w-100">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-12 card-title">
                      <h5 className="mb-0">Billing Address</h5>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mt-3">
                      <div className="form-row">
                        <label htmlFor="street">Street</label>
                        <textarea
                          className="form-control street"
                          required
                          id="street"
                          name="street"
                          value={bStreet}
                          onChange={(e) => setBStreet(e.target.value)}
                          style={{ backgroundColor: "#43596c", color: "white" }}
                        />
                        <div className="invalid-feedback">
                          Please provide a valid Street
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-3">
                      <div className="form-row">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          id="city"
                          value={bCity}
                          onChange={(e) => setBCity(e.target.value)}
                          name="city"
                          style={{ backgroundColor: "#43596c", color: "white" }}
                          placeholder="City"
                        />
                        <div className="invalid-feedback">
                          Please provide a valid City
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mt-3">
                      <div className="form-row">
                        <label htmlFor="state">State</label>
                        <select
                          type="text"
                          className="form-control"
                          id="state"
                          name="state"
                          value={bState}
                          onChange={(e) => setBState(e.target.value)}
                          required
                          style={{ backgroundColor: "#43596c", color: "white" }}
                        >
                          <option value="" selected hidden>
                            Choose
                          </option>
                          <option value="Andaman and Nicobar Islads">
                            Andaman and Nicobar Islands
                          </option>
                          <option value="Andhra Predhesh">
                            Andhra Predhesh
                          </option>
                          <option value="Arunachal Predesh">
                            Arunachal Predesh
                          </option>
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
                          <option value="Himachal Predesh">
                            Himachal Predesh
                          </option>
                          <option value="Jammu and Kashmir">
                            Jammu and Kashmir
                          </option>
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
                          <option value="Other Territory">
                            Other Territory
                          </option>
                        </select>
                        <div className="invalid-feedback">
                          Please provide a valid State
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-3">
                      <div className="form-row">
                        <label htmlFor="pinco">Pin Code</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          id="pinco"
                          name="pinco"
                          value={bPincode}
                          onChange={(e) => setBPincode(e.target.value)}
                          style={{ backgroundColor: "#43596c", color: "white" }}
                          placeholder="PIN code"
                        />
                        <div className="invalid-feedback">
                          Please provide a valid Pin Code
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mt-3">
                      <div className="form-row">
                        <label htmlFor="country">Country</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          id="country"
                          name="country"
                          value={bCountry}
                          onChange={(e) => setBCountry(e.target.value)}
                          style={{ backgroundColor: "#43596c", color: "white" }}
                          placeholder="Country"
                        />
                        <div className="invalid-feedback">
                          Please provide a valid Country
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-12 d-flex">
                      <h5>Shipping Address</h5>
                      <input
                        className="ml-4 ml-5"
                        type="checkbox"
                        onClick={placeShipAddress}
                        id="shipAddress"
                        name="ship_address"
                      />
                      <label className="ml-2 mt-1 ml-2" htmlFor="shipAddress">
                        Same As Billing Address
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mt-3">
                      <div className="form-row">
                        <label htmlFor="shipstreet">Street</label>
                        <textarea
                          className="form-control"
                          id="shipstreet"
                          name="shipstreet"
                          style={{ backgroundColor: "#43596c", color: "white" }}
                          value={sStreet}
                          onChange={(e) => setSStreet(e.target.value)}
                        />
                        <div className="invalid-feedback">
                          Please provide a valid Street
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-3">
                      <div className="form-row">
                        <label htmlFor="shipcity">City</label>
                        <input
                          type="text"
                          className="form-control"
                          id="shipcity"
                          name="shipcity"
                          style={{ backgroundColor: "#43596c", color: "white" }}
                          placeholder="City"
                          value={sCity}
                          onChange={(e) => setSCity(e.target.value)}
                        />
                        <div className="invalid-feedback">
                          Please provide a valid City
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mt-3">
                      <div className="form-row">
                        <label htmlFor="shipstate">State</label>
                        <select
                          type="text"
                          className="form-control"
                          id="shipState"
                          name="shipstate"
                          style={{ backgroundColor: "#43596c", color: "white" }}
                          value={sState}
                          onChange={(e) => setSState(e.target.value)}
                        >
                          <option value="" selected>
                            Choose
                          </option>
                          <option value="Andaman and Nicobar Islads">
                            Andaman and Nicobar Islands
                          </option>
                          <option value="Andhra Predhesh">
                            Andhra Predhesh
                          </option>
                          <option value="Arunachal Predesh">
                            Arunachal Predesh
                          </option>
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
                          <option value="Himachal Predesh">
                            Himachal Predesh
                          </option>
                          <option value="Jammu and Kashmir">
                            Jammu and Kashmir
                          </option>
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
                          <option value="Other Territory">
                            Other Territory
                          </option>
                        </select>
                        <div className="invalid-feedback">
                          Please provide a valid State
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-3">
                      <div className="form-row">
                        <label htmlFor="shippinco">Pin Code</label>
                        <input
                          type="text"
                          className="form-control"
                          id="shippinco"
                          name="shippinco"
                          style={{ backgroundColor: "#43596c", color: "white" }}
                          placeholder="PIN code"
                          value={sPincode}
                          onChange={(e) => setSPincode(e.target.value)}
                        />
                        <div className="invalid-feedback">
                          Please provide a valid Pin Code
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mt-3">
                      <div className="form-row">
                        <label htmlFor="shipcountry">Country</label>
                        <input
                          type="text"
                          className="form-control"
                          id="shipcountry"
                          name="shipcountry"
                          style={{ backgroundColor: "#43596c", color: "white" }}
                          placeholder="Country"
                          value={sCountry}
                          onChange={(e) => setSCountry(e.target.value)}
                        />
                        <div className="invalid-feedback">
                          Please provide a valid Country
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3 w-100">
                <div className="col">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="agreeTerms"
                      required
                      style={{ backgroundColor: "#43596c" }}
                    />
                    <label htmlFor="agreeTerms">
                      Agree to Terms and Conditions
                    </label>
                    <div className="invalid-feedback">
                      You must agree before submitting.
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-5 mb-5 w-100">
                <div className="col-md-4"></div>
                <div className="col-md-4 d-flex justify-content-center">
                  <button
                    className="btn btn-outline-secondary text-light"
                    type="submit"
                    style={{ width: "50%", height: "fit-content" }}
                  >
                    SAVE
                  </button>
                  <Link
                    to="/customers"
                    className="btn btn-outline-secondary ml-1 text-light"
                    style={{ width: "fit-content", height: "fit-content" }}
                  >
                    CANCEL
                  </Link>
                </div>
                <div className="col-md-4"></div>
              </div>
              </div>
            </form>
            
          </div>
        </div>
        <div className="modal fade" id="newPaymentTerm">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">New Payment Term</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                id="dismissPaymentTermModal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="card p-3">
                <form
                  onSubmit={handlePaymentTermModalSubmit}
                  id="newTermForm"
                  className="px-1"
                >
                  <div className="row mt-2 w-100">
                    <div className="col-6">
                      <label htmlFor="name">Term Name</label>
                      <input
                        type="text"
                        name="term_name"
                        id="termName"
                        value={newPaymentTerm}
                        onChange={(e) => {
                          setNewPaymentTerm(e.target.value);
                        }}
                        className="form-control w-100"
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="name">Days</label>
                      <input
                        type="number"
                        name="days"
                        id="termDays"
                        className="form-control w-100"
                        value={newPaymentTermDays}
                        onChange={(e) => {
                          setNewPaymentTermDays(e.target.value);
                        }}
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>
                  <div className="row mt-4 w-100">
                    <div className="col-4"></div>
                    <div className="col-4 d-flex justify-content-center">
                      <button
                        className="btn btn-outline-secondary text-grey w-75"
                        type="submit"
                        id="savePaymentTerm"
                      >
                        Save
                      </button>
                    </div>
                    <div className="col-4"></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
        </>
    )
}
export default Addvendor;