import React, { useEffect, useState } from "react";
import "../styles/FinBase.css";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../functions/config";
function FinBase() {
  const user = Cookies.get("User");
  let is_company = false;
  if (user === "Company") {
    is_company = true;
  }
  const navigate = useNavigate();
  function handleLogout() {
    Cookies.remove("User");
    Cookies.remove("Login_id");
    navigate("/");
  }
  function hideListElements() {
    var listItems = document.querySelectorAll("#myList li");
    listItems.forEach(function (item) {
      item.style.display = "none";
    });
  }
  const showMenu = () => {
    var ele = document.querySelector("ul.submenu");
    if (ele.classList.contains("mm-show")) {
      ele.classList.remove("mm-show");
      ele.classList.add("mm-collapse");
    } else {
      ele.classList.add("mm-show");
      ele.classList.remove("mm-collapse");
    }
  };

  function toggleSidebar() {
    var wrapper = document.getElementById("headerWrapper");
    var sidebarWrapper = document.querySelector(".sidebar-wrapper");

    if (wrapper.classList.contains("toggled")) {
      // unpin sidebar when hovered
      wrapper.classList.remove("toggled");
      // sidebarWrapper.removeEventListener("mouseenter", hoverIn);
      // sidebarWrapper.removeEventListener("mouseleave", hoverOut);
    } else {
      wrapper.classList.add("toggled");
      // sidebarWrapper.addEventListener("mouseenter", hoverIn);
      // sidebarWrapper.addEventListener("mouseleave", hoverOut);
    }

    // function hoverIn() {
    //   wrapper.classList.add("sidebar-hovered");
    // }

    // function hoverOut() {
    //   wrapper.classList.remove("sidebar-hovered");
    // }
  }

  useEffect(() => {
    try {
      document.querySelector(".submenu").classList.add("mm-collapse");
    } catch (error) {
      
    }
  }, []);

  useEffect(() => {
    hideListElements();
  }, []);

  function filter() {
    var value = document.getElementById("myInput").value.toLowerCase();

    var listItems = document.querySelectorAll("#myList li");
    listItems.forEach(function (item) {
      if (value !== "") {
        var text = item.textContent.toLowerCase();
        item.style.display = text.indexOf(value) > -1 ? "" : "none";
      } else {
        item.style.display = "none";
      }
    });
  }

  const [loginName, setLoginName] = useState("");
  const [loginImage, setLoginImage] = useState("");

  const ID = Cookies.get("Login_id");
  const getLogDetails = () => {
    axios
      .get(`${config.base_url}/user/${ID}/`)
      .then((res) => {
        console.log("RESPONSE==", res);
        if (res.data.status) {
          const details = res.data.data;
          const logImg = `${config.base_url}/${details.image}`;
          setLoginImage(logImg);
          setLoginName(details.name);
        }
      })
      .catch((err) => {
        console.log("ERROR==", err);
      });
  };

  useEffect(() => {
    getLogDetails();
  }, []);

  return (
    <>
      <Helmet>
        {/* <!-- Reset styles --> */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/modern-css-reset/dist/reset.min.css"
        />
        {/* <!-- Google Fonts Muli --> */}
        <link
          href="https://fonts.googleapis.com/css2?family=Muli:wght@300;400;700&display=swap"
          rel="stylesheet"
        ></link>
        {/* <!-- Vector CSS --> */}
        {/* <link
          href={`${process.env.PUBLIC_URL}/static/assets/plugins/vectormap/jquery-jvectormap-2.0.2.css`}
          rel="stylesheet"
        /> */}
        {/* <!--plugins--> */}
        {/* <link
          href={`${process.env.PUBLIC_URL}/static/assets/plugins/simplebar/css/simplebar.css`}
          rel="stylesheet"
        /> */}

        <link
          href={`${process.env.PUBLIC_URL}/static/assets/plugins/metismenu/css/metisMenu.min.css`}
          rel="stylesheet"
        />

        {/* <!-- Bootstrap CSS --> */}
        <link
          rel="stylesheet"
          href={`${process.env.PUBLIC_URL}/static/assets/css/bootstrap.min.css`}
        />
        {/* <!-- Icons CSS --> */}
        <link
          rel="stylesheet"
          href={`${process.env.PUBLIC_URL}/static/assets/css/icons.css`}
        />

        <link
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href={`${process.env.PUBLIC_URL}/static/assets/css/app.css`}
        />

        {/* jQuery first, then Popper.js, then Bootstrap JS */}
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/js/jquery.min.js`}
        ></script>
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/js/popper.min.js`}
        ></script>
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/js/bootstrap.min.js`}
        ></script>

        {/* <!--plugins--> */}
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/plugins/simplebar/js/simplebar.min.js`}
        ></script>
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/plugins/metismenu/js/metisMenu.min.js`}
        ></script>
        {/* <!-- Vector map JavaScript --> */}
        {/* <script
          src={`${process.env.PUBLIC_URL}/static/assets/plugins/vectormap/jquery-jvectormap-2.0.2.min.js`}
        ></script>
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/plugins/vectormap/jquery-jvectormap-world-mill-en.js`}
        ></script>
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/plugins/vectormap/jquery-jvectormap-in-mill.js`}
        ></script>
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/plugins/vectormap/jquery-jvectormap-us-aea-en.js`}
        ></script>
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/plugins/vectormap/jquery-jvectormap-uk-mill-en.js`}
        ></script>
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/plugins/vectormap/jquery-jvectormap-au-mill.js`}
        ></script>
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/plugins/apexcharts-bundle/js/apexcharts.min.js`}
        ></script> */}
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/js/index.js`}
        ></script>
        {/* <!-- App JS --> */}
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/js/app.js`}
        ></script>
      </Helmet>
      {/* <!-- wrapper --> */}
      <div className="wrapper">
        {/* <!--header--> */}
        <div className="wrapper" id="headerWrapper">
          {/* <!--header--> */}
          <header className="top-header" style={{ backgroundColor: "#213b52" }}>
            <nav className="navbar navbar-expand">
              <div className="sidebar-header">
                <div className="d-none d-lg-flex">
                  <img
                    src={`${process.env.PUBLIC_URL}/static/assets/images/logo-icon.png`}
                    className="logo-icon-2"
                    alt=""
                  />
                </div>
                <div className="a">
                  <h4>
                    <b>Fin sYs</b>
                  </h4>
                </div>
                <a
                  href="javascript:;"
                  onClick={toggleSidebar}
                  className="toggle-btn ml-lg-auto p-0"
                >
                  <i
                    className="bx bx-menu text-white"
                    style={{ fontSize: "28px" }}
                  ></i>
                </a>
              </div>
              <div className="flex-grow-1 search-bar">
                <div className="input-group d-flex align-items-center">
                  <div
                    className="input-group-prepend search-arrow-back"
                    style={{ display: "none" }}
                  >
                    <button className="btn btn-search-back" type="button">
                      <i className="bx bx-arrow-back"></i>
                    </button>
                  </div>
                  <input
                    type="text"
                    autocomplete="off"
                    id="myInput"
                    onKeyUp={filter}
                    className="form-control"
                    placeholder="search"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-search" type="button">
                      <i className="lni lni-search-alt"></i>
                    </button>
                  </div>
                  <div
                    className=" mt-5"
                    id="myDIV"
                    style={{
                      zIndex: "1",
                      position: "absolute",
                      backgroundColor: "#213b52",
                      width: "550px",
                      height: "1px",
                    }}
                  >
                    <ul
                      id="myList"
                      class="one"
                      style={{ backgroundColor: "#213b52" }}
                    >
                      <li>
                        <a href="{% url 'Fin_Com_Home' %}">Dashboard</a>
                      </li>

                      <li>
                        <a href="{% url 'Fin_Staff_Req' %}">Staff Requests</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_All_Staff' %}">All Staff</a>
                      </li>

                      <li>
                        <a href="{% url 'Fin_items' %}">Item</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_priceList' %}">Price Lists</a>
                      </li>
                      <li>
                        <a href="{% url 'StockAdjustment' %}">
                          Stock Adjustments
                        </a>
                      </li>

                      <li>
                        <a href="">Online Banking</a>
                      </li>
                      <li>
                        <a href="">Bank Reconcilation</a>
                      </li>
                      <li>
                        <a href="">Reconcile</a>
                      </li>
                      <li>
                        <a href="">Cash Position</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_banking_listout' %}">
                          Offline Banking
                        </a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_bankholder' %}">Bank Holders</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_cashInHand' %}">Cash In Hand</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_cheques' %}">Cheques</a>
                      </li>
                      <li>
                        <a href="{% url 'loan_ac_listoutpage' %}">
                          Loan Account
                        </a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_upiPayments' %}">UPI</a>
                      </li>

                      <li>
                        <a href="">Sales Records</a>
                      </li>
                      <li>
                        <a href="">Suppliers</a>
                      </li>
                      <li>
                        <a href="">Product and Services</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_customers' %}">Customers</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_estimates' %}">Estimate</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_salesOrder' %}">Sales Order</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_invoice' %}">Invoices</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_creditNotes' %}">Credit Note</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_view_payment_received' %}">
                          Payments Received
                        </a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_RET_INV_Listout' %}">
                          Retainer Invoices
                        </a>
                      </li>
                      <li>
                        <a href="{% url 'deliverylist' %}">Delivery Challan</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_recurringInvoice' %}">
                          Recurring Invoices
                        </a>
                      </li>

                      <li>
                        <a href="{% url 'Fin_vendors' %}">Vendor</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_purchaseOrder' %}">
                          Purchase Order
                        </a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_List_Purchase_Bill' %}">Bill</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_expense' %}">Expenses</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_paymentmade' %}">Payment Made</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_debitnotelist' %}">Debit Note</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_recurring_bill_list' %}">
                          Recurring Bill
                        </a>
                      </li>

                      <li>
                        <a href="">Transaction Reports</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_report_bill_details' %}">
                          Bill Details
                        </a>
                      </li>
                      <li>
                        <a href="">Sales</a>
                      </li>
                      <li>
                        <a href="">Sales by Customer</a>
                      </li>
                      <li>
                        <a href="">Sales by Items</a>
                      </li>
                      <li>
                        <a href="">Purchase</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_purchase_report_vendor' %}">
                          Purchase by Vendor
                        </a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_purchase_report_item' %}">
                          Purchase by Item
                        </a>
                      </li>
                      <li>
                        <a href="">All Transactions</a>
                      </li>
                      <li>
                        <a href="">Profit and Loss</a>
                      </li>
                      <li>
                        <a href="">Balance Sheet</a>
                      </li>
                      <li>
                        <a href="">Cash Flow</a>
                      </li>
                      <li>
                        <a href="">Day Book</a>
                      </li>
                      <li>
                        <a href="">Party</a>
                      </li>
                      <li>
                        <a href="">Party Statements</a>
                      </li>
                      <li>
                        <a href="">All Parties</a>
                      </li>
                      <li>
                        <a href="">GST Reports</a>
                      </li>
                      <li>
                        <a href="">GSTR-1</a>
                      </li>
                      <li>
                        <a href="">GSTR-2</a>
                      </li>
                      <li>
                        <a href="">GSTR-3B</a>
                      </li>
                      <li>
                        <a href="">GSTR-9</a>
                      </li>
                      <li>
                        <a href="">Sales Summary by HSN</a>
                      </li>
                      <li>
                        <a href="">Profit and Loss</a>
                      </li>
                      <li>
                        <a href="">Balance Sheet</a>
                      </li>
                      <li>
                        <a href="">Trial Balance</a>
                      </li>
                      <li>
                        <a href="">Accounts Receivables</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_aging_summary' %}">
                          Aging Summary
                        </a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_aging_details' %}">
                          Aging Details
                        </a>
                      </li>
                      <li>
                        <a href="">Credit Note Details</a>
                      </li>
                      <li>
                        <a href="">Debit Note Report</a>
                      </li>
                      <li>
                        <a href="">Accounts Payables</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_report_account_outstanding_payables' %}">
                          <i class="bx bx-right-arrow-alt"></i> Outstanding
                          Payables{" "}
                        </a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_report_account_outstanding_receivable' %}">
                          <i class="bx bx-right-arrow-alt"></i> Outstanding
                          Receivables{" "}
                        </a>
                      </li>
                      <li>
                        <a href="">Stock Summary</a>
                      </li>
                      <li>
                        <a href="">Stock Valuation</a>
                      </li>
                      <li>
                        <a href="">Sales Summary Report</a>
                      </li>
                      <li>
                        <a href="">Purchase Order Details</a>
                      </li>
                      <li>
                        <a href="">Purchase Order By Vendor</a>
                      </li>
                      <li>
                        <a href="">Recurring Bill</a>
                      </li>

                      <li>
                        <a href="{% url 'Fin_Eway_bills' %}">Eway Bills</a>
                      </li>

                      <li>
                        <a href="{% url 'Fin_chartOfAccounts' %}">
                          Chart of Accounts
                        </a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_manualJournals' %}">
                          Manual Journal
                        </a>
                      </li>

                      <li>
                        <a href="{% url 'employee_list' %}">Employee</a>
                      </li>
                      <li>
                        <a href="{% url 'employee_loan_list' %}">
                          Employee Loan
                        </a>
                      </li>
                      <li>
                        <a href="{% url 'holiday_list' %}">Holidays</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_Attendance' %}">Attendance</a>
                      </li>
                      <li>
                        <a href="{% url 'Fin_salary_details' %}">
                          Salary Details
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="right-topbar ml-auto">
                <ul
                  className="navbar navbar-expand"
                  style={{ listStyleType: "none", margin: "0", padding: "0" }}
                >
                  <a
                    className="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative"
                    href="javascript:;"
                    data-toggle="dropdown"
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      textDecoration: "none",
                    }}
                  >
                    <i
                      className="fa fa-gear text-white"
                      style={{ fontSize: "24px" }}
                    ></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <ul
                      className="a"
                      style={{
                        listStyleType: "none",
                        margin: "0",
                        padding: "0",
                        width: "200px",
                        display: "ruby-text",
                      }}
                    >
                      <li>
                        <a
                          href=""
                          style={{
                            display: "block",
                            padding: "8px 16px",
                            textDecoration: "none",
                          }}
                        >
                          Company Profile
                        </a>
                      </li>
                      <li>
                        <a
                          href=""
                          style={{
                            display: "block",
                            padding: "8px 16px",
                            textDecoration: "none",
                          }}
                        >
                          Users
                        </a>
                      </li>
                      <li>
                        <a
                          href=""
                          style={{
                            display: "block",
                            padding: "8px 16px",
                            textDecoration: "none",
                          }}
                        >
                          Branches
                        </a>
                      </li>
                      <li>
                        <a
                          href=""
                          style={{
                            display: "block",
                            padding: "8px 16px",
                            textDecoration: "none",
                          }}
                        >
                          Currencies
                        </a>
                      </li>
                      <li>
                        <a
                          href=""
                          style={{
                            display: "block",
                            padding: "8px 16px",
                            textDecoration: "none",
                          }}
                        >
                          Tax
                        </a>
                      </li>
                      <li>
                        <a
                          href=""
                          style={{
                            display: "block",
                            padding: "8px 16px",
                            textDecoration: "none",
                          }}
                        >
                          Templates
                        </a>
                      </li>
                      <li>
                        <a
                          href=""
                          style={{
                            display: "block",
                            padding: "8px 16px",
                            textDecoration: "none",
                          }}
                        >
                          Accounts and Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href=""
                          style={{
                            display: "block",
                            padding: "8px 16px",
                            textDecoration: "none",
                          }}
                        >
                          Customize Form Style
                        </a>
                      </li>
                      <li>
                        <a
                          href=""
                          style={{
                            display: "block",
                            padding: "8px 16px",
                            textDecoration: "none",
                          }}
                        >
                          Chart of Accounts
                        </a>
                      </li>
                      <li>
                        <a
                          href=""
                          style={{
                            display: "block",
                            padding: "8px 16px",
                            textDecoration: "none",
                          }}
                        >
                          Module Settings
                        </a>
                      </li>
                    </ul>
                  </div>
                </ul>
              </div>
              <div className="right-topbar ml-auto">
                <ul className="navbar-nav">
                  <li className="nav-item dropdown dropdown-lg">
                    <a
                      className="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative"
                      href="javascript:;"
                      data-toggle="dropdown"
                    >
                      {" "}
                      <i
                        className="bx bx-bell vertical-align-middle"
                        style={{ fontSize: "25px" }}
                      ></i>
                      <span className="msg-count">5</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a className="p-0" href="javascript:;">
                        <div className="msg-header w-100">
                          <h6 className="msg-header-title">5 New</h6>
                          <p className="msg-header-subtitle">
                            Application Notifications
                          </p>
                        </div>
                      </a>
                      <div className="header-notifications-list">
                        {/* {% if noti %}
                    {% for i in noti %}
                    <a className="dropdown-item" href="{% url 'Fin_Anotification' %}">
                      <div className="media align-items-center">
                        <div className="notify bg-light-primary text-primary"><i className="bx bx-file"></i>
                        </div>
                        <div className="media-body">
                          <h6 className="msg-name">{{i.Title}}<span className="msg-time float-right">{{i.date_created}} {{i.time}}</span></h6>
                          <p className="msg-info">{{i.Discription|truncatewords:4}}</p>
                        </div>
                      </div>
                    </a>
                    {% endfor %} */}
                      </div>
                      <a href="{% url 'Fin_Anotification' %}">
                        <div className="text-center msg-footer">
                          View All Notifications
                        </div>
                      </a>
                      {/* {% else %} */}

                      {/* <p className="msg-info text-center mt-5">Notifications is not found</p> */}
                      {/* {% endif %} */}
                    </div>
                  </li>
                  <li className="nav-item dropdown dropdown-user-profile">
                    <a
                      className="nav-link dropdown-toggle dropdown-toggle-nocaret"
                      href="javascript:;"
                      data-toggle="dropdown"
                    >
                      <div className="media user-box align-items-center">
                        <div className="media-body user-info">
                          <p className="user-name mb-0">
                            <label
                              style={{ textAlign: "center", fontSize: "15px" }}
                            >
                              {loginName}
                            </label>
                          </p>
                          <p className="designattion mb-0">Online</p>
                        </div>
                        {loginImage && loginImage != "" ? (
                          <img src={loginImage} className="user-img" />
                        ) : (
                          <img
                            src={`${process.env.PUBLIC_URL}/static/assets/images/user-1.jpg`}
                            className="user-img"
                          />
                        )}
                      </div>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <Link
                        className="dropdown-item justify-content-start"
                        to="/company_profile"
                      >
                        <i className="bx bx-user"></i>
                        <span>Profile</span>
                      </Link>
                      <Link
                        className="dropdown-item justify-content-start"
                        to="/company_home"
                      >
                        <i className="bx bx-tachometer"></i>
                        <span>Dashboard</span>
                      </Link>
                      <div className="dropdown-divider mb-0"></div>
                      <a
                        className="dropdown-item justify-content-start"
                        onClick={handleLogout}
                      >
                        <i className="bx bx-power-off"></i>
                        <span>Logout</span>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
          </header>
          {/* <!--end header--> */}

          {/* <!--navigation--> */}
          <div
            id="nav1"
            className="nav-container"
            style={{ backgroundColor: "#213b52" }}
          >
            <nav className="topbar-nav">
              <ul className="metismenu" id="menu">
                <li>
                  <Link to="/company_home">
                    <div className="menu-title">Dashboard</div>
                  </Link>
                </li>
                {is_company ? (
                  <li>
                    <a
                      href="javascript:;"
                      class="has-arrow"
                      onClick={() => showMenu()}
                    >
                      <div class="parent-icon">
                        <i class="bx bxs-user"></i>
                      </div>
                      <div class="menu-title">Staff</div>
                    </a>
                    <ul className="submenu">
                      <li id="items">
                        <Link to="/staff_requests">
                          <i class="bx bx-right-arrow-alt"></i>Staff Requests
                        </Link>
                      </li>
                      <li id="pricelist">
                        <Link to="/all_staffs">
                          <i class="bx bx-right-arrow-alt"></i>All Staff
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : null}
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </nav>
          </div>

          {/* {% endif %} */}
          <div className="page-wrapper">
            <div
              className="page-content-wrapper"
              style={{ backgroundColor: "#2f516f" }}
            >
              <div className="container pt-3">
                {/* {% for message in messages %}
            {% if message %}
            <div className="alert" onclick="this.parentElement.style.display='none';">
              <div className="row d-flex">
                <div className="col-md-12">
                  <center>
                    <h5 style={{color: "goldenrod"}}>{{ message }}</h5>
                  </center>
                </div>
              </div>
            </div>
            {% endif %}
            {% endfor %} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FinBase;