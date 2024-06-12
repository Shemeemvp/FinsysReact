import React, { useEffect, useState } from "react";
import AdminBase from "./AdminBase";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../functions/config";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AllClientsOverview() {
  const { id } = useParams();
  const user = Cookies.get("User");
  const navigate = useNavigate();

  const [distributorData, setDistributorData] = useState({
    name: "",
    email: "",
    contact: "",
    endDate: "",
    image: "",
    term: "",
    username: "",
    code: "",
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
  const fetchClientData = () => {
    if (user === "Admin") {
      axios
        .get(`${config.base_url}/get_clients_overview_data/${id}/`)
        .then((res) => {
          console.log("RESPONSE==", res);
          if (res.data.status) {
            const distReq = res.data.data;
            const modules = res.data.modules;
            const img = distReq.image;
            var imageUrl = null
            if(distReq.image){
              imageUrl = `${config.base_url}/${distReq.image}`;
            }
            const r = {
              name: distReq.name,
              image: imageUrl,
              email: distReq.email,
              contact: distReq.contact,
              endDate: distReq.endDate,
              term: distReq.term,
              username: distReq.username,
              code: distReq.code,
              id: distReq.id,
            };
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
            setDistributorData(r);
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
    fetchClientData();
  }, []);

  function cancelContract(id) {
    if (user === "Admin") {
      axios
        .delete(`${config.base_url}/Client_Req_Reject/${id}/`)
        .then((res) => {
          console.log("RESPONSE==", res);
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Contract cancelled",
            });
            navigate("/all_clients");
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
      <AdminBase />
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
                {distributorData.image ? (
                  <img
                    className="img-thumbnail"
                    width="20%"
                    src={distributorData.image}
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
                <b>{distributorData.name} </b>
              </h3>
              {/* <!-- <h3 className="h3 text-center"><b>AthulMon Gp</b></h3> --> */}

              <hr />
              <div className="row  pb-2 pt-2 p-5">
                <div className="col-md-6">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b>Company
                    Code{" "}
                  </h5>
                </div>
                <div className="col-md-6">
                  <h4 className="h4">
                    <b>: {distributorData.code}</b>
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
                    <b>: {distributorData.email}</b>
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
                    <b> : {distributorData.username}</b>
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
                    <b>: {distributorData.contact}</b>
                  </h4>
                </div>
              </div>
              <div className="row p-5 pt-3 pb-3">
                <div className="col">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b> Payment Terms{" "}
                  </h5>
                </div>
                <div className="col">
                  <h4 className="h4">
                    {" "}
                    <b>: {distributorData.term}</b>
                  </h4>
                </div>
              </div>
              <div className="row p-5 pt-3 pb-3">
                <div className="col">
                  <h5 className="h5">
                    <b style={{ marginRight: "10px" }}>{"->"} </b> End Date
                  </h5>
                </div>
                <div className="col">
                  <h4 className="h4">
                    {" "}
                    <b> : {distributorData.endDate}</b>
                  </h4>
                </div>
              </div>

              <hr />

              <h3 class="h3 p-5 pb-3 pt-3">
                <b>Modules</b>
              </h3>
              <div class="row p-3" style={{ marginLeft: "20px" }}>
                <div class="col-md-3 p-3">
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

                <div class="col-md-3 p-3">
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

                <div class="col-md-3 p-3">
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

                <div class="col-md-3 p-3">
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
                <div class="col-md-3 p-3 mt-4">
                  <h5>
                    <u>EWAY BILL</u>
                  </h5>
                  {modules && modules.EWay_Bill && (
                    <span>
                      <b>{"->"} </b> EWay Bill <br />
                    </span>
                  )}
                </div>

                <div class="col-md-3 p-3 mt-4">
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

                <div class="col-md-3 p-3 mt-4">
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
              <center>
                <button
                  onClick={() => cancelContract(`${distributorData.id}`)}
                  class="btn btn-danger"
                  style={{ width: "40%" }}
                >
                  Cancel Contract
                </button>
              </center>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllClientsOverview;
