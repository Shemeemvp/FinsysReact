import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import "../../styles/Items.css";

function ViewPriceList() {
  const ID = Cookies.get("Login_id");
  const { priceListId } = useParams();
  const [priceListDetails, setPriceListDetails] = useState({});
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState({
    action: "",
    date: "",
    doneBy: "",
  });

  const [items, setItems] = useState([])

  const fetchPLDetails = () => {
    axios
      .get(`${config.base_url}/fetch_pl_details/${priceListId}/`)
      .then((res) => {
        console.log("PL DATA=", res);
        if (res.data.status) {
          var pl = res.data.priceList;
          var hist = res.data.history;
          var cmt = res.data.comments;
          var itms = res.data.items;
          setComments([]);
          setItems([]);
          cmt.map((c) => {
            setComments((prevState) => [...prevState, c]);
          });
          itms.map((i) => {
            setItems((prevState) => [...prevState, i]);
          });
          setPriceListDetails(pl);
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
    fetchPLDetails();
  }, []);

  const currentUrl = window.location.href;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    currentUrl
  )}`;

  const navigate = useNavigate();

  const changeStatus = (status) => {
    var st = {
      id: priceListId,
      status: status,
    };
    axios
      .post(`${config.base_url}/change_pl_status/`, st)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Status Updated",
          });
          fetchPLDetails();
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
  const savePLComment = (e) => {
    e.preventDefault();
    var cmt = {
      Id: ID,
      list: priceListId,
      comments: comment,
    };
    axios
      .post(`${config.base_url}/add_pl_comment/`, cmt)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Comment Added",
          });
          setComment("");
          fetchPLDetails();
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

  function handleDeletePL(id) {
    Swal.fire({
      title: `Delete Price List - ${priceListDetails.name}?`,
      text: "All related data will be deleted.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_price_list/${id}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Price List Deleted successfully",
            });
            navigate("/price_list");
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
          .delete(`${config.base_url}/delete_pl_comment/${id}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Comment Deleted",
            });
            fetchPLDetails();
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

  function printSheet() {
    var divToPrint = document.getElementById("printContent");
    var prntElems = document.querySelectorAll(
      "#printContent, #printContent *"
    );
    prntElems.forEach(function (element) {
      element.style.color = "black";
    });
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
      var prntElems = document.querySelectorAll(
        "#printContent, #printContent *"
      );
      prntElems.forEach(function (element) {
        element.style.color = "white";
      });
    });
  }

  function priceListPdf() {
    var plData = {
      Id: ID,
      pl_id: priceListId
    }
    axios
      .get(`${config.base_url}/price_list_pdf/`, {
        responseType: "blob",
        params: plData
      })
      .then((res) => {
        console.log("PDF RES=", res);

        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = `PriceList_${priceListDetails.name}.pdf`;
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
          pl_id: priceListId,
          Id: ID,
          email_ids: emailIds,
          email_message: emailMessage,
        };
        axios
          .post(`${config.base_url}/share_pl_details_email/`, em)
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
          to="/price_list"
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
                    {priceListDetails.status == "Inactive" ? (
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
                    <Link
                      to={`/edit_price_list/${priceListId}/`}
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
                      onClick={() => handleDeletePL(`${priceListDetails.id}`)}
                      style={{ height: "fit-content", width: "fit-content" }}
                    >
                      &nbsp;Delete
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
                    <a
                      onClick={priceListPdf}
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
                      to={`/price_list_history/${priceListId}/`}
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
                  {priceListDetails.name}
                </h3>
                {priceListDetails.status == "Inactive" ? (
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
        >
          <div className="card-body p-0">
            <div id="overview">
              <div
                className="row g-0 d-flex justify-content-center"
                style={{ marginLeft: "1px", marginRight: "1px" }}
              >
                <div className="col-lg-10">
                  <div className="history_highlight py-3 d-flex">
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
                  <div className="p-5 pt-2">
                    <div id="printContent">
                      <center>
                        <h4>PRICE LIST DETAILS </h4>
                      </center>
                      <hr />
                      <div className="row mb-3">
                        <div className="col-4 d-flex justify-content-center">
                          <label style={{ color: "white" }}> Name </label>
                        </div>
                        <div className="col-4 d-flex justify-content-center">
                          <p>:</p>
                        </div>
                        <div className="col-4 d-flex justify-content-center">
                          <p
                            style={{
                              color: "white",
                              fontSize: "15px",
                              textTransform: "Uppercase",
                            }}
                          >
                            {" "}
                            {priceListDetails.name}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-4 d-flex justify-content-center">
                          <label style={{ color: "white" }}> Type </label>
                        </div>
                        <div className="col-4 d-flex justify-content-center">
                          <p>:</p>
                        </div>
                        <div className="col-4 d-flex justify-content-center">
                          <p
                            style={{
                              color: "white",
                              fontSize: "15px",
                              textTransform: "Uppercase",
                            }}
                          >
                            {" "}
                            {priceListDetails.type}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-4 d-flex justify-content-center">
                          <label style={{ color: "white" }}> Item Rate </label>
                        </div>
                        <div className="col-4 d-flex justify-content-center">
                          <p>:</p>
                        </div>
                        <div className="col-4 d-flex justify-content-center">
                          <p
                            style={{
                              color: "white",
                              fontSize: "15px",
                              textTransform: "Uppercase",
                            }}
                          >
                            {priceListDetails.item_rate ==
                            "Customized individual rate" ? (
                              "Customized individual rate"
                            ) : (
                              <>
                                {priceListDetails.up_or_down == "Markup"
                                  ? "Markup the item rates by a percentage"
                                  : "Markdown the item rates by a percentage"}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-4 d-flex justify-content-center">
                          <label style={{ color: "white" }}>
                            {" "}
                            Description{" "}
                          </label>
                        </div>
                        <div className="col-4 d-flex justify-content-center">
                          <p>:</p>
                        </div>
                        <div className="col-4 d-flex justify-content-center">
                          <p
                            style={{
                              color: "white",
                              fontSize: "15px",
                              textTransform: "Uppercase",
                            }}
                          >
                            {" "}
                            {priceListDetails.description}
                          </p>
                        </div>
                      </div>
                      {priceListDetails.item_rate ==
                      "Customized individual rate" ? (
                        <>
                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-center">
                              <label style={{ color: "white" }}>
                                {" "}
                                Currency{" "}
                              </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  textTransform: "Uppercase",
                                }}
                              >
                                {priceListDetails.currency}{" "}
                              </p>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <table
                              className="table table-bordered"
                              style={{
                                backgroundColor: "#2f516f",
                                color: "white",
                                fontSize: "medium",
                              }}
                            >
                              <thead>
                                <tr>
                                  <th className="text-center">Item Details</th>
                                  <th className="text-center">
                                    Standard Rate(INR)
                                  </th>
                                  <th className="text-center">
                                    Custom Rate(INR)
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {items && items.map((i)=>(
                                  <tr>
                                    <td className="text-center">
                                      {i.name}
                                    </td>
                                    <td className="text-center">
                                      {i.stdRate}
                                    </td>
                                    <td className="text-center">
                                      <b>{i.customRate}</b>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-center">
                              <label style={{ color: "white" }}>
                                {" "}
                                Percentage{" "}
                              </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  textTransform: "Uppercase",
                                }}
                              >
                                {" "}
                                {priceListDetails.percentage}%{" "}
                              </p>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-4 d-flex justify-content-center">
                              <label style={{ color: "white" }}>
                                {" "}
                                Round Off To{" "}
                              </label>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p>:</p>
                            </div>
                            <div className="col-4 d-flex justify-content-center">
                              <p
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  textTransform: "Uppercase",
                                }}
                              >
                                {priceListDetails.round_off}{" "}
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

            <form onSubmit={savePLComment} className="px-1">
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

export default ViewPriceList;
