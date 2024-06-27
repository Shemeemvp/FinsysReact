import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import "../../styles/Items.css";

function ViewStockAdjust() {
  const ID = Cookies.get("Login_id");
  const { stockId } = useParams();
  const [stockDetails, setStockDetails] = useState({});
  const [statementDetails, setStatementDetails] = useState({});
  const [stockItems, setStockItems] = useState([]);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState({
    action: "",
    date: "",
    doneBy: "",
  });

  const [fileUrl, setFileUrl] = useState(null);

  const fetchStockAdjustDetails = () => {
    axios
      .get(`${config.base_url}/fetch_stock_adjust_details/${stockId}/`)
      .then((res) => {
        console.log("STOCK DATA=", res);
        if (res.data.status) {
          var stck = res.data.stock;
          var hist = res.data.history;
          var cmt = res.data.comments;
          var itms = res.data.items;
          var statm = res.data.statement;
          if (stck.attach_file) {
            var url = `${config.base_url}/${stck.attach_file}`;
            setFileUrl(url);
          }

          setStatementDetails(statm);
          setStockItems([]);
          setComments([]);
          itms.map((i) => {
            setStockItems((prevState) => [...prevState, i]);
          });
          cmt.map((c) => {
            setComments((prevState) => [...prevState, c]);
          });
          setStockDetails(stck);
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
    fetchStockAdjustDetails();
  }, []);

  const currentUrl = window.location.href;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    currentUrl
  )}`;

  const navigate = useNavigate();

  function handleConvertStockAdjust() {
    Swal.fire({
      title: `Convert Stock Adjust - ${stockDetails.reference_no}?`,
      text: "Are you sure you want to convert this.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Convert",
    }).then((result) => {
      if (result.isConfirmed) {
        var st = {
          id: stockId,
        };
        axios
          .post(`${config.base_url}/change_stock_adjust_status/`, st)
          .then((res) => {
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Converted",
              });
              fetchStockAdjustDetails();
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
      stock_adjustment: stockId,
      comment: comment,
    };
    axios
      .post(`${config.base_url}/add_stock_adjust_comment/`, cmt)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Comment Added",
          });
          setComment("");
          fetchStockAdjustDetails();
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

  function handleDeleteStockAdjust(id) {
    Swal.fire({
      title: `Delete Stock Adjust - ${stockDetails.reference_no}?`,
      text: "Data cannot be restored.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_stock_adjust/${id}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Stock Adjust Data Deleted.",
            });
            navigate("/stock_adjust");
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
          .delete(`${config.base_url}/delete_stock_adjust_comment/${id}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Comment Deleted",
            });
            fetchStockAdjustDetails();
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
    document.getElementById("statement").style.display = "none";
    document.getElementById("printBtn").style.display = "none";
    document.getElementById("pdfBtn").style.display = "none";
    document.getElementById("shareBtn").style.display = "none";
    document.getElementById("editBtn").style.display = "block";
    document.getElementById("deleteBtn").style.display = "block";
    document.getElementById("historyBtn").style.display = "block";
    document.getElementById("commentBtn").style.display = "block";
    if (stockDetails.status == "Draft") {
      document.getElementById("statusBtn").style.display = "block";
    }
    document.getElementById("overviewBtn").style.backgroundColor =
      "rgba(22,37,50,255)";
    document.getElementById("statementBtn").style.backgroundColor =
      "transparent";
  }

  function statement() {
    document.getElementById("overview").style.display = "none";
    document.getElementById("statement").style.display = "block";
    document.getElementById("printBtn").style.display = "block";
    document.getElementById("pdfBtn").style.display = "block";
    document.getElementById("shareBtn").style.display = "block";
    document.getElementById("editBtn").style.display = "none";
    document.getElementById("deleteBtn").style.display = "none";
    document.getElementById("historyBtn").style.display = "none";
    document.getElementById("commentBtn").style.display = "none";
    if (stockDetails.status == "Draft") {
      document.getElementById("statusBtn").style.display = "none";
    }
    document.getElementById("overviewBtn").style.backgroundColor =
      "transparent";
    document.getElementById("statementBtn").style.backgroundColor =
      "rgba(22,37,50,255)";
  }

  function printSheet() {
    var divToPrint = document.getElementById("pdfs");
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

  function stockAdjustStatementPdf() {
    var data = {
      Id: ID,
      stock_id: stockId,
    };
    axios
      .get(`${config.base_url}/stock_adjust_statement_pdf/`, {
        responseType: "blob",
        params: data,
      })
      .then((res) => {
        console.log("PDF RES=", res);

        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = `StockAdjustment_Statement_${stockDetails.reference_no}.pdf`;
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
          stock_id: stockId,
          Id: ID,
          email_ids: emailIds,
          email_message: emailMessage,
        };
        axios
          .post(`${config.base_url}/share_stock_adjust_statement_email/`, em)
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
    formData.append("stock_id", stockId);
    if (file) {
      formData.append("attach_file", file);
    }

    axios
      .post(`${config.base_url}/add_stock_adjust_attachment/`, formData)
      .then((res) => {
        console.log("FILE RES==", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "File Added.",
          });
          setFile(null)
          document.getElementById('fileModalDismiss').click();
          fetchStockAdjustDetails();
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
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <Link
          className="d-flex justify-content-end p-2"
          style={{ cursor: "pointer" }}
          to="/stock_adjust"
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
                      onClick={statement}
                      id="statementBtn"
                    >
                      Statement
                    </a>
                  </div>

                  <div className="col-md-6 d-flex justify-content-end">
                    {stockDetails.status == "Draft" ? (
                      <a
                        onClick={handleConvertStockAdjust}
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
                      onClick={stockAdjustStatementPdf}
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
                      to={`/edit_stock_adjust/${stockId}/`}
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
                        handleDeleteStockAdjust(`${stockDetails.id}`)
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
                      to={`/stock_adjust_history/${stockId}/`}
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
                  STOCK ADJUSTMENT VIEW
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
                  <div className="p-5 pt-2">
                    <center>
                      <h4>ITEM DETAILS </h4>
                    </center>
                    <hr />
                    {stockDetails.mode_of_adjustment == "Quantity" ? (
                      <>
                        {stockItems.map((j) => (
                          <>
                            <div className="row mb-4 d-flex justify-content-between align-items-center">
                              <div className="col-md-3 mt-3">
                                <h6 className="mb-0 ml-5">Name</h6>
                              </div>
                              <div className="col-md-3 mt-3">
                                <p className="mb-0 text-right">{j.name}</p>
                              </div>

                              <div className="col-md-3 mt-3 vl">
                                <h6 className="mb-0  ">Quantity Available</h6>
                              </div>
                              <div className="col-md-3 mt-3">
                                <p className="mb-0 text-right mr-5">
                                  {j.quantity_avail}
                                </p>
                              </div>
                            </div>
                            <div className="row mb-4 d-flex justify-content-between align-items-center">
                              <div className="col-md-3 mt-3 ">
                                <h6 className="mb-0  ml-5">Quantity In Hand</h6>
                              </div>
                              <div className="col-md-3 mt-3">
                                <p className="mb-0 text-right ">
                                  {j.quantity_inhand}
                                </p>
                              </div>
                              <div className="col-md-3 mt-3 vl">
                                <h6 className="mb-0">Adjusted Quantity</h6>
                              </div>
                              <div className="col-md-3 mt-3">
                                <p className="mb-0 text-right mr-5">
                                  {j.quantity_adj}
                                </p>
                              </div>
                            </div>
                            <hr
                              className="my-4 mx-auto"
                              style={{ width: "50%" }}
                            />
                          </>
                        ))}
                      </>
                    ) : (
                      <>
                        {stockItems.map((j) => (
                          <>
                            <div className="row mb-4 d-flex justify-content-between align-items-center">
                              <div className="col-md-3 mt-3">
                                <h6 className="mb-0 ml-5">Name</h6>
                              </div>
                              <div className="col-md-3 mt-3">
                                <p className="mb-0 text-right">{j.name}</p>
                              </div>

                              <div className="col-md-3 mt-3 vl">
                                <h6 className="mb-0">Value Available</h6>
                              </div>
                              <div className="col-md-3 mt-3">
                                <p className="mb-0 text-right mr-5">
                                  {j.current_val}
                                </p>
                              </div>
                            </div>
                            <div className="row mb-4 d-flex justify-content-between align-items-center">
                              <div className="col-md-4 mt-3 ">
                                <h6 className="mb-0 ml-5">
                                  New Stock in Value
                                </h6>
                              </div>
                              <div className="col-md-2 mt-3">
                                <p className="mb-0 text-right">
                                  {j.changed_val}
                                </p>
                              </div>
                              <div className="col-md-4 mt-3 vl">
                                <h6 className="mb-0">
                                  Adjusted Stock in Value
                                </h6>
                              </div>
                              <div className="col-md-2 mt-3">
                                <p className="mb-0 text-right mr-5">
                                  {j.adjusted_val}
                                </p>
                              </div>
                            </div>

                            <hr
                              className="my-4 mx-auto"
                              style={{ width: "50%" }}
                            />
                          </>
                        ))}
                      </>
                    )}
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
                  <div className="px-5 py-4">
                    <center>
                      <h4>STOCK ADJUSTMENT DETAILS </h4>
                    </center>
                    <hr />

                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Reference No</label>
                      </div>
                      <div className="col-1 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-3 d-flex justify-content-start">
                        <p
                          style={{
                            color: "white",
                            fontSize: "15px",
                            textTransform: "Uppercase",
                          }}
                        >
                          {stockDetails.reference_no}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start">
                        <label style={{ color: "white" }}>
                          Mode of Adjustment{" "}
                        </label>
                      </div>
                      <div className="col-1 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p style={{ color: "white", fontSize: "15px" }}>
                          {stockDetails.mode_of_adjustment}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start">
                        <label style={{ color: "white" }}> Reason </label>
                      </div>
                      <div className="col-1 d-flex justify-content-center">
                        <p>:</p>
                      </div>
                      <div className="col-4 d-flex justify-content-start">
                        <p style={{ color: "white", fontSize: "15px" }}>
                          {stockDetails.reason}
                        </p>
                      </div>
                    </div>

                    {stockDetails.description && (
                      <div className="row mb-3">
                        <div className="col-6 d-flex justify-content-start">
                          <label style={{ color: "white" }}>
                            {" "}
                            Description{" "}
                          </label>
                        </div>
                        <div className="col-1 d-flex justify-content-center">
                          <p>:</p>
                        </div>
                        <div className="col-3 d-flex justify-content-start">
                          <p style={{ color: "white", fontSize: "15px" }}>
                            {stockDetails.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="" id="statement" style={{ display: "none" }}>
              <div
                className="rectangle"
                id="pdfs"
                style={{
                  color: "black",
                  backgroundColor: "white",
                  width: "850px",
                  height: "900px",
                  border: "3px white",
                  margin: "2rem auto",
                }}
              >
                <div
                  className="pcs-template-body"
                  style={{ textAlign: "left" }}
                >
                  <div
                    className="col-sm-12"
                    style={{
                      margin: "0 !important",
                      padding: "0!important",
                      backgroundImage: "linear-gradient(#1b83e8, black)",
                      color: "white",
                    }}
                    id="colorgradient"
                  >
                    <br />
                    <p style={{ fontSize: "4vh", textAlign: "center" }}>
                      STOCK ADJUSTMENT
                    </p>
                    <p style={{ textAlign: "center" }}>
                      {statementDetails.company} <br />
                      {statementDetails.city}, <br />
                      {statementDetails.pincode},{statementDetails.state},<br />
                      {statementDetails.email}
                      <br />
                      <br />
                    </p>
                  </div>

                  <br />
                  <br />

                  {/* <div style="display:table;width:100%;">
                    <div className=" pcs-journal-header-section">
                      <div></div>
                    </div>
                  </div> */}

                  <div className="d-flex mb-4 " style={{ marginLeft: "-95px" }}>
                    <div className="col-6 text-right ">
                      <h5 className="mr-auto text-dark ">Reference Number</h5>
                    </div>
                    <div className="col-2 text-center text-dark">:</div>
                    <div className="col-6">
                      <h6 className="ml-auto mt-1 text-dark">
                        {stockDetails.reference_no}
                      </h6>
                    </div>
                  </div>

                  <div className="d-flex mb-4 " style={{ marginLeft: "-95px" }}>
                    <div className="col-6 text-right text-dark">
                      <h5 className="mr-auto text-dark">Reason</h5>
                    </div>
                    <div className="col-2 text-center text-dark">:</div>
                    <div className="col-6">
                      <h6 className="ml-auto mt-1 text-dark">
                        {stockDetails.reason}
                      </h6>
                    </div>
                  </div>

                  <div className="d-flex mb-4 " style={{ marginLeft: "-95px" }}>
                    <div className="col-6 text-right">
                      <h5 className="mr-auto text-dark">Date</h5>
                    </div>
                    <div className="col-2 text-center text-dark">:</div>
                    <div className="col-6">
                      <h6 className="ml-auto mt-1 text-dark">
                        {stockDetails.adjusting_date}
                      </h6>
                    </div>
                  </div>

                  <div
                    className="d-flex mb-4   "
                    style={{ marginLeft: "-95px" }}
                  >
                    <div className="col-6 text-right ">
                      <h5 className="mr-auto text-dark">Mode of Adjustment</h5>
                    </div>
                    <div className="col-2 text-center text-dark">:</div>
                    <div className="col-6">
                      <h6 className="ml-auto mt-1 text-dark">
                        {stockDetails.mode_of_adjustment}
                      </h6>
                    </div>
                  </div>

                  <div className="d-flex mb-4 " style={{ marginLeft: "-95px" }}>
                    <div className="col-6 text-right">
                      <h5 className="mr-auto text-dark">Status</h5>
                    </div>
                    <div className="col-2 text-center text-dark">:</div>
                    <div className="col-6">
                      <h6 className="ml-auto mt-1 text-dark">
                        {stockDetails.status}
                      </h6>
                    </div>
                  </div>

                  <div className="d-flex mb-4 " style={{ marginLeft: "-95px" }}>
                    <div className="col-6 text-right">
                      <h5 className="mr-auto text-dark">Created By</h5>
                    </div>
                    <div className="col-2 text-center text-dark">:</div>
                    <div className="col-6">
                      <h6 className="ml-auto mt-1 text-dark">
                        {statementDetails.name}
                      </h6>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-11 mx-auto">
                      <table
                        style={{
                          width: "100%",
                          marginTop: "20px",
                          tableLayout: "fixed",
                        }}
                        cellspacing="0"
                        cellpadding="0"
                        className="pcs-itemtable border border-dark "
                        id="print-Table"
                      >
                        <thead style={{ backgroundColor: "#22b8d1" }}>
                          <tr
                            style={{ height: "40px" }}
                            className="border border-dark"
                          >
                            <td
                              style={{
                                padding: "5px 10px 5px 10px",
                                wordWrap: "break-word",
                                textAlign: "center",
                              }}
                              className="table-head"
                            >
                              Item Details
                            </td>

                            {stockDetails.mode_of_adjustment == "Quantity" ? (
                              <>
                                <td
                                  style={{
                                    padding: "5px 10px 5px 5px",
                                    wordWrap: "break-word",
                                    textAlign: "center",
                                  }}
                                  className="table-head"
                                >
                                  Quantity Available
                                </td>
                                <td
                                  style={{
                                    padding: "5px 10px 5px 5px",
                                    wordWrap: "break-word",
                                    textAlign: "center",
                                  }}
                                  className="table-head"
                                >
                                  New Quantity on hand
                                </td>
                                <td
                                  style={{
                                    padding: "5px 10px 5px 5px",
                                    wordWrap: "break-word",
                                    textAlign: "center",
                                  }}
                                  className="table-head"
                                >
                                  Quantity Adjusted
                                </td>
                              </>
                            ) : (
                              <>
                                <td
                                  style={{
                                    padding: "5px 10px 5px 5px",
                                    wordWrap: "break-word",
                                    textAlign: "center",
                                  }}
                                  className="table-head"
                                >
                                  Value Available
                                </td>
                                <td
                                  style={{
                                    padding: "5px 10px 5px 5px",
                                    wordWrap: "break-word",
                                    textAlign: "center",
                                  }}
                                  className="table-head"
                                >
                                  New Stock in Value
                                </td>
                                <td
                                  style={{
                                    padding: "5px 10px 5px 5px",
                                    wordWrap: "break-word",
                                    textAlign: "center",
                                  }}
                                  className="table-head"
                                >
                                  Adjusted Stock in Value
                                </td>
                              </>
                            )}
                          </tr>
                        </thead>

                        <tbody id="items-table-body">
                          {stockDetails.mode_of_adjustment == "Quantity" ? (
                            <>
                              {stockItems.map((j) => (
                                <tr
                                  className="row0 border border-dark"
                                  id="row1"
                                >
                                  <td
                                    style={{
                                      padding: "10px 0px 10px 10px",
                                      fontSize: "16px",
                                      textAlign: "center",
                                    }}
                                    className="pcs-item-row"
                                  >
                                    {j.name}{" "}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px 10px 10px 5px",
                                      wordWrap: "break-word",
                                      fontSize: "18px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {j.quantity_avail}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px 10px 10px 5px",
                                      wordWrap: "break-word",
                                      fontSize: "18px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {j.quantity_inhand}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px 10px 10px 5px",
                                      wordWrap: "break-word",
                                      fontSize: "18px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {j.quantity_adj}
                                  </td>
                                </tr>
                              ))}
                            </>
                          ) : (
                            <>
                              {stockItems.map((j) => (
                                <tr
                                  className="row1 border border-dark"
                                  id="row2"
                                >
                                  <td
                                    style={{
                                      padding: "10px 0px 10px 10px",
                                      fontSize: "16px",
                                      textAlign: "center",
                                    }}
                                    className="pcs-item-row"
                                  >
                                    {j.name}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px 10px 10px 5px",
                                      wordWrap: "break-word",
                                      fontSize: "18px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {j.current_val}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px 10px 10px 5px",
                                      wordWrap: "break-word",
                                      fontSize: "18px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {j.changed_val}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px 10px 10px 5px",
                                      wordWrap: "break-word",
                                      fontSize: "18px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {j.adjusted_val}
                                  </td>
                                </tr>
                              ))}
                            </>
                          )}
                        </tbody>
                      </table>
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

      {/* <!-- Attach File Modal --> */}
      <div className="modal fade" id="attachFileModal">
          <div className="modal-dialog">
              <div className="modal-content" style={{backgroundColor: "#213b52"}}>
                  <div className="modal-header">
                      <h5 className="m-3">Attach File</h5>
                      <button type="button" className="close" data-dismiss="modal" id="fileModalDismiss" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <form onSubmit={handleFileModalSubmit} method="post" encType="multipart/form-data" className="needs-validation px-1">
                      <div className="modal-body w-100">
                          <div className="card p-3">
                            <div className="form-group">
                                <label for="emailIds">Input File</label>
                                <input type="file" className="form-control" name="file" onChange={(e) => setFile(e.target.files[0])} id="fileAttachInput" required />
                            </div>
                              
                          </div>
                      </div>
                      <div className="modal-footer d-flex justify-content-center w-100" style={{borderTop: "1px solid #ffffff"}}>
                          <button type="submit" className="submitShareEmailBtn w-50 text-uppercase">SAVE</button>
                      </div>
                  </form>
              </div>   
          </div>
      </div>
    </>
  );
}

export default ViewStockAdjust;
