import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import html2pdf from "html2pdf.js";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import "../../styles/SalesOrder.css";

function ViewRecInvoice() {
  const ID = Cookies.get("Login_id");
  const { invoiceId } = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [otherDetails, setOtherDetails] = useState({});
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState({
    action: "",
    date: "",
    doneBy: "",
  });

  const [fileUrl, setFileUrl] = useState(null);

  const fetchRecInvoiceDetails = () => {
    axios
      .get(`${config.base_url}/fetch_rec_invoice_details/${invoiceId}/`)
      .then((res) => {
        console.log("INV DATA=", res);
        if (res.data.status) {
          var invoice = res.data.invoice;
          var hist = res.data.history;
          var cmt = res.data.comments;
          var itms = res.data.items;
          var other = res.data.otherDetails;
          if (invoice.file) {
            var url = `${config.base_url}/${invoice.file}`;
            setFileUrl(url);
          }

          setOtherDetails(other);
          setInvoiceItems([]);
          setComments([]);
          itms.map((i) => {
            setInvoiceItems((prevState) => [...prevState, i]);
          });
          cmt.map((c) => {
            setComments((prevState) => [...prevState, c]);
          });
          setInvoiceDetails(invoice);
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
    fetchRecInvoiceDetails();
  }, []);

  const currentUrl = window.location.href;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    currentUrl
  )}`;

  const navigate = useNavigate();

  function handleConvertInvoice() {
    Swal.fire({
      title: `Convert Recurring Invoice - ${invoiceDetails.rec_invoice_no}?`,
      text: "Are you sure you want to convert this.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Convert",
    }).then((result) => {
      if (result.isConfirmed) {
        var st = {
          id: invoiceId,
        };
        axios
          .post(`${config.base_url}/change_rec_invoice_status/`, st)
          .then((res) => {
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Converted",
              });
              fetchRecInvoiceDetails();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  const [comment, setComment] = useState("");
  const saveInvoiceComment = (e) => {
    e.preventDefault();
    var cmt = {
      Id: ID,
      RecInvoice: invoiceId,
      comments: comment,
    };
    axios
      .post(`${config.base_url}/add_rec_invoice_comment/`, cmt)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Comment Added",
          });
          setComment("");
          fetchRecInvoiceDetails();
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

  function handleDeleteRecInvoice(id) {
    Swal.fire({
      title: `Delete Recurring Invoice - ${invoiceDetails.rec_invoice_no}?`,
      text: "Data cannot be restored.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_rec_invoice/${id}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Rec. Invoice Deleted.",
            });
            navigate("/rec_invoice");
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
          .delete(`${config.base_url}/delete_rec_invoice_comment/${id}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Comment Deleted",
            });
            fetchRecInvoiceDetails();
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
    document.getElementById("template").style.display = "none";
    document.getElementById("slip").style.display = "none";
    document.getElementById("printBtn").style.display = "none";
    document.getElementById("slipPrintBtn").style.display = "none";
    document.getElementById("pdfBtn").style.display = "none";
    document.getElementById("slipPdfBtn").style.display = "none";
    document.getElementById("shareBtn").style.display = "none";
    document.getElementById("editBtn").style.display = "block";
    document.getElementById("deleteBtn").style.display = "block";
    document.getElementById("attachBtn").style.display = "block";
    document.getElementById("historyBtn").style.display = "block";
    document.getElementById("commentBtn").style.display = "block";
    if (invoiceDetails.status == "Draft") {
      document.getElementById("statusBtn").style.display = "block";
    }
    document.getElementById("overviewBtn").style.backgroundColor =
      "rgba(22,37,50,255)";
    document.getElementById("templateBtn").style.backgroundColor =
      "transparent";
    document.getElementById("slipBtn").style.backgroundColor = "transparent";
  }

  function template() {
    document.getElementById("overview").style.display = "none";
    document.getElementById("template").style.display = "block";
    document.getElementById("slip").style.display = "none";
    document.getElementById("printBtn").style.display = "block";
    document.getElementById("slipPrintBtn").style.display = "none";
    document.getElementById("pdfBtn").style.display = "block";
    document.getElementById("shareBtn").style.display = "block";
    document.getElementById("editBtn").style.display = "none";
    document.getElementById("deleteBtn").style.display = "none";
    document.getElementById("attachBtn").style.display = "none";
    document.getElementById("historyBtn").style.display = "none";
    document.getElementById("commentBtn").style.display = "none";
    document.getElementById("slipPdfBtn").style.display = "none";
    if (invoiceDetails.status == "Draft") {
      document.getElementById("statusBtn").style.display = "none";
    }
    document.getElementById("overviewBtn").style.backgroundColor =
      "transparent";
    document.getElementById("templateBtn").style.backgroundColor =
      "rgba(22,37,50,255)";
    document.getElementById("slipBtn").style.backgroundColor = "transparent";
  }

  function slip() {
    document.getElementById("overview").style.display = "none";
    document.getElementById("template").style.display = "none";
    document.getElementById("slip").style.display = "block";
    document.getElementById("printBtn").style.display = "none";
    document.getElementById("slipPrintBtn").style.display = "block";
    document.getElementById("pdfBtn").style.display = "none";
    document.getElementById("shareBtn").style.display = "none";
    document.getElementById("editBtn").style.display = "none";
    document.getElementById("deleteBtn").style.display = "none";
    document.getElementById("historyBtn").style.display = "none";
    document.getElementById("attachBtn").style.display = "none";
    document.getElementById("slipPdfBtn").style.display = "block";
    document.getElementById("commentBtn").style.display = "none";
    if (invoiceDetails.status == "Draft") {
      document.getElementById("statusBtn").style.display = "none";
    }
    document.getElementById("overviewBtn").style.backgroundColor =
      "transparent";
    document.getElementById("slipBtn").style.backgroundColor =
      "rgba(22,37,50,255)";
    document.getElementById("templateBtn").style.backgroundColor =
      "transparent";
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

  function printSlip() {
    var divToPrint = document.getElementById("slip_container");
    var printWindow = window.open("", "", "height=700,width=1000");
    var styles = `
    .slip h5 {
  font-family: serif;
}
p {
  font-size: 1.2em;
}
.address {
  display: flex;
  flex-direction: column;
}
.address p,
.slip-footer p {
  font-size: 1rem;
  margin: 0;
}
.slip-container {
  width: 105mm;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px dotted black;
  box-shadow: rgba(60, 64, 67, 0.5) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.35) 0px 2px 6px 2px;
}
.divider {
  margin: 1rem 0;
  border-bottom: 3px dotted black;
}
.trns-id p,
.datetime p,
.createdby p {
  font-size: 0.85rem;
  margin: 0;
}
.equal-length-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 2vh;
  margin-right: 2vh;
}

.equal-length-item {
  flex: 1;
  text-align: center;
}
    `;

    printWindow.document.write("<html><head><title></title>");
    printWindow.document.write(`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Agbalumo&family=Black+Ops+One&family=Gluten:wght@100..900&family=Playball&display=swap" rel="stylesheet">
    `);
    printWindow.document.write("</head>");
    printWindow.document.write("<body>");
    printWindow.document.write("<style>");
    printWindow.document.write(styles);
    printWindow.document.write("</style>");
    printWindow.document.write(divToPrint.outerHTML);
    printWindow.document.write("</body>");
    printWindow.document.write("</html>");
    printWindow.document.close();
    printWindow.print();
    printWindow.addEventListener("afterprint", function () {
      printWindow.close();
    });
  }

  function updateDateTime() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();
    var formattedDay = day < 10 ? `0${day}` : day;
    var formattedMonth = month < 10 ? `0${month}` : month;
    var formattedHours = hours < 10 ? `0${hours}` : hours;
    var formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    var formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    var formattedDateTime = `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    try {
      document.getElementById("dateTimeDisplay").textContent =
        formattedDateTime;
    } catch (err) {
      console.log(err);
    }
  }

  setInterval(updateDateTime, 1000);

  function slipPdf() {
    var invoiceNo = `${invoiceDetails.rec_invoice_no}`;
    var element = document.getElementById("slip");
    var opt = {
      margin: 1,
      filename: "RecurringInvoiceSlip_" + invoiceNo + ".pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  }

  function toggleTemplate(templateId, buttonId) {
    document.querySelectorAll(".printTemplates").forEach(function (ele) {
      ele.style.display = "none";
    });

    document.getElementById(templateId).style.display = "block";

    document.querySelectorAll(".templateToggleButtons").forEach(function (ele) {
      ele.classList.remove("active");
    });

    document.getElementById(buttonId).classList.add("active");

    document.getElementById("page-content").scrollIntoView();
  }

  function invoicePdf() {
    var data = {
      Id: ID,
      inv_id: invoiceId,
    };
    axios
      .get(`${config.base_url}/rec_invoice_pdf/`, {
        responseType: "blob",
        params: data,
      })
      .then((res) => {
        console.log("PDF RES=", res);

        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = `RecurringInvoice_${invoiceDetails.rec_invoice_no}.pdf`;
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
          inv_id: invoiceId,
          Id: ID,
          email_ids: emailIds,
          email_message: emailMessage,
        };
        axios
          .post(`${config.base_url}/share_rec_invoice_email/`, em)
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

  const [file, setFile] = useState(null);

  function handleFileModalSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Id", ID);
    formData.append("inv_id", invoiceId);
    if (file) {
      formData.append("file", file);
    }

    axios
      .post(`${config.base_url}/add_rec_invoice_attachment/`, formData)
      .then((res) => {
        console.log("FILE RES==", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "File Added.",
          });
          setFile(null);
          document.getElementById("fileModalDismiss").click();
          fetchRecInvoiceDetails();
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

  return (
    <>
      <FinBase />
      <div
        className="page-content mt-0 pt-0"
        id="page-content"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <Link
          className="d-flex justify-content-end p-2"
          style={{ cursor: "pointer" }}
          to="/rec_invoice"
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
                      onClick={template}
                      id="templateBtn"
                    >
                      Templates
                    </a>
                    <a
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderRadius: "1vh",
                      }}
                      onClick={slip}
                      id="slipBtn"
                    >
                      Slip
                    </a>
                  </div>

                  <div className="col-md-6 d-flex justify-content-end">
                    {invoiceDetails.status == "Draft" ? (
                      <a
                        onClick={handleConvertInvoice}
                        id="statusBtn"
                        style={{
                          display: "block",
                          height: "fit-content",
                          width: "fit-content",
                        }}
                        className="ml-2 fa fa-check btn btn-outline-secondary text-grey "
                        role="button"
                      >
                        &nbsp;Convert
                      </a>
                    ) : null}
                    <a
                      onClick={invoicePdf}
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
                      onClick={slipPdf}
                      className="ml-2 btn btn-outline-secondary text-grey fa fa-file"
                      role="button"
                      id="slipPdfBtn"
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

                    <a
                      className="ml-2 btn btn-outline-secondary text-grey fa fa-print"
                      role="button"
                      id="slipPrintBtn"
                      style={{
                        display: "none",
                        height: "fit-content",
                        width: "fit-content",
                      }}
                      onClick={() => printSlip()}
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
                      to={`/edit_rec_invoice/${invoiceId}/`}
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
                        handleDeleteRecInvoice(invoiceId)
                      }
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
                    <div
                      className="dropdown p-0 nav-item"
                      id="attachBtn"
                      style={{ display: "block" }}
                    >
                      <li
                        className="ml-2 dropdown-toggle btn btn-outline-secondary text-grey fa fa-paperclip"
                        data-toggle="dropdown"
                        style={{
                          height: "fit-content",
                          width: "fit-content",
                        }}
                      >
                        &nbsp;Attach
                      </li>
                      <ul
                        className="dropdown-menu"
                        style={{ backgroundColor: "black" }}
                      >
                        <a
                          className="dropdown-item fa fa-paperclip"
                          style={{ cursor: "pointer" }}
                          data-toggle="modal"
                          data-target="#attachFileModal"
                        >
                          &nbsp; Attach file
                        </a>
                        {fileUrl ? (
                          <a
                            className="dropdown-item fa fa-download"
                            style={{ cursor: "pointer" }}
                            download
                            target="_blank"
                            href={fileUrl}
                          >
                            &nbsp; Download file
                          </a>
                        ) : null}
                      </ul>
                    </div>
                    <Link
                      to={`/rec_invoice_history/${invoiceId}/`}
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
                  RECURRING INVOICE OVERVIEW
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
              <div
                className="row g-0"
                style={{ marginLeft: "1px", marginRight: "1px" }}
              >
                <div className="col-lg-8">
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
                  <div className="pb-3 px-2">
                    <div className="card-body">
                      <div className="card-title">
                        <div className="row">
                          <div className="col mt-3">
                            <h2 className="mb-0">
                              # {invoiceDetails.rec_invoice_no}
                            </h2>
                          </div>
                        </div>
                      </div>
                      <hr />

                      <div className="row mb-4 d-flex justify-content-between align-items-center">
                        <div className="col-md-4 mt-3">
                          <h5
                            style={{
                              borderBottom:
                                "1px solid rgba(128, 128, 128, 0.6)",
                              width: "fit-content",
                            }}
                          >
                            Company Details
                          </h5>
                        </div>
                        <div className="col-md-4 mt-3"></div>
                        <div className="col-md-4 mt-3"></div>

                        <div className="col-md-2 mt-3">
                          <h6 className="mb-0">Company</h6>
                        </div>
                        <div className="col-md-4 mt-3">
                          <p className="mb-0 text-right">
                            {otherDetails.Company_name}
                          </p>
                        </div>
                        <div className="col-md-2 mt-3 vl">
                          <h6 className="mb-0">Email</h6>
                        </div>
                        <div className="col-md-4 mt-3">
                          <p className="mb-0 text-right">
                            {otherDetails.Email}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-4 d-flex justify-content-between align-items-center">
                        <div className="col-md-2 mt-3">
                          <h6 className="mb-0">Mobile</h6>
                        </div>
                        <div className="col-md-4 mt-3">
                          <p className="mb-0 text-right">
                            {otherDetails.Mobile}
                          </p>
                        </div>
                        <div className="col-md-2 mt-3 vl">
                          <h6 className="mb-0">Address</h6>
                        </div>
                        <div className="col-md-4 mt-3">
                          <p className="mb-0 text-right">
                            {otherDetails.Address} <br />
                            {otherDetails.City},{otherDetails.State} -{" "}
                            {otherDetails.Pincode}
                          </p>
                        </div>
                      </div>

                      <hr className="my-4" />

                      <div className="row mb-4 d-flex justify-content-between align-items-center">
                        <div className="col-md-4 mt-3">
                          <h5
                            style={{
                              borderBottom:
                                "1px solid rgba(128, 128, 128, 0.6)",
                              width: "fit-content",
                            }}
                          >
                            Recurring Invoice Details
                          </h5>
                        </div>
                        <div className="col-md-4 mt-3"></div>
                        <div className="col-md-4 mt-3"></div>

                        <div className="col-md-3 mt-3">
                          <h6 className="mb-0">Rec. Invoice No,</h6>
                        </div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0 text-right">
                            {invoiceDetails.rec_invoice_no}
                          </p>
                        </div>

                        <div className="col-md-3 mt-3 vl">
                          <h6 className="mb-0">Customer Name</h6>
                        </div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0 text-right">
                            {otherDetails.customerName}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-4 d-flex justify-content-between align-items-center">
                        <div className="col-md-3 mt-3">
                          <h6 className="mb-0">Rec. Invoice Date</h6>
                        </div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0 text-right">
                            {invoiceDetails.start_date}
                          </p>
                        </div>

                        <div className="col-md-3 mt-3 vl">
                          <h6 className="mb-0">End Date</h6>
                        </div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0 text-right">
                            {invoiceDetails.end_date}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-4 d-flex justify-content-start align-items-center">
                        <div className="col-md-3 mt-3">
                          <h6 className="mb-0">Repeat Every</h6>
                        </div>
                        <div className="col-md-3 mt-3 vr">
                          <p className="mb-0">{otherDetails.repeatType}</p>
                        </div>
                        <div className="col-md-3 mt-3 vl">
                          <h6 className="mb-0">Payment Method</h6>
                        </div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0 text-right">
                            {invoiceDetails.payment_method}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-4 d-flex justify-content-start align-items-center">
                        {invoiceDetails.profile_name ? (
                          <>
                            <div className="col-md-3 mt-3">
                              <h6 className="mb-0">Profile Name</h6>
                            </div>
                            <div className="col-md-3 mt-3 vr">
                              <p className="mb-0">
                                {invoiceDetails.profile_name}
                              </p>
                            </div>
                          </>
                        ) : null}

                        {invoiceDetails.entry_type ? (
                          <>
                            <div className="col-md-3 mt-3 vl">
                              <h6 className="mb-0">Entry Type</h6>
                            </div>
                            <div className="col-md-3 mt-3">
                              <p className="mb-0 text-right">
                                {invoiceDetails.entry_type}
                              </p>
                            </div>
                          </>
                        ) : null}
                      </div>
                      <div className="row mb-4 d-flex justify-content-start align-items-center">
                        <div className="col-md-3 mt-3">
                          <h6 className="mb-0">Address</h6>
                        </div>
                        <div className="col-md-3 mt-3 vr">
                          <p className="mb-0">
                            {invoiceDetails.billing_address}
                          </p>
                        </div>
                        <div className="col-md-3 mt-3 vl"></div>
                        <div className="col-md-3 mt-3"></div>
                      </div>

                      <hr />

                      <div className="row mb-4 d-flex justify-content-between align-items-center">
                        <div className="col-md-4 mt-3">
                          <h5
                            style={{
                              borderBottom:
                                "1px solid rgba(128, 128, 128, 0.6)",
                              width: "fit-content",
                            }}
                          >
                            Customer Details
                          </h5>
                        </div>
                        <div className="col-md-4 mt-3"></div>
                        <div className="col-md-4 mt-3"></div>

                        <div className="col-md-3 mt-3 ">
                          <h6 className="mb-0">Customer Name</h6>
                        </div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0 text-right">
                            {otherDetails.customerName}
                          </p>
                        </div>

                        <div className="col-md-3 mt-3 vl">
                          <h6 className="mb-0">Customer Email</h6>
                        </div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0 text-right">
                            {otherDetails.customerEmail}
                          </p>
                        </div>

                        <div className="col-md-3 mt-3">
                          <h6 className="mb-0">GST Type</h6>
                        </div>
                        <div className="col-md-3 mt-3">
                          <p className="mb-0" style={{ textAlign: "right" }}>
                            {invoiceDetails.gst_type}
                          </p>
                        </div>

                        {invoiceDetails.gstin != "None" && (
                          <>
                            <div className="col-md-3 mt-3 vl">
                              <h6 className="mb-0">GSTIN No</h6>
                            </div>
                            <div className="col-md-3 mt-3">
                              <p className="mb-0 text-right">
                                {invoiceDetails.gstin}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="row mb-4 d-flex justify-content-between align-items-center">
                        <div className="col-md-3 mt-3">
                          <h6 className="mb-0">Address</h6>
                        </div>
                        <div className="col-md-3 mt-3 ">
                          <p className="mb-0 text-right">
                            {invoiceDetails.billing_address}
                          </p>
                        </div>
                      </div>
                      <hr />

                      <div className="row mb-4 d-flex justify-content-between align-items-center">
                        <div className="col-md-12 mt-3">
                          <h5
                            style={{
                              borderBottom:
                                "1px solid rgba(128, 128, 128, 0.6)",
                              width: "fit-content",
                            }}
                          >
                            Items Details
                          </h5>
                          {invoiceItems &&
                            invoiceItems.map((itm) => (
                              <>
                                <div className="row mb-4 d-flex justify-content-between align-items-center">
                                  <div className="col-md-3 mt-3">
                                    <h6 className="mb-0">Name</h6>
                                  </div>
                                  <div className="col-md-3 mt-3">
                                    <p className="mb-0 text-right">
                                      {itm.name}
                                    </p>
                                  </div>

                                  <div className="col-md-3 mt-3 vl">
                                    <h6 className="mb-0">
                                      {itm.item_type == "Goods" ? "HSN" : "SAC"}
                                    </h6>
                                  </div>
                                  <div className="col-md-3 mt-3">
                                    <p className="mb-0 text-right">
                                      {itm.item_type == "Goods"
                                        ? itm.hsn
                                        : itm.sac}
                                    </p>
                                  </div>
                                </div>
                                <div className="row mb-4 d-flex justify-content-between align-items-center">
                                  <div className="col-md-3 mt-3">
                                    <h6 className="mb-0">Price</h6>
                                  </div>
                                  <div className="col-md-3 mt-3">
                                    <p className="mb-0 text-right">
                                      {itm.price}
                                    </p>
                                  </div>
                                  <div className="col-md-3 mt-3 vl">
                                    <h6 className="mb-0">Quantity</h6>
                                  </div>
                                  <div className="col-md-3 mt-3">
                                    <p className="mb-0 text-right">
                                      {itm.quantity}
                                    </p>
                                  </div>
                                </div>
                                <div className="row mb-4 d-flex justify-content-start align-items-center">
                                  <div className="col-md-3 mt-3">
                                    <h6 className="mb-0">Tax Amount</h6>
                                  </div>
                                  <div className="col-md-3 mt-3">
                                    <p className="mb-0 text-right">
                                      {itm.tax} %
                                    </p>
                                  </div>
                                  <div className="col-md-3 mt-3 vl">
                                    <h6 className="mb-0">Discount</h6>
                                  </div>
                                  <div className="col-md-3 mt-3">
                                    <p className="mb-0 text-right">
                                      {itm.discount}
                                    </p>
                                  </div>
                                </div>
                                <div className="row mb-4 d-flex justify-content-start align-items-center">
                                  <div className="col-md-3 mt-3">
                                    <h6 className="mb-0">Total</h6>
                                  </div>
                                  <div className="col-md-3 mt-3">
                                    <p className="mb-0 text-right">
                                      {itm.total}
                                    </p>
                                  </div>
                                  <div className="col-md-6 mt-3 vl">
                                    <h6 className="mb-0">&nbsp;</h6>
                                  </div>
                                </div>
                                <hr
                                  className="my-3 mx-auto"
                                  style={{ width: "50%" }}
                                />
                              </>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="col-md-4"
                  style={{
                    backgroundColor: "rgba(22,37,50,255)",
                    borderTopRightRadius: "2vh",
                    borderBottomRightRadius: "2vh",
                  }}
                >
                  <div className="px-3 py-4">
                    <h4 className="fw-bold mb-2 mt-4 pt-1">
                      Recurring Invoice Tax Details
                    </h4>
                    <hr className="my-4" />
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">Status</h6>
                      {invoiceDetails.status == "Draft" ? (
                        <span className="text-info h5 font-weight-bold">
                          DRAFT
                        </span>
                      ) : (
                        <span className="text-success h5 font-weight-bold">
                          SAVED
                        </span>
                      )}
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">Sub Total</h6>
                      {invoiceDetails.subtotal}
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">Tax Amount</h6>
                      {invoiceDetails.tax_amount}
                    </div>
                    {invoiceDetails.igst != 0 ? (
                      <div className="d-flex justify-content-between mb-4">
                        <h6 className="">IGST</h6>
                        {invoiceDetails.igst}
                      </div>
                    ) : null}
                    {invoiceDetails.cgst != 0 ? (
                      <div className="d-flex justify-content-between mb-4">
                        <h6 className="">CGST</h6>
                        {invoiceDetails.cgst}
                      </div>
                    ) : null}
                    {invoiceDetails.sgst != 0 ? (
                      <div className="d-flex justify-content-between mb-4">
                        <h6 className="">SGST</h6>
                        {invoiceDetails.sgst}
                      </div>
                    ) : null}

                    {invoiceDetails.shipping_charge != 0 ? (
                      <div className="d-flex justify-content-between mb-4">
                        <h6 className="">Shipping Charge</h6>
                        {invoiceDetails.shipping_charge}
                      </div>
                    ) : null}

                    {invoiceDetails.adjustment != 0 ? (
                      <div className="d-flex justify-content-between mb-4">
                        <h6 className="">Adjustment</h6>
                        {invoiceDetails.adjustment}
                      </div>
                    ) : null}
                    <hr className="my-4" />
                    <div className="d-flex justify-content-between mb-4">
                      <h6 className="">Grand Total</h6>
                      <span className="font-weight-bold">
                        {invoiceDetails.grandtotal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="" id="template" style={{ display: "none" }}>
              <div id="whatToPrint" className="print-only">
                {/* <!-- template1 --> */}
                <div id="whatToPrint1" className="printTemplates template1">
                  <div className="my-5 page pagesizea4" size="A4">
                    <div className="p-4" id="printdiv1">
                      <div
                        id="ember2512"
                        className="tooltip-container ember-view ribbon text-ellipsis"
                      >
                        <div className="ribbon-inner ribbon-open">
                          {invoiceDetails.status}
                        </div>
                      </div>
                      <section className="top-content bb d-flex justify-content-between p-0">
                        <div className="logo">
                          {/* <!-- <img src="logo.png" alt="" className="img-fluid"> --> */}
                        </div>
                        <div className="top-left">
                          <div className="graphic-path">
                            <p>Rec. Invoice</p>
                          </div>
                          <div className="position-relative">
                            <p>
                              Rec. Invoice No.
                              <span>{invoiceDetails.rec_invoice_no}</span>
                            </p>
                            {invoiceDetails.salesOrder_no != "" ? (
                              <p>
                                Order No.{" "}
                                <span>{invoiceDetails.salesOrder_no}</span>
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </section>

                      <section className="store-user mt-5 p-0">
                        <div className="col-12">
                          <div className="row bb pb-3">
                            <div className="col-7">
                              <p>FROM,</p>
                              <h5>{otherDetails.Company_name}</h5>
                              <p className="address ">
                                {" "}
                                {otherDetails.Address}
                                <br />
                                {otherDetails.City},{otherDetails.State}
                                <br />
                                {otherDetails.Pincode}
                                <br />
                              </p>
                            </div>
                            <div className="col-5">
                              <p>TO,</p>
                              <h5>{otherDetails.customerName}</h5>
                              <p
                                className="address col-9"
                                style={{ marginLeft: "-14px" }}
                              >
                                {" "}
                                {invoiceDetails.billing_address}{" "}
                              </p>
                            </div>
                          </div>
                          <div className="row extra-info pt-3">
                            <div className="col-6">
                              <p>
                                Rec. Invoice Date:{" "}
                                <span>{invoiceDetails.start_date}</span>
                              </p>
                            </div>
                            <div className="col-6">
                              <p>
                                End Date :<span>{invoiceDetails.end_date}</span>
                              </p>
                              <p>
                                Payment Method:
                                <span>{invoiceDetails.payment_method}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="product-area mt-4 p-0">
                        <table
                          className=" table table-hover table-bordered "
                          id="table1"
                        >
                          <thead>
                            <tr>
                              <td
                                style={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  color: "black",
                                }}
                              >
                                Items
                              </td>
                              <td
                                style={{ fontWeight: "bold", color: "black" }}
                              >
                                HSN/SAC
                              </td>
                              <td
                                style={{ fontWeight: "bold", color: "black" }}
                              >
                                Price
                              </td>
                              <td
                                style={{ fontWeight: "bold", color: "black" }}
                              >
                                Quantity
                              </td>
                              <td
                                style={{ fontWeight: "bold", color: "black" }}
                              >
                                Tax
                              </td>
                              <td
                                style={{ fontWeight: "bold", color: "black" }}
                              >
                                Discount
                              </td>
                              <td
                                style={{ fontWeight: "bold", color: "black" }}
                              >
                                Total
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceItems.map((j) => (
                              <tr>
                                <td
                                  style={{
                                    color: "black",
                                    textAlign: "center",
                                  }}
                                >
                                  {j.name}
                                </td>
                                <td style={{ color: "black" }}>
                                  {j.item_type == "Goods" ? j.hsn : j.sac}
                                </td>
                                <td style={{ color: "black" }}>{j.price}</td>
                                <td style={{ color: "black" }}>{j.quantity}</td>
                                <td style={{ color: "black" }}>{j.tax} %</td>
                                <td style={{ color: "black" }}>
                                  {j.discount}{" "}
                                </td>
                                <td style={{ color: "black" }}>{j.total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <br />
                        <br />
                      </section>

                      <section className="balance-info p-0">
                        <div className="row">
                          <div className="col-md-8"></div>
                          <div className="col-md-4">
                            <table className="table table-borderless">
                              <tbody>
                                <tr>
                                  <td style={{ color: "#000" }}>Sub Total</td>
                                  <td style={{ color: "#000" }}>:</td>
                                  <td
                                    className="text-right"
                                    style={{ color: "#000" }}
                                  >
                                    <span>&#8377; </span>
                                    {invoiceDetails.subtotal}
                                  </td>
                                </tr>

                                {invoiceDetails.igst != 0 ? (
                                  <tr>
                                    <td style={{ color: "#000" }}>IGST</td>
                                    <td style={{ color: "#000" }}>:</td>
                                    <td
                                      className="text-right"
                                      style={{ color: "#000" }}
                                    >
                                      <span>&#8377; </span>
                                      {invoiceDetails.igst}
                                    </td>
                                  </tr>
                                ) : null}
                                {invoiceDetails.cgst != 0 ? (
                                  <tr>
                                    <td style={{ color: "#000" }}>CGST</td>
                                    <td style={{ color: "#000" }}>:</td>
                                    <td
                                      className="text-right"
                                      style={{ color: "#000" }}
                                    >
                                      <span>&#8377; </span>
                                      {invoiceDetails.cgst}
                                    </td>
                                  </tr>
                                ) : null}
                                {invoiceDetails.sgst != 0 ? (
                                  <tr>
                                    <td style={{ color: "#000" }}>SGST</td>
                                    <td style={{ color: "#000" }}>:</td>
                                    <td
                                      className="text-right"
                                      style={{ color: "#000" }}
                                    >
                                      <span>&#8377; </span>
                                      {invoiceDetails.sgst}
                                    </td>
                                  </tr>
                                ) : null}
                                <tr>
                                  <td style={{ color: "#000" }}>Tax Amount</td>
                                  <td style={{ color: "#000" }}>:</td>
                                  <td
                                    className="text-right"
                                    style={{ color: "#000" }}
                                  >
                                    <span>&#8377; </span>
                                    {invoiceDetails.tax_amount}
                                  </td>
                                </tr>
                                {invoiceDetails.shipping_charge != 0 ? (
                                  <tr>
                                    <td style={{ color: "#000" }}>
                                      Shipping Charge
                                    </td>
                                    <td style={{ color: "#000" }}>:</td>
                                    <td
                                      className="text-right"
                                      style={{ color: "#000" }}
                                    >
                                      <span>&#8377; </span>
                                      {invoiceDetails.shipping_charge}
                                    </td>
                                  </tr>
                                ) : null}
                                {invoiceDetails.adjustment != 0 ? (
                                  <tr>
                                    <td style={{ color: "#000" }}>
                                      Adjustment
                                    </td>
                                    <td style={{ color: "#000" }}>:</td>
                                    <td
                                      className="text-right"
                                      style={{ color: "#000" }}
                                    >
                                      <span>&#8377; </span>
                                      {invoiceDetails.adjustment}
                                    </td>
                                  </tr>
                                ) : null}
                              </tbody>
                            </table>
                            <hr style={{ backgroundColor: "#000000" }} />
                            <table className="table table-borderless">
                              <tbody>
                                <tr>
                                  <th style={{ color: "#000" }}>Grand Total</th>
                                  <th style={{ color: "#000" }}>:</th>
                                  <th
                                    className="text-right"
                                    style={{ color: "#000" }}
                                  >
                                    <span>&#8377; </span>
                                    {invoiceDetails.grandtotal}
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>

                {/* <!-- template2 --> */}
                <div
                  id="whatToPrint2"
                  className="printTemplates template2"
                  style={{ display: "none" }}
                >
                  <div className="my-5 page pagesizea4" size="A4">
                    <div id="printdiv2">
                      <div
                        className="row px-5 py-4"
                        style={{ backgroundColor: "#268ddd" }}
                      >
                        <div
                          id="ember2512"
                          className="col-md-4 d-flex justify-content-start tooltip-container ember-view ribbon text-ellipsis"
                        >
                          <div
                            className="text-white d-flex align-items-center px-5"
                            style={{
                              borderRadius: "1vh",
                              backgroundColor: "#999999",
                            }}
                          >
                            {invoiceDetails.status}
                          </div>
                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                          <center className="h3 text-white">
                            <b>Recurring Invoice</b>
                          </center>
                        </div>
                        <div className="col-md-4 d-flex justify-content-end">
                          <div className="text-white">
                            <p className="mb-0 mt-2">
                              Rec. Invoice No:{" "}
                              <b>{invoiceDetails.rec_invoice_no}</b>
                            </p>
                            {invoiceDetails.salesOrder_no != "" ? (
                              <p>
                                Order No. <b>{invoiceDetails.salesOrder_no}</b>
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="px-5 py-1">
                        <section className="store-user p-0">
                          <br />
                          <br />
                          <div className="col-12">
                            <div className="row bb pb-2 mt-3">
                              <div className="col-4 pl-0">
                                <label
                                  className="text-white w-100 p-1"
                                  style={{
                                    backgroundColor: "#999999",
                                    borderTopRightRadius: "4vh",
                                    borderBottomRightRadius: "4vh",
                                  }}
                                >
                                  <b>COMPANY ADDRESS</b>
                                </label>
                                <h5
                                  className="text-secondary"
                                  style={{ fontWeight: "bold" }}
                                >
                                  {otherDetails.Company_name}
                                </h5>
                                <p
                                  className="address"
                                  style={{ fontWeight: "bold", color: "#000" }}
                                >
                                  {otherDetails.Address}
                                  <br />
                                  {otherDetails.City}
                                  <br />
                                  {otherDetails.State} - {otherDetails.Pincode}
                                  <br />
                                  <span>Mob: </span>
                                  <b>{otherDetails.Mobile}</b>
                                </p>
                              </div>
                              <div className="col-4"></div>
                              <div className="col-4 pr-0">
                                <label
                                  className="text-white w-100 p-1"
                                  style={{
                                    backgroundColor: "#999999",
                                    borderTopRightRadius: "4vh",
                                    borderBottomRightRadius: "4vh",
                                  }}
                                >
                                  <b>SHIPPING ADDRESS</b>
                                </label>
                                <h5
                                  className="text-secondary"
                                  style={{ fontWeight: "bold" }}
                                >
                                  {otherDetails.customerName}
                                </h5>
                                <p
                                  className="address"
                                  style={{ fontWeight: "bold", color: "#000" }}
                                >
                                  {invoiceDetails.billing_address}{" "}
                                </p>
                              </div>
                            </div>
                            <div className="row my-3">
                              <div className="col-12">
                                <p>
                                  Start Date:{" "}
                                  <span>{invoiceDetails.start_date}</span>
                                </p>
                                <p>
                                  End Date:{" "}
                                  <span>{invoiceDetails.end_date}</span>
                                </p>
                                <p>
                                  Payment Method:{" "}
                                  <span>{invoiceDetails.payment_method}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </section>

                        <section className="product-area mt-2 p-0">
                          <table
                            className="table table-hover table-bordered  template2table"
                            id="table2"
                          >
                            <thead>
                              <tr className="template3tablehead">
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  Items
                                </th>
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  HSN/SAC
                                </th>
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  Quantity
                                </th>
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  Rate
                                </th>
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  Tax
                                </th>
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  Discount
                                </th>
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody style={{ backgroundColor: "#999999" }}>
                              {invoiceItems.map((j) => (
                                <tr>
                                  <td
                                    className="text-center"
                                    style={{
                                      color: "black",
                                      textAlign: "center",
                                    }}
                                  >
                                    {j.name}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ color: "black" }}
                                  >
                                    {j.item_type == "Goods" ? j.hsn : j.sac}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ color: "black" }}
                                  >
                                    {j.price}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ color: "black" }}
                                  >
                                    {j.quantity}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ color: "black" }}
                                  >
                                    {j.tax} %
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ color: "black" }}
                                  >
                                    {j.discount}{" "}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ color: "black" }}
                                  >
                                    {j.total}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </section>

                        <section className="balance-info p-0">
                          <div className="row mt-3">
                            <div className="col-4">
                              <table className="table table-borderless">
                                <tbody>
                                  {invoiceDetails.note ? (
                                    <tr>
                                      <td
                                        style={{
                                          color: "#000",
                                          textAlign: "left",
                                        }}
                                      >
                                        Note
                                      </td>
                                      <td
                                        style={{
                                          color: "#000",
                                          textAlign: "left",
                                        }}
                                      >
                                        :
                                      </td>
                                      <th
                                        style={{
                                          color: "#000",
                                          textAlign: "center",
                                        }}
                                      >
                                        {invoiceDetails.note}
                                      </th>
                                    </tr>
                                  ) : null}
                                </tbody>
                              </table>
                            </div>
                            <div className="col-4"></div>
                            <div className="col-4">
                              <br />
                              <br />
                              <table className="table table-borderless">
                                <tbody>
                                  <tr>
                                    <td style={{ color: "#000" }}>Sub Total</td>
                                    <td style={{ color: "#000" }}>:</td>
                                    <td
                                      className="text-right"
                                      style={{ color: "#000" }}
                                    >
                                      <span>&#8377; </span>
                                      {invoiceDetails.subtotal}
                                    </td>
                                  </tr>

                                  {invoiceDetails.igst != 0 ? (
                                    <tr>
                                      <td style={{ color: "#000" }}>IGST</td>
                                      <td style={{ color: "#000" }}>:</td>
                                      <td
                                        className="text-right"
                                        style={{ color: "#000" }}
                                      >
                                        <span>&#8377; </span>
                                        {invoiceDetails.igst}
                                      </td>
                                    </tr>
                                  ) : null}
                                  {invoiceDetails.cgst != 0 ? (
                                    <tr>
                                      <td style={{ color: "#000" }}>CGST</td>
                                      <td style={{ color: "#000" }}>:</td>
                                      <td
                                        className="text-right"
                                        style={{ color: "#000" }}
                                      >
                                        <span>&#8377; </span>
                                        {invoiceDetails.cgst}
                                      </td>
                                    </tr>
                                  ) : null}
                                  {invoiceDetails.sgst != 0 ? (
                                    <tr>
                                      <td style={{ color: "#000" }}>SGST</td>
                                      <td style={{ color: "#000" }}>:</td>
                                      <td
                                        className="text-right"
                                        style={{ color: "#000" }}
                                      >
                                        <span>&#8377; </span>
                                        {invoiceDetails.sgst}
                                      </td>
                                    </tr>
                                  ) : null}
                                  <tr>
                                    <td style={{ color: "#000" }}>
                                      Tax Amount
                                    </td>
                                    <td style={{ color: "#000" }}>:</td>
                                    <td
                                      className="text-right"
                                      style={{ color: "#000" }}
                                    >
                                      <span>&#8377; </span>
                                      {invoiceDetails.tax_amount}
                                    </td>
                                  </tr>
                                  {invoiceDetails.shipping_charge != 0 ? (
                                    <tr>
                                      <td style={{ color: "#000" }}>
                                        Shipping Charge
                                      </td>
                                      <td style={{ color: "#000" }}>:</td>
                                      <td
                                        className="text-right"
                                        style={{ color: "#000" }}
                                      >
                                        <span>&#8377; </span>
                                        {invoiceDetails.shipping_charge}
                                      </td>
                                    </tr>
                                  ) : null}
                                  {invoiceDetails.adjustment != 0 ? (
                                    <tr>
                                      <td style={{ color: "#000" }}>
                                        Adjustment
                                      </td>
                                      <td style={{ color: "#000" }}>:</td>
                                      <td
                                        className="text-right"
                                        style={{ color: "#000" }}
                                      >
                                        <span>&#8377; </span>
                                        {invoiceDetails.adjustment}
                                      </td>
                                    </tr>
                                  ) : null}
                                </tbody>
                              </table>
                              <hr style={{ backgroundColor: "#000000" }} />
                              <table className="table table-borderless">
                                <tbody>
                                  <tr>
                                    <th style={{ color: "#000" }}>
                                      Grand Total
                                    </th>
                                    <th style={{ color: "#000" }}>:</th>
                                    <th
                                      className="text-right"
                                      style={{ color: "#000" }}
                                    >
                                      <span>&#8377; </span>
                                      {invoiceDetails.grandtotal}
                                    </th>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- template3 --> */}
                <div
                  id="whatToPrint3"
                  className="printTemplates template3"
                  style={{ display: "none" }}
                >
                  <div className="my-5 page pagesizea4" size="A4">
                    <div className="" id="printdiv3">
                      <div className="row">
                        <div
                          className="col-sm-12"
                          style={{
                            backgroundImage: "linear-gradient(#1b83e8, black)",
                            color: "white",
                          }}
                        >
                          <p style={{ fontSize: "4vh", textAlign: "center" }}>
                            RECURRING INVOICE
                          </p>
                          <p style={{ textAlign: "center" }}>
                            {" "}
                            {otherDetails.Company_name} <br />
                            {otherDetails.Address} <br />
                            {otherDetails.City},{otherDetails.State}
                            <br />
                            {otherDetails.Email}
                            <br />
                          </p>
                        </div>

                        <div className="row col-12">
                          <div className="col-md-1"></div>
                          <div className="col-5">
                            <br />
                            <br />
                            <br />
                            <p style={{ color: "black" }}>
                              {" "}
                              <span style={{ fontWeight: "bold" }}>To: </span>
                              <br />
                              {otherDetails.customerName}
                              <br />
                              {invoiceDetails.billing_address}
                            </p>
                          </div>
                          <div className="col-md-1"></div>
                          <div className="col-5">
                            <br />
                            <br />
                            <br />
                            <table className="table table-borderless">
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      color: "#000",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Rec. Invoice No.
                                  </td>
                                  <td style={{ color: "#000" }}>:</td>
                                  <td
                                    className="text-right"
                                    style={{ color: "#000" }}
                                  >
                                    {invoiceDetails.rec_invoice_no}
                                  </td>
                                </tr>

                                <tr>
                                  <td
                                    style={{
                                      color: "#000",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Rec. Invoice Date
                                  </td>
                                  <td style={{ color: "#000" }}>:</td>
                                  <td
                                    className="text-right"
                                    style={{ color: "#000" }}
                                  >
                                    {invoiceDetails.invoice_date}
                                  </td>
                                </tr>

                                <tr>
                                  <td
                                    style={{
                                      color: "#000",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    End Date
                                  </td>
                                  <td style={{ color: "#000" }}>:</td>
                                  <td
                                    className="text-right"
                                    style={{ color: "#000" }}
                                  >
                                    {invoiceDetails.end_date}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      color: "#000",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Payment Method
                                  </td>
                                  <td style={{ color: "#000" }}>:</td>
                                  <td
                                    className="text-right"
                                    style={{ color: "#000" }}
                                  >
                                    {invoiceDetails.payment_method}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="col-md-1"></div>
                        <div className="col-md-10">
                          <br />
                          <table
                            className="table table-hover table-bordered  template3table"
                            id="table3"
                          >
                            <thead>
                              <tr className="template3tablehead">
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  Items
                                </th>
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  HSN/SAC
                                </th>
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  Quantity
                                </th>
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  Rate
                                </th>
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  Tax
                                </th>
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  Discount
                                </th>
                                <th
                                  className="text-center bg-dark"
                                  style={{ color: "black" }}
                                >
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoiceItems.map((j) => (
                                <tr>
                                  <td
                                    className="text-center"
                                    style={{
                                      color: "black",
                                      textAlign: "center",
                                    }}
                                  >
                                    {j.name}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ color: "black" }}
                                  >
                                    {j.item_type == "Goods" ? j.hsn : j.sac}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ color: "black" }}
                                  >
                                    {j.price}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ color: "black" }}
                                  >
                                    {j.quantity}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ color: "black" }}
                                  >
                                    {j.tax} %
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ color: "black" }}
                                  >
                                    {j.discount}{" "}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ color: "black" }}
                                  >
                                    {j.total}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <section className="balance-info p-0">
                        <div className="row">
                          <div className="col-md-7"></div>
                          <div className="col-md-4">
                            <br />
                            <table className="table table-borderless">
                              <tbody>
                                <tr>
                                  <td style={{ color: "#000" }}>Sub Total</td>
                                  <td style={{ color: "#000" }}>:</td>
                                  <td
                                    className="text-right"
                                    style={{ color: "#000" }}
                                  >
                                    <span>&#8377; </span>
                                    {invoiceDetails.subtotal}
                                  </td>
                                </tr>

                                {invoiceDetails.igst != 0 ? (
                                  <tr>
                                    <td style={{ color: "#000" }}>IGST</td>
                                    <td style={{ color: "#000" }}>:</td>
                                    <td
                                      className="text-right"
                                      style={{ color: "#000" }}
                                    >
                                      <span>&#8377; </span>
                                      {invoiceDetails.igst}
                                    </td>
                                  </tr>
                                ) : null}
                                {invoiceDetails.cgst != 0 ? (
                                  <tr>
                                    <td style={{ color: "#000" }}>CGST</td>
                                    <td style={{ color: "#000" }}>:</td>
                                    <td
                                      className="text-right"
                                      style={{ color: "#000" }}
                                    >
                                      <span>&#8377; </span>
                                      {invoiceDetails.cgst}
                                    </td>
                                  </tr>
                                ) : null}
                                {invoiceDetails.sgst != 0 ? (
                                  <tr>
                                    <td style={{ color: "#000" }}>SGST</td>
                                    <td style={{ color: "#000" }}>:</td>
                                    <td
                                      className="text-right"
                                      style={{ color: "#000" }}
                                    >
                                      <span>&#8377; </span>
                                      {invoiceDetails.sgst}
                                    </td>
                                  </tr>
                                ) : null}
                                <tr>
                                  <td style={{ color: "#000" }}>Tax Amount</td>
                                  <td style={{ color: "#000" }}>:</td>
                                  <td
                                    className="text-right"
                                    style={{ color: "#000" }}
                                  >
                                    <span>&#8377; </span>
                                    {invoiceDetails.tax_amount}
                                  </td>
                                </tr>
                                {invoiceDetails.shipping_charge != 0 ? (
                                  <tr>
                                    <td style={{ color: "#000" }}>
                                      Shipping Charge
                                    </td>
                                    <td style={{ color: "#000" }}>:</td>
                                    <td
                                      className="text-right"
                                      style={{ color: "#000" }}
                                    >
                                      <span>&#8377; </span>
                                      {invoiceDetails.shipping_charge}
                                    </td>
                                  </tr>
                                ) : null}
                                {invoiceDetails.adjustment != 0 ? (
                                  <tr>
                                    <td style={{ color: "#000" }}>
                                      Adjustment
                                    </td>
                                    <td style={{ color: "#000" }}>:</td>
                                    <td
                                      className="text-right"
                                      style={{ color: "#000" }}
                                    >
                                      <span>&#8377; </span>
                                      {invoiceDetails.adjustment}
                                    </td>
                                  </tr>
                                ) : null}
                              </tbody>
                            </table>
                            <hr style={{ backgroundColor: "#000000" }} />
                            <table className="table table-borderless">
                              <tbody>
                                <tr>
                                  <th style={{ color: "#000" }}>Grand Total</th>
                                  <th style={{ color: "#000" }}>:</th>
                                  <th
                                    className="text-right"
                                    style={{ color: "#000" }}
                                  >
                                    <span>&#8377; </span>
                                    {invoiceDetails.grandtotal}
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="templateToggle"
                className="templateToggleSegment mt-1 mb-2 w-100 d-flex justify-content-center"
              >
                <button
                  id="toggleTemplate1"
                  onClick={() =>
                    toggleTemplate("whatToPrint1", "toggleTemplate1")
                  }
                  style={{ width: "fit-content", height: "fit-content" }}
                  className="btn btn-outline-light btn-sm m-2 active templateToggleButtons"
                >
                  1
                </button>
                <button
                  id="toggleTemplate2"
                  onClick={() =>
                    toggleTemplate("whatToPrint2", "toggleTemplate2")
                  }
                  style={{ width: "fit-content", height: "fit-content" }}
                  className="btn btn-outline-light btn-sm m-2 templateToggleButtons"
                >
                  2
                </button>
                <button
                  id="toggleTemplate3"
                  onClick={() =>
                    toggleTemplate("whatToPrint3", "toggleTemplate3")
                  }
                  style={{ width: "fit-content", height: "fit-content" }}
                  className="btn btn-outline-light btn-sm m-2 templateToggleButtons"
                >
                  3
                </button>
              </div>
            </div>
            <div className="" id="slip" style={{ display: "none" }}>
              <div className="slip-container bg-white" id="slip_container">
                <div className="slip text-dark">
                  <h5 className="font-weight-bold text-center text-dark">
                    {otherDetails.Company_name}
                  </h5>
                  <div className="address text-center">
                    <p>{otherDetails.Address}</p>
                    <p>
                      {otherDetails.State}, {otherDetails.Country}
                    </p>
                    <p>{otherDetails.Mobile}</p>
                  </div>

                  <div className="divider"></div>

                  <div className="ml-4 mt-2" style={{ color: "black" }}>
                    <div className="row">
                      <div className="col-md-6 text-left">Invoice No:</div>
                      <div className="col-md-5 text-right">
                        {invoiceDetails.rec_invoice_no}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 text-left">Customer Name:</div>
                      <div className="col-md-5 text-right">
                        {otherDetails.customerName}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 text-left">Rec. Invoice Date :</div>
                      <div className="col-md-5 text-right">
                        {invoiceDetails.start_date}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 text-left">End Date:</div>
                      <div className="col-md-5 text-right">
                        {invoiceDetails.end_date}
                      </div>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <div
                    className="equal-length-container"
                    style={{ color: "black", fontWeight: "bold" }}
                  >
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Item
                      <hr
                        style={{
                          borderBottom: "1px solid black",
                          marginTop: "1vh",
                          width: "95%",
                        }}
                      />
                    </div>
                    <div
                      className="equal-length-item ml-2"
                      style={{ textAlign: "center" }}
                    >
                      HSN/SAC
                      <hr
                        style={{
                          borderBottom: "1px solid black",
                          marginTop: "1vh",
                          width: "63%",
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Qty
                      <hr
                        style={{
                          borderBottom: "1px solid black",
                          marginTop: "1vh",
                          width: "60%",
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Rate
                      <hr
                        style={{
                          borderBottom: "1px solid black",
                          marginTop: "1vh",
                          width: "65%",
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Tax
                      <hr
                        style={{
                          borderBottom: "1px solid black",
                          marginTop: "1vh",
                          width: "60%",
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                    <div
                      className="equal-length-item"
                      style={{ textAlign: "center" }}
                    >
                      Total
                      <hr
                        style={{
                          borderBottom: "1px solid black",
                          marginTop: "1vh",
                          width: "65%",
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                  </div>
                  {invoiceItems.map((i) => (
                    <div
                      className="equal-length-container"
                      style={{
                        color: "black",
                        fontSize: "small",
                        wordWrap: "break-word",
                        marginBottom: "1vh",
                      }}
                    >
                      <div
                        className="equal-length-item"
                        style={{ textAlign: "center", marginLeft: "2px" }}
                      >
                        {i.name}
                      </div>
                      <div
                        className="equal-length-item"
                        style={{ textAlign: "right" }}
                      >
                        {i.item_type == "Goods" ? i.hsn : i.sac}
                      </div>
                      <div
                        className="equal-length-item"
                        style={{ textAlign: "center" }}
                      >
                        {i.quantity}
                      </div>
                      <div
                        className="equal-length-item"
                        style={{ textAlign: "center" }}
                      >
                        {i.price}
                      </div>
                      <div
                        className="equal-length-item"
                        style={{ textAlign: "center" }}
                      >
                        {i.tax}%
                      </div>
                      <div
                        className="equal-length-item"
                        style={{ textAlign: "center" }}
                      >
                        {i.total}
                      </div>
                    </div>
                  ))}

                  <div className="subtot mt-5">
                    <div className="subtot-item d-flex justify-content-between">
                      <span>Subtotal</span>
                      <span>
                        <span>&#8377; </span>
                        {invoiceDetails.subtotal}
                      </span>
                    </div>
                    <div className="subtot-item d-flex justify-content-between">
                      <span>Tax Amount</span>
                      <span>
                        <span>&#8377; </span>
                        {invoiceDetails.tax_amount}
                      </span>
                    </div>

                    {invoiceDetails.igst == 0 ? (
                      <>
                        <div className="subtot-item d-flex justify-content-between">
                          <span>CGST</span>
                          <span>
                            <span>&#8377; </span>
                            {invoiceDetails.cgst}
                          </span>
                        </div>
                        <div className="subtot-item d-flex justify-content-between">
                          <span>SGST</span>
                          <span>
                            <span>&#8377; </span>
                            {invoiceDetails.sgst}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="subtot-item d-flex justify-content-between">
                        <span>IGST</span>
                        <span>
                          <span>&#8377; </span>
                          {invoiceDetails.igst}
                        </span>
                      </div>
                    )}

                    {invoiceDetails.adjustment != 0 ? (
                      <div className="subtot-item d-flex justify-content-between">
                        <span>Adjustment</span>
                        <span>
                          <span>&#8377; </span>
                          {invoiceDetails.adjustment}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="divider"></div>
                  <div className="grandtot fw-bold d-flex justify-content-between">
                    <span>
                      <strong>TOTAL</strong>
                    </span>
                    <span>
                      <strong>
                        <span>&#8377; </span>
                        {invoiceDetails.grandtotal}
                      </strong>
                    </span>
                  </div>
                  <div className="divider"></div>
                  <div className="paid-by mb-4 d-flex justify-content-between">
                    <span>Paid By:</span>
                    <span>{invoiceDetails.payment_method}</span>
                  </div>
                  <div className="createdby d-flex justify-content-between">
                    <p className="">Created By:</p>
                    <span>{otherDetails.createdBy}</span>
                  </div>
                  <div className="datetime d-flex justify-content-between">
                    <p className="">Printed On:</p>
                    <span id="dateTimeDisplay"></span>
                  </div>
                  <div className="trns-id d-flex justify-content-between">
                    <span>Transaction ID:</span>
                    <span>XXXXXXXXX</span>
                  </div>
                  <div className="slip-footer mt-4 text-center">
                    <p>Thank you for supporting Local business!</p>
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
              <h5 className="m-3">Share Invoice</h5>
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
                      placeholder="This message will be sent along with Recurring Invoice details."
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

            <form onSubmit={saveInvoiceComment} className="px-1">
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

      {/* <!-- Attach File Modal --> */}
      <div className="modal fade" id="attachFileModal">
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">Attach File</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                id="fileModalDismiss"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form
              onSubmit={handleFileModalSubmit}
              method="post"
              encType="multipart/form-data"
              className="needs-validation px-1"
            >
              <div className="modal-body w-100">
                <div className="card p-3">
                  <div className="form-group">
                    <label for="emailIds">Input File</label>
                    <input
                      type="file"
                      className="form-control"
                      name="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      id="fileAttachInput"
                      required
                    />
                  </div>
                </div>
              </div>
              <div
                className="modal-footer d-flex justify-content-center w-100"
                style={{ borderTop: "1px solid #ffffff" }}
              >
                <button
                  type="submit"
                  className="submitShareEmailBtn w-50 text-uppercase"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewRecInvoice;
