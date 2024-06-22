import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";

function ChartOfAccounts() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);

  function filterTable(row, filterValue) {
    var table = document.getElementById("chartOfAccountsTable");
    var rows = table.getElementsByTagName("tr");

    for (var i = 1; i < rows.length; i++) {
      var statusCell = rows[i].getElementsByTagName("td")[row];

      if (
        filterValue == "all" ||
        statusCell.textContent.toLowerCase() == filterValue
      ) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  }

  function searchTable() {
    var rows = document.querySelectorAll("#chartOfAccountsTable tbody tr");
    var val = document
      .getElementById("search")
      .value.trim()
      .replace(/ +/g, " ")
      .toLowerCase();
    rows.forEach(function (row) {
      var text = row.textContent.replace(/\s+/g, " ").toLowerCase();
      row.style.display = text.includes(val) ? "" : "none";
    });
  }

  function filterAccounts() {
    let input, table, tr, td, i, j, txtValue;
    var selectElement = document.getElementById("categoryId");
    var filter = selectElement.value.toLowerCase();
    var values = [];

    if (filter === "asset") {
      values = [
        "Other Asset",
        "Other Current Asset",
        "Cash",
        "Bank",
        "Fixed Asset",
        "Stock",
        "Payment Clearing",
      ];
    } else if (filter === "liability") {
      values = [
        "Other Current Liability",
        "Credit Card",
        "Long Term Liability",
        "Other Liability",
        "Overseas Tax Payable",
      ];
    } else if (filter === "equity") {
      values = ["Equity"];
    } else if (filter === "income") {
      values = ["Income", "Other Income"];
    } else if (filter === "expense") {
      values = ["Expense", "Cost Of Goods Sold", "Other Expense"];
    }

    table = document.getElementById("chartOfAccountsTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
      let rowVisible = false;
      td = tr[i].getElementsByTagName("td")[1];

      if (filter === "") {
        rowVisible = true;
      } else {
        // Check if the text content of the cell is in the values array
        if (values.includes(td.innerText)) {
          rowVisible = true;
        }
      }

      // Show/hide the row based on the search results
      tr[i].style.display = rowVisible ? "" : "none";
    }
  }

  const fetchAccounts = () => {
    axios
      .get(`${config.base_url}/fetch_chart_of_accounts/${ID}/`)
      .then((res) => {
        console.log("CA RES=", res);
        if (res.data.status) {
          var acc = res.data.accounts;
          setAccounts([]);
          acc.map((i) => {
            setAccounts((prevState) => [...prevState, i]);
          });
        }
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <>
      <FinBase />
      <div
        className="page-content"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="card radius-15 h-20">
          <div className="row">
            <div className="col-md-12">
              <center>
                <h2 className="mt-3">CHART OF ACCOUNTS</h2>
              </center>
              <hr />
            </div>
          </div>
        </div>
        <div className="card radius-15">
          <div className="card-body">
            <div className="row">
              <div className="col-md-5 d-flex justify-content-start align-items-center">
                <input
                  type="text"
                  id="search"
                  style={{ width: "50%" }}
                  className="form-control"
                  placeholder="Search.."
                  autoComplete="off"
                  onKeyUp={searchTable}
                />

                <select
                  className="form-control btn btn-outline-secondary dropdown-toggle text-grey ml-1"
                  id="categoryId"
                  style={{ width: "25%" }}
                  aria-label=".form-select-lg example"
                  name="type"
                  onChange={filterAccounts}
                >
                  <option value="" selected>
                    All
                  </option>
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                  <option value="Equity">Equity</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div className="col-md-7 d-flex justify-content-end">
                <div className="dropdown ml-1">
                  <button
                    type="button"
                    style={{ width: "fit-content", height: "fit-content" }}
                    className="btn btn-outline-secondary dropdown-toggle text-grey"
                    data-toggle="dropdown"
                  >
                    <i className="fa fa-filter"></i> filter by
                  </button>
                  <div
                    className="dropdown-menu"
                    style={{ backgroundColor: "black" }}
                  >
                    <a
                      className="dropdown-item"
                      style={{
                        height: "40px",
                        fontSize: "15px",
                        color: "white",
                        cursor: "pointer",
                      }}
                      onClick={() => filterTable(3, "all")}
                    >
                      All
                    </a>
                    <a
                      className="dropdown-item"
                      style={{
                        height: "40px",
                        fontSize: "15px",
                        color: "white",
                        cursor: "pointer",
                      }}
                      onClick={() => filterTable(3, "active")}
                    >
                      Active
                    </a>
                    <a
                      className="dropdown-item"
                      style={{
                        height: "40px",
                        fontSize: "15px",
                        color: "white",
                        cursor: "pointer",
                      }}
                      onClick={() => filterTable(3, "inactive")}
                    >
                      Inactive
                    </a>
                  </div>
                </div>
                <Link to="/add_account" className="ml-1">
                  <button
                    type="button"
                    style={{ width: "fit-content", height: "fit-content" }}
                    className="btn btn-outline-secondary text-grey"
                  >
                    <i className="fa fa-plus font-weight-light"></i> Account
                  </button>
                </Link>
              </div>
            </div>
            <div className="row mt-3">
              <table
                className="table table-responsive-md table-responsive-sm table-responsive-lg table-hover"
                style={{ overflow: "scroll" }}
                id="chartOfAccountsTable"
              >
                <thead>
                  <tr>
                    <th scope="col">ACCOUNT NAME</th>
                    <th scope="col">ACCOUNT TYPE</th>
                    <th scope="col">ACCOUNT CODE</th>
                    <th scope="col">STATUS</th>
                    {/* <!-- <th scope="col">ACTION</th> --> */}
                  </tr>
                </thead>
                <tbody>
                  {accounts &&
                    accounts.map((a) => (
                      <>
                        {!a.sub_account ? (
                          <tr
                            className="table-row cursor-pointer"
                            onClick={()=>navigate(`/view_account/${a.id}/`)}
                            style={{ cursor: "pointer" }}
                          >
                            <td>{a.account_name}</td>
                            <td>{a.account_type}</td>
                            <td>{a.account_code}</td>
                            <td className="text-uppercase">{a.status}</td>
                          </tr>
                        ) : null}

                        {accounts.map((sub) => (
                          <>
                            {sub.sub_account &&
                            sub.parent_account == a.account_name ? (
                              <tr
                                className="table-row cursor-pointer"
                                onClick={()=>navigate(`/view_account/${sub.id}/`)}
                                style={{ cursor: "pointer" }}
                              >
                                <td>
                                  <i className="fa fa-arrow-right ml-3 mr-2"></i>
                                  {sub.account_name}
                                </td>
                                <td>{sub.account_type}</td>
                                <td>{sub.account_code}</td>
                                <td className="text-uppercase">{sub.status}</td>
                              </tr>
                            ) : null}
                          </>
                        ))}
                      </>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChartOfAccounts;
