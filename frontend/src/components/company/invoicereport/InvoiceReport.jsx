import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import html2pdf from "html2pdf.js";
import axios from "axios";
import * as XLSX from "xlsx";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import "../../styles/InvoiceReport.css";

function InvoiceReport() {
  const ID = Cookies.get("Login_id");

  const [reportData, setReportData] = useState([]);
  const [otherDetails, setOtherDetails] = useState({});

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [report, setReport] = useState("");

  const fetchInvoiceReportDetails = () => {
    axios
      .get(`${config.base_url}/fetch_invoice_report_details/${ID}/`)
      .then((res) => {
        console.log("REPRT DATA=", res);
        if (res.data.status) {
          setReportData(res.data.reportData);
          setOtherDetails(res.data.otherDetails);
          setStartDate("");
          setEndDate("");
          setStatus("");
          setReport("");
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
    fetchInvoiceReportDetails();
  }, []);

  const currentUrl = window.location.href;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    currentUrl
  )}`;

  const navigate = useNavigate();

  const handleCustomize = (e) => {
    e.preventDefault();

    var det = {
      Id: ID,
      start_date: startDate,
      end_date: endDate,
      report: report,
      status: status,
    };

    axios
      .post(`${config.base_url}/fetch_invoice_report_details_customized/`, det)
      .then((res) => {
        console.log("REPRT DATA=", res);
        if (res.data.status) {
          setReportData(res.data.reportData);
          setOtherDetails(res.data.otherDetails);
          setStartDate(res.data.startDate);
          setEndDate(res.data.endDate);
          setStatus(res.data.filterStatus);
          setReport(res.data.report);

          var contentDiv = document.getElementById("contentDiv");
          if (contentDiv.style.display === "block") {
            toggleContent();
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

  function printSection() {
    var divToPrint = document.getElementById("printReport");
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

  function reportPDF() {
    var st = startDate;
    var en = endDate;
    var date = "";
    if (st != "" && en != "") {
      date = `_${startDate}` + "_" + `${endDate}`;
    }
    var element = document.getElementById("printReport");
    var opt = {
      margin: [0.5, 0.3, 0.3, 0.5],
      filename: "Report_Invoice_Details" + date,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "cm", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  }

  function ExportToExcel() {
    var st = startDate;
    var en = endDate;
    var date = "";
    if (st != "" && en != "") {
      date = `_${startDate}` + "_" + `${endDate}`;
    }
    const Table = document.getElementById("reportTable");
    const ws = XLSX.utils.table_to_sheet(Table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "Report__Invoice_Details" + date + ".xlsx");
  }

  const [emailIds, setEmailIds] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  function handleShareEmail(e) {
    e.preventDefault();

    var st = startDate;
    var end = endDate;
    var stat = status;
    var rpt = report;

    if ((st != "" && end == "") || (st == "" && end != "")) {
      alert("Please select both date inputs or select none");
      return;
    } else {
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
            Id: ID,
            start: st,
            end: end,
            status: stat,
            report: rpt,
            email_ids: emailIds,
            email_message: emailMessage,
          };
          axios
            .post(`${config.base_url}/share_invoice_report_details_email/`, em)
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
  }
  function toggleContent() {
    var contentDiv = document.getElementById("contentDiv");
    if (contentDiv.style.display === "block") {
      contentDiv.style.display = "none";
    } else {
      contentDiv.style.display = "block";
      // Position the div just below the button
      // var buttonRect = event.target.getBoundingClientRect();
      // contentDiv.style.top = (buttonRect.bottom + window.scrollY) + "px";
      // contentDiv.style.left = buttonRect.left + "px";
    }
  }

  return (
    <>
      <FinBase />
      <div
        className="page-content mt-0 pt-0"
        id="page-content"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="card radius-15">
          <div className="card-body" style={{ width: "100%" }}>
            <div className="card-title">
              <center>
                <h2 className="text-uppercase" id="headline">
                  INVOICE DETAILS
                </h2>
              </center>
              <hr />
            </div>

            <div className="bar">
              <div className=" left d-flex justify-content-start">
                <div className="position-relative mr-2">
                  <button
                    className="btn btn-secondary"
                    onClick={toggleContent}
                    style={{ width: "fit-content", height: "fit-content" }}
                  >
                    <i className="fas fa-solid fa-gear"></i> Customize Report
                  </button>
                  <div id="contentDiv" className="content">
                    <h6>Customize Report</h6>
                    <form
                      onSubmit={handleCustomize}
                      className="form reportCustomizeForm px-1"
                      method="get"
                    >
                      <div className="px-2 w-100">
                        <label style={{ textAlign: "left" }}>From</label>
                        <br />
                        <input
                          className="inputdate form-control"
                          type="date"
                          name="start_date"
                          id="startDate"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required={endDate != "" ? true : false}
                        />
                      </div>
                      <div className="px-2 w-100">
                        <label style={{ textAlign: "left" }}>To</label>
                        <br />
                        <input
                          type="date"
                          className="inputdate form-control"
                          name="end_date"
                          id="endDate"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required={startDate != "" ? true : false}
                        />
                      </div>
                      <div className="px-2 w-100">
                        <label style={{ textAlign: "left" }}>Report By</label>
                        <br />
                        <select
                          name="report"
                          id="reports"
                          value={report}
                          onChange={(e) => setReport(e.target.value)}
                          className="form-control"
                        >
                          <option value="">Choose..</option>
                          <option
                            value="invdate"
                            style={{ textTransform: "capitalize" }}
                          >
                            INVOICE DATE
                          </option>
                          <option
                            value="duedate"
                            style={{ textTransform: "capitalize" }}
                          >
                            INVOICE DUE DATE
                          </option>
                        </select>
                      </div>
                      <div className="px-2 w-100">
                        <label style={{ textAlign: "left" }}>Status</label>
                        <br />
                        <select
                          name="status"
                          id="salesStatus"
                          className="form-control"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="all">All</option>
                          <option value="Draft">Draft</option>
                          <option value="Not paid">Not paid</option>
                          <option value="fully paid">Fully Paid</option>
                          <option value="partially paid">Partially Paid</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </div>
                      <div className="d-flex px-2 mt-3 mb-4 w-100">
                        <button
                          type="submit"
                          className="btn btn-outline-light w-50"
                          style={{
                            width: "fit-content",
                            height: "fit-content",
                          }}
                        >
                          Run Report
                        </button>
                        <button
                          type="reset"
                          onClick={toggleContent}
                          className="btn btn-outline-light ml-1 w-50"
                          style={{
                            width: "fit-content",
                            height: "fit-content",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="right d-flex">
                <a
                  className="btn btn-outline-secondary text-grey fa fa-file"
                  role="button"
                  id="pdfBtn"
                  onClick={reportPDF}
                  style={{ width: "fit-content", height: "fit-content" }}
                >
                  {" "}
                  &nbsp;PDF
                </a>
                <a
                  className="ml-2 btn btn-outline-secondary text-grey fa fa-print"
                  role="button"
                  id="printBtn"
                  onClick={printSection}
                  style={{ width: "fit-content", height: "fit-content" }}
                >
                  &nbsp;Print
                </a>
                <a
                  className="ml-2 btn btn-outline-secondary text-grey fa fa-table"
                  role="button"
                  id="exportBtn"
                  onClick={ExportToExcel}
                  style={{ width: "fit-content", height: "fit-content" }}
                >
                  &nbsp;Export
                </a>
                <div className="dropdown p-0 nav-item" id="shareBtn">
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
              </div>
            </div>
          </div>
        </div>

        <div className="card radius-15 print-only" id="pdf-card">
          <div className="card-body">
            <div className="container-fluid">
              <div
                id="printReport"
                className="printReportTemplate"
                style={{ display: "block " }}
              >
                <div className="my-5 page" size="A4">
                  <div id="printdiv2">
                    <div className="py-4 bg-secondary">
                      <div className="col-12">
                        <center className="h5 text-white">
                          <b>{otherDetails.cmpName}</b>
                        </center>
                        <center className="h3 text-white">
                          <b> INVOICE DETAILS</b>
                        </center>
                        {startDate != "" && endDate != "" ? (
                          <center className="h6 text-white">
                            {startDate} {"TO"} {endDate}
                          </center>
                        ) : null}
                      </div>
                    </div>
                    <div className="row px-1 py-1">
                      <div className="col-12">
                        <section className="product-area mt-2 py-1">
                          <table
                            className="table table-responsive-md mt-4 table-hover"
                            id="reportTable"
                          >
                            <thead>
                              <tr>
                                <th className="text-center">STATUS</th>
                                <th className="text-center">INVOICE DATE</th>
                                <th className="text-center">DUE DATE</th>
                                <th className="text-center">INVOICE NO.</th>
                                <th className="text-center">ORDER NO.</th>
                                <th className="text-center">CUSTOMER NAME</th>

                                <th className="text-center">INVOICE AMOUNT</th>
                                <th className="text-center"> BALANCE AMOUNT</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.length > 0 &&
                                reportData.map((i) => (
                                  <tr>
                                    <td className="text-center">{i.status}</td>
                                    <td className="text-center">{i.date}</td>
                                    <td className="text-center">
                                      {i.ship_date}
                                    </td>
                                    <td className="text-center">{i.invno}</td>
                                    <td className="text-center">
                                      {i.sales_no}
                                    </td>
                                    <td className="text-center">{i.name}</td>

                                    <td className="text-center">
                                      Rs. {i.total}
                                    </td>
                                    <td className="text-center">
                                      Rs. {i.balance}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>

                          {reportData.length == 0 ? (
                            <center>
                              <h4 className="text-dark">No data available.!</h4>
                            </center>
                          ) : null}
                        </section>

                        <section className="balance-info text-dark pt-1 pb-1">
                          <div className="row p-4">
                            <div className="col-10">
                              <div className="row mb-2">
                                <div className="col-4">
                                  Total customers :{" "}
                                  <p style={{ fontSize: "19px " }}>
                                    {otherDetails.totalCust}
                                  </p>
                                </div>
                                <br />
                                <br />
                              </div>
                              <div className="row ">
                                <div className="col-4 "></div>
                                <div className="col-4"></div>
                                <div className="col-4">
                                  <h5
                                    style={{
                                      color: "#000",
                                      fontWeight: "bold ",
                                    }}
                                  >
                                    Total Amount:
                                  </h5>
                                  <h4
                                    className="text-dark"
                                    id="expense"
                                    style={{ fontWeight: "600" }}
                                  >
                                    ₹
                                    <span id="totalCreditnote">
                                      {otherDetails.totalInv}
                                    </span>
                                  </h4>
                                </div>
                              </div>
                            </div>
                            <div className="col-2 text-center">
                              <h5
                                style={{
                                  paddingTop: "70px",
                                  color: "#000",
                                  fontWeight: "bold ",
                                }}
                              >
                                Total Balance:
                              </h5>
                              <h4
                                className="text-dark"
                                style={{ fontWeight: "600" }}
                                id="totvalue"
                              >
                                ₹
                                <span id="superTotal">
                                  {otherDetails.totalBalance}
                                </span>
                              </h4>
                            </div>
                          </div>
                        </section>
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
              <h5 className="m-3">Share Report</h5>
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
                      placeholder="This message will be sent along with Report details."
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

export default InvoiceReport;
