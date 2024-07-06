import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import * as XLSX from "xlsx";
import { Await, Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";
import config from "../../../functions/config";

function Vendors () {
    const navigate = useNavigate();
    function exportToExcel() {
        const Table = document.getElementById("vendorsTable");
        const ws = XLSX.utils.table_to_sheet(Table);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "Vendors.xlsx");
      }
    
      function sortTable(columnIndex) {
        var table, rows, switching, i, x, y, shouldSwitch;
        table = document.getElementById("vendorsTable");
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
        var table = document.getElementById("vendorsTable");
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
    
      function sortBalAsc() {
        var table = document.getElementById("vendorsTable");
        var rows = Array.from(table.rows).slice(1);
    
        rows.sort(function (a, b) {
          var balA = parseFloat(a.cells[7].textContent);
          var balB = parseFloat(b.cells[7].textContent);
          return balA - balB;
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
    
      function searchTable(){
        var rows = document.querySelectorAll('#vendorsTable tbody tr');
        var val = document.getElementById('search').value.trim().replace(/ +/g, ' ').toLowerCase();
        rows.forEach(function(row) {
          var text = row.textContent.replace(/\s+/g, ' ').toLowerCase();
          row.style.display = text.includes(val) ? '' : 'none';
        });
      }
    
      const ID = Cookies.get('Login_id');
      const [customers, setCustomers] = useState([]);
    
      const fetchCustomers = () =>{
        axios.get(`${config.base_url}/all_vendors/${ID}/`).then((res)=>{
          // console.log("CUST RES=",res)
          if(res.data.status){
            var cust = res.data.vendors;
            setCustomers([])
            cust.map((i)=>{
              var obj = {
                id: i.id,
                name: i.First_name+" "+i.Last_name,
                gstType: i.GST_Treatment,
                gstIn: i.GST_Number,
                mailId: i.Vendor_email,
                openingBalance: i.Opening_balance,
                mobile: i.Mobile,
                status: i.status
              }
              setCustomers((prevState)=>[
                ...prevState, obj
              ])
            })
          }
        }).catch((err)=>{
          console.log('ERR',err)
        })
      }
    
      useEffect(()=>{
        fetchCustomers();
      },[])
      
      function refreshAll(){
        setCustomers([])
        fetchCustomers();
      }
      const [vendors , setVendor] = useState([]);
      // const View_Vendor = async (id) =>{
      //   try{
      //     const response = await axios.post(`${config.base_url}/view_vendor/${id}/`)
      //     // setVendor(response.data);
      //     // console.log(response.data);
      //     navigate('/view_vendor',{state:response.data});
      //   } catch (error) {
      //     console.log('Error');
      //   }
      // }
      const handleclick = async (id) =>{
        try{
          navigate(`/view_vendor/${id}/`);
        } catch (error) {
          console.log('none....')
        }
       
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
                <h2 className="mt-3">VENDORS</h2>
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
                          onClick={()=>sortTable(1)}
                        >
                          Vendor Name
                        </a>
                        <a
                          className="dropdown-item"
                          style={{
                            height: "40px",
                            fontSize: "15px",
                            color: "white",
                            cursor: "pointer",
                          }}
                          onClick={sortBalAsc}
                        >
                          Balance Amount
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
                        onClick={()=>filterTable(7,'all')}
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
                        onClick={()=>filterTable(7,'active')}
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
                        onClick={()=>filterTable(7,'inactive')}
                      >
                        Inactive
                      </a>
                    </div>
                  </div>
                  <Link to="/add_vendor" className="ml-1">
                    <button
                      type="button"
                      style={{ width: "fit-content", height: "fit-content" }}
                      className="btn btn-outline-secondary text-grey"
                    >
                      <i className="fa fa-plus font-weight-light"></i> Vendor
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table
              className="table table-responsive-md table-hover mt-4"
              id="vendorsTable"
              style={{ textAlign: "center" }}
            >
              <thead>
              <tr>
                <th>#</th>
                <th>NAME</th>
                <th>MOBILE NUMBER</th>
                <th>MAIL ID</th>
                <th>GST TYPE</th>
                <th>GSTIN</th>
                <th>OPENING BALANCE</th>
                <th>STATUS</th>
                <th>BALANCE</th>
              </tr>
              </thead>
              <tbody>
                {customers && customers.map((i,index)=>(
                  <tr
                    className="clickable-row"
                    // onClick={()=>navigate(`/view_vendor/${i.id}/`)}
                    // onClick={()=>navigate('/view_vendor',{state:i.id})}
                    // onClick={() => View_Vendor(i.id)}
                    onClick={() => handleclick(i.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index+1}</td>
                    <td>{i.name}</td>
                    <td>{i.mobile}</td>
                    <td>{i.mailId}</td>
                    <td>{i.gstType}</td>
                    {i.gstIn == '' ?(
                      <td>None</td>
                    ):
                    (<td>{i.gstIn}</td>)}
                    <td>{i.openingBalance}</td>
                    <td>{i.status}</td>
                    <td>{i.openingBalance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
        </>
    )
}
export default Vendors;