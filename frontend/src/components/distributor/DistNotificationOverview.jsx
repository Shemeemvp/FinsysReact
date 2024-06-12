import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../functions/config";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DistributorBase from "./DistributorBase";

function DistNotificationOverview() {
  const { id } = useParams();
  const user = Cookies.get("User");
  const navigate = useNavigate();

  const [notificationData, setNotificationData] = useState({
    user: "",
    name: "",
    email: "",
    contact: "",
    endDate: "",
    image: "",
    term: "",
    username: "",
    code: "",
    termUpdation: "",
    moduleUpdation: "",
    newTerm: "",
    id: "",
  });
  const [modules, setModules] = useState({
    Items: false,
    Price_List: false,
    Stock_Adjustment: false,
    Cash_in_hand: false,
    Offline_Banking: false,
    UPI: false,
    Bank_Holders: false,
    Cheque: false,
    Loan_Account: false,
    Customers: false,
    Invoice: false,
    Estimate: false,
    Sales_Order: false,
    Recurring_Invoice: false,
    Retainer_Invoice: false,
    Credit_Note: false,
    Payment_Received: false,
    Delivery_Challan: false,
    Vendors: false,
    Bills: false,
    Recurring_Bills: false,
    Debit_Note: false,
    Purchase_Order: false,
    Expenses: false,
    Payment_Made: false,
    EWay_Bill: false,
    Chart_of_Accounts: false,
    Manual_Journal: false,
    Employees: false,
    Employees_Loan: false,
    Holiday: false,
    Attendance: false,
    Salary_Details: false,
  });

  const [addedModules, setAddedModules] = useState([]);
  const [deductedModules, setDeductedModules] = useState([]);

  const fetchNotificationData = () => {
    if (user === "Distributor") {
      axios
        .get(`${config.base_url}/distributor_notification_overview/${id}/`)
        .then((res) => {
          console.log("RESPONSE==", res);
          if (res.data.status) {
            const notiData = res.data.data;
            const modules = res.data.modules;
            var imageUrl = null;
            if(notiData.image){
                imageUrl = `${config.base_url}/${notiData.image}`;
            }
            const r = {
              user: notiData.user,
              name: notiData.name,
              image: imageUrl,
              email: notiData.email,
              contact: notiData.contact,
              endDate: notiData.endDate,
              term: notiData.term,
              newTerm: notiData.newTerm,
              termUpdation: notiData.termUpdation,
              moduleUpdation: notiData.moduleUpdation,
              username: notiData.username,
              code: notiData.code,
              id: notiData.id,
            };
            if(notiData.moduleUpdation){
              const am = res.data.added_modules;
              const dm = res.data.deducted_modules;
              const m = {
                Items: modules.Items,
                Price_List: modules.Price_List,
                Stock_Adjustment: modules.Stock_Adjustment,
                Cash_in_hand: modules.Cash_in_hand,
                Offline_Banking: modules.Offline_Banking,
                UPI: modules.UPI,
                Bank_Holders: modules.Bank_Holders,
                Cheque: modules.Cheque,
                Loan_Account: modules.Loan_Account,
                Customers: modules.Customers,
                Invoice: modules.Invoice,
                Estimate: modules.Estimate,
                Sales_Order: modules.Sales_Order,
                Recurring_Invoice: modules.Recurring_Invoice,
                Retainer_Invoice: modules.Retainer_Invoice,
                Credit_Note: modules.Credit_Note,
                Payment_Received: modules.Payment_Received,
                Delivery_Challan: modules.Delivery_Challan,
                Vendors: modules.Vendors,
                Bills: modules.Bills,
                Recurring_Bills: modules.Recurring_Bills,
                Debit_Note: modules.Debit_Note,
                Purchase_Order: modules.Purchase_Order,
                Expenses: modules.Expenses,
                Payment_Made: modules.Payment_Made,
                EWay_Bill: modules.EWay_Bill,
                Chart_of_Accounts: modules.Chart_of_Accounts,
                Manual_Journal: modules.Manual_Journal,
                Employees: modules.Employees,
                Employees_Loan: modules.Employees_Loan,
                Holiday: modules.Holiday,
                Attendance: modules.Attendance,
                Salary_Details: modules.Salary_Details,
              };
              setModules(m);
              setAddedModules(am);
              setDeductedModules(dm);
            }
            setNotificationData(r);
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
  };

  useEffect(() => {
    fetchNotificationData();
  }, []);

  function handleModuleUpdateAccept(id) {
    let dt = {
      id: id,
    };
    axios
      .post(`${config.base_url}/accept_dmodule_updation_request/`, dt)
      .then((res) => {
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Request Accepted.",
          });
          navigate("/distributor_notifications");
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

  function handleModuleUpdateReject(id) {
    let dt = {
      id: id,
    };
    axios
      .delete(`${config.base_url}/reject_dmodule_updation_request/`, dt)
      .then((res) => {
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Request Rejected.",
          });
          navigate("/distributor_notifications");
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
      <DistributorBase />
      <div
        className="body-wrapper"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="container-fluid">
          <div className="card radius-15">
            <div className="card-body">
              <div className="card-title">
                <h2 className="card-title mb-9 fw-semibold text-center">
                  <b>COMPANY DETAILS</b>
                </h2>
                <hr />
              </div>
              <center>
                {notificationData.image ? (
                  <img
                    className="img-thumbnail"
                    width="20%"
                    src={notificationData.image}
                    alt=""
                  />
                ) : (
                  <img
                    src={`${process.env.PUBLIC_URL}/static/assets/images/user-1.jpg`}
                    width="20%"
                    className="img-thumbnail"
                  />
                )}
              </center>
              <h3 className="h3 text-center">
                <b>{notificationData.name} </b>
              </h3>
              {/* <!-- <h3 className="h3 text-center"><b>AthulMon Gp</b></h3> --> */}

              <hr />
              <div className="row  pb-2 pt-2 p-5">
                <div className="col-md-6">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b> Company Code
                  </h5>
                </div>
                <div className="col-md-6">
                  <h4 className="h4">
                    <b>: {notificationData.code}</b>
                  </h4>
                </div>
              </div>

              <div className="row  pb-2 pt-2 p-5">
                <div className="col">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b> Email{" "}
                  </h5>
                </div>
                <div className="col">
                  <h4 className="h4">
                    <b>: {notificationData.email}</b>
                  </h4>
                </div>
              </div>
              <div className="row p-5 pt-3 pb-3">
                <div className="col">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b> User Name
                  </h5>
                </div>
                <div className="col">
                  <h4 className="h4">
                    <b> : {notificationData.username}</b>
                  </h4>
                </div>
              </div>
              <div className="row p-5 pt-3 pb-3">
                <div className="col">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b> Contact{" "}
                  </h5>
                </div>
                <div className="col">
                  <h4 className="h4">
                    {" "}
                    <b>: {notificationData.contact}</b>
                  </h4>
                </div>
              </div>
              <div className="row p-5 pt-3 pb-3">
                <div className="col">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b> Payment Terms{" "}
                    {"(Current)"}
                  </h5>
                </div>
                <div className="col">
                  <h4 className="h4">
                    {" "}
                    <b>: {notificationData.term}</b>
                  </h4>
                </div>
              </div>
              {notificationData.termUpdation ? (
                <div className="row p-5 pt-3 pb-3">
                  <div className="col">
                    <h5 className="h5">
                      <b style={{ marginRight: "10px" }}>{"->"} </b> Payment
                      Terms (New)
                    </h5>
                  </div>
                  <div className="col">
                    <h4 className="h4 text-success">
                      {" "}
                      <b>: {notificationData.newTerm}</b>
                    </h4>
                  </div>
                </div>
              ) : null}
              <div className="row p-5 pt-3 pb-3">
                <div className="col">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b> End Date{" "}
                    {"(Current)"}
                  </h5>
                </div>
                <div className="col">
                  <h4 className="h4">
                    {" "}
                    <b> : {notificationData.endDate}</b>
                  </h4>
                </div>
              </div>

              <hr />

              {notificationData.moduleUpdation ? (
                <>
                  <h3 className="h3 p-5 pb-3 pt-3">
                    <b>Old Modules</b>
                  </h3>
                  <div className="row p-3" style={{ marginLeft: "20px" }}>
                    <div className="col-md-3 p-3">
                      <h5>
                        <u>ITEMS</u>
                      </h5>
                      {modules && modules.Items && (
                        <span>
                          <b>{"->"} </b> Items <br />
                        </span>
                      )}
                      {modules && modules.Price_List && (
                        <span>
                          <b>{"->"} </b> Price List <br />
                        </span>
                      )}
                      {modules && modules.Stock_Adjustment && (
                        <span>
                          <b>{"->"} </b> Stock Adjustment <br />
                        </span>
                      )}
                    </div>

                    <div className="col-md-3 p-3">
                      <h5>
                        <u>CASH & BANK</u>
                      </h5>
                      {modules && modules.Cash_in_hand && (
                        <span>
                          <b>{"->"} </b> Cash in hand <br />
                        </span>
                      )}
                      {modules && modules.Offline_Banking && (
                        <span>
                          <b>{"->"} </b> Offline Banking <br />
                        </span>
                      )}
                      {modules && modules.UPI && (
                        <span>
                          <b>{"->"} </b> UPI <br />
                        </span>
                      )}
                      {modules && modules.Bank_Holders && (
                        <span>
                          <b>{"->"} </b> Bank Holders <br />
                        </span>
                      )}
                      {modules && modules.Cheque && (
                        <span>
                          <b>{"->"} </b> Cheque <br />
                        </span>
                      )}
                      {modules && modules.Loan_Account && (
                        <span>
                          <b>{"->"} </b> Loan Account <br />
                        </span>
                      )}
                    </div>

                    <div className="col-md-3 p-3">
                      <h5>
                        <u>SALES</u>
                      </h5>
                      {modules && modules.Customers && (
                        <span>
                          <b>{"->"} </b> Customers <br />
                        </span>
                      )}
                      {modules && modules.Invoice && (
                        <span>
                          <b>{"->"} </b> Invoice <br />
                        </span>
                      )}
                      {modules && modules.Estimate && (
                        <span>
                          <b>{"->"} </b> Estimate <br />
                        </span>
                      )}
                      {modules && modules.Sales_Order && (
                        <span>
                          <b>{"->"} </b> Sales Order <br />
                        </span>
                      )}
                      {modules && modules.Recurring_Invoice && (
                        <span>
                          <b>{"->"} </b> Recurring Invoice <br />
                        </span>
                      )}
                      {modules && modules.Retainer_Invoice && (
                        <span>
                          <b>{"->"} </b> Retainer Invoice <br />
                        </span>
                      )}
                      {modules && modules.Payment_Received && (
                        <span>
                          <b>{"->"} </b> Payment Received <br />
                        </span>
                      )}
                      {modules && modules.Delivery_Challan && (
                        <span>
                          <b>{"->"} </b> Delivery Challan <br />
                        </span>
                      )}
                    </div>

                    <div className="col-md-3 p-3">
                      <h5>
                        <u>PURCHASE</u>
                      </h5>
                      {modules && modules.Vendors && (
                        <span>
                          <b>{"->"} </b> Vendors <br />
                        </span>
                      )}
                      {modules && modules.Bills && (
                        <span>
                          <b>{"->"} </b> Bills <br />
                        </span>
                      )}
                      {modules && modules.Recurring_Bills && (
                        <span>
                          <b>{"->"} </b> Recurring Bills <br />
                        </span>
                      )}
                      {modules && modules.Debit_Note && (
                        <span>
                          <b>{"->"} </b> Debit Note <br />
                        </span>
                      )}
                      {modules && modules.Purchase_Order && (
                        <span>
                          <b>{"->"} </b> Purchase Order <br />
                        </span>
                      )}
                      {modules && modules.Expenses && (
                        <span>
                          <b>{"->"} </b> Expense <br />
                        </span>
                      )}
                      {modules && modules.Payment_Made && (
                        <span>
                          <b>{"->"} </b> Payment Made <br />
                        </span>
                      )}
                    </div>
                    <div className="col-md-3 p-3 mt-4">
                      <h5>
                        <u>EWAY BILL</u>
                      </h5>
                      {modules && modules.EWay_Bill && (
                        <span>
                          <b>{"->"} </b> EWay Bill <br />
                        </span>
                      )}
                    </div>

                    <div className="col-md-3 p-3 mt-4">
                      <h5>
                        <u>ACCOUNTS</u>
                      </h5>
                      {modules && modules.Chart_of_Accounts && (
                        <span>
                          <b>{"->"} </b> Chart of Accounts <br />
                        </span>
                      )}
                      {modules && modules.Manual_Journal && (
                        <span>
                          <b>{"->"} </b> Manual Journal <br />
                        </span>
                      )}
                    </div>

                    <div className="col-md-3 p-3 mt-4">
                      <h5>
                        <u>PAYROLL</u>
                      </h5>
                      {modules && modules.Employees && (
                        <span>
                          <b>{"->"} </b> Employees <br />
                        </span>
                      )}
                      {modules && modules.Employees_Loan && (
                        <span>
                          <b>{"->"} </b> Employees Loan <br />
                        </span>
                      )}
                      {modules && modules.Holiday && (
                        <span>
                          <b>{"->"} </b> Holiday <br />
                        </span>
                      )}
                      {modules && modules.Attendance && (
                        <span>
                          <b>{"->"} </b> Attendance <br />
                        </span>
                      )}
                      {modules && modules.Salary_Details && (
                        <span>
                          <b>{"->"} </b> Salary Details <br />
                        </span>
                      )}
                    </div>
                  </div>
                  <hr />
                  {/* <!-- module update details with added and removed ones --> */}
                  <h3 className="h3 p-5 pb-3 pt-3 text-center">
                    <b>
                      <u>New Modules</u>
                    </b>
                  </h3>
                  <div className="row mt-3 mb-3">
                    <div className="col-md-6">
                      <h5 className="p-5 pb-3 pt-3 text-light">
                        <u>Added Modules</u>
                      </h5>

                      {addedModules ? (
                        <>
                          <div
                            className="row p-3"
                            style={{ marginLeft: "20px" }}
                          >
                            <div className="col">
                              <h5 className="text-light">
                                <u>ITEMS</u>
                              </h5>
                              {Object.keys(addedModules).map((key, index) => (
                                <>
                                  {key === "Items" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Items <br />
                                      </>
                                    )}
                                  {key === "Price_List" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Price List <br />
                                      </>
                                    )}
                                  {key === "Stock_Adjustment" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Stock Adjustment <br />
                                      </>
                                    )}
                                </>
                              ))}
                            </div>
                            <div className="col">
                              <h5 className="text-light">
                                <u>CASH & BANK</u>
                              </h5>
                              {Object.keys(addedModules).map((key, index) => (
                                <>
                                  {key === "Cash_in_hand" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Cash In Hand <br />
                                      </>
                                    )}
                                  {key === "Offline_Banking" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Offline Banking <br />
                                      </>
                                    )}
                                  {key === "UPI" && addedModules[key] === 1 && (
                                    <>
                                      <i className="fa fa-check-circle fa-sm text-light"></i>
                                      &nbsp; UPI <br />
                                    </>
                                  )}
                                  {key === "Bank_Holders" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Bank Holders <br />
                                      </>
                                    )}
                                  {key === "Cheque" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Cheques <br />
                                      </>
                                    )}
                                  {key === "Loan_Account" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Loan Accounts <br />
                                      </>
                                    )}
                                </>
                              ))}
                            </div>
                          </div>
                          <div
                            className="row p-3"
                            style={{ marginLeft: "20px" }}
                          >
                            <div className="col">
                              <h5 className="text-light">
                                <u>SALES</u>
                              </h5>
                              {Object.keys(addedModules).map((key, index) => (
                                <>
                                  {key === "Customers" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Customers <br />
                                      </>
                                    )}
                                  {key === "Invoice" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Invoice <br />
                                      </>
                                    )}
                                  {key === "Estimate" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Estimate <br />
                                      </>
                                    )}
                                  {key === "Sales_Order" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Sale Order <br />
                                      </>
                                    )}
                                  {key === "Recurring_Invoice" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Recurring Invoice <br />
                                      </>
                                    )}
                                  {key === "Retainer_Invoice" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Retainer Invoice <br />
                                      </>
                                    )}
                                  {key === "Credit_Note" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Credit Note <br />
                                      </>
                                    )}
                                  {key === "Payment_Received" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Payment Received <br />
                                      </>
                                    )}
                                  {key === "Delivery_Challan" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Delivery Challan <br />
                                      </>
                                    )}
                                </>
                              ))}
                            </div>
                            <div className="col">
                              <h5 className="text-light">
                                <u>PURCHASE</u>
                              </h5>
                              {Object.keys(addedModules).map((key, index) => (
                                <>
                                  {key === "Vendors" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Vendors
                                        <br />
                                      </>
                                    )}
                                  {key === "Bills" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Bills <br />
                                      </>
                                    )}
                                  {key === "Recurring_Bills" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Recurring Bills
                                        <br />
                                      </>
                                    )}
                                  {key === "Debit_Note" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Debit Note
                                        <br />
                                      </>
                                    )}
                                  {key === "Purchase_Order" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Purchase Order <br />
                                      </>
                                    )}
                                  {key === "Expenses" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Expenses <br />
                                      </>
                                    )}
                                  {key === "Recurring_Expenses" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Recurring Expenses <br />
                                      </>
                                    )}
                                  {key === "Payment_Made" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Payment Made <br />
                                      </>
                                    )}
                                </>
                              ))}
                            </div>
                          </div>
                          <div
                            className="row p-3"
                            style={{ marginLeft: "20px" }}
                          >
                            <div className="col">
                              <h5 className="text-light">
                                <u>PAYROLL</u>
                              </h5>
                              {Object.keys(addedModules).map((key, index) => (
                                <>
                                  {key === "Employees" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Employees <br />
                                      </>
                                    )}
                                  {key === "Employees_Loan" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Employees Loan
                                        <br />
                                      </>
                                    )}
                                  {key === "Holiday" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Holiday <br />
                                      </>
                                    )}
                                  {key === "Attendance" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Attendance <br />
                                      </>
                                    )}
                                  {key === "Salary_Details" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Salary Details <br />
                                      </>
                                    )}
                                </>
                              ))}
                            </div>
                            <div className="col">
                              <h5 className="text-light">
                                <u>ACCOUNTS</u>
                              </h5>
                              {Object.keys(addedModules).map((key, index) => (
                                <>
                                  {key === "Chart_of_Accounts" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Chart of Accounts <br />
                                      </>
                                    )}
                                  {key === "Manual_Journal" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; Manual Journal <br />
                                      </>
                                    )}
                                </>
                              ))}
                            </div>
                          </div>
                          <div
                            className="row p-3"
                            style={{ marginLeft: "20px" }}
                          >
                            <div className="col">
                              <h5 className="text-light">
                                <u>EWAY BILL</u>
                              </h5>
                              {Object.keys(addedModules).map((key, index) => (
                                <>
                                  {key === "EWay_Bill" &&
                                    addedModules[key] === 1 && (
                                      <>
                                        <i className="fa fa-check-circle fa-sm text-light"></i>
                                        &nbsp; E-Way Bill <br />
                                      </>
                                    )}
                                </>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="row p-3" style={{ marginLeft: "20px" }}>
                          <div className="col">
                            <h6 className="text-white-50">No Modules Added</h6>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <h5 className="p-5 pb-3 pt-3 text-light">
                        <u>Removed Modules</u>{" "}
                      </h5>
                      {deductedModules ? (
                        <>
                          <div
                            className="row p-3"
                            style={{ marginLeft: "20px" }}
                          >
                            <div className="col">
                              <h5 className="text-light">
                                <u>ITEMS</u>
                              </h5>
                              {Object.keys(deductedModules).map(
                                (key, index) => (
                                  <>
                                    {key === "Items" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Items <br />
                                        </>
                                      )}
                                    {key === "Price_List" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Price List <br />
                                        </>
                                      )}
                                    {key === "Stock_Adjustment" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Stock Adjustment <br />
                                        </>
                                      )}
                                  </>
                                )
                              )}
                            </div>
                            <div className="col">
                              <h5 className="text-light">
                                <u>CASH & BANK</u>
                              </h5>
                              {Object.keys(deductedModules).map(
                                (key, index) => (
                                  <>
                                    {key === "Cash_in_hand" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Cash In Hand <br />
                                        </>
                                      )}
                                    {key === "Offline_Banking" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Offline Banking <br />
                                        </>
                                      )}
                                    {key === "UPI" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; UPI <br />
                                        </>
                                      )}
                                    {key === "Bank_Holders" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Bank Holders <br />
                                        </>
                                      )}
                                    {key === "Cheque" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Cheques <br />
                                        </>
                                      )}
                                    {key === "Loan_Account" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Loan Accounts <br />
                                        </>
                                      )}
                                  </>
                                )
                              )}
                            </div>
                          </div>
                          <div
                            className="row p-3"
                            style={{ marginLeft: "20px" }}
                          >
                            <div className="col">
                              <h5 className="text-light">
                                <u>SALES</u>
                              </h5>
                              {Object.keys(deductedModules).map(
                                (key, index) => (
                                  <>
                                    {key === "Customers" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Customers <br />
                                        </>
                                      )}
                                    {key === "Invoice" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Invoice <br />
                                        </>
                                      )}
                                    {key === "Estimate" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Estimate <br />
                                        </>
                                      )}
                                    {key === "Sales_Order" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Sale Order <br />
                                        </>
                                      )}
                                    {key === "Recurring_Invoice" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Recurring Invoice <br />
                                        </>
                                      )}
                                    {key === "Retainer_Invoice" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Retainer Invoice <br />
                                        </>
                                      )}
                                    {key === "Credit_Note" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Credit Note <br />
                                        </>
                                      )}
                                    {key === "Payment_Received" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Payment Received <br />
                                        </>
                                      )}
                                    {key === "Delivery_Challan" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Delivery Challan <br />
                                        </>
                                      )}
                                  </>
                                )
                              )}
                            </div>
                            <div className="col">
                              <h5 className="text-light">
                                <u>PURCHASE</u>
                              </h5>
                              {Object.keys(deductedModules).map(
                                (key, index) => (
                                  <>
                                    {key === "Vendors" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Vendors
                                          <br />
                                        </>
                                      )}
                                    {key === "Bills" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Bills <br />
                                        </>
                                      )}
                                    {key === "Recurring_Bills" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Recurring Bills
                                          <br />
                                        </>
                                      )}
                                    {key === "Debit_Note" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Debit Note
                                          <br />
                                        </>
                                      )}
                                    {key === "Purchase_Order" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Purchase Order <br />
                                        </>
                                      )}
                                    {key === "Expenses" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Expenses <br />
                                        </>
                                      )}
                                    {key === "Recurring_Expenses" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Recurring Expenses <br />
                                        </>
                                      )}
                                    {key === "Payment_Made" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Payment Made <br />
                                        </>
                                      )}
                                  </>
                                )
                              )}
                            </div>
                          </div>
                          <div
                            className="row p-3"
                            style={{ marginLeft: "20px" }}
                          >
                            <div className="col">
                              <h5 className="text-light">
                                <u>PAYROLL</u>
                              </h5>
                              {Object.keys(deductedModules).map(
                                (key, index) => (
                                  <>
                                    {key === "Employees" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Employees <br />
                                        </>
                                      )}
                                    {key === "Employees_Loan" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Employees Loan
                                          <br />
                                        </>
                                      )}
                                    {key === "Holiday" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Holiday <br />
                                        </>
                                      )}
                                    {key === "Attendance" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Attendance <br />
                                        </>
                                      )}
                                    {key === "Salary_Details" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Salary Details <br />
                                        </>
                                      )}
                                  </>
                                )
                              )}
                            </div>
                            <div className="col">
                              <h5 className="text-light">
                                <u>ACCOUNTS</u>
                              </h5>
                              {Object.keys(deductedModules).map(
                                (key, index) => (
                                  <>
                                    {key === "Chart_of_Accounts" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Chart of Accounts <br />
                                        </>
                                      )}
                                    {key === "Manual_Journal" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; Manual Journal <br />
                                        </>
                                      )}
                                  </>
                                )
                              )}
                            </div>
                          </div>
                          <div
                            className="row p-3"
                            style={{ marginLeft: "20px" }}
                          >
                            <div className="col">
                              <h5 className="text-light">
                                <u>EWAY BILL</u>
                              </h5>
                              {Object.keys(deductedModules).map(
                                (key, index) => (
                                  <>
                                    {key === "EWay_Bill" &&
                                      deductedModules[key] === 1 && (
                                        <>
                                          <i className="fa fa-times-circle fa-sm text-light"></i>
                                          &nbsp; E-Way Bill <br />
                                        </>
                                      )}
                                  </>
                                )
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="row p-3" style={{ marginLeft: "20px" }}>
                          <div className="col">
                            <h6 className="text-white-50">
                              No Modules Removed
                            </h6>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <hr />
                </>
              ) : null}

              <div className="row pb-5 mt-5">
                <div className="col-md-3"></div>
                <div className="col-md-3">
                    {notificationData.moduleUpdation ? (
                      <button
                        onClick={() =>
                          handleModuleUpdateAccept(`${notificationData.id}`)
                        }
                        className="btn btn-success"
                        style={{ width: "100%" }}
                      >
                        ACCEPT
                      </button>
                    ) : (
                      <a
                        href="{% url 'Fin_payment_terms_Updation_Accept' data.id %}"
                        className="btn btn-success"
                        style={{ width: "100%" }}
                      >
                        ACCEPT
                      </a>
                    )}
                  </div>
                  <div className="col-md-3">
                    {notificationData.moduleUpdation ? (
                      <button
                        onClick={() =>
                          handleModuleUpdateReject(`${notificationData.id}`)
                        }
                        className="btn btn-danger"
                        style={{ width: "100%" }}
                      >
                        REJECT
                      </button>
                    ) : (
                      <a
                        href="{% url 'Fin_payment_terms_Updation_Reject' data.id %}"
                        className="btn btn-danger"
                        style={{ width: "100%" }}
                      >
                        REJECT
                      </a>
                    )}
                  </div>
                <div className="col-md-3"></div>
              </div>

              {/* <center>
                <button
                  onClick={() => cancelContract(`${notificationData.id}`)}
                  className="btn btn-danger"
                  style={{ width: "40%" }}
                >
                  Cancel Contract
                </button>
              </center> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DistNotificationOverview;
