import React, { useEffect, useState } from "react";
import "../styles/DistributorBase.css";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../functions/config";
function DistributorBase() {
  const navigate = useNavigate();
  function handleLogout() {
    Cookies.remove("User");
    Cookies.remove("Login_id");
    navigate("/");
  }

  const [noti, setNoti] = useState(false);
  const [notification, setNotification] = useState([]);
  const fetchNotifications = () => {
    axios
      .get(`${config.base_url}/fetch_dist_notifications/${ID}/`)
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

  function formatTimeInput(timeString) {
      let [hours, minutes] = timeString.split(':').slice(0, 2);

      hours = parseInt(hours, 10);

      let meridiem = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Handle midnight (0) and noon (12)

      hours = String(hours).padStart(2, '0');
      minutes = String(minutes).padStart(2, '0');

      return `${hours}:${minutes} ${meridiem}`;
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

  //   useEffect(() => {
  //     document.querySelector(".submenu").classList.add("mm-collapse");
  //   }, []);

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

  const [loginName, setLoginName] = useState('')
  const [loginImage, setLoginImage] = useState('');

  const ID = Cookies.get("Login_id");
  const getDistributorDetails = () => {
    axios
      .get(`${config.base_url}/user/${ID}/`)
      .then((res) => {
        console.log('RESPONSE==',res)
        if(res.data.status){
          const details = res.data.data
          var logImg = null;
          if(details.image){
            logImg = `${config.base_url}/${details.image}`;
          }          
          setLoginImage(logImg)
          setLoginName(details.name);
        }
      })
      .catch((err) => {
        console.log("ERROR==",err)
      });
  };

  useEffect(()=>{
    getDistributorDetails();
  },[])

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
                        <a href="">Item</a>
                      </li>
                      <li>
                        <a href="">Online Banking</a>
                      </li>
                      <li>
                        <a href="">Bank Reconcilation</a>
                      </li>
                      <li>
                        <a href="">Sales Records</a>
                      </li>
                      <li>
                        <a href="">Invoices</a>
                      </li>
                      <li>
                        <a href="">Customers</a>
                      </li>
                      <li>
                        <a href="">Product and Services</a>
                      </li>
                      <li>
                        <a href="">Expenses</a>
                      </li>
                      <li>
                        <a href="">Suppliers</a>
                      </li>
                      <li>
                        <a href="">Chart of Accounts</a>
                      </li>
                      <li>
                        <a href="">Reconcile</a>
                      </li>
                      <li>
                        <a href="">Cash Position</a>
                      </li>
                      <li>
                        <a href="">Reconcile</a>
                      </li>
                      <li>
                        <a href="">Cash Position</a>
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
                        <a href="">Cash In Hand</a>
                      </li>
                      <li>
                        <a href="">Offline Banking</a>
                      </li>
                      <li>
                        <a href="">Loan Account</a>
                      </li>
                      <li>
                        <a href="">Sales</a>
                      </li>
                      <li>
                        <a href="">Employee</a>
                      </li>
                      <li>
                        <a href="">Employee Loan</a>
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
                                  <Link
                                    className="dropdown-item w-100"
                                    to="/distributor_notifications"
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
                                        <p className="msg-info">
                                          {item.desc}
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              <Link
                                className="w-100 justify-content-center"
                                to="/distributor_notifications"
                              >
                                <p className="msg-info text-center">
                                  View All Notifications
                                </p>
                                {/* <div className="text-center msg-footer w-100">View All Notifications</div> */}
                              </Link>
                            </>
                          ) : (
                            <p className="msg-info text-center mt-5">
                              Notifications is not found
                            </p>
                          )}
                        </div>
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
                          <img
                          src={loginImage}
                          className="user-img"
                        />
                        ):(
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
                        to="/distributor_profile"
                      >
                        <i className="bx bx-user"></i>
                        <span>Profile</span>
                      </Link>
                      <Link
                        className="dropdown-item justify-content-start"
                        to="/distributor_home"
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
                  <Link to="/distributor_home" className="has-arrow">
                    <div className="parent-icon">
                      <i className="bx bx-home-alt"></i>
                    </div>
                    <div className="menu-title">Dashboard</div>
                  </Link>
                </li>
                <li>
                  <a href="#" className="has-arrow">
                    <div className="parent-icon">
                      <i className="fa fa-tags"></i>
                    </div>
                    <div className="menu-title">Trial Period</div>
                  </a>
                </li>
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

export default DistributorBase;
