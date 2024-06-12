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

  const fetchNotifications = () => {
    axios
      .get(`${config.base_url}/fetch_notifications/${ID}/`)
      .then((res) => {
        console.log("NOTIFICATIONS", res);
        if (res.data.status) {
          var ntfs = res.data.notifications;
          setNoti(res.data.status);
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
      document.querySelector(".submenu").classList.add("mm-collapse");
    } catch (error) {}
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
                  <b>Fin sYs</b>
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
                      <span className="msg-count">{notification.length}</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a className="p-0" href="javascript:;">
                        <div className="msg-header w-100">
                          <h6 className="msg-header-title">
                            {notification.length} New
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
                                href="{% url 'Fin_Cnotification' %}"
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
                              href="{% url 'Fin_Cnotification' %}"
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
                      <span className="msg-count">{notification.length}</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a className="p-0" href="javascript:;">
                        <div className="msg-header w-100">
                          <h6 className="msg-header-title">
                            {notification.length} New
                          </h6>
                          <p className="msg-header-subtitle">
                            Application Notifications
                          </p>
                        </div>
                      </a>
                      <div className="header-notifications-list">
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
                    onClick={() => showMenu()}
                  >
                    <div className="parent-icon">
                      <i className="bx bxs-user"></i>
                    </div>
                    <div className="menu-title">Staff</div>
                  </a>
                  <ul className="submenu">
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
      {/* </div> */}
    </>
  );
}

export default FinBase;
