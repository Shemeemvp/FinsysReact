import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import * as XLSX from "xlsx";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";
import config from "../../../functions/config";

function PaymentReceived() {
  const navigate = useNavigate();
  function exportToExcel() {
    const Table = document.getElementById("paymentsTable");
    const ws = XLSX.utils.table_to_sheet(Table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "PaymentReceived.xlsx");
  }

  function sortTable(columnIndex) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("paymentsTable");
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

  function filterTable(row,filterValue) {
    var table1 = document.getElementById("paymentsTable");
    var rows1 = table1.getElementsByTagName("tr");

    for (var i = 1; i < rows1.length; i++) {
      var statusCell = rows1[i].getElementsByTagName("td")[row];

      if (filterValue == "all" || statusCell.textContent.toLowerCase() == filterValue) {
        rows1[i].style.display = "";
      } else {
        rows1[i].style.display = "none";
      }
    }
  }

  function searchTable(){
    var rows = document.querySelectorAll('#paymentsTable tbody tr');
    var val = document.getElementById('search').value.trim().replace(/ +/g, ' ').toLowerCase();
    rows.forEach(function(row) {
      var text = row.textContent.replace(/\s+/g, ' ').toLowerCase();
      row.style.display = text.includes(val) ? '' : 'none';
    });
  }

  const ID = Cookies.get('Login_id');
  const [payment, setPayment] = useState([]);

  const fetchPayments = () =>{
    axios.get(`${config.base_url}/fetch_payments/${ID}/`).then((res)=>{
      if(res.data.status){
        var pay = res.data.payments;
        setPayment([])
        pay.map((i)=>{
          setPayment((prevState)=>[
            ...prevState, i
          ])
        })
      }
    }).catch((err)=>{
      console.log('ERR',err)
    })
  }

  useEffect(()=>{
    fetchPayments();
  },[])
  
  function refreshAll(){
    setPayment([])
    fetchPayments();
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
                <h2 className="mt-3">PAYMENTS RECEIVED</h2>
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
                          onClick={()=>sortTable(3)}
                        >
                          Customer Name
                        </a>
                        <a
                          className="dropdown-item"
                          style={{
                            height: "40px",
                            fontSize: "15px",
                            color: "white",
                            cursor: "pointer",
                          }}
                          onClick={()=>sortTable(2)}
                        >
                          Payment No.
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
                        onClick={()=>filterTable(6,'all')}
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
                        onClick={()=>filterTable(6,'saved')}
                      >
                        Saved
                      </a>
                      <a
                        className="dropdown-item"
                        style={{
                          height: "40px",
                          fontSize: "15px",
                          color: "white",
                          cursor: "pointer",
                        }}
                        onClick={()=>filterTable(6,'draft')}
                      >
                        Draft
                      </a>
                    </div>
                  </div>
                  <Link to="/add_payment" className="ml-1">
                    <button
                      type="button"
                      style={{ width: "fit-content", height: "fit-content" }}
                      className="btn btn-outline-secondary text-grey"
                    >
                      <i className="fa fa-plus font-weight-light"></i> Payment Received
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table
              className="table table-responsive-md table-hover mt-4"
              id="paymentsTable"
              style={{ textAlign: "center" }}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>DATE</th>
                  <th>PAYMENT NO.</th>
                  <th>CUSTOMER NAME</th>
                  <th>MAIL ID</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>BALANCE</th>
                </tr>
              </thead>
              <tbody>
                {payment &&payment.map((i,index)=>(
                  <tr
                    className="clickable-row"
                    onClick={()=>navigate(`/view_payment/${i.id}/`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index+1}</td>
                    <td>{i.payment_date}</td>
                    <td>{i.payment_no}</td>
                    <td>{i.customer_name}</td>
                    <td>{i.customer_email}</td>
                    <td>{i.total}</td>
                    <td>{i.status}</td>
                    <td>{i.balance}</td>
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

export default PaymentReceived;
