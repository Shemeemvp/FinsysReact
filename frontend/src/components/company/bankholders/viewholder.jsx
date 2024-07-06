import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import "../../styles/bankholder.css";

function Viewholder() {
    const ID = Cookies.get("Login_id");
    const { holderId } = useParams();
    const [holderDetails, setHolderDetails] = useState({});
    const [comments, setComments] = useState([]);
    const navigate = useNavigate()
    // const [comments, setComments] = useState([]);
     const [history, setHistory] = useState({});
  
    const fetchHolderDetails = () => {
      axios
        .get(`${config.base_url}/fetch_holder_details/${holderId}/`)
        .then((res) => {
          console.log("HOLDER DATA=", res);
          if (res.data.status) {
            var itm = res.data.item;
            var hist = res.data.history;
            var cmt = res.data.comments;
            
            // Set holder details to state
            setHolderDetails(itm);
            console.log(holderDetails.status)
            
            // Example for setting comments if needed
             setComments([]);
             cmt.map((c) => {
              setComments((prevState) => [...prevState, c]);
             });
  
            // Example for setting history if needed
             if (hist) {
               setHistory(hist);
             }
            
            // Additional logic related to your component
  
            // Example: Calling another function after setting state
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
    fetchHolderDetails();
  }, []);

  const currentUrl = window.location.href;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    currentUrl
  )}`;

  const changeStatus = (status) => {
    var st = {
      id: holderId,
      status: status,
    };
    axios
      .post(`${config.base_url}/change_holder_status/`, st)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Status Updated",
          });
          fetchHolderDetails();
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

  function handleDeleteHolder(id) {
    Swal.fire({
      title: `Delete Bank Holder - ${holderDetails.Holder_name}?`,
      
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_holder/${id}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Bank Holder Deleted successfully",
            });
            navigate("/banklist");
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
      Holder: holderId,
      comment: comment,
    };
    axios
      .post(`${config.base_url}/add_holder_comment/`, cmt)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Comment Added",
          });
          setComment("");
          fetchHolderDetails();
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
          .delete(`${config.base_url}/delete_holder_comment/${id}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Comment Deleted",
            });
            fetchHolderDetails();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }


  
  function overview() {
    document.getElementById("overview").style.display = "block";
    document.getElementById("transaction").style.display = "none";
    document.getElementById("printBtn").style.display = "block";
    document.getElementById("pdfBtn").style.display = "none";
    document.getElementById("shareBtn").style.display = "none";
    document.getElementById("editBtn").style.display = "block";
    document.getElementById("deleteBtn").style.display = "block";
    document.getElementById("historyBtn").style.display = "block";
    document.getElementById("commentBtn").style.display = "block";
    document.getElementById("statusBtn").style.display = "block";
    document.getElementById("overviewBtn").style.backgroundColor =
      "rgba(22,37,50,255)";
    document.getElementById("transactionBtn").style.backgroundColor =
      "transparent";
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

    printWindow.document.write("<html><head><title>Print Preview</title>");
    printWindow.document.write(`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Agbalumo&family=Black+Ops+One&family=Gluten:wght@100..900&family=Playball&display=swap" rel="stylesheet">
        <style>
            #p1 {
                font-size: 17px !important; /* Ensure to add a semicolon after each property */
                color: black !important;
            }
            label {
                color: black !important;
            }
            body {
                font-size: 17px !important;
            }
        </style>
    `);
    printWindow.document.write("</head><body>");
    printWindow.document.write(divToPrint.outerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
    printWindow.addEventListener('afterprint', function() {
        printWindow.close();
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
      <FinBase />
      <div
        className="page-content mt-0 pt-0"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <Link
          className="d-flex justify-content-end p-2"
          style={{ cursor: "pointer" }}
          to="/banklist"
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
                    
                  </div>

                  <div className="col-md-6 d-flex justify-content-end">
                    {holderDetails.status == "Inactive" ? (
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
                      //onClick={itemTransactionPdf}
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
                      to={`/editholder/${holderId}/`}
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
                      onClick={() => handleDeleteHolder(`${holderDetails.id}`)}
                     
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
                      to={`/bankhistory/${holderId}/`}
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
                  {holderDetails.Holder_name}
                </h3>
                {holderDetails.status == "Inactive" ? (
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

        <div
          className="card card-registration card-registration-2"
          style={{ borderRadius: "15px" }}
          id='printContent'
        >
          <div className="card-body p-0">
            <div id="overview">
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
                  <div className="p-5 pt-2">
                    <center>
                      <h4>BANK DETAILS </h4>
                    </center>
                    <hr />
                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}> Bank Name </label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            textTransform: "Uppercase",
                            
                          }}
                        >
                          {holderDetails.Bank_name}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}> Account No </label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            textTransform: "Uppercase",
                          }}
                        >
                          {holderDetails.Account_number}
                        </p>
                      </div>
                    </div>

                    

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>IFSC Code</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            textTransform: "Uppercase",
                          }}
                        >
                          {holderDetails.Ifsc_code}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>
                          Swift Code
                        </label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            textTransform: "Uppercase",
                          }}
                        >
                           {holderDetails.Swift_code}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>
                         Branch Name
                        </label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            textTransform: "Uppercase",
                          }}
                        >
                           {holderDetails.Branch_name}
                        </p>
                      </div>
                    </div>

                   
                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Set Cheque Book Range</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                       
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            textTransform: "Uppercase",
                          }}
                        >
                          {holderDetails.Set_cheque_book_range === true ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                   
                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Enable Cheque Printing</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                       
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            textTransform: "Uppercase",
                          }}
                        >
                          {holderDetails.Enable_cheque_printing === true ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Cheque Printing Configuration</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                       
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            textTransform: "Uppercase",
                          }}
                        >
                          {holderDetails.Set_cheque_printing_configuration === true ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-2">
                    <center>
                      <h4>TAX DETAILS </h4>
                    </center>
                    <hr /></div>
                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}> PAN Number </label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            textTransform: "Uppercase",
                          }}
                        >
                          {holderDetails.Pan_it_number}
                        </p>
                      </div>
                    </div>
                   
                   

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>GST Type</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            textTransform: "Uppercase",
                          }}
                        >
                          {holderDetails.Registration_type}
                        </p>
                      </div>
                    </div>



                    {(holderDetails.Registration_type === "Regular" || holderDetails.Registration_type === "Composition") && (
  <div className="row mb-3">
    <div className="col-4 d-flex justify-content-start">
      <label style={{ color: "white" }}>GST Number</label>
    </div>
    <div className="col-4 d-flex justify-content-center">
      <p>:</p>
    </div>
    <div className="col-4 d-flex justify-content-start">
      <p id="p1"
        style={{
          color: "white",
          fontSize: "15px",
        }}
      >
        {holderDetails.Gstin_un}
      </p>
    </div>
  </div>
)}

                 <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Alter GST Details</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            textTransform: "Uppercase",
                          }}
                        >
                          {holderDetails.Set_alter_gst_details === true ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>

                    
                
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
                      <h4>BANK HOLDER DETAILS </h4>
                    </center>
                    <hr />

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Holder Name</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            
                          }}
                        >
                          {holderDetails.Holder_name}
                        </p>
                      </div>
                    </div>
                    {holderDetails.Alias &&(
                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Alias</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            
                          }}
                      
                        >
                          {holderDetails.Alias}
                        </p>
                      </div>
                    </div>
                    )}

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Phone Number</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            
                          }}
                        >
                          {holderDetails.phone_number}
                        </p>
                      </div>
                    </div>


                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Email</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            
                          }}
                        >
                          {holderDetails.Email}
                        </p>
                      </div>
                    </div>

                          
                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Account Type</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            
                          }}
                        >
                          {holderDetails.Account_type === "BA" ? "Bank Account" : "Credit Card"}
                        </p>
                      </div>
                    </div>



                    
                  <div className="px-5 py-4">
                    <center>
                      <h4>MAILING ADDRESS </h4>
                    </center>
                    <hr /></div>
                    
                    {holderDetails.Mailing_name && (
                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Mailing Name</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            
                          }}
                        >
                          {holderDetails.Mailing_name}
                        </p>
                      </div>
                    </div>)}


                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Address</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            
                          }}
                        >
                          {holderDetails.Address}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Country</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            
                          }}
                        >
                          {holderDetails.Country}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>State</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            
                          }}
                        >
                          {holderDetails.State}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>PIN</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            
                          }}
                        >
                          {holderDetails.Pin}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 py-4">
                    <center>
                      <h4>OPENING BALANCE DETAILS </h4>
                    </center>
                    <hr /></div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Amount</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            
                          }}
                        >
                          {holderDetails.Amount}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Type</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            
                          }}
                        >
                          {holderDetails.Open_type}
                        </p>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Date</label>
                      </div>
                      <div className="col-4 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p id="p1"
                          style={{
                            color: "white",
                            fontSize: "15px",
                            
                          }}
                        >
                          {holderDetails.date}
                        </p>
                      </div>
                    </div>





                    

                    
                  </div>
                </div>
                
              </div>
            </div>
           

            <div id="transaction" style={{ display: "none" }}>
              <div id="printContent">
                <center>
                  <h3 className="mt-3 text-uppercase">
                   - TRANSACTIONS
                  </h3>
                </center>
                <div className="row mt-5">
                  <div className="col d-flex justify-content-between px-5">
                    <div className="item_data">
                      <p>Selling Price: </p>
                      <p>Purchase Price: </p>
                      <p>Min Stock to Maintain: </p>
                    </div>
                    <div className="item_data">
                      <p>Stock Quantity: </p>
                      <p>
                        Stock Value: <span id="stockValue">0</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="table-responsive px-2">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th className="text-center">Sl No.</th>
                        <th className="text-center">Type</th>
                        <th className="text-center">Name</th>
                        <th className="text-center">Date</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {% for i in transactions %} */}
                      {/* <tr>
                        <td style={{ textAlign: "center" }}>
                          {"{forloop.counter}"}
                        </td>
                        <td style={{ textAlign: "center" }}>{"{i.type}"}</td>
                        <td style={{ textAlign: "center" }}>{"{i.name}"}</td>
                        <td style={{ textAlign: "center" }}>
                          {"{i.date|date:'d-m-Y'}"}
                        </td>
                        <td style={{ textAlign: "center" }}>{"{i.qty}"}</td>
                        <td style={{ textAlign: "center" }}>{"{i.price}"}</td>
                        <td style={{ textAlign: "center" }}>{"{i.status}"}</td>
                      </tr> */}
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
                //onSubmit={handleShareEmail}
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
                      //value={emailIds}
                     // onChange={(e) => setEmailIds(e.target.value)}
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
                      //value={emailMessage}
                      //onChange={(e) => setEmailMessage(e.target.value)}
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

export default Viewholder;
