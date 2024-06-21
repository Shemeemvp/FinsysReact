import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import * as XLSX from "xlsx";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";

function PriceList() {
  const navigate = useNavigate();
  function exportToExcel() {
    document.querySelectorAll(".descTooltips").forEach(function (el) {
      el.style.display = "none";
    });
    document.querySelectorAll(".descExport").forEach(function (el) {
      el.style.display = "block";
    });

    const table = document.getElementById("priceListTable");
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "Price_list.xlsx");

    document.querySelectorAll(".descTooltips").forEach(function (el) {
      el.style.display = "block";
    });
    document.querySelectorAll(".descExport").forEach(function (el) {
      el.style.display = "none";
    });
  }

  function sortTable(columnIndex) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("priceListTable");
    switching = true;

    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        x = rows[i]
          .getElementsByTagName("td")
          [columnIndex].textContent.toLowerCase();
        y = rows[i + 1]
          .getElementsByTagName("td")
          [columnIndex].textContent.toLowerCase();

        if (x > y) {
          shouldSwitch = true;
          break;
        }
      }

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

  function filterTable(row, filterValue) {
    var table = document.getElementById("priceListTable");
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
    var rows = document.querySelectorAll("#priceListTable tbody tr");
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

  const ID = Cookies.get("Login_id");
  const [priceList, setPriceList] = useState([]);

  const fetchPriceLists = () => {
    axios
      .get(`${config.base_url}/fetch_price_lists/${ID}/`)
      .then((res) => {
        console.log("PL RES=", res);
        if (res.data.status) {
          var pl = res.data.priceLists;
          setPriceList([]);
          pl.map((i) => {
            setPriceList((prevState) => [...prevState, i]);
          });
        }
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  useEffect(() => {
    fetchPriceLists();
  }, []);

  function refreshAll() {
    setPriceList([]);
    fetchPriceLists();
  }
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
                <h2 className="mt-3">ALL PRICE LISTS</h2>
              </center>
              <hr />
            </div>
          </div>
        </div>

        <div className="card radius-15">
          <div className="card-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      id="search"
                      className="form-control"
                      placeholder="Search.."
                      autoComplete="off"
                      onKeyUp={searchTable}
                    />
                    <div
                      className="dropdown ml-1"
                      style={{ justifyContent: "left" }}
                    >
                      <button
                        type="button"
                        style={{ width: "fit-content", height: "fit-content" }}
                        className="btn btn-outline-secondary dropdown-toggle text-grey"
                        data-toggle="dropdown"
                      >
                        <i className="fa fa-sort"></i> Sort by
                      </button>
                      <div
                        className="dropdown-menu"
                        style={{ backgroundColor: "black" }}
                      >
                        <a
                          className="dropdown-item"
                          onClick={refreshAll}
                          style={{
                            height: "40px",
                            fontSize: "15px",
                            color: "white",
                          }}
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
                          onClick={() => sortTable(2)}
                        >
                          Name
                        </a>
                        <a
                          className="dropdown-item"
                          style={{
                            height: "40px",
                            fontSize: "15px",
                            color: "white",
                            cursor: "pointer",
                          }}
                          onClick={() => sortTable(4)}
                        >
                          Type
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-6 d-flex justify-content-end">
                  <button
                    type="button"
                    style={{ width: "fit-content", height: "fit-content" }}
                    className="btn btn-outline-secondary text-grey"
                    id="exportBtn"
                    onClick={exportToExcel}
                  >
                    <i className="fa fa-table"></i> Export To Excel
                  </button>
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
                        onClick={() => filterTable(7, "all")}
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
                        onClick={() => filterTable(7, "active")}
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
                        onClick={() => filterTable(7, "inactive")}
                      >
                        Inactive
                      </a>
                    </div>
                  </div>
                  <Link to="/add_price_list" className="ml-1">
                    <button
                      type="button"
                      style={{ width: "fit-content", height: "fit-content" }}
                      className="btn btn-outline-secondary text-grey"
                    >
                      <i className="fa fa-plus font-weight-light"></i> Price
                      List
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table
              className="table table-responsive-md table-hover mt-4"
              id="priceListTable"
              style={{ textAlign: "center" }}
            >
              <thead>
                <tr>
                  <th>SL.NO.</th>
                  <th>DATE</th>
                  <th>NAME</th>
                  <th>DESCRIPTION</th>
                  <th>TYPE</th>
                  <th>ROUNDING</th>
                  <th>DETAILS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {priceList &&
                  priceList.map((a, index) => (
                    <tr
                      className="clickable-row"
                      onClick={() => navigate(`/view_price_list/${a.id}/`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{index + 1}</td>
                      <td>{a.created_date}</td>
                      <td>{a.name}</td>
                      <td>
                        <span
                          className="descTooltips"
                          style={{ display: "block" }}
                        >
                          <i
                            className="fa fa-comment"
                            aria-hidden="true"
                            data-toggle="tooltip"
                            data-placement="top"
                            title={a.description ? a.description : "None"}
                          ></i>
                        </span>
                        <span
                          className="descExport"
                          style={{ display: "none" }}
                        >
                          {a.description ? a.description : "None"}
                        </span>
                      </td>
                      <td>{a.type}</td>
                      <td>
                        {a.item_rate == "Customized individual rate"
                          ? "- -"
                          : a.round_off}
                      </td>
                      <td>
                        {a.item_rate == "Customized individual rate" ? (
                          "Per Individual Rate"
                        ) : (
                          <>
                            {a.percentage} {"Perc."} {a.up_or_down}
                          </>
                        )}
                      </td>
                      <td>{a.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default PriceList;
