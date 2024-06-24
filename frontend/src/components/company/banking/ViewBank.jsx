import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import "../../styles/Banking.css";

function ViewBank() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();
  const { bankId } = useParams();
  const [bankDetails, setBankDetails] = useState({});
  const [comments, setComments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState({
    action: "",
    date: "",
    doneBy: "",
  });

  const [lastUpdatedBy, setLastUpdatedBy] = useState("");
  const fetchBankDetails = () => {
    axios
      .get(`${config.base_url}/fetch_bank_details/${bankId}/`)
      .then((res) => {
        console.log("BANK DATA=", res);
        if (res.data.status) {
          var itm = res.data.bank;
          var hist = res.data.history;
          var cmt = res.data.comments;
          var trns = res.data.transactions;
          var upd = res.data.lastUpdated;
          setLastUpdatedBy(upd);
          setComments([]);
          setTransactions([]);
          trns.map((t) => {
            setTransactions((prevState) => [...prevState, t]);
          });
          cmt.map((c) => {
            setComments((prevState) => [...prevState, c]);
          });
          setBankDetails(itm);
          if (hist) {
            setHistory(hist);
          }
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
    fetchBankDetails();
  }, []);

  function formatDate(value) {
    if (value && !isNaN(Date.parse(value))) {
      var date = new Date(value);
      return date.toISOString().slice(0, 10);
    } else {
      return "";
    }
  }

  const currentUrl = window.location.href;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    currentUrl
  )}`;

  function handleFileModalSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Id", ID);
    formData.append("banking", bankId);
    if (file) {
      formData.append("file", file);
    }

    axios
      .post(`${config.base_url}/add_banking_attachment/`, formData)
      .then((res) => {
        console.log("FILE RES==", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "File Added.",
          });
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

  const changeStatus = (status) => {
    var st = {
      id: bankId,
      status: status,
    };
    axios
      .post(`${config.base_url}/change_bank_status/`, st)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Status Updated",
          });
          fetchBankDetails();
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

  function handleDeleteBank(id) {
    Swal.fire({
      title: `Delete Bank - ${bankDetails.bank_name}?`,
      text: "All transactions will be deleted.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_bank/${id}/`)
          .then((res) => {
            console.log(res);

            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Bank Deleted successfully",
              });
              navigate("/banking");
            }

            if (!res.data.status) {
              Swal.fire({
                icon: "info",
                title: `${res.data.message}`,
              });
              fetchBankDetails();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  const [comment, setComment] = useState("");
  const saveItemComment = (e) => {
    e.preventDefault();
    var cmt = {
      Id: ID,
      item: bankId,
      comments: comment,
    };
    axios
      .post(`${config.base_url}/add_bank_comment/`, cmt)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Comment Added",
          });
          setComment("");
          fetchBankDetails();
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

  function deleteComment(id) {
    Swal.fire({
      title: "Delete Comment?",
      text: "Are you sure you want to delete this.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_bank_comment/${id}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Comment Deleted",
            });
            fetchBankDetails();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  function handelDeleteBankTransaction(id) {
    Swal.fire({
      title: "Delete Transaction?",
      text: "Are you sure you want to delete the transaction.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_bank_transaction/${id}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Transaction Deleted",
            });
            fetchBankDetails();
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

  function ExportToExcel(type, fn, dl) {
    var elt = document.getElementById("tbl_exporttable_to_xls");
    var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
    return dl
      ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
      : XLSX.writeFile(wb, fn || "Transaction." + (type || "xlsx"));
  }

  function Transaction() {
    document.getElementById("overview").style.display = "none";
    document.getElementById("statement").style.display = "none";
    document.getElementById("Transaction").style.display = "block";

    document.querySelectorAll(".transactionBtn").forEach(function (btn) {
      btn.style.backgroundColor = "rgba(22,37,50,255)";
    });
    document.querySelectorAll(".overviewBtn").forEach(function (btn) {
      btn.style.backgroundColor = "transparent";
    });
    document.querySelectorAll(".statementBtn").forEach(function (btn) {
      btn.style.backgroundColor = "transparent";
    });
  }
  function Overview() {
    document.getElementById("overview").style.display = "block";
    document.getElementById("statement").style.display = "none";
    document.getElementById("Transaction").style.display = "none";

    document.querySelectorAll(".overviewBtn").forEach(function (btn) {
      btn.style.backgroundColor = "rgba(22,37,50,255)";
    });
    document.querySelectorAll(".transactionBtn").forEach(function (btn) {
      btn.style.backgroundColor = "transparent";
    });
    document.querySelectorAll(".statementBtn").forEach(function (btn) {
      btn.style.backgroundColor = "transparent";
    });
  }

  function Statement() {
    document.getElementById("overview").style.display = "none";
    document.getElementById("statement").style.display = "block";
    document.getElementById("Transaction").style.display = "none";

    document.querySelectorAll(".statementBtn").forEach(function (btn) {
      btn.style.backgroundColor = "rgba(22,37,50,255)";
    });
    document.querySelectorAll(".overviewBtn").forEach(function (btn) {
      btn.style.backgroundColor = "transparent";
    });
    document.querySelectorAll(".transactionBtn").forEach(function (btn) {
      btn.style.backgroundColor = "transparent";
    });
  }

  function searchTable() {
    var rows = document.querySelectorAll("#tbl_exporttable_to_xls tbody tr");
    var val = document
      .getElementById("search")
      .value.trim()
      .replace(/ +/g, " ")
      .toLowerCase();
    rows.forEach(function (row) {
      var text = row.textContent.replace(/\s+/g, " ").toLowerCase();
      row.style.display = text.includes(val) ? "" : "none";
    });
  }

  function printSheet() {
    var divToPrint = document.getElementById("whatToPrint");
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
      b_id: bankId,
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
        a.download = `Bank_Transactions_${bankDetails.bank_name}.pdf`;
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
          b_id: bankId,
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

  return (
    <>
      <FinBase />
      <div
        className="page-content"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <Link
          className="d-flex justify-content-end p-2"
          style={{ cursor: "pointer" }}
          to="/banking"
        >
          <i
            className="fa fa-times-circle text-white"
            style={{ fontSize: "1.2rem" }}
          ></i>
        </Link>
        <div id="Transaction">
          <div className="card radius-15">
            <div className="card-body">
              <div className="card-title">
                <div className="row">
                  <div className="col-md-9">
                    <h5>
                      BANK:{" "}
                      <span style={{ fontSize: "x-large" }}>
                        {bankDetails.bank_name}
                      </span>
                    </h5>
                    <h6>Account No: {bankDetails.account_number}</h6>
                    <h6>IFSC Code: {bankDetails.ifsc_code}</h6>
                    <h6>
                      Opening Balance: <i className="fa fa-rupee"></i>{" "}
                      {bankDetails.opening_balance}
                    </h6>
                  </div>
                  <div className="col-md-3 mt-4 text-right">
                    <h6 className="mt-1 ">
                      Balance: <i className="fa fa-rupee"></i>{" "}
                      {bankDetails.current_balance}
                    </h6>
                  </div>

                  <hr style={{ width: "95%" }} />
                </div>

                <div className="" style={{ float: "left" }}>
                  <a
                    className="transactionBtn"
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderRadius: "1vh",
                      backgroundColor: "rgba(22,37,50,255)",
                    }}
                    onClick={Transaction}
                    id="transactionBtn"
                  >
                    Transactions
                  </a>
                  <a
                    className="overviewBtn"
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderRadius: "1vh",
                    }}
                    onClick={Overview}
                    id="overviewBtn"
                  >
                    Overview
                  </a>
                  <a
                    className="statementBtn"
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderRadius: "1vh",
                    }}
                    onClick={Statement}
                    id="statementBtn"
                  >
                    Statement
                  </a>
                </div>

                <div className="btn-group mx-1" style={{ float: "right" }}>
                  <button
                    type="button"
                    style={{ width: "fit-content", height: "fit-content" }}
                    className="btn btn-outline-secondary text-grey mt-3"
                    id="exportBtn"
                    onClick={() => ExportToExcel("xlsx")}
                  >
                    <i className="fa fa-table"></i> Export To Excel
                  </button>
                </div>
                <div className="btn-group mx-1" style={{ float: "right" }}>
                  <div className="dropdown">
                    <button
                      type="button"
                      className="dropdown-toggle btn btn-outline-secondary  text-grey mt-3 "
                      style={{
                        cursor: "pointer",
                        width: "fit-content",
                        height: "fit-content",
                      }}
                      data-toggle="dropdown"
                    >
                      Transaction
                    </button>
                    <div
                      className="dropdown-menu"
                      style={{ backgroundColor: "black" }}
                    >
                      <a
                        className="dropdown-item"
                        href="{% url 'Fin_bank_to_cash' bankDetails.id %}"
                        style={{
                          height: "40px",
                          fontSize: "15px",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Bank to Cash Transfer
                      </a>
                      <a
                        className="dropdown-item"
                        href="{% url 'Fin_cash_to_bank' bankDetails.id %}"
                        style={{
                          height: "40px",
                          fontSize: "15px",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Cash to Bank Transfer
                      </a>
                      <a
                        className="dropdown-item"
                        href="{% url 'Fin_bank_to_bank' bankDetails.id %}"
                        style={{
                          height: "40px",
                          fontSize: "15px",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Bank to Bank Transfer
                      </a>
                      <a
                        className="dropdown-item"
                        href="{% url 'Fin_bank_adjust' bankDetails.id %}"
                        style={{
                          height: "40px",
                          fontSize: "15px",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Adjust Bank Balance
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="card card-registration card-registration-2"
            style={{ borderRadius: "15px" }}
          >
            <div className="card-body p-0">
              <div className="card radius-15">
                <div className="card-body">
                  <div className="row">
                    <h4 className="container-fluid p-2 ml-2">Transactions</h4>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <input
                        type="text"
                        id="search"
                        className="form-control"
                        placeholder="Search.."
                        autoComplete="off"
                        style={{
                          marginTop: "8px",
                          backgroundColor: "#2f516f",
                          color: "white",
                        }}
                        onKeyUp={searchTable}
                      />
                    </div>
                  </div>
                  <div className="container-fluid">
                    <table
                      className="table table-responsive-md mt-4 table-hover"
                      id="tbl_exporttable_to_xls"
                    >
                      <thead style={{ backgroundColor: "#263d52" }}>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              textTransform: "uppercase",
                            }}
                          >
                            Sl No
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              textTransform: "uppercase",
                            }}
                          >
                            Date
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              textTransform: "uppercase",
                            }}
                          >
                            Type
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              textTransform: "uppercase",
                            }}
                          >
                            Name
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              textTransform: "uppercase",
                            }}
                          >
                            Amount
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              textTransform: "uppercase",
                            }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions &&
                          transactions.map((i, index) => (
                            <tr className="table-row ">
                              <td style={{ textAlign: "center" }}>
                                {index + 1}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {formatDate(i.adjustment_date)}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {i.transaction_type}
                              </td>
                              {i.transaction_type == "From Bank Transfer" ||
                              i.transaction_type == "Cash Withdraw" ||
                              i.transaction_type == "Reduce Balance" ? (
                                <>
                                  <td style={{ textAlign: "center" }}>
                                    {i.to_type}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <i className="fa fa-rupee"></i> -{i.amount}
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td style={{ textAlign: "center" }}>
                                    {i.from_type}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <i className="fa fa-rupee"></i> {i.amount}
                                  </td>
                                </>
                              )}
                              <td>
                                <div className="dropdown">
                                  <i
                                    className="fa fa-ellipsis-v"
                                    data-toggle="dropdown"
                                  ></i>
                                  <div className="dropdown-menu">
                                    {i.transaction_type == "Opening Balance" ? (
                                      <Link
                                        className="dropdown-item edit-item"
                                        to={`/edit_bank/${i.banking}/`}
                                      >
                                        Edit
                                      </Link>
                                    ) : (
                                      <Link
                                        className="dropdown-item edit-item"
                                        href="{% url 'Fin_edit_bank_trans' i.id %}"
                                      >
                                        Edit
                                      </Link>
                                    )}

                                    <a
                                      className="dropdown-item delete-item"
                                      onClick={() =>
                                        handelDeleteBankTransaction(i.id)
                                      }
                                    >
                                      Delete
                                    </a>
                                    <Link
                                      className="dropdown-item edit-item"
                                      to={`/bank_transaction_history/${i.id}/`}
                                    >
                                      History
                                    </Link>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="overview" style={{ display: "none" }}>
          <div className="card radius-15">
            <div className="card-body">
              <div className="card-title">
                <center>
                  <h2 className="mb-0">{bankDetails.bank_name}</h2>
                </center>
                <hr />

                <div className="" style={{ float: "left" }}>
                  <a
                    className="transactionBtn"
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderRadius: "1vh",
                    }}
                    onClick={Transaction}
                    id="transactionBtn"
                  >
                    Transactions
                  </a>
                  <a
                    className="overviewBtn"
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderRadius: "1vh",
                      backgroundColor: "rgba(22,37,50,255)",
                    }}
                    onClick={Overview}
                    id="overviewBtn"
                  >
                    Overview
                  </a>
                  <a
                    className="statementBtn"
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderRadius: "1vh",
                    }}
                    onClick={Statement}
                    id="statementBtn"
                  >
                    Statement
                  </a>
                </div>

                <div className="btn-group" style={{ float: "right" }}>
                  <div>
                    <center>
                      {bankDetails.bank_status == "Active" ? (
                        <a
                          onClick={() => changeStatus("Inactive")}
                          id="statusBtn"
                          style={{
                            height: "fit-content",
                            width: "fit-content",
                          }}
                          className="fa fa-check-circle btn btn-outline-secondary text-grey mt-3"
                          role="button"
                        >
                          &nbsp;Active
                        </a>
                      ) : (
                        <a
                          onClick={() => changeStatus("Active")}
                          id="statusBtn"
                          style={{
                            height: "fit-content",
                            width: "fit-content",
                          }}
                          className="fa fa-check-circle btn btn-outline-secondary text-grey mt-3"
                          role="button"
                        >
                          &nbsp;Inactive
                        </a>
                      )}
                      <Link
                        to={`/edit_bank/${bankId}/`}
                        className="fa fa-pencil btn btn-outline-secondary text-grey mt-3 ml-2"
                        style={{
                          cursor: "pointer",
                          height: "fit-content",
                          width: "fit-content",
                        }}
                        role="button"
                      >
                        &nbsp;Edit
                      </Link>

                      <a
                        onClick={() => handleDeleteBank(bankId)}
                        className="fa fa-trash btn btn-outline-secondary text-grey mt-3 ml-2"
                        style={{
                          cursor: "pointer",
                          height: "fit-content",
                          width: "fit-content",
                        }}
                        role="button"
                      >
                        &nbsp;Delete
                      </a>

                      <button
                        type="button"
                        className=" fa fa-paperclip  btn btn-outline-secondary  text-grey mt-3 ml-2"
                        style={{
                          cursor: "pointer",
                          height: "fit-content",
                          width: "fit-content",
                        }}
                        data-toggle="modal"
                        data-target="#uploadFileModal"
                      >
                        &nbsp;Attach file
                      </button>
                      {/* <!-- <a data-toggle="modal"
                                        className=" fa fa-download btn btn-outline-info rounded-pill text-grey mt-3 mb-3"
                                        data-target="#commentModal"> Download</a> --> */}
                    </center>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="card card-registration card-registration-2"
            style={{ borderRadius: "15px" }}
          >
            <div className="card-body p-0">
              <div id="details">
                <div className="row g-0">
                  <div className="col-lg-8">
                    <div className="p-5">
                      <div className="card-body">
                        <div className="card-title">
                          <div className="row">
                            <div className="col mt-3">
                              <h2 className="mb-0 text-center">Bank Details</h2>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4 ml-5 mr-5 mt-3">
                            <label HtmlFor="title">
                              <h6>
                                <b>Bank Status </b>
                              </h6>
                            </label>
                          </div>
                          <div
                            className="col-md-4 ml-5 mt-3"
                            id="bankStatusDisplay"
                          >
                            {bankDetails.bank_status == "Active" ? (
                              <label HtmlFor="title">
                                <b>
                                  :
                                  <span className="text-success fa fa-check"></span>
                                  {bankDetails.bank_status}
                                </b>
                              </label>
                            ) : (
                              <label HtmlFor="title">
                                <b>
                                  :
                                  <span className="text-danger fa fa-exclamation-triangle"></span>
                                  {bankDetails.bank_status}
                                </b>
                              </label>
                            )}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-md-4 ml-5 mr-5 mt-3">
                            <label HtmlFor="title">
                              <h6>
                                <b>Account Number </b>
                              </h6>
                            </label>
                          </div>
                          <div className="col-md-4 ml-5 mt-3">
                            <label HtmlFor="title">
                              <b>: {bankDetails.account_number}</b>
                            </label>
                          </div>
                        </div>
                        <hr />

                        <div className="row">
                          <div className="col-md-4 ml-5 mr-5 mt-3">
                            <label HtmlFor="title ">
                              <h6>
                                <b>IFSC Code </b>
                              </h6>
                            </label>
                          </div>
                          <div className="col-md-4 ml-5 mt-3">
                            <label HtmlFor="title">
                              <b>: {bankDetails.ifsc_code}</b>
                            </label>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-md-4 ml-5  mr-5 mt-3">
                            <label HtmlFor="title">
                              <h6>
                                <b>Branch Name </b>
                              </h6>
                            </label>
                          </div>
                          <div className="col-md-4 ml-5 mt-3">
                            <label HtmlFor="title">
                              <b>: {bankDetails.branch_name}</b>
                            </label>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-md-4 ml-5 mr-5 mt-3">
                            <label HtmlFor="title">
                              <h6>
                                <b>Created Date</b>{" "}
                              </h6>
                            </label>
                          </div>
                          <div className="col-md-4 ml-5 mt-3">
                            <label HtmlFor="title">
                              <b>: {formatDate(bankDetails.date)}</b>
                            </label>
                          </div>
                        </div>
                        <hr />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 bg-grey">
                    <div className="p-5">
                      <hr className="my-4" />
                      <div className="d-flex justify-content-between mb-4">
                        <h6 className="">Opening Balance</h6>
                        &#8377; {bankDetails.opening_balance}
                      </div>
                      <div className="d-flex justify-content-between mb-4">
                        <h6 className="">Current Balance</h6>
                        &#8377; {bankDetails.current_balance}
                      </div>
                      <div className="d-flex justify-content-between mb-4">
                        <h6 className="">Last Updated By</h6>
                        {lastUpdatedBy}
                      </div>

                      <hr className="my-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="statement" style={{ display: "none" }}>
          <div className="card radius-15 ">
            <div className="card-body">
              <div className="card-title">
                <center>
                  <h2 className="mb-0">{bankDetails.bank_name}</h2>
                </center>
                <hr />

                <div className="" style={{ float: "left" }}>
                  <a
                    className="transactionBtn"
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderRadius: "1vh",
                    }}
                    onClick={Transaction}
                    id="transactionBtn"
                  >
                    Transactions
                  </a>
                  <a
                    className="overviewBtn"
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderRadius: "1vh",
                    }}
                    onClick={Overview}
                    id="overviewBtn"
                  >
                    Overview
                  </a>
                  <a
                    className="statementBtn"
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderRadius: "1vh",
                      backgroundColor: "rgba(22,37,50,255)",
                    }}
                    onClick={Statement}
                    id="statementBtn"
                  >
                    Statement
                  </a>
                </div>
                <div className="d-flex" style={{ float: "right" }}>
                  <a
                    className="ml-2 btn btn-outline-secondary text-grey fa fa-file"
                    role="button"
                    id="pdfBtn"
                    style={{
                      cursor: "pointer",
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
                      cursor: "pointer",
                      height: "fit-content",
                      width: "fit-content",
                    }}
                      onClick={() => printSheet()}
                  >
                    &nbsp;Print
                  </a>
                  <div className="dropdown p-0 nav-item" id="shareBtn">
                    <li
                      className="ml-2 dropdown-toggle btn btn-outline-secondary text-grey fa fa-share-alt"
                      data-toggle="dropdown"
                      style={{
                        cursor: "pointer",
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
                </div>
              </div>
            </div>
          </div>

          <div id="whatToPrint" className="print-only">
            <div className="my-5 page pagea4" size="A4">
              <div className="p-5">
                <div
                  id="ember2512"
                  className="tooltip-container ember-view ribbon text-ellipsis"
                >
                  <div
                    style={{ textTransform: "uppercase", color: "#000000" }}
                    className="ribbon-inner ribbon-open"
                  >
                    {bankDetails.bank_status}
                  </div>
                </div>
                <section className="top-content bb d-flex justify-content-between">
                  <div className="logo"></div>
                  <div className="top-left">
                    <div className="graphic-path">
                      <p
                        style={{ textTransform: "uppercase", color: "#000000" }}
                      >
                        STATEMENT
                      </p>
                    </div>
                    <div className="position-relative">
                      <p
                        style={{ textTransform: "uppercase", color: "#000000" }}
                      >
                        Ac/No:
                        <span>{bankDetails.account_number}</span>
                      </p>
                    </div>
                  </div>
                </section>

                <section className="store-user mt-5">
                  <div className="col-12">
                    <div className="row bb pb-3">
                      <div className="col-7">
                        <h5 style={{ color: "#000000" }}>
                          {bankDetails.bank_name}
                        </h5>
                        <p style={{ color: "#000000" }}>
                          Ac/No: {bankDetails.account_number}
                          <br />
                          IFSC Code: {bankDetails.ifsc_code}
                          <br />
                          Branch: {bankDetails.branch_name}
                          <br />
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="product-area mt-4">
                  <table
                    id="statementTable"
                    className="table table-hover "
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th
                          style={{
                            textAlign: "center",
                            textTransform: "uppercase",
                            color: "black",
                          }}
                        >
                          Sl No
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            textTransform: "uppercase",
                            color: "black",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            textTransform: "uppercase",
                            color: "black",
                          }}
                        >
                          Type
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            textTransform: "uppercase",
                            color: "black",
                          }}
                        >
                          Name
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            textTransform: "uppercase",
                            color: "black",
                          }}
                        >
                          Amount
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            textTransform: "uppercase",
                            color: "black",
                          }}
                        >
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions &&
                        transactions.map((i, index) => (
                          <tr className="table-row ">
                            <td style={{ textAlign: "center", color: "black" }}>
                              {index + 1}
                            </td>
                            <td style={{ textAlign: "center", color: "black" }}>
                              {formatDate(i.adjustment_date)}
                            </td>
                            <td style={{ textAlign: "center", color: "black" }}>
                              {i.transaction_type}
                            </td>
                            {i.transaction_type == "From Bank Transfer" ||
                            i.transaction_type == "Cash Withdraw" ||
                            i.transaction_type == "Reduce Balance" ? (
                              <>
                                <td
                                  style={{
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  {i.to_type}
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  <i className="fa fa-rupee"></i> -{i.amount}
                                </td>
                              </>
                            ) : (
                              <>
                                <td
                                  style={{
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  {i.from_type}
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    color: "black",
                                  }}
                                >
                                  <i className="fa fa-rupee"></i> {i.amount}
                                </td>
                              </>
                            )}
                            <td style={{ textAlign: "center", color: "black" }}>
                              <i className="fa fa-rupee"></i>{" "}
                              {i.current_balance}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Unit Create Modal --> */}
      <div className="modal fade" id="uploadFileModal">
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">Add File</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body w-100">
              <div className="card p-3">
                <form
                  id="uploadFileForm"
                  className="px-1"
                  encType="multipart/form-data"
                >
                  <div className="row mt-2 w-100">
                    <div className="col-12">
                      <input
                        name="file"
                        type="file"
                        id=""
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="form-control text-uppercase w-100"
                      />
                    </div>
                  </div>
                  <div className="row mt-4 w-100">
                    <div className="col-12 d-flex justify-content-center">
                      <button
                        className="btn btn-outline-info text-grey"
                        data-dismiss="modal"
                        type="submit"
                        onClick={handleFileModalSubmit}
                        id="saveFile"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewBank;
