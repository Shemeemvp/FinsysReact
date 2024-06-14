import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import "../../styles/Items.css";

function ViewItem() {
  const ID = Cookies.get("Login_id");
  const { itemId } = useParams();
  const [itemDetails, setItemDetails] = useState({});
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState({
    action: "",
    date: "",
    doneBy: "",
  });

  const fetchItemDetails = () => {
    axios
      .get(`${config.base_url}/fetch_item_details/${itemId}/`)
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
          stockValue(itm.current_stock, itm.purchase_price);
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
      id: itemId,
      status: status,
    };
    axios
      .post(`${config.base_url}/change_item_status/`, st)
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
  const [comment, setComment] = useState("");
  const saveItemComment = (e) => {
    e.preventDefault();
    var cmt = {
      Id: ID,
      item: itemId,
      comments: comment,
    };
    axios
      .post(`${config.base_url}/add_item_comment/`, cmt)
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

  function handleDeleteItem(id) {
    Swal.fire({
      title: `Delete Item - ${itemDetails.name}?`,
      text: "All transactions will be deleted.!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${config.base_url}/delete_item/${id}/`)
          .then((res) => {
            console.log(res);

            Toast.fire({
              icon: "success",
              title: "Item Deleted successfully",
            });
            navigate("/items");
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
          .delete(`${config.base_url}/delete_item_comment/${id}/`)
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
    document.getElementById("historyBtn").style.display = "block";
    document.getElementById("commentBtn").style.display = "block";
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
    document.getElementById("historyBtn").style.display = "none";
    document.getElementById("commentBtn").style.display = "none";
    document.getElementById("statusBtn").style.display = "none";
    document.getElementById("overviewBtn").style.backgroundColor =
      "transparent";
    document.getElementById("transactionBtn").style.backgroundColor =
      "rgba(22,37,50,255)";
  }

  function printSection(sectionId) {
    document.body.style.backgroundColor = "white";
    document.querySelector('.page-content').style.backgroundColor = 'white';
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
    document.querySelector('.page-content').style.backgroundColor = '#2f516f';
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
          to="/items"
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
                    {itemDetails.status == "Inactive" ? (
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
                      href="{% url 'Fin_itemTransactionPdf' itemDetails.id %}"
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
                      onClick={() => printSection("printContent")}
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
                        <li
                          style={{
                            textAlign: "center",
                            color: "#e5e9ec",
                            cursor: "pointer",
                          }}
                        >
                          WhatsApp
                        </li>
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
                      href="{% url 'Fin_editItem' itemDetails.id %}"
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
                      to={`/item_history/${itemId}/`}
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
                  {itemDetails.name}
                </h3>
                {itemDetails.status == "Inactive" ? (
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
                      <h4>ITEM DETAILS </h4>
                    </center>
                    <hr />
                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}> Type </label>
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
                          {itemDetails.item_type}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}> Unit </label>
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
                          {itemDetails.unit}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>
                          {itemDetails.item_type == "Goods"
                            ? "HSN Code"
                            : "SAC Code"}
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
                          {itemDetails.hsn ? itemDetails.hsn : itemDetails.sac}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Tax Reference</label>
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
                          {itemDetails.tax_reference}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>
                          Intra State Tax
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
                          GST {itemDetails.intra_state_tax}%
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>
                          Inter State Tax
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
                          IGST {itemDetails.inter_state_tax}%
                        </p>
                      </div>
                    </div>

                    {/* {% if itemDetails.inventory_account != "" %} */}
                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Inventory</label>
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
                          {itemDetails.inventory_account}
                        </p>
                      </div>
                    </div>
                    {/* {% endif %} */}

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Current</label>
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
                          {itemDetails.current_stock}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Stock Rate per</label>
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
                          {itemDetails.stock_unit_rate}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>
                          Min Stock to Maintain
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
                          {itemDetails.min_stock}
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
                      <h4>PURCHASE INFORMATION </h4>
                    </center>
                    <hr />

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Purchase Price</label>
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
                          INR : {itemDetails.purchase_price}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>
                          Purchase Account
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
                          {itemDetails.purchase_account}
                        </p>
                      </div>
                    </div>
                    {itemDetails.purchase_description && (
                      <div className="row mb-5">
                        <div className="col-4 d-flex justify-content-start">
                          <label style={{ color: "white" }}>
                            {" "}
                            Description{" "}
                          </label>
                        </div>
                        <div className="col-4 d-flex justify-content-center">
                          <p>:</p>
                        </div>
                        <div className="col-4 d-flex justify-content-start">
                          <p style={{ color: "white", fontSize: "15px" }}>
                            {itemDetails.purchase_description}
                          </p>
                        </div>
                      </div>
                    )}

                    <center>
                      <h4>SALES INFORMATION </h4>
                    </center>
                    <hr />

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Selling Price</label>
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
                          INR : {itemDetails.selling_price}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-4 d-flex justify-content-start">
                        <label style={{ color: "white" }}>Sales Account</label>
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
                          {itemDetails.sales_account}
                        </p>
                      </div>
                    </div>
                    {itemDetails.sales_description && (
                      <div className="row mb-5">
                        <div className="col-4 d-flex justify-content-start">
                          <label style={{ color: "white" }}>
                            {" "}
                            Description{" "}
                          </label>
                        </div>
                        <div className="col-4 d-flex justify-content-center">
                          <p>:</p>
                        </div>
                        <div className="col-4 d-flex justify-content-start">
                          <p style={{ color: "white", fontSize: "15px" }}>
                            {itemDetails.sales_description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div id="transaction" style={{ display: "none" }}>
              <div id="printContent">
                <center>
                  <h3 className="mt-3 text-uppercase">
                    {itemDetails.name} - TRANSACTIONS
                  </h3>
                </center>
                <div className="row mt-5">
                  <div className="col d-flex justify-content-between px-5">
                    <div className="item_data">
                      <p>Selling Price: {itemDetails.selling_price}</p>
                      <p>Purchase Price: {itemDetails.purchase_price}</p>
                      <p>Min Stock to Maintain: {itemDetails.min_stock}</p>
                    </div>
                    <div className="item_data">
                      <p>Stock Quantity: {itemDetails.current_stock}</p>
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
              <div className="card p-3">
                <form
                  action="{% url 'Fin_shareItemTransactionsToEmail' item.id %}"
                  method="post"
                  className="needs-validation"
                  id="share_to_email_form"
                >
                  <div className="form-group">
                    <label for="emailIds">Email IDs</label>
                    <textarea
                      className="form-control"
                      name="email_ids"
                      id="emailIds"
                      rows="3"
                      placeholder="Multiple emails can be added by separating with a comma(,)."
                      required
                    ></textarea>
                  </div>
                  <div className="form-group mt-2">
                    <label for="item_unitname">Message(optional)</label>
                    <textarea
                      name="email_message"
                      id="email_message"
                      className="form-control"
                      cols=""
                      rows="4"
                      placeholder="This message will be sent along with Bill details."
                    ></textarea>
                  </div>
                </form>
              </div>
              <div
                className="modal-footer d-flex justify-content-center"
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

export default ViewItem;
