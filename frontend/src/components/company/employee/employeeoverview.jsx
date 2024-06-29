import React, { useEffect, useState,useRef } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import "../../styles/employee.css";


function ViewEmployee() {
    const baseURL = 'http://127.0.0.1:8000';

    const ID = Cookies.get("Login_id");
    const { itemId } = useParams();
    const navigate = useNavigate();
    const [itemDetails, setItemDetails] = useState({});
    const [comments, setComments] = useState([]);
    const [history, setHistory] = useState({
      action: "",
      date: "",
      doneBy: "",
    });
    const currentUrl = window.location.href;
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        currentUrl
    )}`;
    const fetchItemDetails = () => {
        axios
          .get(`${config.base_url}/fetch_employee_details/${itemId}/`)
          .then((res) => {
            console.log("ITEM DATA=", res);
            if (res.data.status) {
              var itm = res.data.item;
              var hist = res.data.history;
              var cmt = res.data.comments;
              setComments([]);
              cmt.map((c) => {
                setComments((prevState) => [...prevState, c]);
              });
              setItemDetails(itm);
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
        fetchItemDetails();
      }, []);
      const changeStatus = (status) => {
        var st = {
          id: itemId,
          status: status,
        };
        axios
          .post(`${config.base_url}/change_Employee_status/`, st)
          .then((res) => {
            console.log(res);
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Status Updated",
              });
              fetchItemDetails();
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
      const [comment, setComment] = useState("");
      const saveItemComment = (e) => {
        e.preventDefault();
        var cmt = {
          Id: ID,
          item: itemId,
          comments: comment,
        };
        axios
          .post(`${config.base_url}/Fin_addEmployeeComment/`, cmt)
          .then((res) => {
            console.log(res);
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Comment Added",
              });
              setComment("");
              fetchItemDetails();
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
    
     
    
    
      function itemTransactionPdf() {
        axios
          .get(`${config.base_url}/employee_transaction_pdf/${itemId}/${ID}/`, {
            responseType: "blob",
          })
          .then((res) => {
            console.log("PDF RES=", res);
    
            const file = new Blob([res.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = fileURL;
            a.download = `EMPLOYEE_DETAILS.pdf`;
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
    
    
      function handleDeleteItem(id) {
        Swal.fire({
          title: `Delete  - ${itemDetails.first_name}?`,
          text: "All transactions will be deleted.!",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#3085d6",
          confirmButtonColor: "#d33",
          confirmButtonText: "Delete",
        }).then((result) => {
          if (result.isConfirmed) {
            axios
              .delete(`${config.base_url}/delete_employee/${id}/`)
              .then((res) => {
                console.log(res);
    
                Toast.fire({
                  icon: "success",
                  title: "Employee Deleted successfully",
                });
                navigate("/employee");
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
              .delete(`${config.base_url}/delete_employee_comment/${id}/`)
              .then((res) => {
                console.log(res);
    
                Toast.fire({
                  icon: "success",
                  title: "Comment Deleted",
                });
                fetchItemDetails();
              })
              .catch((err) => {
                console.log(err);
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
              itemId: itemId,
              Id: ID,
              email_ids: emailIds,
              email_message: emailMessage,
            };
            axios
              .post(`${config.base_url}/share_employee_transactions_email/`, em)
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
      function printSection(sectionId) {
        var transactionElements = document.querySelectorAll(
          "#transaction, #transaction *"
        );
       
    
        var printContents = document.getElementById(sectionId).innerHTML;
    
        var printerDiv = document.createElement("div");
        printerDiv.className = "printContainer";
        printerDiv.innerHTML = printContents;
    
        document.body.appendChild(printerDiv);
        document.body.classList.add("printingContent");
    
        window.print();
    
        document.body.removeChild(printerDiv);
        document.body.classList.remove("printingContent");
    
       
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
          <style>
             
              .printContent {
                  color: #0b0303;
                  background-color: #f9f9f9;
                  padding: 20px;
                  border: 1px solid #ccc;
              }
              .printContent h1 {
                  color: #020910;
              }
              .printContent p {
                  color: #0d0202;
              }
          </style>
      `);
        printWindow.document.write("</head>");
        printWindow.document.write("<body>");
        printWindow.document.write(divToPrint.outerHTML);
        printWindow.document.write("</body>");
        printWindow.document.write("</html>");
        printWindow.document.close();
        printWindow.print();
        printWindow.addEventListener('afterprint', function() {
          printWindow.close();
        });
    
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
              to="/employee"
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
                          id="overviewBtn"
                        >
                          Overview
                        </a>
                       
                      </div>
    
                      <div className="col-md-6 d-flex justify-content-end">
                        {itemDetails.employee_status == "Inactive" ? (
                          <a
                             onClick={() => changeStatus("Active")}
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
                             onClick={() => changeStatus("Inactive")}
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
                           onClick={itemTransactionPdf}
                          className="ml-2 btn btn-outline-secondary text-grey fa fa-file"
                          role="button"
                          id="pdfBtn"
                          style={{
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
                            {/* <li
                              style={{
                                textAlign: "center",
                                color: "#e5e9ec",
                                cursor: "pointer",
                              }}
                            >
                              WhatsApp
                            </li> */}
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
                          to={`/edit_employee/${itemId}/`}
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
                          onClick={() => handleDeleteItem(`${itemDetails.id}`)}
                          style={{ height: "fit-content", width: "fit-content" }}
                        >
                          &nbsp;Delete
                        </a>
                        <a
                          href="#"
                          className="ml-2 btn btn-outline-secondary text-grey fa fa-comments"
                          id="commentBtn"
                          role="button"
                          style={{
                            display: "block",
                            height: "fit-content",
                            width: "fit-content",
                          }}
                          data-toggle="modal"
                          data-target="#commentModal"
                        >
                          &nbsp;Comment
                        </a>
                        <Link
                          to={`/employee_history/${itemId}/`}
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
                    <h3
                      className="card-title"
                      style={{ textTransform: "Uppercase" }}
                    >
                      EMPLOYEE OVERVIEW
                    </h3>
                    {itemDetails.employee_status == "Inactive" ? (
                      <h6
                        className="blinking-text"
                        style={{ color: "red", width: "140px", fontWeight: "bold" }}
                      >
                        INACTIVE
                      </h6>
                    ) : (
                      <h6
                        style={{
                          width: "140px",
                          color: "green",
                          fontWeight: "bold",
                        }}
                      >
                        ACTIVE
                      </h6>
                    )}
                  </center>
                </div>
              </div>
            </div>
            <div id="transaction" >
            <div id="printContent">
            <div
              className="card card-registration card-registration-2"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body p-0">
                <div id="overview" >
                  <div
                    className="row g-0"
                    style={{ marginLeft: "1px", marginRight: "1px" }}
                  >
                    <div className="col-lg-6">
                      <div className="history_highlight px-4 pt-4 d-flex">
                        <div className="col-8 d-flex justify-content-start">
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
                        <div className="col-4 d-flex justify-content-end">
                          <span>{history.date}</span>
                        </div>
                      </div>
                      <div>
                    <label id="nameEmploy" hidden>
                      {itemDetails.first_name}_{itemDetails.last_name}
                    </label>
                  </div>
                  <div className="d-flex flex-column align-items-center text-center p-3">
                  {itemDetails.upload_image && (
                    <img
                      className="rounded-circle"
                      width="150px"
                      height="150px"
                      src={`${config.base_url}/${itemDetails.upload_image}`} 

                      alt="Employee"
                    />
                  )}
                  <span
                    className="font-weight-bold"
                    style={{ fontSize: 'x-large', textTransform: 'capitalize' }}
                  >
                    {itemDetails.title}. {itemDetails.first_name} {itemDetails.last_name}
                  </span>
                </div>
                      <div className="p-5 pt-2">
                        <center>
                          <h4>Personal Info </h4>
                        </center>
                        <hr />
                        {itemDetails.alias && (
                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: 'white' }}> Alias </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p
                                style={{
                                  color: 'white',
                                  fontSize: '15px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {itemDetails.alias}
                              </p>
                            </div>
                          </div>
                        )}
                               {itemDetails.employee_number && (
                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: 'white' }}> Employee Number </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p
                                style={{
                                  color: 'white',
                                  fontSize: '15px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {itemDetails.employee_number}
                              </p>
                            </div>
                          </div>
                        )}
                         {itemDetails.date_of_joining && (
                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: 'white' }}> Joining Date </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p
                                style={{
                                  color: 'white',
                                  fontSize: '15px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {itemDetails.date_of_joining}
                              </p>
                            </div>
                          </div>
                        )}
                          {itemDetails.employee_designation && (
                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: 'white' }}> Designation </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p
                                style={{
                                  color: 'white',
                                  fontSize: '15px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {itemDetails.employee_designation}
                              </p>
                            </div>
                          </div>
                        )}
                        {itemDetails.date_of_birth && (
                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: 'white' }}> Date Of birth </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p
                                style={{
                                  color: 'white',
                                  fontSize: '15px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {itemDetails.date_of_birth}
                              </p>
                            </div>
                          </div>
                        )}
                        {itemDetails.gender && (
                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: 'white' }}> Gender </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p
                                style={{
                                  color: 'white',
                                  fontSize: '15px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {itemDetails.gender}
                              </p>
                            </div>
                          </div>
                        )}
                        {itemDetails.blood_group && (
                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: 'white' }}> Blood Group </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p
                                style={{
                                  color: 'white',
                                  fontSize: '15px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {itemDetails.blood_group}
                              </p>
                            </div>
                          </div>
                        )}
                        {itemDetails.mobile && (
                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: 'white' }}>  Contact </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p
                                style={{
                                  color: 'white',
                                  fontSize: '15px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {itemDetails.mobile}
                              </p>
                            </div>
                          </div>
                        )}
    
                       {itemDetails.emergency_contact && (
                        <div className="row mb-3">
                          <div className="col-4 d-flex justify-content-start">
                            <label style={{ color: "white" }}> Emergency Contact </label>
                          </div>
                          <div className="col-4 d-flex justify-content-center">
                            <p>:</p>
                          </div>
                          <div className="col-4 d-flex justify-content-start">
                            <p
                              style={{
                                color: "white",
                                fontSize: "15px",
                                textTransform: "Uppercase",
                              }}
                            >
                              {itemDetails.emergency_contact}
                            </p>
                          </div>
                        </div>
                        )}
                         {itemDetails.employee_mail && (
                        <div className="row mb-3">
                          <div className="col-4 d-flex justify-content-start">
                            <label style={{ color: "white" }}> Email </label>
                          </div>
                          <div className="col-4 d-flex justify-content-center">
                            <p>:</p>
                          </div>
                          <div className="col-4 d-flex justify-content-start">
                            <p
                              style={{
                                color: "white",
                                fontSize: "15px",
                                textTransform: "Uppercase",
                              }}
                            >
                              {itemDetails.employee_mail}
                            </p>
                          </div>
                        </div>
                        )} {itemDetails.fathers_name_mothers_name && (
                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: "white" }}> Father/Mother's Name </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  textTransform: "Uppercase",
                                }}
                              >
                                {itemDetails.fathers_name_mothers_name}
                              </p>
                            </div>
                          </div>
                          )} {itemDetails.spouse_name && (
                            <div className="row mb-3">
                              <div className="col-4 d-flex justify-content-start">
                                <label style={{ color: "white" }}> Spouse Name </label>
                              </div>
                              <div className="col-4 d-flex justify-content-center">
                                <p>:</p>
                              </div>
                              <div className="col-4 d-flex justify-content-start">
                                <p
                                  style={{
                                    color: "white",
                                    fontSize: "15px",
                                    textTransform: "Uppercase",
                                  }}
                                >
                                  {itemDetails.spouse_name}
                                </p>
                              </div>
                            </div>
                            )} 
                            {itemDetails.employee_current_location && (
                              <div className="row mb-3">
                                <div className="col-4 d-flex justify-content-start">
                                  <label style={{ color: "white" }}> Current Location </label>
                                </div>
                                <div className="col-4 d-flex justify-content-center">
                                  <p>:</p>
                                </div>
                                <div className="col-4 d-flex justify-content-start">
                                  <p
                                    style={{
                                      color: "white",
                                      fontSize: "15px",
                                      textTransform: "Uppercase",
                                    }}
                                  >
                                    {itemDetails.employee_current_location}
                                  </p>
                                </div>
                              </div>
                              )}
                              {(itemDetails.street || itemDetails.city || itemDetails.state || itemDetails.pincode || itemDetails.country) && (
                              <div className="row mb-3">
                                <div className="col-4 d-flex justify-content-start">
                                  <label style={{ color: 'white' }}> Permanent Address </label>
                                </div>
                                <div className="col-4 d-flex justify-content-center">
                                  <p>:</p>
                                </div>
                                <div className="col-4 d-flex justify-content-start">
                                  <p
                                    style={{
                                      color: 'white',
                                      fontSize: '15px',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                     {itemDetails.street && `${itemDetails.street},`}<br></br>
                                    {itemDetails.city && `${itemDetails.city},`}
                                    {itemDetails.state && `${itemDetails.state},`}<br></br>
                                    {itemDetails.pincode && `${itemDetails.pincode},`}
                                    {itemDetails.country && itemDetails.country}
                                  </p>
                                </div>
                              </div>
                            )}
                        
                     
                        {(itemDetails.temporary_street || itemDetails.temporary_city || itemDetails.temporary_state || itemDetails.temporary_pincode || itemDetails.temporary_country) && (
                              <div className="row mb-3">
                                <div className="col-4 d-flex justify-content-start">
                                  <label style={{ color: 'white' }}> Temporary Address</label>
                                </div>
                                <div className="col-4 d-flex justify-content-center">
                                  <p>:</p>
                                </div>
                                <div className="col-4 d-flex justify-content-start">
                                  <p
                                    style={{
                                      color: 'white',
                                      fontSize: '15px',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    {itemDetails.street && `${itemDetails.temporary_street},`}<br></br>
                                    {itemDetails.city && `${itemDetails.temporary_city},`}
                                    {itemDetails.state && `${itemDetails.temporary_state},`}<br></br>
                                    {itemDetails.pincode && `${itemDetails.temporary_pincode},`}
                                    {itemDetails.country && itemDetails.temporary_country}
                                  </p>
                                </div>
                              </div>
                            )}
                      </div>
                    </div>
    
                    <div
                      className="col-md-6"
                      style={{
                        backgroundColor: "rgba(22,37,50,255)",
                        borderTopRightRadius: "2vh",
                        borderBottomRightRadius: "2vh",
                      }}
                    >
                      <div className="px-5 py-4">
                        <center>
                          <h4>SALARY INFORMATION </h4>
                        </center>
                        <hr />
                        {itemDetails.employee_salary_type && (
                        <div className="row mb-3">
                          <div className="col-4 d-flex justify-content-start">
                            <label style={{ color: "white" }}>Salary Type</label>
                          </div>
                          <div className="col-4 d-flex justify-content-center">
                            <p>:</p>
                          </div>
                          <div className="col-4 d-flex justify-content-start">
                            <p
                              style={{
                                color: "white",
                                fontSize: "15px",
                                textTransform: "Uppercase",
                              }}
                            >
                               {itemDetails.employee_salary_type}
                            </p>
                          </div>
                        </div>
                        )}
                        {itemDetails.employee_salary_type !== null && (
                          <>
                           {itemDetails.employee_salary_type === 'Time Based' && (
                            <>
                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: "white" }}>
                              Total Working Hours
                              </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  textTransform: "Uppercase",
                                }}
                              >
                                {itemDetails.total_working_hours}
                              </p>
                            </div>
                          </div>
                          <div className="row mb-5">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: "white" }}>
                              Amount Per Hour
                              </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p style={{ color: "white", fontSize: "15px" }}>
                                {itemDetails.amount_per_hour}
                              </p>
                            </div>
                          </div>
                          </>
                        )}
                        <div className="row mb-3">
                          <div className="col-4 d-flex justify-content-start">
                            <label style={{ color: "white" }}>Employee Salary</label>
                          </div>
                          <div className="col-4 d-flex justify-content-center">
                            <p>:</p>
                          </div>
                          <div className="col-4 d-flex justify-content-start">
                            <p
                              style={{
                                color: "white",
                                fontSize: "15px",
                                textTransform: "Uppercase",
                              }}
                            >
                               {itemDetails.salary_amount}
                            </p>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-4 d-flex justify-content-start">
                            <label style={{ color: "white" }}>Salary Date Range</label>
                          </div>
                          <div className="col-4 d-flex justify-content-center">
                            <p>:</p>
                          </div>
                          <div className="col-4 d-flex justify-content-start">
                            <p
                              style={{
                                color: "white",
                                fontSize: "15px",
                                textTransform: "Uppercase",
                              }}
                            >
                               {itemDetails.salary_effective_from}
                            </p>
                          </div>
                        </div>
                        </>
                            )}
                            {itemDetails.tds_type === 'Percentage' && (
                              <div className="row mb-3">
                                <div className="col-4 d-flex justify-content-start">
                                  <label style={{ color: 'white' }}>TDS Percentage</label>
                                </div>
                                <div className="col-4 d-flex justify-content-center">
                                  <p>:</p>
                                </div>
                                <div className="col-4 d-flex justify-content-start">
                                  <p style={{ color: 'white', fontSize: '15px', textTransform: 'uppercase' }}>
                                    {itemDetails.percentage_amount}
                                  </p>
                                </div>
                              </div>
                            )}

                            {itemDetails.tds_type === 'Amount' && (
                              <div className="row mb-3">
                                <div className="col-4 d-flex justify-content-start">
                                  <label style={{ color: 'white' }}>TDS Amount</label>
                                </div>
                                <div className="col-4 d-flex justify-content-center">
                                  <p>:</p>
                                </div>
                                <div className="col-4 d-flex justify-content-start">
                                  <p style={{ color: 'white', fontSize: '15px', textTransform: 'uppercase' }}>
                                    {itemDetails.percentage_amount}
                                  </p>
                                </div>
                              </div>
                            )}
                          
                        <center>
                          <h4>STATUTORY INFORMATION </h4>
                        </center>
                        <hr />
                        {itemDetails.income_tax_number && (

                        <div className="row mb-3">
                          <div className="col-4 d-flex justify-content-start">
                            <label style={{ color: "white" }}>Income Tax Number</label>
                          </div>
                          <div className="col-4 d-flex justify-content-center">
                            <p>:</p>
                          </div>
                          <div className="col-4 d-flex justify-content-start">
                            <p
                              style={{
                                color: "white",
                                fontSize: "15px",
                                textTransform: "Uppercase",
                              }}
                            >
                            {itemDetails.income_tax_number}
                            </p>
                          </div>
                        </div>
                        )}
                        {itemDetails.aadhar_number && (
                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: "white" }}>Aadhar Number</label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  textTransform: "Uppercase",
                                }}
                              >
                                {itemDetails.aadhar_number}
                              </p>
                            </div>
                          </div>
                        )}
                        {itemDetails.universal_account_number && (
                          <div className="row mb-5">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: "white" }}>
                              Universal Account Number
                              </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p style={{ color: "white", fontSize: "15px" }}>
                                {itemDetails.universal_account_number}
                              </p>
                            </div>
                          </div>
                        )}
                         {itemDetails.pan_number && (
                          <div className="row mb-5">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: "white" }}>
                              PAN Number
                              </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p style={{ color: "white", fontSize: "15px" }}>
                                {itemDetails.pan_number}
                              </p>
                            </div>
                          </div>
                        )}
                         {itemDetails.pf_account_number && (
                          <div className="row mb-5">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: "white" }}>
                              PF Account Number
                              </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p style={{ color: "white", fontSize: "15px" }}>
                                {itemDetails.pf_account_number}
                              </p>
                            </div>
                          </div>
                        )}
                        {itemDetails.pr_account_number && (
                          <div className="row mb-5">
                            <div className="col-4 d-flex justify-content-start">
                              <label style={{ color: "white" }}>
                              PR Account Number
                              </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-start">
                              <p style={{ color: "white", fontSize: "15px" }}>
                                {itemDetails.pr_account_number}
                              </p>
                            </div>
                          </div>
                        )}
                         {itemDetails.provide_bank_details === 'Yes' && (
                          <>
                          
                            <center>
                              <h4>Bank Details</h4>
                            </center>
                            <hr />

                            <div className="row mb-3">
                              <div className="col-4 d-flex justify-content-start">
                                <label style={{ color: 'white' }}>Account Number</label>
                              </div>
                              <div className="col-4 d-flex justify-content-center">
                                <p>:</p>
                              </div>
                              <div className="col-4 d-flex justify-content-start">
                                <p style={{ color: 'white', fontSize: '15px', textTransform: 'uppercase' }}>
                                  {itemDetails.account_number}
                                </p>
                              </div>
                            </div>

                            <div className="row mb-3">
                              <div className="col-4 d-flex justify-content-start">
                                <label style={{ color: 'white' }}>IFSC</label>
                              </div>
                              <div className="col-4 d-flex justify-content-center">
                                <p>:</p>
                              </div>
                              <div className="col-4 d-flex justify-content-start">
                                <p style={{ color: 'white', fontSize: '15px', textTransform: 'uppercase' }}>
                                  {itemDetails.ifsc}
                                </p>
                              </div>
                            </div>

                            <div className="row mb-3">
                              <div className="col-4 d-flex justify-content-start">
                                <label style={{ color: 'white' }}>Bank Name</label>
                              </div>
                              <div className="col-4 d-flex justify-content-center">
                                <p>:</p>
                              </div>
                              <div className="col-4 d-flex justify-content-start">
                                <p style={{ color: 'white', fontSize: '15px', textTransform: 'uppercase' }}>
                                  {itemDetails.name_of_bank}
                                </p>
                              </div>
                            </div>

                            <div className="row mb-3">
                              <div className="col-4 d-flex justify-content-start">
                                <label style={{ color: 'white' }}>Branch Name</label>
                              </div>
                              <div className="col-4 d-flex justify-content-center">
                                <p>:</p>
                              </div>
                              <div className="col-4 d-flex justify-content-start">
                                <p style={{ color: 'white', fontSize: '15px', textTransform: 'uppercase' }}>
                                  {itemDetails.branch_name}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
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
                                <td className="text-center">{c.comment}</td>
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
    
    export default ViewEmployee;