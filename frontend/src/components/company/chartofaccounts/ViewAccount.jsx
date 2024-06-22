import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import "../../styles/Items.css";

function ViewAccount() {
  const ID = Cookies.get("Login_id");
  const { accountId } = useParams();
  const [accountDetails, setAccountDetails] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [history, setHistory] = useState({
    action: "",
    date: "",
    doneBy: "",
  });

  const fetchAccountDetails = () => {
    axios
      .get(`${config.base_url}/fetch_account_details/${accountId}/`)
      .then((res) => {
        console.log("ITEM DATA=", res);
        if (res.data.status) {
          var acc = res.data.account;
          var hist = res.data.history;
          setAccountDetails(acc);
          if (hist) {
            setHistory(hist);
          }
          setDesc(acc.account_type);
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

  useEffect(() => {
    fetchAccountDetails();
  }, []);

  const currentUrl = window.location.href;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    currentUrl
  )}`;

  const navigate = useNavigate();

  const changeStatus = (status) => {
    var st = {
      id: accountId,
      status: status,
    };
    axios
      .post(`${config.base_url}/change_account_status/`, st)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Status Updated",
          });
          fetchAccountDetails();
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

  function handleDeleteAccount(id) {
    Swal.fire({
      title: `Delete Account - ${accountDetails.account_name}?`,
      text: "All transactions will be deleted.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_account/${id}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Account Deleted successfully",
            });
            navigate("/chart_of_accounts");
          })
          .catch((err) => {
            console.log(err);
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

  function overview() {
    document.getElementById("overview").style.display = "block";
    document.getElementById("transaction").style.display = "none";
    document.getElementById("printBtn").style.display = "none";
    document.getElementById("pdfBtn").style.display = "none";
    document.getElementById("shareBtn").style.display = "none";
    document.getElementById("editBtn").style.display = "block";
    document.getElementById("deleteBtn").style.display = "block";
    if(accountDetails.create_status == 'added'){
      document.getElementById("historyBtn").style.display = "block";
    }
    document.getElementById("exportBtn").style.display = "none";
    document.getElementById("statusBtn").style.display = "block";
    document.getElementById("overviewBtn").style.backgroundColor =
      "rgba(22,37,50,255)";
    document.getElementById("transactionBtn").style.backgroundColor =
      "transparent";
  }

  function transaction() {
    document.getElementById("overview").style.display = "none";
    document.getElementById("transaction").style.display = "block";
    document.getElementById("printBtn").style.display = "block";
    document.getElementById("pdfBtn").style.display = "block";
    document.getElementById("shareBtn").style.display = "block";
    document.getElementById("editBtn").style.display = "none";
    document.getElementById("deleteBtn").style.display = "none";
    if(accountDetails.create_status == 'added'){
      document.getElementById("historyBtn").style.display = "none";
    }
    document.getElementById("exportBtn").style.display = "block";
    document.getElementById("statusBtn").style.display = "none";
    document.getElementById("overviewBtn").style.backgroundColor =
      "transparent";
    document.getElementById("transactionBtn").style.backgroundColor =
      "rgba(22,37,50,255)";
  }

  function ExportToExcel(type, fn, dl) {
    var elt = document.getElementById("transactionTable");
    var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
    return dl
      ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
      : XLSX.writeFile(
          wb,
          fn ||
            `${accountDetails.account_name}_transactions.` + (type || "xlsx")
        );
  }

  function printSection(sectionId) {
    document.body.style.backgroundColor = "white";
    document.querySelector(".page-content").style.backgroundColor = "white";
    var transactionElements = document.querySelectorAll(
      "#transaction, #transaction *"
    );
    transactionElements.forEach(function (element) {
      element.style.color = "black";
    });

    var printContents = document.getElementById(sectionId).innerHTML;

    var printerDiv = document.createElement("div");
    printerDiv.className = "printContainer";
    printerDiv.innerHTML = printContents;

    document.body.appendChild(printerDiv);
    document.body.classList.add("printingContent");

    window.print();

    document.body.removeChild(printerDiv);
    document.body.classList.remove("printingContent");

    transactionElements.forEach(function (element) {
      element.style.color = "white";
    });
    document.querySelector(".page-content").style.backgroundColor = "#2f516f";
  }

  function printSheet() {
    var divToPrint = document.getElementById("printContent");
    var printWindow = window.open("", "", "height=700,width=1000");

    printWindow.document.write("<html><head><title></title>");
    printWindow.document.write(`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Agbalumo&family=Black+Ops+One&family=Gluten:wght@100..900&family=Playball&display=swap" rel="stylesheet">
    `);
    printWindow.document.write("</head>");
    printWindow.document.write("<body>");
    printWindow.document.write(divToPrint.outerHTML);
    printWindow.document.write("</body>");
    printWindow.document.write("</html>");
    printWindow.document.close();
    printWindow.print();
    printWindow.addEventListener("afterprint", function () {
      printWindow.close();
    });
  }

  function accTransactionPdf() {
    var acData = {
      Id: ID,
      ac_id: accountId,
    };
    axios
      .get(`${config.base_url}/account_transaction_pdf/`, {
        responseType: "blob",
        params: acData,
      })
      .then((res) => {
        console.log("PDF RES=", res);

        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = `Account_Transactions_${accountDetails.account_name}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((err) => {
        console.log("ERROR=", err);
        if (err.response && err.response.data && !err.response.data.status) {
          Swal.fire({
            icon: "error",
            title: `${err.response.data.message}`,
          });
        }
      });
  }

  const [emailIds, setEmailIds] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  function handleShareEmail(e) {
    e.preventDefault();

    var emailsString = emailIds.trim();

    var emails = emailsString.split(",").map(function (email) {
      return email.trim();
    });

    var emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    var invalidEmails = [];
    if (emailsString === "") {
      alert("Enter valid email addresses.");
    } else {
      for (var i = 0; i < emails.length; i++) {
        var currentEmail = emails[i];

        if (currentEmail !== "" && !emailRegex.test(currentEmail)) {
          invalidEmails.push(currentEmail);
        }
      }

      if (invalidEmails.length > 0) {
        alert("Invalid emails. Please check!\n" + invalidEmails.join(", "));
      } else {
        // document.getElementById("share_to_email_form").submit();
        var em = {
          ac_id: accountId,
          Id: ID,
          email_ids: emailIds,
          email_message: emailMessage,
        };
        axios
          .post(`${config.base_url}/share_account_transactions_email/`, em)
          .then((res) => {
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Shared via mail.",
              });
              setEmailIds("");
              setEmailMessage("");
            }
          })
          .catch((err) => {
            console.log("ERROR=", err);
            if (
              err.response &&
              err.response.data &&
              !err.response.data.status
            ) {
              Swal.fire({
                icon: "error",
                title: `${err.response.data.message}`,
              });
            }
          });
      }
    }
  }

  function setDesc(type) {
    var Acnt_desc = document.getElementById("acnt-desc");

    switch (type) {
      case "Accounts Payable":
        Acnt_desc.innerHTML = `<b>Accounts Payable</b>`;
        break;
      case "Accounts Receivable":
        Acnt_desc.innerHTML = `<b>Accounts Receivable</b>`;
        break;
      case "Other Asset":
        Acnt_desc.innerHTML = `<b>Asset</b> <br> Track special assets like goodwill and other intangible assets<br/>`;
        break;
      case "Other Current Asset":
        Acnt_desc.innerHTML = `
                <b>Asset</b> <br> Any short term asset that can be converted into cash or cash equivalents easily<br/>
                <ul>
                    <li>1.Prepaid expenses</li>
                    <li>2.Stocks and Mutual Funds</li>
                </ul>`;
        break;
      case "Cash":
        Acnt_desc.innerHTML = `<b>Asset</b> <br> To keep track of cash and other cash equivalents like petty cash, undeposited funds, etc.<br/>`;
        break;
      case "Bank":
        Acnt_desc.innerHTML = `<b>Asset</b> <br> To keep track of bank accounts like Savings, Checking, and Money Market accounts<br/>`;
        break;
      case "Fixed Asset":
        Acnt_desc.innerHTML = `
                <b>Asset</b> <br> Any long term investment or an asset that cannot be converted into cash easily like:<br/>
                <ul>
                    <li>1.Land and Buildings</li>
                    <li>2.Plant, Machinery and Equipment</li>
                    <li>3.Computers</li>
                    <li>3.Furniture</li>
                </ul>`;
        break;
      case "Stock":
        Acnt_desc.innerHTML = `<b>Asset</b> <br> To keep track of your inventory assets.<br/>`;
        break;
      case "Payment Clearing":
        Acnt_desc.innerHTML = `<b>Asset</b> <br> To keep track of funds moving in and out via payment processors like Stripe, PayPal, etc.<br/>`;
        break;
      case "Other Current Liability":
        Acnt_desc.innerHTML = `
                <b>Liability</b> <br> Any short term liability like:<br/>
                <ul>
                    <li>1.Customer Deposits</li>
                    <li>2.Tax Payable</li>
                </ul>`;
        break;
      case "Credit Card":
        Acnt_desc.innerHTML = `<b>Liability</b> <br>Create a trail of all your credit card transactions by creating a credit card account<br/>`;
        break;
      case "Long Term Liability":
        Acnt_desc.innerHTML = `<b>Liability</b> <br> Liabilities that mature after a minimum period of one year like Notes Payable, Debentures, and Long Term Loans<br/>`;
        break;
      case "Other Liability":
        Acnt_desc.innerHTML = `
                <b>Liability</b> <br>Obligation of an entity arising from past transactions or events which would require repayment.<br/>
                <ul>
                    <li>1.Tax to be paid</li>
                    <li>2.Loan to be Repaid</li>
                    <li>3.Accounts Payable etc</li>
                </ul>`;
        break;
      case "Overseas Tax Payable":
        Acnt_desc.innerHTML = `<b>Liability</b> <br> Track your taxes in this account if your business sells digital services to foreign customers.<br/>`;
        break;
      case "Equity":
        Acnt_desc.innerHTML = `<b>Equity</b> <br>Owners or stakeholders interest on the assets of the business after deducting all the liabilities<br/>`;
        break;
      case "Income":
        Acnt_desc.innerHTML = `<b>Income</b> <br>Income or Revenue earned from normal business activities like sale of goods and services to customers<br/>`;
        break;
      case "Other Income":
        Acnt_desc.innerHTML = `
                <b>Income</b> <br>Income or revenue earned from activties not directly related to your business like :<br/>
                <ul>
                    <li>1.Interest Earned</li>
                    <li>2.Dividend Earned</li>
                </ul>`;
        break;
      case "Expense":
        Acnt_desc.innerHTML = `
                <b>Expense</b> <br>Reflects expenses incurred for running normal business operations, such as :<br/>
                <ul>
                    <li>1.Advertisements and Marketing</li>
                    <li>2.Business Travel Expenses</li>
                    <li>3.License Fees</li>
                    <li>4.Utility Expenses</li>
                </ul>`;
        break;
      case "Cost Of Goods Sold":
        Acnt_desc.innerHTML = `
                <b>Expense</b> <br>This indicates the direct costs attributable to the production of the goods sold by a company such as:<br/>
                <ul>
                    <li>1.Material and Labor costs</li>
                    <li>2.Cost of obtaining raw materials</li>
                </ul>`;
        break;
      case "Other Expense":
        Acnt_desc.innerHTML = `
            <b>Expense</b> <br>Track miscellaneous expenses incurred for activities other than primary business operations or create additional accounts to track default expenses like insurance or contribution towards charity.<br/>`;
        break;

      default:
        Acnt_desc.innerHTML = `<b>Account Type</b> <br>Select an account type..<br/>`;
    }
  }

  return (
    <>
      <FinBase />
      <div
        className="page-content mt-0 pt-0"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <Link
          className="d-flex justify-content-end p-2"
          style={{ cursor: "pointer" }}
          to="/chart_of_accounts"
        >
          <i
            className="fa fa-times-circle text-white"
            style={{ fontSize: "1.2rem" }}
          ></i>
        </Link>
        <div className="card radius-15">
          <div className="card-body" style={{ width: "100%" }}>
            <div className="card-title">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    <a
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderRadius: "1vh",
                        backgroundColor: "rgba(22,37,50,255)",
                      }}
                      onClick={overview}
                      id="overviewBtn"
                    >
                      Overview
                    </a>
                    <a
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderRadius: "1vh",
                      }}
                      onClick={transaction}
                      id="transactionBtn"
                    >
                      Transactions
                    </a>
                  </div>

                  <div className="col-md-6 d-flex justify-content-end">
                    {accountDetails.status == "inactive" ? (
                      <a
                        onClick={() => changeStatus("active")}
                        id="statusBtn"
                        style={{
                          display: "block",
                          height: "fit-content",
                          width: "fit-content",
                        }}
                        className="ml-2 fa fa-ban btn btn-outline-secondary text-grey "
                        role="button"
                      >
                        &nbsp;Inactive
                      </a>
                    ) : (
                      <a
                        onClick={() => changeStatus("inactive")}
                        id="statusBtn"
                        style={{
                          display: "block",
                          height: "fit-content",
                          width: "fit-content",
                        }}
                        className="ml-2 fa fa-check-circle btn btn-outline-secondary text-grey"
                        role="button"
                      >
                        &nbsp;Active
                      </a>
                    )}
                    <a
                      className="ml-2 btn btn-outline-secondary text-grey fa fa-table"
                      role="button"
                      id="exportBtn"
                      style={{
                        display: "none",
                        height: "fit-content",
                        width: "fit-content",
                      }}
                      onClick={() => ExportToExcel("xlsx")}
                    >
                      &nbsp;Export
                    </a>
                    <a
                      onClick={accTransactionPdf}
                      className="ml-2 btn btn-outline-secondary text-grey fa fa-file"
                      role="button"
                      id="pdfBtn"
                      style={{
                        display: "none",
                        height: "fit-content",
                        width: "fit-content",
                      }}
                    >
                      &nbsp;PDF
                    </a>
                    <a
                      className="ml-2 btn btn-outline-secondary text-grey fa fa-print"
                      role="button"
                      id="printBtn"
                      style={{
                        display: "none",
                        height: "fit-content",
                        width: "fit-content",
                      }}
                      onClick={() => printSheet()}
                    >
                      &nbsp;Print
                    </a>
                    <div
                      className="dropdown p-0 nav-item"
                      id="shareBtn"
                      style={{ display: "none" }}
                    >
                      <li
                        className="ml-2 dropdown-toggle btn btn-outline-secondary text-grey fa fa-share-alt"
                        data-toggle="dropdown"
                        style={{
                          height: "fit-content",
                          width: "fit-content",
                        }}
                      >
                        &nbsp;Share
                      </li>
                      <ul
                        className="dropdown-menu"
                        style={{ backgroundColor: "black" }}
                        id="listdiv"
                      >
                        <a
                          href={shareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <li
                            style={{
                              textAlign: "center",
                              color: "#e5e9ec",
                              cursor: "pointer",
                            }}
                          >
                            WhatsApp
                          </li>
                        </a>
                        <li
                          style={{
                            textAlign: "center",
                            color: "#e5e9ec",
                            cursor: "pointer",
                          }}
                          data-toggle="modal"
                          data-target="#shareToEmail"
                        >
                          Email
                        </li>
                      </ul>
                    </div>
                    <Link
                      to={`/edit_account/${accountId}/`}
                      className="ml-2 fa fa-pencil btn btn-outline-secondary text-grey"
                      id="editBtn"
                      role="button"
                      style={{ height: "fit-content", width: "fit-content" }}
                    >
                      &nbsp;Edit
                    </Link>
                    <a
                      className="ml-2 btn btn-outline-secondary text-grey fa fa-trash"
                      id="deleteBtn"
                      role="button"
                      onClick={() =>
                        handleDeleteAccount(`${accountDetails.id}`)
                      }
                      style={{ height: "fit-content", width: "fit-content" }}
                    >
                      &nbsp;Delete
                    </a>
                    {accountDetails.create_status == "added" ? (
                      <Link
                        to={`/account_history/${accountId}/`}
                        className="ml-2 btn btn-outline-secondary text-grey fa fa-history"
                        id="historyBtn"
                        role="button"
                        style={{ height: "fit-content", width: "fit-content" }}
                      >
                        &nbsp;History
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
              <center>
                <h3
                  className="card-title"
                  style={{ textTransform: "Uppercase" }}
                >
                  ACCOUNT OVERVIEW
                </h3>
              </center>
            </div>
          </div>
        </div>

        <div
          className="card card-registration card-registration-2"
          style={{ borderRadius: "15px" }}
        >
          <div className="card-body p-0">
            <div id="overview">
              <div className="row g-0 mx-0">
                <div className="col-lg-7">
                  {accountDetails.create_status == "added" ? (
                    <div className="history_highlight px-1 pt-4 d-flex">
                      <div className="col-9 d-flex justify-content-start">
                        {history.action == "Created" ? (
                          <p
                            className="text-success"
                            style={{ fontSize: "1.07rem", fontWeight: "500" }}
                          >
                            Created by :
                          </p>
                        ) : (
                          <p
                            className="text-warning"
                            style={{ fontSize: "1.07rem", fontWeight: "500" }}
                          >
                            Last Edited by :
                          </p>
                        )}
                        <span
                          className="ml-2"
                          style={{ fontSize: "1.15rem", fontWeight: "500" }}
                        >
                          {history.doneBy}
                        </span>
                      </div>
                      <div className="col-3 d-flex justify-content-end">
                        <span>{history.date}</span>
                      </div>
                    </div>
                  ) : null}
                  <div className="">
                    <div className="card-body">
                      <div className="card-title">
                        <div className="row">
                          <div className="col mt-3">
                            <h2 className="mb-0">
                              {accountDetails.account_name}
                            </h2>
                          </div>
                        </div>
                      </div>
                      <hr />

                      <div className="row">
                        <div className="col-md-4 mt-3">
                          <label for="title">
                            <h6>Type Description : </h6>
                          </label>
                          <div
                            id="acnt-desc"
                            className="form-control"
                            style={{
                              fontSize: "small",
                              backgroundColor: "rgb(0 0 0 / 39%)",
                              opacity: "1",
                              height: "200px",
                              width: "600px",
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-4 mt-3">
                          <label for="title">
                            <h6>Name Description : </h6>
                          </label>
                          <div
                            className="form-control"
                            style={{
                              fontSize: "small",
                              backgroundColor: "rgb(0 0 0 / 39%)",
                              opacity: "1",
                              height: "100px",
                              width: "600px",
                            }}
                          >
                            {accountDetails.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="col-lg-5 bg-grey"
                  style={{
                    backgroundColor: "rgba(22,37,50,255)",
                    borderTopRightRadius: "2vh",
                    borderBottomRightRadius: "2vh",
                  }}
                >
                  <div className="px-5">
                    <h3 className="fw-bold mb-2 mt-4 pt-1">Account Details</h3>
                    <hr className="my-4" />
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">Account Type</h6>
                      {accountDetails.account_type}
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">Account Name</h6>
                      {accountDetails.account_name}
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">Status</h6>
                      {accountDetails.status == "active" ? (
                        <i className="fa fa-check-circle text-success">
                          &nbsp;ACTIVE
                        </i>
                      ) : (
                        <i className="fa fa-ban text-danger">&nbsp;INACTIVE</i>
                      )}
                    </div>
                    {/* <!-- <div className="d-flex justify-content-between mb-4">
                                  <h6 className="">Credit</h6>
                                  {{ account1s.balance }}
                              </div> --> */}
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">Balance</h6>
                      {accountDetails.balance}
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">As of</h6>
                      {accountDetails.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="transaction" style={{ display: "none" }}>
              <div id="printContent">
                <center>
                  <h3 className="mt-3 text-uppercase">
                    {accountDetails.account_name} - TRANSACTIONS
                  </h3>
                </center>
                <div className="row mt-5">
                  <div className="col d-flex justify-content-between px-5">
                    <div className="account_data" style={{fontSize: '1.2rem', fontWeight: 'bold'}}>
                      <p>Type: {accountDetails.account_type}</p>
                    </div>
                    <div className="account_data" style={{fontSize: '1.2rem', fontWeight: 'bold'}}>
                      <p>
                        Account Code:{" "}
                        {accountDetails.account_code
                          ? accountDetails.account_code
                          : "--"}
                      </p>
                      <p>Balance: {accountDetails.balance}</p>
                    </div>
                  </div>
                </div>
                <div className="table-responsive px-2">
                  <table className="table table-bordered" id="transactionTable">
                    <thead>
                      <tr>
                        <th className="text-center text-uppercase">Date</th>
                        <th className="text-center text-uppercase">Type</th>
                        <th className="text-center text-uppercase">Debit</th>
                        <th className="text-center text-uppercase">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length != 0 &&
                        transactions.map((t) => (
                          <tr>
                            <td style={{ textAlign: "center" }}> {t.date} </td>
                            <td style={{ textAlign: "center" }}> {t.type} </td>
                            <td style={{ textAlign: "center" }}> {t.debit} </td>
                            <td style={{ textAlign: "center" }}>
                              {" "}
                              {t.credit}{" "}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {transactions.length == 0 ? (
                    <center>
                      <h5>No Transactions Available.!</h5>
                    </center>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Share To Email Modal --> */}
      <div className="modal fade" id="shareToEmail">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">Share Item Transactions</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={handleShareEmail}
                className="needs-validation px-1"
                id="share_to_email_form"
              >
                <div className="card p-3 w-100">
                  <div className="form-group">
                    <label for="emailIds">Email IDs</label>
                    <textarea
                      className="form-control"
                      name="email_ids"
                      id="emailIds"
                      rows="3"
                      placeholder="Multiple emails can be added by separating with a comma(,)."
                      value={emailIds}
                      onChange={(e) => setEmailIds(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label for="item_unitname">Message(optional)</label>
                    <textarea
                      name="email_message"
                      id="email_message"
                      className="form-control"
                      cols=""
                      rows="4"
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      placeholder="This message will be sent along with Account details."
                    />
                  </div>
                </div>
                <div
                  className="modal-footer d-flex justify-content-center w-100"
                  style={{ borderTop: "1px solid #ffffff" }}
                >
                  <button
                    type="submit"
                    id="share_with_email"
                    className="submitShareEmailBtn w-50 text-uppercase"
                  >
                    SEND MAIL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewAccount;
