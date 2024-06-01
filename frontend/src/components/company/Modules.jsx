import React, { useState } from "react";
import "../styles/Modules.css";
import axios from "axios";
import config from "../../functions/config";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Modules() {
  const ID = Cookies.get("Login_id");
  const [formData, setFormData] = useState({
    c1: null,
    c2: null,
    c3: null,
    c4: null,
    c5: null,
    c6: null,
    c7: null,
    c8: null,
    c9: null,
    c10: null,
    c11: null,
    c12: null,
    c13: null,
    c14: null,
    c15: null,
    c16: null,
    c17: null,
    c18: null,
    c19: null,
    c20: null,
    c21: null,
    c22: null,
    c23: null,
    c24: null,
    c25: null,
    c26: null,
    c27: null,
    c28: null,
    c29: null,
    c30: null,
    c31: null,
    c32: null,
    c33: null,
    c34: null,
    c35: null,
    c36: null,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked ? "1" : null,
    });
  };

  function toggleSelectAll(source) {
    // Get all checkboxes in the document
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Loop through each checkbox and set its checked property based on the source checkbox
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = source.checked;
    }

    const updatedFormData = {};

    for (let i = 1; i <= 36; i++) {
      updatedFormData[`c${i}`] = source.checked ? "1" : null;
    }

    setFormData(updatedFormData);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const data = {
      Login_Id: ID,
      Items: formData.c1,
      Price_List: formData.c2,
      Stock_Adjustment: formData.c3,
      Cash_in_hand: formData.c4,
      Offline_Banking: formData.c5,
      Bank_Reconciliation: formData.c6,
      UPI: formData.c7,
      Bank_Holders: formData.c8,
      Cheque: formData.c9,
      Loan_Account: formData.c10,
      Customers: formData.c11,
      Invoice: formData.c12,
      Estimate: formData.c13,
      Sales_Order: formData.c14,
      Recurring_Invoice: formData.c15,
      Retainer_Invoice: formData.c16,
      Credit_Note: formData.c17,
      Payment_Received: formData.c18,
      Delivery_Challan: formData.c19,
      Vendors: formData.c20,
      Bills: formData.c21,
      Recurring_Bills: formData.c22,
      Debit_Note: formData.c23,
      Purchase_Order: formData.c24,
      Expenses: formData.c25,
      Recurring_Expenses: formData.c26,
      Payment_Made: formData.c27,
      EWay_Bill: formData.c28,
      Chart_of_Accounts: formData.c29,
      Manual_Journal: formData.c30,
      Reconcile: formData.c36,
      Employees: formData.c31,
      Employees_Loan: formData.c32,
      Holiday: formData.c33,
      Attendance: formData.c34,
      Salary_Details: formData.c35,
    };

    axios
      .post(`${config.base_url}/Add_Modules/`, data)
      .then((res) => {
        console.log("RESPONSE==", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Registered successfully",
          });
          navigate("/company_registration");
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
      <div
        className="modules-body-wrapper"
        style={{ padding: "30px 120px 120px 120px" }}
      >
        <div className="modules-container">
          <form
            id="modulesForm"
            action="#"
            onSubmit={handleSubmit}
            method="post"
            style={{ padding: "20px" }}
          >
            <div
              className="head"
              style={{ borderBottom: "1px solid gray", marginBottom: "30px" }}
            >
              <h2
                className="mb-4 pb-4 text-center"
                id="m-head"
                style={{
                  marginBottom: "30px",
                  fontFamily: "montserrat, arial, verdana",
                  fontWeight: "bold",
                }}
              >
                Choose Your Modules..!
              </h2>
            </div>
            {/* <!-- Checkbox to select/deselect all --> */}
            <div className="row w-100">
              <div className="card-body p-0">
                <div className="form-check p-0" style={{ fontSize: "medium" }}>
                  <input
                    type="checkbox"
                    style={{ height: "20px", width: "20px" }}
                    id="selectAllCheckbox"
                    onChange={(e) => toggleSelectAll(e.target)}
                  />
                  <label for="selectAllCheckbox">
                    Select All{" "}
                    <span className="">(or choose individually)</span>
                  </label>
                </div>
              </div>
            </div>

            <h4
              className="w-100"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              <b>
                <u>ITEM</u>
              </b>
            </h4>
            <div className="row w-100" style={{ fontSize: "15px" }}>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c1"
                  name="c1"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Items
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c2"
                  name="c2"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Price List
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c3"
                  name="c3"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Stock Adjustment{" "}
                </b>
              </div>
              <div className="col-md-3"></div>
            </div>
            <hr />

            <h4
              className="w-100"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                marginBottom: "20px",
                marginTop: "30px",
              }}
            >
              <b>
                <u>CASH & BANK</u>
              </b>
            </h4>
            <div className="row w-100" style={{ fontSize: "15px" }}>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c4"
                  name="c4"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Cash in hand
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c5"
                  name="c5"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Offline Banking
                </b>
              </div>
              {/* <!-- <div className="col-md-3">
                        <input  type="checkbox" style={{marginRight: "10px", marginBottom: "20px", width: "20px", height: "20px"}} id="c6" name="c6" value="1"> 
                        <b  style={{ color: "rgb(84, 84, 84)", fontFamily: "'Times New Roman', Times, serif" }}>Bank Reconciliation</b>
                    </div> --> */}
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c7"
                  name="c7"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  UPI
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c8"
                  name="c8"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Bank Holders
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c9"
                  name="c9"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Cheque
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c10"
                  name="c10"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Loan Account
                </b>
              </div>
            </div>
            <hr />

            <h4
              className="w-100"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                marginBottom: "20px",
                marginTop: "30px",
              }}
            >
              <b>
                <u>SALES</u>
              </b>
            </h4>
            <div className="row w-100" style={{ fontSize: "15px" }}>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c11"
                  name="c11"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Customers
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c12"
                  name="c12"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Invoice
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c13"
                  name="c13"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Estimate
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c14"
                  name="c14"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Sales Order
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c15"
                  name="c15"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Recurring Invoice
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c16"
                  name="c16"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Retainer Invoice
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c17"
                  name="c17"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Credit Note
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c18"
                  name="c18"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Payment_Received
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c19"
                  name="c19"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Delivery Challan
                </b>
              </div>
            </div>
            <hr />

            <h4
              className="w-100"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                marginBottom: "20px",
                marginTop: "30px",
              }}
            >
              <b>
                <u>PURCHASE</u>
              </b>
            </h4>
            <div className="row w-100" style={{ fontSize: "15px" }}>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c20"
                  name="c20"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Vendors
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c21"
                  name="c21"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Bills
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c22"
                  name="c22"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Recurring Bills
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c23"
                  name="c23"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Debit Note
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c24"
                  name="c24"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Purchase Order
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c25"
                  name="c25"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Expenses
                </b>
              </div>
              {/* <!-- <div className="col-md-3">
                        <input  type="checkbox" style={{marginRight: "10px", marginBottom: "20px", width: "20px", height: "20px"}} id="c26" name="c26" value="1"> 
                        <b  style={{ color: "rgb(84, 84, 84)", fontFamily: "'Times New Roman', Times, serif" }}>Recurring Expenses</b>
                    </div> --> */}
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c27"
                  name="c27"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Payment Made
                </b>
              </div>
              {/* <!-- <div className="col-md-3">
                        <input  type="checkbox" style={{marginRight: "10px", marginBottom: "20px", width: "20px", height: "20px"}} id="c28" name="c28" value="1"> 
                        <b  style={{ color: "rgb(84, 84, 84)", fontFamily: "'Times New Roman', Times, serif" }}>EWay Bill</b>
                    </div> --> */}
            </div>
            <hr />

            <h4
              className="w-100"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              <b>
                <u>EWAY BILL</u>
              </b>
            </h4>
            <div className="row w-100" style={{ fontSize: "15px" }}>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c28"
                  name="c28"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  EWay Bill
                </b>
              </div>
            </div>
            <hr />

            <h4
              className="w-100"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              <b>
                <u>ACCOUNTS</u>
              </b>
            </h4>
            <div className="row w-100" style={{ fontSize: "15px" }}>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c29"
                  name="c29"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Chart of Accounts
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c30"
                  name="c30"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Manual Journal
                </b>
              </div>
              {/* <!-- <div className="col-md-3">
                        <input  type="checkbox" style={{marginRight: "10px", marginBottom: "20px", width: "20px", height: "20px"}} id="c36" name="c36" value="1"> 
                        <b  style={{ color: "rgb(84, 84, 84)", fontFamily: "'Times New Roman', Times, serif" }}>Reconcile</b>
                    </div> --> */}
            </div>
            <hr />

            <h4
              className="w-100"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              <b>
                <u>PAYROLL</u>
              </b>
            </h4>
            <div className="row w-100" style={{ fontSize: "15px" }}>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c31"
                  name="c31"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Employees
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c32"
                  name="c32"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Employees Loan
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c33"
                  name="c33"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Holiday
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c34"
                  name="c34"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Attendance
                </b>
              </div>
              <div className="col-md-3">
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    marginBottom: "20px",
                    width: "20px",
                    height: "20px",
                  }}
                  id="c35"
                  name="c35"
                  value="1"
                  onChange={handleInputChange}
                />
                <b
                  style={{
                    color: "rgb(84, 84, 84)",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                >
                  Salary Details
                </b>
              </div>
            </div>
            <hr />

            <center className="w-100">
              <input
                type="submit"
                className="next modules-action-button"
                value="Submit"
                style={{ width: "20%" }}
              />
            </center>

            {/* <!-- <center><input type="submit" className="btn btn-danger p-2 mt-5 mb-3" style="width: 30%;font-weight: bold;border-radius: 10px;"></center> --> */}
          </form>
        </div>
      </div>
    </>
  );
}

export default Modules;
