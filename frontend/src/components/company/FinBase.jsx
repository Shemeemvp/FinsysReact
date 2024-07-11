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
  const ID = Cookies.get("Login_id");
  const [noti, setNoti] = useState(false);
  const [notification, setNotification] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [custCreditLimitAlerts, setCustCreditLimitAlerts] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchNotifications = () => {
    axios
      .get(`${config.base_url}/fetch_notifications/${ID}/`)
      .then((res) => {
        console.log("NOTIFICATIONS", res);
        if (res.data.status) {
          var ntfs = res.data.notifications;
          setNoti(res.data.status);
          setNotificationCount(res.data.count);
          setNotification([]);
          ntfs.map((i) => {
            var obj = {
              title: i.Title,
              desc: i.Discription,
              date: i.date_created,
              time: i.time,
            };
            setNotification((prevState) => [...prevState, obj]);
          });
        }
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchMinStockAlerts = () => {
    axios
      .get(`${config.base_url}/fetch_min_stock_alerts/${ID}/`)
      .then((res) => {
        console.log("STOCK", res);
        if (res.data.status) {
          var ntfs = res.data.minStockAlerts;
          setStockAlerts([]);
          setNoti(res.data.status);
          setNotificationCount(res.data.count);
          ntfs.map((i) => {
            var obj = {
              title: i.Title,
              desc: i.Discription,
              date: i.date_created,
              time: i.time,
            };
            setStockAlerts((prevState) => [...prevState, obj]);
          });
        }
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  };

  useEffect(() => {
    fetchMinStockAlerts();
  }, []);

  const fetchCustCreditLimitAlerts = () => {
    axios
      .get(`${config.base_url}/fetch_cust_credit_limit_alerts/${ID}/`)
      .then((res) => {
        console.log("CUST CRED", res);
        if (res.data.status) {
          var ntfs = res.data.custCreditLimit;
          setCustCreditLimitAlerts([]);
          setNoti(res.data.status);
          setNotificationCount(res.data.count);
          ntfs.map((i) => {
            var obj = {
              title: i.Title,
              desc: i.Discription,
              date: i.date_created,
              time: i.time,
            };
            setCustCreditLimitAlerts((prevState) => [...prevState, obj]);
          });
        }
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  };

  useEffect(() => {
    fetchCustCreditLimitAlerts();
  }, []);

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
  function hideMenus(menuId){
    try {
      document.querySelectorAll("ul.submenu").forEach(element => {
        if(element.id != menuId){
          element.classList.remove("mm-show");
          element.classList.add("mm-collapse");
        }
      });
    } catch (error) {
      console.error("Error adding class to submenu elements:", error);
    }
  }
  const showMenu = (menuId) => {
    hideMenus(menuId)
    const element = document.getElementById(menuId);
    if (element) {
      if (element.classList.contains("mm-show")) {
        element.classList.remove("mm-show");
        element.classList.add("mm-collapse");
      } else {
        element.classList.add("mm-show");
        element.classList.remove("mm-collapse");
      }
    }
  };

  function hideRepSubMenus(menuId){
    try {
      document.querySelectorAll("ul.reportSub").forEach(element => {
        if(element.id != menuId){
          element.classList.remove("mm-show");
          element.classList.add("mm-collapse");
        }
      });
    } catch (error) {
      console.error("Error adding class to submenu elements:", error);
    }
  }

  const showRepSubMenu = (menuId) => {
    hideRepSubMenus(menuId)
    const element = document.getElementById(menuId);
    if (element) {
      if (element.classList.contains("mm-show")) {
        element.classList.remove("mm-show");
        element.classList.add("mm-collapse");
      } else {
        element.classList.add("mm-show");
        element.classList.remove("mm-collapse");
      }
    }
  };

  function toggleSidebar() {
    // var wrapper = document.getElementById("headerWrapper");
    var wrapper = document.querySelector(".wrapper");

    if (wrapper.classList.contains("toggled")) {
      wrapper.classList.add("toggled");
      wrapper.classList.remove("toggled");
    } else {
      wrapper.classList.remove("toggled");
      wrapper.classList.add("toggled");
    }
  }

  useEffect(() => {
    try {
      document.querySelectorAll("ul.submenu").forEach(element => {
        element.classList.add("mm-collapse");
      });
    } catch (error) {
      console.error("Error adding class to submenu elements:", error);
    }

    try {
      document.querySelectorAll("ul.reportSub").forEach(element => {
        element.classList.add("mm-collapse");
      });
    } catch (error) {
      console.error("Error adding class to reportSub elements:", error);
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

  const getLogDetails = () => {
    axios
      .get(`${config.base_url}/user/${ID}/`)
      .then((res) => {
        console.log("BASE RESPONSE==", res);
        if (res.data.status) {
          const details = res.data.data;
          var logImg = null;
          if (details.image) {
            logImg = `${config.base_url}/${details.image}`;
          }
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

  function formatTimeInput(timeString) {
    let [hours, minutes] = timeString.split(":").slice(0, 2);

    hours = parseInt(hours, 10);

    let meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Handle midnight (0) and noon (12)

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");

    return `${hours}:${minutes} ${meridiem}`;
  }

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
        {/* <script
          src={`${process.env.PUBLIC_URL}/static/assets/js/jquery.min.js`}
        ></script> */}
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/js/popper.min.js`}
        ></script>
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/js/bootstrap.min.js`}
        ></script>

        {/* <!--plugins--> */}

        <script
          src={`${process.env.PUBLIC_URL}/static/assets/plugins/metismenu/js/metisMenu.min.js`}
        ></script>
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/js/index.js`}
        ></script>
        {/* <!-- App JS --> */}
        <script
          src={`${process.env.PUBLIC_URL}/static/assets/js/app.js`}
        ></script>
      </Helmet>
      {/* <!-- wrapper --> */}
      {/* <div className="wrapper"> */}
      {/* <!--header--> */}
      <div className="wrapper headerWrapper" id="headerWrapper">
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
                  <b>Accuhub</b>
                </h4>
              </div>
              <a
                href="javascript:;"
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
                    className="one"
                    style={{ backgroundColor: "#213b52" }}
                  >
                    <li>
                      <a href="">Dashboard</a>
                    </li>

                    <li>
                      <a href="">Staff Requests</a>
                    </li>
                    <li>
                      <a href="">All Staff</a>
                    </li>

                    <li>
                      <a href="">Item</a>
                    </li>
                    <li>
                      <a href="">Price Lists</a>
                    </li>
                    <li>
                      <a href="">Stock Adjustments</a>
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
                      <a href="">Offline Banking</a>
                    </li>
                    <li>
                      <a href="">Bank Holders</a>
                    </li>
                    <li>
                      <a href="">Cash In Hand</a>
                    </li>
                    <li>
                      <a href="">Cheques</a>
                    </li>
                    <li>
                      <a href="">Loan Account</a>
                    </li>
                    <li>
                      <a href="">UPI</a>
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
                      <a href="">Customers</a>
                    </li>
                    <li>
                      <a href="">Estimate</a>
                    </li>
                    <li>
                      <a href="">Sales Order</a>
                    </li>
                    <li>
                      <a href="">Invoices</a>
                    </li>
                    <li>
                      <a href="">Credit Note</a>
                    </li>
                    <li>
                      <a href="">Payments Received</a>
                    </li>
                    <li>
                      <a href="">Retainer Invoices</a>
                    </li>
                    <li>
                      <a href="">Delivery Challan</a>
                    </li>
                    <li>
                      <a href="">Recurring Invoices</a>
                    </li>

                    <li>
                      <a href="">Vendor</a>
                    </li>
                    <li>
                      <a href="">Purchase Order</a>
                    </li>
                    <li>
                      <a href="">Bill</a>
                    </li>
                    <li>
                      <a href="">Expenses</a>
                    </li>
                    <li>
                      <a href="">Payment Made</a>
                    </li>
                    <li>
                      <a href="">Debit Note</a>
                    </li>
                    <li>
                      <a href="">Recurring Bill</a>
                    </li>

                    <li>
                      <a href="">Transaction Reports</a>
                    </li>
                    <li>
                      <a href="">Bill Details</a>
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
                      <a href="">Purchase by Vendor</a>
                    </li>
                    <li>
                      <a href="">Purchase by Item</a>
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
                      <a href="">Aging Summary</a>
                    </li>
                    <li>
                      <a href="">Aging Details</a>
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
                      <a href="">
                        <i className="bx bx-right-arrow-alt"></i> Outstanding
                        Payables{" "}
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <i className="bx bx-right-arrow-alt"></i> Outstanding
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
                      <a href="">Eway Bills</a>
                    </li>

                    <li>
                      <a href="">Chart of Accounts</a>
                    </li>
                    <li>
                      <a href="">Manual Journal</a>
                    </li>

                    <li>
                      <a href="">Employee</a>
                    </li>
                    <li>
                      <a href="">Employee Loan</a>
                    </li>
                    <li>
                      <a href="">Holidays</a>
                    </li>
                    <li>
                      <a href="">Attendance</a>
                    </li>
                    <li>
                      <a href="">Salary Details</a>
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
                {is_company ? (
                  <li className="nav-item dropdown dropdown-lg">
                    <a
                      className="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative"
                      href="javascript:;"
                      data-toggle="dropdown"
                    >
                      <i
                        className="bx bx-bell vertical-align-middle"
                        style={{ fontSize: "25px" }}
                      ></i>
                      <span className="msg-count">{notificationCount}</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a className="p-0" href="javascript:;">
                        <div className="msg-header w-100">
                          <h6 className="msg-header-title">
                            {notificationCount} New
                          </h6>
                          <p className="msg-header-subtitle">
                            Application Notifications
                          </p>
                        </div>
                      </a>
                      <div className="header-notifications-list">
                        {noti ? (
                          <>
                            {notification.map((item) => (
                              <a
                                className="dropdown-item w-100"
                                href="#"
                              >
                                <div className="media align-items-center w-100">
                                  <div className="notify bg-light-primary text-primary">
                                    <i className="bx bx-file"></i>
                                  </div>
                                  <div className="media-body">
                                    <h6 className="msg-name w-100">
                                      {item.title}
                                      <span className="msg-time float-right">
                                        {item.date} {formatTimeInput(item.time)}
                                      </span>
                                    </h6>
                                    <p className="msg-info">{item.desc}</p>
                                  </div>
                                </div>
                              </a>
                            ))}
                            {stockAlerts.map((item) => (
                              <a
                                className="dropdown-item w-100"
                                href="#"
                              >
                                <div className="media align-items-center w-100">
                                  <div className="notify bg-light-primary text-primary">
                                    <i className="bx bx-file"></i>
                                  </div>
                                  <div className="media-body">
                                    <h6 className="msg-name w-100">
                                      {item.title}
                                      <span className="msg-time float-right">
                                        {item.date} {formatTimeInput(item.time)}
                                      </span>
                                    </h6>
                                    <p className="msg-info">{item.desc}</p>
                                  </div>
                                </div>
                              </a>
                            ))}
                            {custCreditLimitAlerts.map((item) => (
                              <a
                                className="dropdown-item w-100"
                                href="#"
                              >
                                <div className="media align-items-center w-100">
                                  <div className="notify bg-light-primary text-primary">
                                    <i className="bx bx-file"></i>
                                  </div>
                                  <div className="media-body">
                                    <h6 className="msg-name w-100">
                                      {item.title}
                                      <span className="msg-time float-right">
                                        {item.date} {formatTimeInput(item.time)}
                                      </span>
                                    </h6>
                                    <p className="msg-info">{item.desc}</p>
                                  </div>
                                </div>
                              </a>
                            ))}
                            <a
                              className="w-100 justify-content-center"
                              href="#"
                            >
                              <p className="msg-info text-center">
                                View All Notifications
                              </p>
                              {/* <div className="text-center msg-footer w-100">View All Notifications</div> */}
                            </a>
                          </>
                        ) : (
                          <p className="msg-info text-center mt-5">
                            Notifications is not found
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ) : (
                  <li className="nav-item dropdown dropdown-lg">
                    <a
                      className="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative"
                      href="javascript:;"
                      data-toggle="dropdown"
                    >
                      <i
                        className="bx bx-bell vertical-align-middle"
                        style={{ fontSize: "25px" }}
                      ></i>
                      <span className="msg-count">{notificationCount}</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a className="p-0" href="javascript:;">
                        <div className="msg-header w-100">
                          <h6 className="msg-header-title">
                            {notificationCount} New
                          </h6>
                          <p className="msg-header-subtitle">
                            Application Notifications
                          </p>
                        </div>
                      </a>
                      <div className="header-notifications-list">
                        {stockAlerts.map((item) => (
                          <a
                            className="dropdown-item w-100"
                            href="#"
                          >
                            <div className="media align-items-center w-100">
                              <div className="notify bg-light-primary text-primary">
                                <i className="bx bx-file"></i>
                              </div>
                              <div className="media-body">
                                <h6 className="msg-name w-100">
                                  {item.title}
                                  <span className="msg-time float-right">
                                    {item.date} {formatTimeInput(item.time)}
                                  </span>
                                </h6>
                                <p className="msg-info">{item.desc}</p>
                              </div>
                            </div>
                          </a>
                        ))}
                        {custCreditLimitAlerts.map((item) => (
                          <a
                            className="dropdown-item w-100"
                            href="#"
                          >
                            <div className="media align-items-center w-100">
                              <div className="notify bg-light-primary text-primary">
                                <i className="bx bx-file"></i>
                              </div>
                              <div className="media-body">
                                <h6 className="msg-name w-100">
                                  {item.title}
                                  <span className="msg-time float-right">
                                    {item.date} {formatTimeInput(item.time)}
                                  </span>
                                </h6>
                                <p className="msg-info">{item.desc}</p>
                              </div>
                            </div>
                          </a>
                        ))}
                        <a className="dropdown-item" href="javascript:;">
                          <div className="media align-items-center">
                            <div className="notify bg-light-primary text-primary">
                              <i className="bx bx-group"></i>
                            </div>
                            <div className="media-body">
                              <h6 className="msg-name">
                                New Customers
                                <span className="msg-time float-right">
                                  14 Sec ago
                                </span>
                              </h6>
                              <p className="msg-info">5 new user registered</p>
                            </div>
                          </div>
                        </a>
                        <a className="dropdown-item" href="javascript:;">
                          <div className="media align-items-center">
                            <div className="notify bg-light-danger text-danger">
                              <i className="bx bx-cart-alt"></i>
                            </div>
                            <div className="media-body">
                              <h6 className="msg-name">
                                New Orders{" "}
                                <span className="msg-time float-right">
                                  2 min ago
                                </span>
                              </h6>
                              <p className="msg-info">
                                You have recived new orders
                              </p>
                            </div>
                          </div>
                        </a>
                        <a className="dropdown-item" href="javascript:;">
                          <div className="media align-items-center">
                            <div className="notify bg-light-shineblue text-shineblue">
                              <i className="bx bx-file"></i>
                            </div>
                            <div className="media-body">
                              <h6 className="msg-name">
                                24 PDF File
                                <span className="msg-time float-right">
                                  19 min ago
                                </span>
                              </h6>
                              <p className="msg-info">
                                The pdf files generated
                              </p>
                            </div>
                          </div>
                        </a>
                        <a className="dropdown-item" href="javascript:;">
                          <div className="media align-items-center">
                            <div className="notify bg-light-shineblue text-shineblue">
                              <i className="bx bx-file"></i>
                            </div>
                            <div className="media-body">
                              <h6 className="msg-name">
                                24 PDF File
                                <span className="msg-time float-right">
                                  19 min ago
                                </span>
                              </h6>
                              <p className="msg-info">
                                The pdf files generated
                              </p>
                            </div>
                          </div>
                        </a>
                        <a className="dropdown-item" href="javascript:;">
                          <div className="media align-items-center">
                            <div className="notify bg-light-cyne text-cyne">
                              <i className="bx bx-send"></i>
                            </div>
                            <div className="media-body">
                              <h6 className="msg-name">
                                Time Response{" "}
                                <span className="msg-time float-right">
                                  28 min ago
                                </span>
                              </h6>
                              <p className="msg-info">
                                5.1 min avarage time response
                              </p>
                            </div>
                          </div>
                        </a>
                      </div>
                      <a
                        className="w-100 justify-content-center"
                        href="javascript:;"
                      >
                        <div className="text-center msg-footer">
                          View All Notifications
                        </div>
                      </a>
                    </div>
                  </li>
                )}
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
                      {loginImage ? (
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
                    className="has-arrow"
                    onClick={() => showMenu('staffSubmenu')}
                  >
                    <div className="parent-icon">
                      <i className="bx bxs-user"></i>
                    </div>
                    <div className="menu-title">Staff</div>
                  </a>
                  <ul className="submenu" id="staffSubmenu">
                    <li id="items">
                      <Link to="/staff_requests">
                        <i className="bx bx-right-arrow-alt"></i>Staff Requests
                      </Link>
                    </li>
                    <li id="pricelist">
                      <Link to="/all_staffs">
                        <i className="bx bx-right-arrow-alt"></i>All Staff
                      </Link>
                    </li>
                  </ul>
                </li>
              ) : null}
              <li>
                <a href="javascript:;" className="has-arrow" onClick={()=>{showMenu('itemsSubmenu')}}>
                  <div className="parent-icon"><i className='bx bxs-package'></i></div>
                  <div className="menu-title">Item</div>
                </a>
                <ul className="submenu" id="itemsSubmenu">
                  {/* {% if allmodules.Items == 1 %} */}
                  <li id="items"><Link to="/items"><i className="bx bx-right-arrow-alt"></i>Items</Link></li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Price_List == 1 %} */}
                  <li id="pricelist">
                    <Link to="/price_list"><i className="bx bx-right-arrow-alt"></i>Price Lists</Link>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Stock_Adjustment == 1 %} */}
                  <li id="stockadjustment"><Link to="/stock_adjust"><i className="bx bx-right-arrow-alt"></i>Stock Adjustments</Link></li>
                  {/* {% endif %} */}
                </ul>
              </li>
              <li>
                <a href="javascript:;" className="has-arrow" onClick={()=>{showMenu('cashBankSubmenu')}}>
                  <div className="parent-icon"><i className="bx bx-home-alt"></i>
                  </div>
                  <div className="menu-title" style={{marginRight: "20px"}}>Cash&Bank</div>
                </a>
                <ul className="submenu" id="cashBankSubmenu">
                  {/* {% if allmodules.Offline_Banking == 1 %} */}
                  
                  <li id="Offlinebanking"><Link to="/banking"><i className="bx bx-right-arrow-alt"></i>Offline
                      Banking</Link>
                  </li>
                  {/* {% endif %} */}

                  

                  {/* {% if allmodules.Bank_Holders == 1 %} */}
                 
                  <li id="bank_holder"><Link to="/banklist"><i className="bx bx-right-arrow-alt"></i>Bank Holders</Link></li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Cash_in_hand == 1 %} */}
                  <li id="cashinhands"><a href="{% url 'Fin_cashInHand' %}"><i className="bx bx-right-arrow-alt"></i>Cash
                      In Hand</a>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Cheque == 1 %} */}
                  <li id="cheques"><a href="{% url 'Fin_cheques' %}"><i className="bx bx-right-arrow-alt"></i>Cheques
                    </a>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Loan_Account == 1 %} */}
                  <li><a href="{% url 'loan_ac_listoutpage' %}"><i className="bx bx-right-arrow-alt"></i>Loan Account</a></li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.UPI == 1 %} */}
                  <li><a href="{% url 'Fin_upiPayments' %}"><i className="bx bx-right-arrow-alt"></i>UPI</a></li>
                  {/* {% endif %} */}
                </ul>
              </li>
              <li>
                <a href="javascript:;" className="has-arrow" onClick={()=>{showMenu('salesSubmenu')}}>
                  <div className="parent-icon"><i className="bx bx-file"></i>
                  </div>
                  <div className="menu-title">Sales</div>
                </a>
                <ul className="submenu" id="salesSubmenu">
                  {/* {% if allmodules.Customers == 1 %} */}
                  <li id="customers"><Link to="/customers"><i className="bx bx-right-arrow-alt"></i>Customers</Link>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Estimate == 1 %} */}

                  <li id="estimate"><Link to="/Estimate"><i className="bx bx-right-arrow-alt"></i>Estimate</Link>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Sales_Order == 1 %} */}
                  <li id="salesorder"><Link to="/sales_order"><i className="bx bx-right-arrow-alt"></i>Sales Order</Link>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Invoice == 1 %} */}
                  
                  <li id="invoices"><Link to="/invoice"><i className="bx bx-right-arrow-alt"></i>Invoices</Link>
                  </li>
                  {/* {% endif %} */}
            

                  {/* {% if allmodules.Credit_Note == 1 %} */}
                  <li id="creditnote">
                    <Link to="/credit_note"><i className="bx bx-right-arrow-alt"></i>Credit Note</Link>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Payment_Received == 1 %} */}
                  <li id="paymentsreceived"><Link to="/payment_received"><i className="bx bx-right-arrow-alt"></i>Payments Received</Link>
                  </li>
                  {/* {% endif %} */}
          
                  {/* {% if allmodules.Retainer_Invoice == 1 %} */}
                  <li id="retainerinvoices"><Link to="/ret_invoice"><i className="bx bx-right-arrow-alt"></i>Retainer Invoices</Link>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Delivery_Challan == 1 %} */}
                  <li id="deliverychallan"><Link to="/delivery_challan"><i className="bx bx-right-arrow-alt"></i> Delivery Challan</Link>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Recurring_Invoice == 1 %} */}
                  <li id="reccuringinvoices"><Link to="/rec_invoice"><i className="bx bx-right-arrow-alt"></i> Recurring Invoices</Link>
                  </li>
                  {/* {% endif %} */}
                </ul>
              </li>
              <li>
                <a href="javascript:;" className="has-arrow" onClick={()=>{showMenu('purchaseSubmenu')}}>
                  <div className="parent-icon"><i className='bx bx-briefcase-alt'></i>
                  </div>
                  <div className="menu-title">Purchase</div>
                </a>
                <ul className="submenu" id="purchaseSubmenu">
                  {/* {% if allmodules.Vendors == 1 %} */}
                  {/* <li id="vendor"><a href="{% url 'Fin_vendors' %}"><i className="bx bx-right-arrow-alt"></i>Vendor</a> */}
                  <li id="vendor"><Link to="/vendors"><i className="bx bx-right-arrow-alt"></i>Vendor</Link>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Purchase_Order == 1 %} */}
                  <li id="purchaseorder"><a href="{% url 'Fin_purchaseOrder' %}"><i className="bx bx-right-arrow-alt"></i>Purchase Order</a>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Bills == 1 %} */}
                  <li id="bill"><a href="{% url 'Fin_List_Purchase_Bill' %}"><i className="bx bx-right-arrow-alt"></i>Bill</a>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Expenses == 1 %} */}
                  <li id="expense"><Link to="/expense"><i className="bx bx-right-arrow-alt"></i>Expense</Link>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Payment_Made == 1 %} */}
                  <li id="payment"><a href="{% url 'Fin_paymentmade' %}"><i className="bx bx-right-arrow-alt"></i>Payment Made</a>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Debit_Note == 1 %} */}
                  <li id="debitnote"><a href="{% url 'Fin_debitnotelist' %}"><i className="bx bx-right-arrow-alt"></i>Debit Note</a>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Recurring_Bills == 1 %} */}
                  <li id="recurringbill"><Link to="/rec_bill"><i className="bx bx-right-arrow-alt"></i>Recurring Bill</Link>
                  </li>
                  {/* {% endif %} */}
                  
                </ul>
              </li>
              <li>
                <a href="javascript:;" className="has-arrow" onClick={()=>showMenu('reportsSubmenu')}>
                  <div className="parent-icon"><i className="bx bx-comment-edit"></i></div>
                  <div className="menu-title">Reports</div>
                </a>
                <ul className="submenu" id="reportsSubmenu">
                  <li id="transactonreport" onClick={()=>showRepSubMenu('transSub')}>
                    <a><i className="bx bx-right-arrow-alt"></i>Transaction Reports</a>
                    <ul className="px-4 reportSub" id="transSub">
                      <li><a href=""><i className="bx bx-right-arrow-alt"></i>Sales</a></li>
                      <ul className="px-4">
                        <li><a href="{% url 'Fin_salesByCustomerReport' %}"><i className="bx bx-right-arrow-alt"></i>Sales by Customer</a></li>
                        <li><a href="{% url 'Fin_salesByItemReport' %}"><i className="bx bx-right-arrow-alt"></i>Sales By Item</a></li>
                      </ul>
                      <li><a href=""><i className="bx bx-right-arrow-alt"></i>Purchase</a></li>
                      <ul className="px-4">
                        <li><a href="{% url 'Fin_purchase_report_vendor' %}"><i className="bx bx-right-arrow-alt"></i>Purchase by Vendor</a></li>
                        <li><a href="{% url 'Fin_purchase_report_item' %}"><i className="bx bx-right-arrow-alt"></i>Purchase By Item</a></li>
                      </ul>
                      <li><a href="{% url 'alltransactions' %}"><i className="bx bx-right-arrow-alt"></i>All Transactions</a></li>
                      <li><a href="{% url 'Fin_cashFlowReport' %}"><i className="bx bx-right-arrow-alt"></i>Cash Flow</a></li>
                      <li><a href="{% url 'Fin_dayBookReport' %}"><i className="bx bx-right-arrow-alt"></i>Day Book</a></li>
                      <li><a href="{% url 'Fin_trial_balance' %}"><i className="bx bx-right-arrow-alt"></i>Trial Balance</a></li>
                      <li><a href=""><i className="bx bx-right-arrow-alt"></i>Profit and Loss</a></li>
                      <li><a href=""><i className="bx bx-right-arrow-alt"></i>Balance Sheet</a></li>
                    </ul>
                  </li>
                  <li id="stock" onClick={()=>showRepSubMenu('stockSub')}>
                    <a><i className="bx bx-right-arrow-alt"></i>Stock Reports </a>
                    <ul className="px-4 reportSub" id="stockSub">
                      <li><a href=""><i className="bx bx-right-arrow-alt"></i>Stock Summary </a></li>
                      <li><a href="{% url 'Fin_stockDetailsReport' %}"><i className="bx bx-right-arrow-alt"></i>Stock Details</a></li>
                      <li><a href="{%url 'Fin_InventoryItemReport' %}"><i className="bx bx-right-arrow-alt"></i>Stock Valuation Summary</a></li>
                      <li><a href="{% url 'Fin_lowstockDetailsReport' %}"><i className="bx bx-right-arrow-alt"></i> Low Stock Details</a></li>
                      <li><a href="{% url 'Fin_sales_item_DiscountReport' %}"><i className="bx bx-right-arrow-alt"></i>Sales Item Discount Details</a></li>
                      <li><a href="{% url 'Fin_itemReportByParty' %}"><i className="bx bx-right-arrow-alt"></i>Item Report by Party</a></li>
                    </ul>
                  </li>
                  <li id="party" onClick={()=>showRepSubMenu('partySub')}>
                    <a><i className="bx bx-right-arrow-alt"></i>Party Reports</a>
                    <ul className="px-4 reportSub" id="partySub">
                      <li><a href="{% url 'Fin_partyStatementReport' %}"><i className="bx bx-right-arrow-alt"></i>Party Statements</a></li>
                      <li><a href="{% url 'Fin_allPartiesReport' %}"><i className="bx bx-right-arrow-alt"></i>All Parties</a></li>
                      <li><a href="{% url 'Fin_partyReportByItem' %}"><i className="bx bx-right-arrow-alt"></i>Party Report by Item</a></li>
                      <li><a href="{% url 'Fin_salespurchasebypartyReport' %}"><i className="bx bx-right-arrow-alt"></i>Sale purchase By Party </a></li>
                    </ul>
                  </li>
                  <li id="gstreports" onClick={()=>showRepSubMenu('gstrSub')}>
                    <a><i className="bx bx-right-arrow-alt"></i>GST Reports</a>
                    <ul className="px-4 reportSub" id="gstrSub">
                      <li><a href="{% url 'gstr1' %}">GSTR-1</a></li>
                      <li><a href="{% url 'gstr2' %}">GSTR-2</a></li>
                      <li><a href="">GSTR-3B</a></li>
                      <li><a href="">GSTR-9</a></li>
                      <li><a href="{% url 'sale_summary_byHSN' %}">Sale Summary by HSN</a></li>
                    </ul>
                  </li>
                  <li id="accountsreceivables" onClick={()=>showRepSubMenu('receivableSub')}>
                    <a><i className="bx bx-right-arrow-alt"></i>Accounts Receivable</a>
                    <ul className="px-4 reportSub" id="receivableSub">
                      <li><a href="{% url 'Fin_customerbalence' %}"><i className="bx bx-right-arrow-alt"></i>Customer Balances</a></li>
                      <li><a href="{% url 'Fin_aging_summary' %}"><i className="bx bx-right-arrow-alt"></i>Aging Summary</a></li>
                      <li><a href="{% url 'Fin_aging_details' %}"><i className="bx bx-right-arrow-alt"></i>Aging Details</a></li>
                      <li><a href="{% url 'Fin_Invoice_Report' %}"><i className="bx bx-right-arrow-alt"></i> Invoice Details </a></li>
                      <li><a href="{% url 'Fin_recInvoice_report' %}"><i className="bx bx-right-arrow-alt"></i>Recurring Invoice Details</a></li>
                      <li><a href="{% url 'Fin_Retainer_Report' %}"><i className="bx bx-right-arrow-alt"></i>Retainer Invoice Details </a></li>
                      <li><a href="{% url 'Fin_salesOrderDetailsReport' %}"><i className="bx bx-right-arrow-alt"></i>Sales Order Details</a></li>
                      <li><a href="{% url 'Fin_sales_order_item_details' %}"><i className="bx bx-right-arrow-alt"></i>Sales Order Item </a></li>
                      <li><a href="{% url 'Fin_estimate_report' %}"><i className="bx bx-right-arrow-alt"></i>Estimate Details</a></li>
                      <li><a href="{% url 'Fin_report_account_outstanding_receivable' %}"><i className="bx bx-right-arrow-alt"></i> Outstanding Receivables </a></li>
                    </ul>
                  </li>

                  <li id="crd" onClick={()=>showRepSubMenu('paymentSub')}>
                    <a><i className="bx bx-right-arrow-alt"></i>Payments Received </a>
                    <ul className="px-4 reportSub" id="paymentSub">
                      <li><a href="{%url 'Fin_paymentRecivedReport' %}"><i className="bx bx-right-arrow-alt"></i> Payments Received Summary</a></li>
                      <li><a href="{% url 'Fin_PaymentReceived_report' %}"><i className="bx bx-right-arrow-alt"></i> Payments Received </a></li>
                      <li><a href="{% url 'Fin_creditnoteReport' %}"><i className="bx bx-right-arrow-alt"></i>Credit Note Details</a></li>
                    </ul>
                  </li>

                  <li id="accountspayables" onClick={()=>showRepSubMenu('payableSub')}>
                    <a><i className="bx bx-right-arrow-alt"></i>Accounts Payable</a>
                    <ul className="px-4 reportSub" id="payableSub">
                      <li><a href="{% url 'Fin_venderbalance' %}"><i className="bx bx-right-arrow-alt"></i>Vendor Balances</a></li>
                      <li><a href="{% url 'Fin_report_bill_details' %}"><i className="bx bx-right-arrow-alt"></i> Bill Details</a></li>
                      <li><a href="{% url 'Fin_recBill_report' %}"><i className="bx bx-right-arrow-alt"></i>Recurring Bill Details</a></li>
                      <li><a href="{% url 'Fin_purchaseOrderDetailsReport' %}"><i className="bx bx-right-arrow-alt"></i> Purchase Order Details</a></li>
                      <li><a href="{% url 'Fin_purchase_order_item_details' %}"><i className="bx bx-right-arrow-alt"></i>Purchase Order Item </a></li>
                      <li><a href="{% url 'Fin_paymentMadeSummaryReport' %}"><i className="bx bx-right-arrow-alt"></i>Payments Made Summary</a></li>
                      <li><a href="{% url 'Fin_Paymentmade_report' %}"><i className="bx bx-right-arrow-alt"></i>Payments Made</a></li>
                      <li><a href="{% url 'Fin_debitnotereport' %}"><i className="bx bx-right-arrow-alt"></i> Debit Note Details</a></li>
                      <li><a href="{% url 'Fin_report_account_outstanding_payables' %}"><i className="bx bx-right-arrow-alt"></i> Outstanding Payables </a></li>
                    </ul>
                  </li>
                  
                  <li id="stocksummary"><a href="{% url 'stocksummary' %}"><i className="bx bx-right-arrow-alt"></i>Stock Summary </a></li>
                    {/* <!-- <li id="stockvaluation"><a href=""><i className="bx bx-right-arrow-alt"></i>Stock Valuation</a></li> -->  */}
                    {/* <!-- <li id="salessummaryreport"><a href=""><i className="bx bx-right-arrow-alt"></i>Sales Summary Report</a></li>
                    <li id="salessummaryreport"><a href=""><i className="bx bx-right-arrow-alt"></i>Purchase Order Details</a></li>
                    <li id="salessummaryreport"><a href=""><i className="bx bx-right-arrow-alt"></i>Purchase Order By Vendor</a></li>
                    <li id="salessummaryreport"><a href=""><i className="bx bx-right-arrow-alt"></i> Recurring Bill Report</a></li> --> */}
                    <li id="expense">
                      <a href="{% url 'Fin_expenseReport' %}"><i className="bx bx-right-arrow-alt"></i>Expense Report </a>
                    </li>
                    <li id="ewaybill">
                      <a href="{% url 'Fin_ewayBillReport' %}"><i className="bx bx-right-arrow-alt"></i>EWay Bill Report </a>
                    </li>
                    <li id="stocksummary"><a href="{% url 'Fin_journel_report' %}"><i className="bx bx-right-arrow-alt"></i>Journal Report </a></li>

                    <li><a href="{% url 'Fin_employee_loan_statement_report' %}"><i className="bx bx-right-arrow-alt"></i>Employee Loan Statement</a></li>
                    
                    <li id="business" onClick={()=>showRepSubMenu('businessSub')}>
                      <a><i className="bx bx-right-arrow-alt"></i>Business Status</a>
                      <ul className="px-4 reportSub" id="businessSub">
                        <li><a href="{% url 'Fin_BankReport' %}"><i className="bx bx-right-arrow-alt"></i> Bank Statement</a></li>
                        <li><a href="{% url 'Fin_loanAccountReport' %}"><i className="bx bx-right-arrow-alt"></i> Loan Statement</a></li>
                        
                        <li id="discountreport"><a href="{% url 'Fin_discount_report' %}"><i className="bx bx-right-arrow-alt"></i>Discount Report </a></li>
                      </ul>
                    </li>
                </ul>
              </li>
              {/* {% if allmodules.EWay_Bill == 1 %} */}

              <li>
                <a href="{% url 'Fin_Eway_bills' %}" className="has-arrow">
                  <div className="parent-icon"><i className="bx bx-file"></i>
                  </div>
                  <div className="menu-title">Eway Bill</div>
                </a>
                
              </li>
              {/* {% endif %} */}
              
              <li>
                <a href="javascript:;" className="has-arrow" onClick={()=>{showMenu('accountingSubmenu')}}>
                  <div className="parent-icon"><i className="bx bx-line-chart"></i>
                  </div>
                  <div className="menu-title">Accounting</div>
                </a>
                <ul className="submenu" id="accountingSubmenu">
                  

                  {/* {% if allmodules.Chart_of_Accounts == 1 %} */}
                  <li id="chartofaccounts"><Link to="/chart_of_accounts"><i className="bx bx-right-arrow-alt"></i>Chart of
                      Accounts</Link>
                  </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Manual_Journal == 1 %} */}
                  <li id="manualjournal"><a href="{% url 'Fin_manualJournals' %}"><i className="bx bx-right-arrow-alt"></i>Manual Journal
                    </a>
                  </li>
                  {/* {% endif %} */}

                  
                </ul>
              </li>
            
              <li>
                <a href="javascript:;" className="has-arrow" onClick={()=>{showMenu('payrollSubmenu')}}>
                  <div className="parent-icon"><i className="bx bx-money"></i>
                  </div>
                  <div className="menu-title">Payroll</div>
                </a>
                <ul className="submenu" id="payrollSubmenu">
                  

                  {/* {% if allmodules.Employees == 1 %} */}
                  <li id="employee"><Link to="/employee"><i className="bx bx-right-arrow-alt"></i>Employee</Link></li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Employees_Loan == 1 %} */}
                  <li id="employeeloan"><a href="{% url 'employee_loan_list' %}"><i className="bx bx-right-arrow-alt"></i>Employee Loan</a> </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Holiday == 1 %} */}
                  <li><a href="{% url 'holiday_list' %}"><i className="bx bx-right-arrow-alt"></i>Holidays</a> </li>
                  {/* {% endif %} */}

                  {/* {% if allmodules.Attendance == 1 %} */}
                  <li><a href="{% url 'Fin_Attendance' %}"><i className="bx bx-right-arrow-alt"></i>Attendance</a> </li>
                  {/* {% endif %} */}
                  {/* {% if allmodules.Salary_Details == 1 %} */}
                  <li><a href="{% url 'Fin_salary_details' %}"><i className="bx bx-right-arrow-alt"></i>Salary Details</a> </li>
                  {/* {% endif %} */}
                </ul>
              </li>
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
      {/* </div> */}
    </>
  );
}

export default FinBase;
