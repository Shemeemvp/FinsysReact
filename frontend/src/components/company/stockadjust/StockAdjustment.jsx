import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import * as XLSX from "xlsx";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";

function StockAdjustment() {
  const navigate = useNavigate();
  function exportToExcel() {
    document.querySelectorAll(".descTooltips").forEach(function (el) {
      el.style.display = "none";
    });
    document.querySelectorAll(".descExport").forEach(function (el) {
      el.style.display = "block";
    });

    const table = document.getElementById("stockTable");
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "StockAdjustment.xlsx");

    document.querySelectorAll(".descTooltips").forEach(function (el) {
      el.style.display = "block";
    });
    document.querySelectorAll(".descExport").forEach(function (el) {
      el.style.display = "none";
    });
  }

  function sortTableByDate(row) {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("stockTable");
    switching = true;

    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[row];
        y = rows[i + 1].getElementsByTagName("TD")[row];

        let dateX = new Date(x.innerHTML);
        let dateY = new Date(y.innerHTML);

        if (dateX > dateY) {
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
    var table = document.getElementById("stockTable");
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

  function sortRefAscending() {
    var table = document.getElementById("stockTable");
    var rows = Array.from(table.rows).slice(1);

    rows.sort(function (a, b) {
      var refA = parseInt(a.cells[4].textContent);
      var refB = parseInt(b.cells[4].textContent);
      return refA - refB;
    });

    // Remove existing rows from the table
    for (var i = table.rows.length - 1; i > 0; i--) {
      table.deleteRow(i);
    }

    // Append the sorted rows back to the table
    rows.forEach(function (row) {
      table.tBodies[0].appendChild(row);
    });
  }

  function searchTable() {
    var rows = document.querySelectorAll("#stockTable tbody tr");
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
  const [stock, setStock] = useState([]);

  const fetchStockAdjustments = () => {
    axios
      .get(`${config.base_url}/fetch_stock_adjust/${ID}/`)
      .then((res) => {
        console.log("SA RES=", res);
        if (res.data.status) {
          var stck = res.data.stock;
          setStock([]);
          stck.map((i) => {
            setStock((prevState) => [...prevState, i]);
          });
        }
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  useEffect(() => {
    fetchStockAdjustments();
  }, []);

  function refreshAll() {
    setStock([]);
    fetchStockAdjustments();
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
                <h2 className="mt-3">ALL STOCK ADJUSTMENT</h2>
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
                          onClick={() => sortTableByDate(1)}
                        >
                          Date
                        </a>
                        <a
                          className="dropdown-item"
                          style={{
                            height: "40px",
                            fontSize: "15px",
                            color: "white",
                            cursor: "pointer",
                          }}
                          onClick={sortRefAscending}
                        >
                          Reference No.
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
                        onClick={() => filterTable(6, "all")}
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
                        onClick={() => filterTable(6, "save")}
                      >
                        Save
                      </a>
                      <a
                        className="dropdown-item"
                        style={{
                          height: "40px",
                          fontSize: "15px",
                          color: "white",
                          cursor: "pointer",
                        }}
                        onClick={() => filterTable(6, "draft")}
                      >
                        Draft
                      </a>
                    </div>
                  </div>
                  <Link to="/add_stock_adjust" className="ml-1">
                    <button
                      type="button"
                      style={{ width: "fit-content", height: "fit-content" }}
                      className="btn btn-outline-secondary text-grey"
                    >
                      <i className="fa fa-plus font-weight-light"></i> Stock
                      Adjust
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table
              className="table table-responsive-md table-hover mt-4"
              id="stockTable"
              style={{ textAlign: "center" }}
            >
              <thead>
                <tr>
                  <th>SL.NO.</th>
                  <th>DATE</th>
                  <th>REASON</th>
                  <th>DESCRIPTION</th>
                  <th>REFERENCE NO.</th>
                  <th>TYPE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {stock &&
                  stock.map((i, index) => (
                    <tr
                      className="clickable-row"
                      onClick={() => navigate(`/view_stock_adjust/${i.id}/`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{index + 1}</td>
                      <td>{i.adjusting_date}</td>
                      <td>{i.reason}</td>
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
                            title={i.description ? i.description : "None"}
                          ></i>
                        </span>
                        <span
                          className="descExport"
                          style={{ display: "none" }}
                        >
                          {i.description ? i.description : "None"}
                        </span>
                      </td>
                      <td>{i.reference_no}</td>
                      <td>{i.mode_of_adjustment}</td>
                      <td>{i.status}</td>
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

export default StockAdjustment;
