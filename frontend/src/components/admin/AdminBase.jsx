import React from "react";

function AdminBase() {
  var listItems = document.querySelectorAll("#myList li");
  listItems.forEach(function (item) {
    item.style.display = "none";
  });

  function filter() {
    var value = document.getElementById("myInput").value.toLowerCase();

    listItems.forEach(function (item) {
      if (value !== "") {
        var text = item.textContent.toLowerCase();
        item.style.display = text.indexOf(value) > -1 ? "" : "none";
      } else {
        item.style.display = "none";
      }
    });
  }

  return (
    <>
      {/* <!-- wrapper --> */}
      <div className="wrapper">
        {/* <!--header--> */}
        <div className="wrapper">
          {/* <!--header--> */}
          <header className="top-header" style={{ backgroundColor: "#213b52" }}>
            <nav className="navbar navbar-expand">
              <div className="sidebar-header">
                <div className="d-none d-lg-flex">
                  <img
                    src="%PUBLIC_URL%/static/assets/images/logo-icon.png"
                    className="logo-icon-2"
                    alt=""
                  />
                </div>
                <div className="a">
                  <h4>
                    <b>Fin sYs</b>
                  </h4>
                </div>
                <a href="javascript:;" className="toggle-btn ml-lg-auto">
                  {" "}
                  <i className="bx bx-menu"></i>
                </a>
              </div>
              <div className="flex-grow-1 search-bar">
                <div className="input-group">
                  <div className="input-group-prepend search-arrow-back">
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
                    <i className="fa fa-gear" style={{ fontSize: "24px" }}></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <ul
                      className="a"
                      style={{
                        listStyleType: "none",
                        margin: "0",
                        padding: "0",
                        width: "200px",
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
                      <i className="bx bx-bell vertical-align-middle"></i>
                      <span className="msg-count">5</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a href="javascript:;">
                        <div className="msg-header">
                          <h6 className="msg-header-title">5 New</h6>
                          <p className="msg-header-subtitle">
                            Application Notifications
                          </p>
                        </div>
                      </a>
                      {/* <div className="header-notifications-list">
                    {% if noti %}
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
                    {% endfor %}
                    
                  </div>
                  <a href="{% url 'Fin_Anotification' %}">
                    <div className="text-center msg-footer">View All Notifications</div>
                  </a>
                  {% else %}
                
                  <p className="msg-info text-center mt-5">Notifications is not found</p>
                  {% endif %} */}
                    </div>
                  </li>
                  <li className="nav-item dropdown dropdown-user-profile">
                    <a
                      className="nav-link dropdown-toggle dropdown-toggle-nocaret"
                      href="javascript:;"
                      data-toggle="dropdown"
                    >
                      {/* {% if user.is_authenticated %} */}
                      <div className="media user-box align-items-center">
                        <div className="media-body user-info">
                          <p className="user-name mb-0">
                            {/* {% if user.is_authenticated %} */}
                            {/* {% csrf_token %} */}
                            <label style={{textAlign: "center", fontSize: "15px"}}>
                              Admin
                            </label>
                            {/* {% endif %} */}
                          </p>
                          <p className="designattion mb-0">Online</p>
                        </div>
                        <img
                          src="%PUBLIC_URL%\static\assets\images\user-1.jpg"
                          className="user-img"
                        />
                      </div>
                      {/* {% endif %} */}
                    </a>
                    {/* {% if user.is_authenticated %} */}
                    <div className="dropdown-menu dropdown-menu-right">
                      {/* <!-- <a className="dropdown-item"
                    href="/app1/userprofile/{{ user.id }}"><i className="bx bx-user"></i><span>Profile</span></a> --> */}
                      <a
                        className="dropdown-item"
                        href="{% url 'Fin_Adminhome' %}"
                      >
                        <i className="bx bx-tachometer"></i>
                        <span>Dashboard</span>
                      </a>
                      <div className="dropdown-divider mb-0"></div>
                      <a className="dropdown-item" href="{% url 'logout' %}">
                        <i className="bx bx-power-off"></i>
                        <span>Logout</span>
                      </a>
                    </div>
                    {/* {% endif %} */}
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
            style={{backgroundColor: "#213b52"}}
          >
            <nav className="topbar-nav">
              <ul className="metismenu" id="menu">
                <li>
                  <a href="{% url 'Fin_Adminhome' %}" className="has-arrow">
                    <div className="parent-icon">
                      <i className="bx bx-home-alt"></i>
                    </div>
                    <div className="menu-title">Dashboard</div>
                  </a>
                </li>
                {/* <!-- <li>
              <a href="{% url 'Fin_PaymentTerm' %}" className="has-arrow">
                <div className="parent-icon"><i className='bx bxs-package'></i>
                </div>
                <div className="menu-title">Payment Terms</div>
              </a>
             

            </li> --> */}
                <li>
                  <a href="javascript:;" className="has-arrow">
                    <div className="parent-icon">
                      <i className="bx bxs-package"></i>
                    </div>
                    <div className="menu-title" style={{marginRight: "20px"}}>
                      Payment Terms
                    </div>
                  </a>
                  <ul className="submenu">
                    <li id="newTerms">
                      <a href="{% url 'Fin_PaymentTerm' %}">
                        <i className="bx bx-right-arrow-alt"></i>New Term
                      </a>
                    </li>
                    <li id="termExtension">
                      <a href="{% url 'Fin_adminTermExtensionRequests' %}">
                        <i className="bx bx-right-arrow-alt"></i>Extension
                        Requests
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="{% url 'Fin_Admin_trial_period_section' %}"
                    className="has-arrow"
                  >
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
              style={{backgroundColor: "#2f516f"}}
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

export default AdminBase;
