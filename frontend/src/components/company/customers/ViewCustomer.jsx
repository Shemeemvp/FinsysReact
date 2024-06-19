import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import "../../styles/Items.css";

function ViewCustomer() {
  const ID = Cookies.get("Login_id");
  const { customerId } = useParams();
  const [customerDetails, setCustomerDetails] = useState({});
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState({
    action: "",
    date: "",
    doneBy: "",
  });

  const fetchCustomerDetails = () => {
    axios
      .get(`${config.base_url}/fetch_customer_details/${customerId}/`)
      .then((res) => {
        console.log("CUST DATA=", res);
        if (res.data.status) {
          var itm = res.data.customer;
          var hist = res.data.history;
          var cmt = res.data.comments;
          setComments([]);
          cmt.map((c) => {
            setComments((prevState) => [...prevState, c]);
          });
          setCustomerDetails(itm);
          if (hist) {
            setHistory(hist);
          }
          // stockValue(itm.current_stock, itm.purchase_price);
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
    fetchCustomerDetails();
  }, []);

  const currentUrl = window.location.href;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    currentUrl
  )}`;

  function stockValue(stock, rate) {
    var valueElement = document.getElementById("stockValue");
    if (!isNaN(stock) && !isNaN(rate)) {
      valueElement.innerText = parseFloat(stock * rate);
    } else {
      valueElement.innerText = 0;
    }
  }
  const navigate = useNavigate();

  const changeStatus = (status) => {
    var st = {
      id: customerId,
      status: status,
    };
    axios
      .post(`${config.base_url}/change_customer_status/`, st)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Status Updated",
          });
          fetchCustomerDetails();
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
  const [comment, setComment] = useState("");
  const saveItemComment = (e) => {
    e.preventDefault();
    var cmt = {
      Id: ID,
      customer: customerId,
      comments: comment,
    };
    axios
      .post(`${config.base_url}/add_customer_comment/`, cmt)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Comment Added",
          });
          setComment("");
          fetchCustomerDetails();
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

  function handleDeleteCustomer() {
    Swal.fire({
      title: `Delete Customer - ${customerDetails.first_name}?`,
      text: "All transactions will be deleted.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_customer/${customerId}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Customer Deleted successfully",
            });
            navigate("/customers");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

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
          .delete(`${config.base_url}/delete_customer_comment/${id}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Comment Deleted",
            });
            fetchCustomerDetails();
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
    document.getElementById("exportBtn").style.display = "none";
    document.getElementById("overviewBtn").style.backgroundColor =
      "rgba(22,37,50,255)";
    document.getElementById("transactionBtn").style.backgroundColor =
      "transparent";
    document.getElementById("historyBtn").style.display = "block";
    document.getElementById("statusBtn").style.display = "block";
    document.getElementById("commentsBtn").style.display = "block";
  }
  function transaction() {
    document.getElementById("overview").style.display = "none";
    document.getElementById("transaction").style.display = "block";
    document.getElementById("printBtn").style.display = "block";
    document.getElementById("pdfBtn").style.display = "block";
    document.getElementById("shareBtn").style.display = "block";
    document.getElementById("editBtn").style.display = "none";
    document.getElementById("deleteBtn").style.display = "none";
    document.getElementById("exportBtn").style.display = "block";
    document.getElementById("overviewBtn").style.backgroundColor =
      "transparent";
    document.getElementById("transactionBtn").style.backgroundColor =
      "rgba(22,37,50,255)";
    document.getElementById("historyBtn").style.display = "none";
    document.getElementById("statusBtn").style.display = "none";
    document.getElementById("commentsBtn").style.display = "none";
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

  function ExportToExcel(type, fn, dl) {
    var elt = document.getElementById("transactionTable");
    var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
    return dl
      ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
      : XLSX.writeFile(
          wb,
          fn || `${customerDetails.first_name}_transactions.` + (type || "xlsx")
        );
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

  function itemTransactionPdf() {
    axios
      .get(`${config.base_url}/item_transaction_pdf/${customerId}/${ID}/`, {
        responseType: "blob",
      })
      .then((res) => {
        console.log("PDF RES=", res);

        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = `Item_transactions_${customerId}.pdf`;
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
          customerId: customerId,
          Id: ID,
          email_ids: emailIds,
          email_message: emailMessage,
        };
        axios
          .post(`${config.base_url}/share_item_transactions_email/`, em)
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
        className="page-content mt-0 pt-0"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <Link
          className="d-flex justify-content-end p-2"
          style={{ cursor: "pointer" }}
          to="/customers"
        >
          <i
            className="fa fa-times-circle text-white"
            style={{ fontSize: "1.2rem" }}
          ></i>
        </Link>

        <div className="card radius-15">
          <div className="card-body w-100">
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
                      {" "}
                      Transactions
                    </a>
                  </div>

                  <div className="col-md-6 d-flex justify-content-end">
                    {customerDetails.status == "Inactive" ? (
                      <a
                        onClick={() => changeStatus("Active")}
                        id="statusBtn"
                        className="ml-2 fa fa-ban btn btn-outline-secondary text-grey"
                        role="button"
                        style={{ height: "fit-content", width: "fit-content" }}
                      >
                        &nbsp;Inactive
                      </a>
                    ) : (
                      <a
                        onClick={() => changeStatus("Inactive")}
                        id="statusBtn"
                        className="ml-2 fa fa-check-circle btn btn-outline-secondary text-grey"
                        role="button"
                        style={{ height: "fit-content", width: "fit-content" }}
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
                      href="{% url 'Fin_customerTransactionsPdf' customerDetails.id %}"
                      className="ml-2 btn btn-outline-secondary text-grey fa fa-file"
                      role="button"
                      id="pdfBtn"
                      style={{
                        display: "none",
                        height: "fit-content",
                        width: "fit-content",
                      }}
                    >
                      {" "}
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
                    <a
                      href="{% url 'Fin_editCustomer' customerDetails.id %}"
                      className="ml-2 fa fa-pencil btn btn-outline-secondary text-grey"
                      id="editBtn"
                      role="button"
                      style={{ height: "fit-content", width: "fit-content" }}
                    >
                      &nbsp;Edit
                    </a>
                    <a
                      className="ml-2 btn btn-outline-secondary text-grey fa fa-trash"
                      id="deleteBtn"
                      role="button"
                      onClick={handleDeleteCustomer}
                      style={{ height: "fit-content", width: "fit-content" }}
                    >
                      &nbsp;Delete
                    </a>
                    <a
                      href="#"
                      className="ml-2 btn btn-outline-secondary text-grey fa fa-comments"
                      id="commentsBtn"
                      role="button"
                      data-toggle="modal"
                      data-target="#commentModal"
                      style={{ height: "fit-content", width: "fit-content" }}
                    >
                      &nbsp;Comment
                    </a>
                    <Link
                      to={`/customer_history/${customerDetails.id}/`}
                      className="ml-2 btn btn-outline-secondary text-grey fa fa-history"
                      id="historyBtn"
                      role="button"
                      style={{ height: "fit-content", width: "fit-content" }}
                    >
                      &nbsp;History
                    </Link>
                  </div>
                </div>
              </div>
              <center>
                <h3 className="card-title">CUSTOMER OVERVIEW</h3>
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
                <div className="col-lg-8">
                  <div className="history_highlight pt-3 px-2 d-flex">
                    <div className="col-12 d-flex justify-content-start align-items-center">
                      {history.action == "Created" ? (
                        <p
                          className="text-success m-0"
                          style={{ fontSize: "1.07rem", fontWeight: "500" }}
                        >
                          Created by :
                        </p>
                      ) : (
                        <p
                          className="text-warning m-0"
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
                      <span className="ml-5">{history.date}</span>
                    </div>
                  </div>

                  <div className="pb-3 px-2">
                    <div className="card-body">
                      <div className="card-title">
                        <div className="row">
                          <div className="col mt-3">
                            <h2 className="mb-0">
                              {customerDetails.title}
                              {"."} {customerDetails.first_name}{" "}
                              {customerDetails.last_name}
                            </h2>
                          </div>
                        </div>
                      </div>
                      <hr />

                      <div className="row mb-4 d-flex justify-content-between align-items-center">
                        <div className="col-md-2 mt-3">
                          <h6 className="mb-0">Company</h6>
                        </div>
                        <div className="col-md-1 mt-3">:</div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0">{customerDetails.company}</p>
                        </div>
                        <div className="col-md-2 mt-3 vl">
                          <h6 className="mb-0">Email</h6>
                        </div>
                        <div className="col-md-1 mt-3">:</div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0">{customerDetails.email}</p>
                        </div>
                      </div>

                      <div className="row mb-4 d-flex justify-content-between align-items-center">
                        <div className="col-md-2 mt-3">
                          <h6 className="mb-0">Mobile</h6>
                        </div>
                        <div className="col-md-1 mt-3">:</div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0">{customerDetails.mobile}</p>
                        </div>
                        <div className="col-md-2 mt-3 vl">
                          <h6 className="mb-0">Website</h6>
                        </div>
                        <div className="col-md-1 mt-3">:</div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0">{customerDetails.website}</p>
                        </div>
                      </div>

                      <div className="row mb-4 d-flex justify-content-between align-items-center">
                        <div className="col-md-2 mt-3">
                          <h6 className="mb-0">Location</h6>
                        </div>
                        <div className="col-md-1 mt-3">:</div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0">{customerDetails.location}</p>
                        </div>
                        <div className="col-md-2 mt-3 vl">
                          <h6 className="mb-0">Place of Supply</h6>
                        </div>
                        <div className="col-md-1 mt-3">:</div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0">
                            {customerDetails.place_of_supply}
                          </p>
                        </div>
                      </div>

                      <div className="row mb-4 d-flex justify-content-between align-items-center">
                        <div className="col-md-2 mt-3">
                          <h6 className="mb-0">Payment Terms</h6>
                        </div>
                        <div className="col-md-1 mt-3">:</div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0">
                            {"{ customerDetails.payment_terms.term_name }"}
                          </p>
                        </div>
                        <div className="col-md-2 mt-3 vl">
                          <h6 className="mb-0">Price List</h6>
                        </div>
                        <div className="col-md-1 mt-3">:</div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0">
                            {"{ customerDetails.price_list.name }"}
                          </p>
                        </div>
                      </div>

                      <hr />
                      <div className="row ">
                        <div className="col-md-6">
                          <div className="card-content bg-transparent border-0 ml-4">
                            <div className="row">
                              <div className="col-md-12">
                                <h5
                                  className="ml-3"
                                  style={{ textAlign: "center" }}
                                >
                                  Billing Address
                                </h5>
                                <hr />
                              </div>
                            </div>
                            <br />
                            <div className="row mb-3">
                              <div className="col-md-3">
                                <h6 className="mb-0">Street</h6>
                              </div>
                              <div className="col-md-1">:</div>
                              <div className="col-md-8">
                                <p
                                  className="mb-0"
                                  style={{ textAlign: "right" }}
                                >
                                  {customerDetails.billing_street}
                                </p>
                              </div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-3">
                                <h6 className="mb-0">City</h6>
                              </div>
                              <div className="col-md-1">:</div>
                              <div className="col-md-8">
                                <p
                                  className="mb-0"
                                  style={{ textAlign: "right" }}
                                >
                                  {customerDetails.billing_city}
                                </p>
                              </div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-3">
                                <h6 className="mb-0">State</h6>
                              </div>
                              <div className="col-md-1">:</div>
                              <div className="col-md-8">
                                <p
                                  className="mb-0"
                                  style={{ textAlign: "right" }}
                                >
                                  {customerDetails.billing_state}
                                </p>
                              </div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-3">
                                <h6 className="mb-0">Pincode</h6>
                              </div>
                              <div className="col-md-1">:</div>
                              <div className="col-md-8">
                                <p
                                  className="mb-0"
                                  style={{ textAlign: "right" }}
                                >
                                  {customerDetails.billing_pincode}
                                </p>
                              </div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-3">
                                <h6 className="mb-0">Country</h6>
                              </div>
                              <div className="col-md-1">:</div>
                              <div className="col-md-8">
                                <p
                                  className="mb-0"
                                  style={{ textAlign: "right" }}
                                >
                                  {customerDetails.billing_country}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="card-content bg-transparent border-0">
                            <div className="row">
                              <div className="col-md-12">
                                <h5
                                  className="ml-3"
                                  style={{ textAlign: "center" }}
                                >
                                  Shipping Address
                                </h5>
                                <hr />
                              </div>
                            </div>
                            <br />
                            <div className="row mb-3">
                              <div className="col-md-3">
                                <h6 className="mb-0">Street</h6>
                              </div>
                              <div className="col-md-1">:</div>
                              <div className="col-md-8">
                                <p
                                  className="mb-0"
                                  style={{ textAlign: "right" }}
                                >
                                  {customerDetails.ship_street}
                                </p>
                              </div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-3">
                                <h6 className="mb-0">City</h6>
                              </div>
                              <div className="col-md-1">:</div>
                              <div className="col-md-8">
                                <p
                                  className="mb-0"
                                  style={{ textAlign: "right" }}
                                >
                                  {customerDetails.ship_city}
                                </p>
                              </div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-3">
                                <h6 className="mb-0">State</h6>
                              </div>
                              <div className="col-md-1">:</div>
                              <div className="col-md-8">
                                <p
                                  className="mb-0"
                                  style={{ textAlign: "right" }}
                                >
                                  {customerDetails.ship_state}
                                </p>
                              </div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-3">
                                <h6 className="mb-0">Pincode</h6>
                              </div>
                              <div className="col-md-1">:</div>
                              <div className="col-md-8">
                                <p
                                  className="mb-0"
                                  style={{ textAlign: "right" }}
                                >
                                  {customerDetails.ship_pincode}
                                </p>
                              </div>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-3">
                                <h6 className="mb-0">Country</h6>
                              </div>
                              <div className="col-md-1">:</div>
                              <div className="col-md-8">
                                <p
                                  className="mb-0"
                                  style={{ textAlign: "right" }}
                                >
                                  {customerDetails.ship_country}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-4 bg-grey"
                  style={{
                    backgroundColor: "rgba(22,37,50,255)",
                    borderTopRightRadius: "2vh",
                    borderBottomRightRadius: "2vh",
                  }}
                >
                  <div className="px-3">
                    <h3 className="fw-bold mb-2 mt-4 pt-1">Customer Details</h3>
                    <hr className="my-4" />
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">Status</h6>
                      {customerDetails.status == "Active" ? (
                        <i className="fa fa-check-circle text-success">
                          &nbsp;ACTIVE
                        </i>
                      ) : (
                        <i className="fa fa-ban text-danger">&nbsp;INACTIVE</i>
                      )}
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">GST Type</h6>
                      {customerDetails.gst_type}
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">GSTIN</h6>
                      {customerDetails.gstin}
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">PAN</h6>
                      {customerDetails.pan_no}
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">Opening Bal.</h6>
                      {customerDetails.opening_balance}
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">Credit Limit</h6>
                      {customerDetails.credit_limit}
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">Balance</h6>
                      {customerDetails.current_balance}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="transaction" style={{ display: "none" }}>
              <div id="printContent">
                <center>
                  <h3 className="mt-3 text-uppercase">
                    {customerDetails.first_name} {customerDetails.last_name} -
                    TRANSACTIONS
                  </h3>
                </center>
                <div className="row mt-5">
                  <div className="col d-flex justify-content-between px-5">
                    <div className="customer_data">
                      <p>Email: {customerDetails.email}</p>
                      <p>GSTIN: {customerDetails.gstin}</p>
                      <p>
                        Address:
                        <br />
                        {customerDetails.billing_street},{" "}
                        {customerDetails.billing_city},{" "}
                        {customerDetails.billing_state} <br />
                        {customerDetails.billing_country}-
                        {customerDetails.billing_pincode}
                      </p>
                    </div>
                    <div className="customer_data">
                      <p>Mobile: {customerDetails.mobile}</p>
                      <p>Credit Limit: {customerDetails.credit_limit}</p>
                      <p>Balance: {"{BALANCE|floatformat:2 }"}</p>
                    </div>
                  </div>
                </div>
                <div className="table-responsive px-2">
                  <table className="table table-bordered" id="transactionTable">
                    <thead>
                      <tr>
                        <th className="text-center text-uppercase">
                          Transaction
                        </th>
                        <th className="text-center text-uppercase">Type</th>
                        <th className="text-center text-uppercase">Number</th>
                        <th className="text-center text-uppercase">Date</th>
                        <th className="text-center text-uppercase">Total</th>
                        <th className="text-center text-uppercase">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {% for t in transactions %} */}
                      <tr>
                        <td style={{ textAlign: "center" }}>
                          {"{forloop.counter}"}
                        </td>
                        <td style={{ textAlign: "center" }}>{"{t.type}"}</td>
                        <td style={{ textAlign: "center" }}>{"{t.number}"}</td>
                        <td style={{ textAlign: "center" }}> {"{t.date}"} </td>
                        <td style={{ textAlign: "center" }}> {"{t.total}"} </td>
                        <td style={{ textAlign: "center" }}>
                          {" "}
                          {"{t.balance}"}{" "}
                        </td>
                      </tr>
                      {/* {% endfor %} */}
                    </tbody>
                  </table>
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
                      placeholder="This message will be sent along with Bill details."
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

      {/* <!-- Add Comments Modal --> */}
      <div
        className="modal fade"
        id="commentModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h3 className="modal-title" id="exampleModalLabel">
                Add Comments
              </h3>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <form onSubmit={saveItemComment} className="px-1">
              <div className="modal-body w-100">
                <textarea
                  type="text"
                  className="form-control"
                  name="comment"
                  value={comment}
                  required
                  onChange={(e) => setComment(e.target.value)}
                />
                {comments.length > 0 ? (
                  <div className="container-fluid">
                    <table className="table mt-4">
                      <thead>
                        <tr>
                          <th className="text-center">sl no.</th>
                          <th className="text-center">Comment</th>
                          <th className="text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comments.map((c, index) => (
                          <tr className="table-row">
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">{c.comments}</td>
                            <td className="text-center">
                              <a
                                className="text-danger"
                                onClick={() => deleteComment(`${c.id}`)}
                              >
                                <i
                                  className="fa fa-trash"
                                  style={{
                                    fontSize: "1.1rem",
                                    cursor: "pointer",
                                  }}
                                ></i>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <span className="my-2 font-weight-bold d-flex justify-content-center">
                    No Comments.!
                  </span>
                )}
              </div>

              <div className="modal-footer w-100">
                <button
                  type="button"
                  style={{ width: "fit-content", height: "fit-content" }}
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  style={{ width: "fit-content", height: "fit-content" }}
                  className="btn"
                  id="commentSaveBtn"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewCustomer;
