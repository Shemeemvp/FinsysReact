import React, { useEffect, useState } from "react";
import "../styles/Modules.css";
import axios from "axios";
import config from "../../functions/config";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function EditModules() {
  const ID = Cookies.get("Login_id");
  const [modules, setModules] = useState({
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

  const [moduleRequest, setModuleRequest] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setModules({
      ...modules,
      [e.target.name]: e.target.checked ? "1" : null,
    });
  };

  const fetchModules = () =>{
    axios.get(`${config.base_url}/get_modules/${ID}/`).then((res)=>{
      console.log('MODULES==',res)
      if(res.data.status){
        const modules = res.data.modules;
        const m = {
          c1: modules.Items,
          c2: modules.Price_List,
          c3: modules.Stock_Adjustment,
          c4: modules.Cash_in_hand,
          c5: modules.Offline_Banking,
          c6: null,
          c7: modules.UPI,
          c8: modules.Bank_Holders,
          c9: modules.Cheque,
          c10: modules.Loan_Account,
          c11: modules.Customers,
          c12: modules.Invoice,
          c13: modules.Estimate,
          c14: modules.Sales_Order,
          c15: modules.Recurring_Invoice,
          c16: modules.Retainer_Invoice,
          c17: modules.Credit_Note,
          c18: modules.Payment_Received,
          c19: modules.Delivery_Challan,
          c20: modules.Vendors,
          c21: modules.Bills,
          c22: modules.Recurring_Bills,
          c23: modules.Debit_Note,
          c24: modules.Purchase_Order,
          c25: modules.Expenses,
          c26: null,
          c27: modules.Payment_Made,
          c28: modules.EWay_Bill,
          c29: modules.Chart_of_Accounts,
          c30: modules.Manual_Journal,
          c31: modules.Employees,
          c32: modules.Employees_Loan,
          c33: modules.Holiday,
          c34: modules.Attendance,
          c35: modules.Salary_Details,
          c36: null,
        };
        setModules(m);
        setModuleRequest(res.data.module_request);
      }
    }).catch((err)=>{
      console.log('MODULES ERROR==',err)
    })

  }

  useEffect(()=>{
    fetchModules();
  },[])

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

    setModules(updatedFormData);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const data = {
      Login_Id: ID,
      Items: modules.c1,
      Price_List: modules.c2,
      Stock_Adjustment: modules.c3,
      Cash_in_hand: modules.c4,
      Offline_Banking: modules.c5,
      Bank_Reconciliation: modules.c6,
      UPI: modules.c7,
      Bank_Holders: modules.c8,
      Cheque: modules.c9,
      Loan_Account: modules.c10,
      Customers: modules.c11,
      Invoice: modules.c12,
      Estimate: modules.c13,
      Sales_Order: modules.c14,
      Recurring_Invoice: modules.c15,
      Retainer_Invoice: modules.c16,
      Credit_Note: modules.c17,
      Payment_Received: modules.c18,
      Delivery_Challan: modules.c19,
      Vendors: modules.c20,
      Bills: modules.c21,
      Recurring_Bills: modules.c22,
      Debit_Note: modules.c23,
      Purchase_Order: modules.c24,
      Expenses: modules.c25,
      Recurring_Expenses: modules.c26,
      Payment_Made: modules.c27,
      EWay_Bill: modules.c28,
      Chart_of_Accounts: modules.c29,
      Manual_Journal: modules.c30,
      Employees: modules.c31,
      Employees_Loan: modules.c32,
      Holiday: modules.c33,
      Attendance: modules.c34,
      Salary_Details: modules.c35,
      Reconcile: modules.c36,
    };

    axios
      .post(`${config.base_url}/Edit_Modules/`, data)
      .then((res) => {
        console.log("RESPONSE==", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Request Sent.",
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
                  checked={modules.c1 ? true : false}
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
                  checked={modules.c2 ? true : false}
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
                  checked={modules.c3 ? true : false}
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
                  checked={modules.c4 ? true : false}
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
                  checked={modules.c5 ? true : false}
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
                  checked={modules.c7 ? true : false}
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
                  checked={modules.c8 ? true : false}
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
                  checked={modules.c9 ? true : false}
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
                  checked={modules.c10 ? true : false}
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
                  checked={modules.c11 ? true : false}
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
                  checked={modules.c12 ? true : false}
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
                  checked={modules.c13 ? true : false}
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
                  checked={modules.c14 ? true : false}
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
                  checked={modules.c15 ? true : false}
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
                  checked={modules.c16 ? true : false}
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
                  checked={modules.c17 ? true : false}
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
                  checked={modules.c18 ? true : false}
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
                  checked={modules.c19 ? true : false}
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
                  checked={modules.c20 ? true : false}
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
                  checked={modules.c21 ? true : false}
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
                  checked={modules.c22 ? true : false}
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
                  checked={modules.c23 ? true : false}
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
                  checked={modules.c24 ? true : false}
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
                  checked={modules.c25 ? true : false}
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
                  checked={modules.c27 ? true : false}
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
                  checked={modules.c28 ? true : false}
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
                  checked={modules.c29 ? true : false}
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
                  checked={modules.c30 ? true : false}
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
                  checked={modules.c31 ? true : false}
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
                  checked={modules.c32 ? true : false}
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
                  checked={modules.c33 ? true : false}
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
                  checked={modules.c34 ? true : false}
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
                  checked={modules.c35 ? true : false}
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
            
            {moduleRequest?(
              <>
                <center className="w-100"><input type="submit" disabled class="next modules-action-button" value="Submit" style={{width: "20%"}} /></center>
                <p class="text-center text-danger">You have a pending request, please wait for approval.</p>
              </>

            ):(
              <center className="w-100"><input type="submit" class="next modules-action-button" value="Submit" style={{width: "20%"}} /></center>
            )}

            {/* <center className="w-100">
              <input
                type="submit"
                className="next modules-action-button"
                value="Submit"
                style={{ width: "20%" }}
              />
            </center> */}

            {/* <!-- <center><input type="submit" className="btn btn-danger p-2 mt-5 mb-3" style="width: 30%;font-weight: bold;border-radius: 10px;"></center> --> */}
          </form>
        </div>
      </div>
    </>
  );
}

export default EditModules;
