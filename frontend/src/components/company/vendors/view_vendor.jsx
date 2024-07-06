import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import * as XLSX from "xlsx";
import { Link, useNavigate,useParams,useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";
import config from "../../../functions/config";
import Vendors from "./Allvendors";
import Swal from "sweetalert2";


function View_vendor () {
    const ID = Cookies.get("Login_id");
    const location = useLocation();
    const { id } = useParams();
    const [vendor,setVendor] = useState([]);
    const [company,setCompany] = useState([]);
    const [terms,setTerms] = useState([]);
    const [history,setHistory] =  useState([]);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();
    const viewvendor = () =>{
        axios.get(`${config.base_url}/view_vendor/${id}/${ID}/`).then((res)=>{
            if(res.data.status){
              var vendor = res.data.vendors;
              var company = res.data.company;
              var term = res.data.payment_term;
              var hist = res.data.history;
              var cmt = res.data.comments;
              
            }
            setVendor(vendor);
            setComments(cmt);
            setCompany(company);
            setTerms(term);
            if (hist) {
                setHistory(hist);
            }
          }).catch((err)=>{
            console.log('ERR',err)
          })
        }
        useEffect(()=>{
            viewvendor();
          },[])
   
    // $(document).ready(function ($) {
    //     $(".table-row").click(function () {
    //         window.document.location = $(this).data("href");
    //     });
    // });
    function overview() {
        document.getElementById('overview').style.display = 'block';
        document.getElementById('transaction').style.display = 'none';
        document.getElementById('statement').style.display = 'none';
        document.getElementById('overviewBtn').style.backgroundColor='rgba(22,37,50,255)'
        document.getElementById('transactionBtn').style.backgroundColor='transparent';
        document.getElementById('statementBtn').style.backgroundColor='transparent';
        document.getElementById('shareBtn').style.display = 'none';
        document.getElementById('printBtn').style.display = 'none';
        document.getElementById('pdfBtn').style.display = 'none';
        document.getElementById('editBtn').style.display = 'block';
        document.getElementById('exportBtn').style.display = 'none';
        document.getElementById('deleteBtn').style.display = 'block';
        document.getElementById('historyBtn').style.display = 'block';
        document.getElementById('statusBtn').style.display = 'block';

        document.getElementById('commentsBtn').style.display = 'block';
        // $('#shareBtn').hide();
        // $('#printBtn').hide();
        // $('#pdfBtn').hide();
        // $('#editBtn').show();
        // $('#exportBtn').hide();
        // $('#deleteBtn').show();
        // $('#historyBtn').show();
        // $('#activeBtn').show();
        // $('#inactiveBtn').show();
        // $('#commentsBtn').show();
    }
    function transaction() {
        document.getElementById('overview').style.display = 'none';
        document.getElementById('statement').style.display = 'none';
        document.getElementById('transaction').style.display = 'block';
        document.getElementById('overviewBtn').style.backgroundColor='transparent';
        document.getElementById('statementBtn').style.backgroundColor='transparent';
        document.getElementById('transactionBtn').style.backgroundColor='rgba(22,37,50,255)';
        document.getElementById('shareBtn').style.display = 'none';
        document.getElementById('printBtn').style.display = 'none';
        document.getElementById('pdfBtn').style.display = 'none';
        document.getElementById('editBtn').style.display = 'none';
        document.getElementById('exportBtn').style.display = 'block';
        document.getElementById('deleteBtn').style.display = 'none';
        document.getElementById('historyBtn').style.display = 'none';
        document.getElementById('statusBtn').style.display = 'none';
        document.getElementById('commentsBtn').style.display = 'none';
        // $('#shareBtn').hide();
        // $('#printBtn').hide();
        // $('#pdfBtn').hide();
        // $('#editBtn').hide();
        // $('#exportBtn').show();
        // $('#deleteBtn').hide();
        // $('#historyBtn').hide();
        // $('#commentsBtn').hide();
        // $('#activeBtn').hide();
        // $('#inactiveBtn').hide();
    }
    function statement() {
        document.getElementById('overview').style.display = 'none';
        document.getElementById('transaction').style.display = 'none';
        document.getElementById('statement').style.display = 'block';
        document.getElementById('overviewBtn').style.backgroundColor='transparent';
        document.getElementById('transactionBtn').style.backgroundColor='transparent';
        document.getElementById('statementBtn').style.backgroundColor='rgba(22,37,50,255)';
        document.getElementById('shareBtn').style.display = 'block';
        document.getElementById('printBtn').style.display = 'block';
        document.getElementById('pdfBtn').style.display = 'block';
        document.getElementById('editBtn').style.display = 'none';
        document.getElementById('exportBtn').style.display = 'none';
        document.getElementById('deleteBtn').style.display = 'none';
        document.getElementById('historyBtn').style.display = 'none';
        document.getElementById('statusBtn').style.display = 'none';
        document.getElementById('commentsBtn').style.display = 'none';
        // $('#printBtn').show();
        // $('#pdfBtn').show();
        // $('#shareBtn').show();
        // $('#deleteBtn').hide();
        // $('#editBtn').hide();
        // $('#exportBtn').hide();
        // $('#historyBtn').hide();
        // $('#commentsBtn').hide();
        // $('#activeBtn').hide();
        // $('#inactiveBtn').hide();
    }
    const Change_vendor_status = async (id,status) =>{
        try{
            const response = await axios.post(`${config.base_url}/change_vendor_status/${id}/${status}/`)
            console.log('Changed');
            viewvendor();
        } catch (error) {
            console.log('Error');
        }
    }
    function exportToExcel() {
        const Table = document.getElementById("dataTable");
        const ws = XLSX.utils.table_to_sheet(Table);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "Vendor Transactions.xlsx");
      }
      function vendorTransactionPdf() {
        axios
          .get(`${config.base_url}/vendor_transaction_pdf/${id}/${ID}/`, {
            responseType: "blob",
          })
          .then((res) => {
            console.log("PDF RES=", res);
            console.log(res.data);
            const file = new Blob([res.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = fileURL;
            a.download = `vendor_transactions_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          })
          .catch((err) => {
            console.log("ERROR=", err);
            if (err.response && err.response.data && !err.response.data.status) {
              Swal.fire({
                icon: "error",
                title: `${err.response.data.message}`,
              });
            }
          });
      }
      function printSheet() {
        var divToPrint = document.getElementById("printContent");
        var printWindow = window.open("", "", "height=700,width=1000");
    
        printWindow.document.write("<html><head><title></title>");
        printWindow.document.write(`
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Agbalumo&family=Black+Ops+One&family=Gluten:wght@100..900&family=Playball&display=swap" rel="stylesheet">
        `);
        printWindow.document.write("</head>");
        printWindow.document.write("<body>");
        printWindow.document.write(divToPrint.outerHTML);
        printWindow.document.write("</body>");
        printWindow.document.write("</html>");
        printWindow.document.close();
        printWindow.print();
        printWindow.addEventListener('afterprint', function() {
          printWindow.close();
        });
    
      }
      const currentUrl = window.location.href;
      const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        currentUrl
      )}`;
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      const [emailIds, setEmailIds] = useState("");
        const [emailMessage, setEmailMessage] = useState("");
      function handleShareEmail(e) {
        e.preventDefault();
    
        var emailsString = emailIds.trim();
    
        var emails = emailsString.split(",").map(function (email) {
          return email.trim();
        });
    
        var emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    
        var invalidEmails = [];
        if (emailsString === "") {
          alert("Enter valid email addresses.");
        } else {
          for (var i = 0; i < emails.length; i++) {
            var currentEmail = emails[i];
    
            if (currentEmail !== "" && !emailRegex.test(currentEmail)) {
              invalidEmails.push(currentEmail);
            }
          }
    
          if (invalidEmails.length > 0) {
            alert("Invalid emails. Please check!\n" + invalidEmails.join(", "));
          } else {
            // document.getElementById("share_to_email_form").submit();
            var em = {
              id: id,
              Id: ID,
              email_ids: emailIds,
              email_message: emailMessage,
            };
            axios
              .post(`${config.base_url}/share_vendor_transaction_mail/`, em)
              .then((res) => {
                if (res.data.status) {
                  Toast.fire({
                    icon: "success",
                    title: "Shared via mail.",
                  });
                  setEmailIds("");
                  setEmailMessage("");
                }
              })
              .catch((err) => {
                console.log("ERROR=", err);
                if (
                  err.response &&
                  err.response.data &&
                  !err.response.data.status
                ) {
                  Swal.fire({
                    icon: "error",
                    title: `${err.response.data.message}`,
                  });
                }
              });
          }
        }
      }
      function searchTable(){
        var rows = document.querySelectorAll('#dataTable tbody tr');
        var val = document.getElementById('search').value.trim().replace(/ +/g, ' ').toLowerCase();
        rows.forEach(function(row) {
          var text = row.textContent.replace(/\s+/g, ' ').toLowerCase();
          row.style.display = text.includes(val) ? '' : 'none';
        });
      }
      const EditVendor = async  (id) => {
        try{
            navigate(`/edit_vendor/${id}/`)
        } catch (error) {
            console.log('Failed')
        }
      }
      function DeleteVendor(id) {
        Swal.fire({
            title: `Delete Vendor - ${vendor.First_name}?`,
            text: "All datas will be deleted.!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#3085d6",
            confirmButtonColor: "#d33",
            confirmButtonText: "Delete",
          }).then((result) => {
            if (result.isConfirmed) {
              axios
                .delete(`${config.base_url}/delete_vendor/${id}/`)
                .then((res) => {
                  console.log(res);
      
                  Toast.fire({
                    icon: "success",
                    title: "Vendor Deleted successfully",
                  });
                  navigate("/vendors");
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });
      }
      const [comment, setComment] = useState("");
      const saveItemComment = (e) => {
        e.preventDefault();
        var cmt = {
          Id: ID,
          id:id,
          comments: comment,
        };
        axios
          .post(`${config.base_url}/add_vendor_comment/`, cmt)
          .then((res) => {
            console.log(res);
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "Comment Added",
              });
              console.log('comment',res.data.data);
              setComments("");
              
              viewvendor();
            }
            
          })
          .catch((err) => {
            console.log("ERROR=", err);
            if (!err.response.data.status) {
              Swal.fire({
                icon: "error",
                title: `${err.response.data.message}`,
              });
            }
          });
      };
      // function deleteComment(id) {
      //   Swal.fire({
      //     title: "Delete Comment?",
      //     text: "Are you sure you want to delete this.!",
      //     icon: "warning",
      //     showCancelButton: true,
      //     cancelButtonColor: "#3085d6",
      //     confirmButtonColor: "#d33",
      //     confirmButtonText: "Delete",
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       axios
      //         .delete(`${config.base_url}/delete_item_comment/${id}/`)
      //         .then((res) => {
      //           console.log(res);
    
      //           Toast.fire({
      //             icon: "success",
      //             title: "Comment Deleted",
      //           });
      //           viewvendor();
      //         })
      //         .catch((err) => {
      //           console.log(err);
      //         });
      //     }
      //   });
      // }
      
      const handleclick = async (id) =>{
        try{
          navigate(`/vendor_history/${id}/`);
        } catch (error) {
          console.log('none....')
        }
       
      } 

    return (
        <>
        <FinBase />
        <div className="page-content" style={{ backgroundColor: "#213b52" }}>
        <span className="d-flex justify-content-end p-2" style={{cursor:'pointer'}} ><i class="fa fa-times-circle text-white" style={{fontSize:'1.2rem'}}></i></span>
        <div className="card radius-15" style={{ backgroundColor: "#213b52" }}>
        <div className="card-body" style={{width:'100%'}}>
            <div className="card-title">
                <div className="container-fluid" >
                    <div className="row">
                        <div className="col-md-6">
                            {/* <a style="padding: 10px; cursor: pointer; border-radius: 1vh; background-color: rgba(22,37,50,255);" onclick="overview()" id="overviewBtn" >Overview</a> */}
                            <a style={{padding:'10px',cursor:'pointer',borderRadius:'1vh',backgroundColor:'rgba(22,37,50,255)'}} onClick={() =>overview()} id="overviewBtn">Overview</a>
                            {/* <a style="padding: 10px; cursor: pointer; border-radius: 1vh;" onclick="transaction()" id="transactionBtn" > Transactions</a> */}
                            <a style={{padding:'10px',cursor:'pointer',borderRadius:'1vh'}} onClick={() => transaction()} id="transactionBtn">Transactions</a>
                            {/* <a style="padding: 10px; cursor: pointer; border-radius: 1vh;" onclick="statement()" id="statementBtn" > Statement</a> */}
                            <a style={{padding:'10px',cursor:'pointer',borderRadius:'1vh'}} onClick={() => statement()} id="statementBtn">Statement</a>
                        </div> 
                        <div className="col-md-6 d-flex justify-content-end">
                        {vendor.status == 'Active' ? (
                            <a className="ml-2 fa fa-check-circle btn btn-outline-secondary text-grey" role="button" style={{height:'30px',width:'100px'}} id="statusBtn" onClick={() => Change_vendor_status(vendor.id,'Inactive')}>&nbsp;Active</a> 
                        ): (
                            <a className="ml-2 fa fa-ban btn btn-outline-secondary text-grey" role="button" style={{height:'30px',width:'100px'}} id="statusBtn" onClick={() => Change_vendor_status(vendor.id,'Active')}>&nbsp;Inactive</a>   
                        )}
                        <a className="ml-2 btn btn-outline-secondary text-grey fa fa-table" role="button" id="exportBtn" style={{display:'none',height:'30px',width:'100px'}} onClick={() =>exportToExcel()}>&nbsp;Export</a>
                            <a className="ml-2 btn btn-outline-secondary text-grey fa fa-file" role="button" id="pdfBtn" style={{display:'none',height:'30px',width:'100px'}} onClick={vendorTransactionPdf}> &nbsp;PDF</a> 
                            <a className="ml-2 btn btn-outline-secondary text-grey fa fa-print" role="button" id="printBtn" style={{display:'none',height:'30px',width:'100px'}} onClick={() => printSheet()}>&nbsp;Print</a>
                            {/* <div className="dropdown p-0 nav-item"  id="shareBtn" style={{display:'none'}}>
                                <li  className="ml-2 dropdown-toggle btn btn-outline-secondary text-grey fa fa-share-alt" data-toggle="dropdown" style={{height:'30px',width:'100px'}}>&nbsp;Share</li>
                                <ul className="dropdown-menu" style={{backgroundColor:'black'}} id="listdiv">
                                    
                                    <li style={{textAlign:'center',color:'#e5e9ec',cursor:'pointer'}} data-toggle="modal" data-target="#shareToEmail">Email</li>
                                </ul>
                            </div> */}
                            <div
                      className="dropdown p-0 nav-item"
                      id="shareBtn"
                      style={{ display: "none" }}
                    >
                      <li
                        className="ml-2 dropdown-toggle btn btn-outline-secondary text-grey fa fa-share-alt"
                        data-toggle="dropdown"
                        style={{
                          height: "fit-content",
                          width: "fit-content",
                        }}
                      >
                        &nbsp;Share
                      </li>
                      <ul
                        className="dropdown-menu"
                        style={{ backgroundColor: "black" }}
                        id="listdiv"
                      >
                        <a
                          href={shareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <li
                            style={{
                              textAlign: "center",
                              color: "#e5e9ec",
                              cursor: "pointer",
                            }}
                          >
                            WhatsApp
                          </li>
                        </a>
                        <li
                          style={{
                            textAlign: "center",
                            color: "#e5e9ec",
                            cursor: "pointer",
                          }}
                          data-toggle="modal"
                          data-target="#shareToEmail"
                        >
                          Email
                        </li>
                      </ul>
                    </div>
                        <a class="ml-2 fa fa-pencil btn btn-outline-secondary text-grey" id="editBtn" role="button" style={{height:'30px',width:'100px'}} onClick={() =>EditVendor(vendor.id)}>&nbsp;Edit</a>
                        <a class="ml-2 btn btn-outline-secondary text-grey fa fa-trash" id="deleteBtn" role="button"  style={{height:'30px',width:'100px'}} onClick={() =>DeleteVendor(vendor.id)}>&nbsp;Delete</a>
                        <a href="#"  class="ml-2 btn btn-outline-secondary text-grey fa fa-comments" id="commentsBtn" role="button" data-toggle="modal" data-target="#commentModal" style={{height:'30px',width:'100px'}}>&nbsp;Comment</a>
                        <a class="ml-2 btn btn-outline-secondary text-grey fa fa-history" id="historyBtn" role="button" style={{height:'30px',width:'100px'}} onClick={() => handleclick(vendor.id)}>&nbsp;History</a>

                            {/* {% if vendor.status == 'Inactive' %} */}
                            {/* <a href="{% url 'Fin_changeVendorStatus' vendor.id 'Active' %}" id="activeBtn" class="ml-2 fa fa-ban btn btn-outline-secondary text-grey" role="button" >&nbsp;Inactive</a> */}
                            {/* <a className="ml-2 fa fa-ban btn btn-outline-secondary text-grey" role="button">&nbsp;Inactive</a> onclick="return confirm('Are you sure you want to delete Vendor - {{vendor.first_name}}.?')" */}
                            {/* {% else %} */}
                            {/* <a href="{% url 'Fin_changeVendorStatus' vendor.id 'Inactive' %}" id="inactiveBtn" class="ml-2 fa fa-check-circle btn btn-outline-secondary text-grey" role="button" >&nbsp;Active</a> */}
                            {/* <a className="ml-2 fa fa-check-circle btn btn-outline-secondary text-grey" role="button">&nbsp;Active</a>   */}
                            {/* {% endif %} */}
                        {/* <li style={{textAlign:'center'}} >{% post_to_whatsapp object_or_url "WhatsApp" %}</li> */}
                            
                        </div>
                    </div> 
                </div>
                <center>
                    <h3 className="card-title" >VENDOR OVERVIEW</h3>
                </center>
            </div>
        </div>
    </div>
    <div className="card card-registration card-registration-2" style={{borderRadius:'15px'}}>
        <div className="card-body p-0">

            <div id="overview">
                <div className="row g-0 mx-0">
                    <div className="col-lg-8">
                        <div className="history_highlight pt-3 px-2 d-flex">
                            <div className="col-12 d-flex justify-content-start align-items-center">
                                {history.action == 'Created' ? (<p className="text-success m-0" style={{fontSize:'1.07rem',fontWeight:'500'}}>Created by :</p>):(<p class="text-warning m-0" style={{fontSize:'1.07rem',fontWeight:'500'}}>Last Edited by :</p>)}
                                <span className="ml-2" style={{fontSize:'1.07rem',fontWeight:'500'}}>{history.doneBy}</span>
                                <span className="ml-5">{history.date}</span>
                            </div>
                        </div>
                        <div className="pb-3 px-2">
                            <div className="card-body">
                                <div className="card-title">
                                    <div className="row">
                                        <div className="col mt-3">
                                            {/* <h2 class="mb-0">{{ vendor.title }}. {{ vendor.first_name }} {{ vendor.last_name }}</h2> */}
                                            <h2 class="mb-0"> {vendor.Title} .{vendor.First_name}  {vendor.Last_name}</h2>
                                        </div>
                                    </div>
                                </div>
                                <hr />

                                <div class="row mb-4 d-flex justify-content-between align-items-center">
                                    <div class="col-md-2 mt-3">
                                        <h6 class="mb-0">Company</h6>
                                    </div>
                                    <div class="col-md-1 mt-3">
                                        :
                                    </div>
                                    <div class="col-md-3 mt-3">
                                        <p class="mb-0">{ vendor.Company_Name }</p>
                                    </div>
                                    <div class="col-md-2 mt-3 vl">
                                        <h6 class="mb-0">Email</h6>
                                    </div>
                                    <div class="col-md-1 mt-3">
                                        :
                                    </div>
                                    <div class="col-md-3 mt-3">
                                        <p class="mb-0">{ vendor.Vendor_email }</p>
                                    </div>
                                </div>
                                <div class="row mb-4 d-flex justify-content-between align-items-center">
                                    <div class="col-md-2 mt-3">
                                        <h6 class="mb-0">Mobile</h6>
                                    </div>
                                    <div class="col-md-1 mt-3">
                                        :
                                    </div>
                                    <div class="col-md-3 mt-3">
                                        <p class="mb-0">{ vendor.Mobile }</p>
                                    </div>
                                    <div class="col-md-2 mt-3 vl">
                                        <h6 class="mb-0">Website</h6>
                                    </div>
                                    <div class="col-md-1 mt-3">
                                        :
                                    </div>
                                    <div class="col-md-3 mt-3">
                                        <p class="mb-0">{ vendor.Website }</p>
                                    </div>
                                </div>
                                <div class="row mb-4 d-flex justify-content-between align-items-center">
                                    <div class="col-md-2 mt-3">
                                        <h6 class="mb-0">Location</h6>
                                    </div>
                                    <div class="col-md-1 mt-3">
                                        :
                                    </div>
                                    <div class="col-md-3 mt-3">
                                        <p class="mb-0">{ vendor.Location }</p>
                                    </div>
                                    <div class="col-md-2 mt-3 vl">
                                        <h6 class="mb-0">Place of Supply</h6>
                                    </div>
                                    <div class="col-md-1 mt-3">
                                        :
                                    </div>
                                    <div class="col-md-3 mt-3">
                                        <p class="mb-0">{ vendor.Place_of_supply }</p>
                                    </div>
                                </div>
                                <div class="row mb-4 d-flex justify-content-between align-items-center">
                                    <div class="col-md-2 mt-3">
                                        <h6 class="mb-0">Payment Terms</h6>
                                    </div>
                                    <div class="col-md-1 mt-3">
                                        :
                                    </div>
                                    <div class="col-md-3 mt-3">
                                        <p class="mb-0">{terms}</p>
                                    </div>
                                    <div class="col-md-2 mt-3 vl">
                                        <h6 class="mb-0">Price List</h6>
                                    </div>
                                    <div class="col-md-1 mt-3">
                                        :
                                    </div>
                                    <div class="col-md-3 mt-3">
                                        <p class="mb-0"></p>
                                    </div>
                                </div>
                                <hr />
                                <div class="row ">
                                    <div class="col-md-6" >
                                        <div class="card-content bg-transparent border-0 ml-4" >
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <h5 class="ml-3" style={{textAlign:'center'}}>Billing Address</h5>
                                                    <hr />
                                                </div>
                                            </div><br />
                                            <div class="row mb-3">
                                                <div class="col-md-3" >
                                                    <h6 class="mb-0">Street</h6>
                                                </div>
                                                <div class="col-md-1">
                                                    :
                                                </div>
                                                <div class="col-md-8">
                                                    <p class="mb-0" style={{textAlign:'right'}}>{ vendor.Billing_street }</p>
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-3">
                                                    <h6 class="mb-0">City</h6>
                                                </div>
                                                <div class="col-md-1">
                                                    :
                                                </div>
                                                <div class="col-md-8">
                                                    <p class="mb-0" style={{textAlign:'right'}}>{ vendor.Billing_city }</p>
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-3">
                                                    <h6 class="mb-0">State</h6>
                                                </div>
                                                <div class="col-md-1">
                                                    :
                                                </div>
                                                <div class="col-md-8">
                                                    <p class="mb-0" style={{textAlign:'right'}}>{ vendor.Billing_state }</p>
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-3">
                                                    <h6 class="mb-0">Pincode</h6>
                                                </div>
                                                <div class="col-md-1">
                                                    :
                                                </div>
                                                <div class="col-md-8">
                                                    <p class="mb-0" style={{textAlign:'right'}}>{ vendor.Billing_pincode }</p>
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-3">
                                                    <h6 class="mb-0">Country</h6>
                                                </div>
                                                <div class="col-md-1">
                                                    :
                                                </div>
                                                <div class="col-md-8">
                                                    <p class="mb-0" style={{textAlign:'right'}}>{ vendor.Billing_country }</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card-content bg-transparent border-0" >
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <h5 class="ml-3" style={{textAlign:'center'}}>Shipping Address</h5>
                                                    <hr />
                                                </div>
                                            </div><br />
                                            <div class="row mb-3">
                                                <div class="col-md-3" >
                                                    <h6 class="mb-0">Street</h6>
                                                </div>
                                                <div class="col-md-1">
                                                    :
                                                </div>
                                                <div class="col-md-8">
                                                    <p class="mb-0" style={{textAlign:'right'}}>{ vendor.Shipping_street }</p>
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-3">
                                                    <h6 class="mb-0">City</h6>
                                                </div>
                                                <div class="col-md-1">
                                                    :
                                                </div>
                                                <div class="col-md-8">
                                                    <p class="mb-0" style={{textAlign:'right'}}>{ vendor.Shipping_city }</p>
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-3">
                                                    <h6 class="mb-0">State</h6>
                                                </div>
                                                <div class="col-md-1">
                                                    :
                                                </div>
                                                <div class="col-md-8">
                                                    <p class="mb-0" style={{textAlign:'right'}}>{ vendor.Shipping_state }</p>
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-3">
                                                    <h6 class="mb-0">Pincode</h6>
                                                </div>
                                                <div class="col-md-1">
                                                    :
                                                </div>
                                                <div class="col-md-8">
                                                    <p class="mb-0" style={{textAlign:'right'}}>{ vendor.Shipping_pincode }</p>
                                                </div>
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-md-3">
                                                    <h6 class="mb-0">Country</h6>
                                                </div>
                                                <div class="col-md-1">
                                                    :
                                                </div>
                                                <div class="col-md-8">
                                                    <p class="mb-0" style={{textAlign:'right'}}>{ vendor.Shipping_country }</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 bg-grey">

                        <div className="px-3">
                            <h3 className="fw-bold mb-2 mt-4 pt-1">Vendor Details</h3>
                            <hr className="my-4" />
                            <div className="d-flex justify-content-between mb-4">
                                <h6 className="">Status</h6>
                                {vendor.status == 'Active' ? (
                                    <i className="fa fa-check-circle text-success">&nbsp;ACTIVE</i>
                                ) : (
                                    <i className="fa fa-ban text-danger">&nbsp;INACTIVE</i>
                                )}
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <h6 className="">GST Type</h6>
                                { vendor.GST_Treatment }
                            </div>
                            <div className="col-md-4">
                                <p>
                                    {vendor.GST_Treatment == 'Unregistered Business' ? (
                                        <h6 className=""></h6>
                                    ) : (
                                        
                                    <h6 className="" style={{position:'relative',right:'15px'}}>GSTIN {vendor.GST_Number}</h6>
                                     )}
                                </p>

                            </div>

                            {/* <div className="d-flex justify-content-between mb-4">
                                <h6 className="">GSTIN</h6>
                                { vendor.GST_Number}
                            </div> */}
                            
                            
                            <div className="d-flex justify-content-between mb-4">
                                <h6 className="">PAN</h6>
                                { vendor.Pan_Number}
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <h6 className="">Opening Bal.</h6>
                                { vendor.Opening_balance}
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <h6 className="">Credit Limit</h6>
                                { vendor.Credit_limit}
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <h6 className="">Balance</h6>
                                { vendor.Opening_balance}
                            </div>
                            
                        </div>

                    </div>
                </div>
            </div>
            <div id="transaction" style={{display:'none'}} >
                <div className="row mt-3 mb-3">
                    <div className="col-md-1"></div>
                    <div className="col-md-10">
                        <div className="row mt-3">
                            <h3 style={{marginLeft:'15px'}}><strong>{vendor.Title}.{ vendor.First_name } { vendor.Last_name }</strong></h3>
                        </div>
                        <div className="row mt-4 mb-3">
                            <div className="col-md-4">
                                <p>Mobile : <strong>{vendor.Mobile}</strong></p>
                            </div>
                            <div className="col-md-4"></div>
                            <div className="col-md-4">
                                <p>GSTIN : <strong>{vendor.GST_Number}</strong></p>
                            </div>
                        </div>
                        <div className="row mt-3 mb-3">
                            <div className="col-md-4">
                                <p>Email : <strong>{vendor.Vendor_email}</strong></p>
                            </div>
                            <div className="col-md-4"></div>
                            <div className="col-md-4">
                                <span className="font-weight-bold" style={{fontSize:'1.9rem'}}>Balance:<span id="vendorBalance" className="text-info ml-2 font-weight-bold" style={{fontSize:'2.2rem'}}>{vendor.Opening_balance}</span></span>
                            </div>
                        </div>
                        <div className="row mt-3 mb-3">
                            <div className="col-md-4">
                                <p>
                                    {/* {% if vendor.credit_limit != 0 %}
                                        Credit Limit: <strong>{{ vendor.credit_limit }}</strong>
                                    {% else %}
                                        No Credit Limit Set
                                    {% endif %} */}
                                    {vendor.Credit_limit !=0 ? (
                                        <strong>Credit Limit: { vendor.Credit_limit }</strong>
                                    ):(
                                        <h3>No Credit Limit Set</h3>
                                    )}
                                </p>
                            </div>
                            <div className="col-md-4"></div>
                            <div className="col-md-4"></div>
                        </div>
                        <hr />
                        <div className="row mt-4 d-flex justify-content-between">
                            <h5 style={{marginLeft:'15px'}}><strong>Transactions</strong></h5>
                            <input type="text" id="search" className="form-control w-25" placeholder="Search.." autocomplete="off" style={{position:'relative',left:'1200px',bottom:'30px'}} onKeyUp={searchTable}/>
                        </div>
                    </div>
                    <div className="col-md-1"></div>
                </div>
                <div className="row mt-4 mb-5">
                    <div className="col-md-1"></div>
                    <div className="col-md-10">
                        <table id="dataTable" className="table tabledata  table-bordered table-hover" style={{borderWidth:'2px'}}>
                            <thead>
                                <tr id="tH1" style={{visibility:'collapse'}}>
                                    <th>#</th>
                                    <th className="filterTable-column">Type</th>
                                    <th className="filterTable-column">Date</th>
                                    <th className="filterTable-column">Number</th>
                                    <th className="filterTable-column">Total</th>
                                    <th className="filterTable-column">Balance</th>
                                </tr>
                                <tr id="tH2" style={{visibility:'visible'}}>
                                    <th>#</th>
                                    <th className="filterTable-column">Type
                                        <span className="dropdown">
                                            <button className="btn dropdown-toggle text-white" type="button" id="dropdownMenuType" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{width:'50px'}}>
                                                <i className="fa fa-filter" style={{fontSize:'1rem'}}></i>
                                            </button>
                                            <div className="dropdown-menu p-2" aria-labelledby="dropdownMenuType">
                                                <select id="typeFilterCondition" className="form-control form-control-sm">
                                                    <option value="equals_to">Equals To</option>
                                                </select>
                                                <input type="text" id="typeFilter" placeholder="Type" className="form-control form-control-sm mt-1" required />
                                                <div className="d-flex mt-1">
                                                    <input type="button" onclick="clearSearch('typeFilter',this)" className="btn btn-sm btn-info mr-1" style={{width:'49%'}} value="CLEAR" />
                                                    <input type="button" onclick="filterSearchValues(1,'typeFilter',this)" className="btn btn-sm btn-info" style={{width:'49%'}} value="APPLY" />
                                                </div>
                                            </div>
                                        </span>                                            
                                    </th>
                                    <th className="filterTable-column">Number
                                        <span className="dropdown">
                                            <button className="btn dropdown-toggle text-white" type="button" id="dropdownMenuNumber" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{width:'50px'}}>
                                                <i className="fa fa-filter" style={{fontSize:'1rem'}}></i>
                                            </button>
                                            <div className="dropdown-menu p-2" aria-labelledby="dropdownMenuNumber">
                                                <select id="numberFilterCondition" className="form-control form-control-sm">
                                                    <option value="equals_to">Equals To</option>
                                                </select>
                                                <input type="text" id="numberFilter" placeholder="Number" className="form-control form-control-sm mt-1" required />
                                                <div className="d-flex mt-1">
                                                    <input type="button" onclick="clearSearch('numberFilter',this)" className="btn btn-sm btn-info mr-1" style={{width:'49%'}} value="CLEAR" />
                                                    <input type="button" onclick="filterSearchValues(2,'numberFilter',this)" className="btn btn-sm btn-info" style={{width:'49%'}} value="APPLY" />
                                                </div>
                                            </div>
                                        </span>
                                    </th>

                                    <th className="filterTable-column">Date
                                        <span className="dropdown">
                                            <button className="btn dropdown-toggle text-white" type="button" id="dropdownMenuDate" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{width:'50px'}}>
                                                <i className="fa fa-filter" style={{fontSize:'1rem'}}></i>
                                            </button>
                                            <div className="dropdown-menu p-2" aria-labelledby="dropdownMenuDate">
                                                <select id="dateFilterCondition" className="form-control form-control-sm">
                                                    <option value="equals_to">Equals To</option>
                                                </select>
                                                <input type="date" id="dateFilter" className="form-control form-control-sm mt-1" required />
                                                <div className="d-flex mt-1">
                                                    <input type="button" onclick="clearSearch('dateFilter',this)" className="btn btn-sm btn-info mr-1" style={{width:'49%'}} value="CLEAR" />
                                                    <input type="button" onclick="filterSearchValues(3,'dateFilter',this)" className="btn btn-sm btn-info" style={{width:'49%'}} value="APPLY" />
                                                </div>
                                            </div>
                                        </span>
                                    </th>
                                    
                                    <th className="filterTable-column">Total
                                        <span className="dropdown">
                                            <button className="btn dropdown-toggle text-white" type="button" id="dropdownMenuTotal" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{width:'50px'}}>
                                                <i className="fa fa-filter" style={{fontSize:'1rem'}}></i>
                                            </button>
                                            <div className="dropdown-menu p-2" aria-labelledby="dropdownMenuTotal">
                                                <select id="totalFilterCondition" className="form-control form-control-sm">
                                                    <option value="equals_to">Equals To</option>
                                                </select>
                                                <input type="number" id="totalFilter" placeholder="Total" className="form-control form-control-sm mt-1" required />
                                                <div className="d-flex mt-1">
                                                    <input type="button" onclick="clearSearch('totalFilter',this)" className="btn btn-sm btn-info mr-1" style={{width:'49%'}} value="CLEAR" />
                                                    <input type="button" onclick="filterAmount(4,'totalFilter',this)" className="btn btn-sm btn-info" style={{width:'49%'}} value="APPLY" />
                                                </div>
                                            </div>
                                        </span>
                                    </th>

                                    <th className="filterTable-column">Balance
                                        <span className="dropdown">
                                            <button className="btn dropdown-toggle text-white" type="button" id="dropdownMenuBalance" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{width:'50px'}}>
                                                <i className="fa fa-filter" style={{fontSize:'1rem'}}></i>
                                            </button>
                                            <div className="dropdown-menu p-2" aria-labelledby="dropdownMenuBalance">
                                                <select id="balanceFilterCondition" className="form-control form-control-sm">
                                                    <option value="equals_to">Equals To</option>
                                                </select>
                                                <input type="number" id="balanceFilter" placeholder="Balance" className="form-control form-control-sm mt-1" required />
                                                <div className="d-flex mt-1">
                                                    <input type="button" onclick="clearSearch('balanceFilter',this)" className="btn btn-sm btn-info mr-1" style={{width:'49%'}} value="CLEAR" />
                                                    <input type="button" onclick="filterAmount(5,'balanceFilter',this)" className="btn btn-sm btn-info" style={{width:'49%'}} value="APPLY" />
                                                </div>
                                            </div>
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="dataTableBody">
                
                                <tr>
                                    <td>1</td>
                                    <td><strong>Opening Balance</strong></td>
                                    <td></td>
                                    <td>{vendor.Date}</td>
                                    <td>{vendor.Opening_balance}</td>
                                    <td>{vendor.Opening_balance}</td>
                                </tr>
                                
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-1"></div>
                </div>
            </div>
            <div id="statement" style={{display:'none'}} >
                <div className="container-fluid" >
                    <div className="py-5">
                        <div className="row">
                            <div className="col-sm-12 d-flex justify-content-between align-items-center">
                                <div className="date_range d-flex">
                                    <div className="form-group">
                                        <label for="from">From</label>
                                        <input type="date" className="form-control" id="fromDate" />
                                    </div>
                                    <div className="form-group ml-2">
                                        <label for="from">To</label>
                                        <input type="date" className="form-control" id="toDate" />
                                    </div>
                                </div>
                                <div className="run_report">
                                    <button className="btn btn-outline-secondary text-white btn-sm ml-2">Run Report</button>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="row mt-4">
                            <div className="col-md-7" style={{margin:'auto'}}>
                                <div className="card">
                                    <div className="card-block1">
                                        <div id="printContent" className="print-container card-body">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-sm-12 col-sm-offset-1" style={{padding:'20px'}}>
                                                        <div className="widget-box">
                                                            <div className="widget-header widget-header-large py-3 px-4" style={{backgroundColor:'#343a40',padding:'1.1rem 1rem'}}>
                                                                <h5 className="widget-title mb-4 print-visible" style={{color:'white'}}>
                                                                    <strong><span style={{color:'#fff',fontSize:'1.3rem',fontWeight:'bold'}}>Statement of {vendor.Title}. {vendor.First_name} {vendor.Last_name}</span></strong>
                                                                </h5>  
                                                                {/* <span id="df" style="border: none;color: #F7F7F7;background-color: #343a40;">{{vendor.date|date:'Y-m-d'}}</span> <span style="color: white;">to</span>
                                                                <span id="dl" style="border: none; background-color: none;color: #F7F7F7;background-color: #343a40;">{% now 'Y-m-d' %}</span> */}
                                                            </div>
                                            
                                                            <div className="widget-body bg-white" style={{padding:'1rem 0.5rem'}}>
                                                                <div className="widget-main">
                                                                    <div className="row"  style={{padding:'20px'}} >
                                                                        <div className="col-sm-12" style={{display:'flex'}}>
                                                                            <div className="col-6" style={{width:'50%'}}>
                                                                                {/* <div style={{width:'20px'}}>
                                                                                    {% if cmp.Image %}<img src="{{cmp.Image.url}}" style="width: 25px;">{% endif %}
                                                                                </div> */}
                                                                                <p style={{color:'black'}}><strong>{ company.Company_name }</strong> <br />
                                                                                    {company.City} <br />
                                                                                    {company.State},{company.Country} <br />
                                                                                    {company.Email}<br />
                                                                                    {company.Pincode}<br />
                                                                                </p>  
                                                                            </div>
                                                                            <div style={{width:'50%',paddingTop:'1rem'}}>
                                                                                <p style={{color:'black'}}>To,<br /><strong>{vendor.First_name} {vendor.Last_name}</strong><br />
                                                                                    {vendor.Billing_street},{vendor.Billing_city}<br />
                                                                                    {vendor.Billing_state},{vendor.Billing_country}<br />
                                                                                    {vendor.Billing_pincode }<br />
                                                                                    {vendor.Vendor_email}<br />
                                                                                    {vendor.Mobile}<br />
                                                                                </p>
                                                                            </div>
                                                                        
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="row">
                                                                        <div style={{display:'flex',width:'75%',justifyContent:'end'}}>
                                                                            <table style={{color:'black'}}>
                                                                                <tr>
                                                                                    <th className="text-black">Account Summary</th>
                                                                                </tr>
                                                                                <tr>
                                                                                    <th>Opening balance</th>
                                                                                    <th>:</th>
                                                                                    <th>{vendor.Opening_balance}</th>
                                                                                </tr>
                                                                                <tr>
                                                                                    <th>Balance</th>
                                                                                    <th>:</th>
                                                                                    <th>{vendor.Opening_balance}</th>
                                                                                </tr>
                                                                            </table>
                                                                        </div>
                                                                        
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="col-md-12" style={{marginBottom:'1.5rem',marginTop:'1rem'}}>
                                                                    {/* <!-- <table id="logic" class="table table-bordered" width="100%" style=" color:white; background-color: #545455;"> --> */}
                                                                    <table id="logic" className="table table-hover" width={'100%'}>
                                                                        <thead className="" style={{background:'#22b8d1'}}>
                                                                            <tr>
                                                            
                                                                                <th style={{padding:'1.2rem 0.5rem',color:'black'}}>Date</th>
                                                                                <th style={{padding:'1.2rem 0.5rem',color:'black'}}>Type</th>
                                                                                <th style={{padding:'1.2rem 0.5rem',color:'black'}}>Number</th>
                                                                                <th style={{padding:'1.2rem 0.5rem',color:'black'}}>Total</th>
                                                                                <th style={{padding:'1.2rem 0.5rem',color:'black'}}>Balance</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {/* {% for data in combined_data %}
                                                                                <tr style="padding: 1.2rem 0.5rem;">
                                                                                    <td style="padding: 1.2rem 0.5rem; color: black;">{{data.Date|date:'d-m-Y'}}</td>
                                                                                    <td style="font-family: monospace; padding: 1.2rem 0.5rem; color: black;"><strong>{{data.Type}}</strong></td>
                                                                                    <td style="padding: 1.2rem 0.5rem; color: black;">{{data.Number}}</td>
                                                                                    <td style="padding: 1.2rem 0.5rem; color: black;">{{data.Total}}</td>
                                                                                    <td style="padding: 1.2rem 0.5rem; color: black;">{{data.Balance}}</td>
                                                                                </tr>
                                                                            {% endfor %} */}
                                                                             {/* <br />
                                                                            <tr >
                                                                                <th style="padding:1.2rem 0.5rem;" colspan="4">BALANCE</th>
                                                                                <th >{{BALANCE}}</th>
                                                                            </tr>  */}
                                                                            <tr style={{padding:'1.2rem 0.5rem'}}>
                                                                            <td style={{padding:'1.2rem 0.5rem',color:'black'}}>{vendor.Date}</td>
                                                                            <td style={{padding:'1.2rem 0.5rem',color:'black',fontFamily:'monospace'}}><strong>Opening Balance</strong></td>
                                                                            <td style={{padding:'1.2rem 0.5rem',color:'black'}}></td>
                                                                            <td style={{padding:'1.2rem 0.5rem',color:'black'}}></td>
                                                                            <td style={{padding:'1.2rem 0.5rem',color:'black'}}>{vendor.Opening_balance}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
</div>


     <div
        className="modal fade"
        id="commentModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h3 className="modal-title" id="exampleModalLabel">
                Add Comments
              </h3>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <form onSubmit={saveItemComment} className="px-1">
              <div className="modal-body w-100">
                <textarea
                  type="text"
                  className="form-control"
                  name="comment"
                  value={comment}
                  required
                  onChange={(e) => setComment(e.target.value)}
                />
                {comments.length > 0 ? (
                  <div className="container-fluid">
                    <table className="table mt-4">
                      <thead>
                        <tr>
                          <th className="text-center">sl no.</th>
                          <th className="text-center">Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comments.map((c, index) => (
                          <tr className="table-row">
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">{c.comments}</td>
                            
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <span className="my-2 font-weight-bold d-flex justify-content-center">
                    No Comments.!
                  </span>
                )}
              </div>

              <div className="modal-footer w-100">
                <button
                  type="button"
                  style={{ width: "fit-content", height: "fit-content" }}
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  style={{ width: "fit-content", height: "fit-content" }}
                  className="btn"
                  id="commentSaveBtn"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>        



<div className="modal fade" id="shareToEmail">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">Share Vendor Transactions</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={handleShareEmail}
                className="needs-validation px-1"
                id="share_to_email_form"
              >
                <div className="card p-3 w-100">
                  <div className="form-group">
                    <label for="emailIds">Email IDs</label>
                    <textarea
                      className="form-control"
                      name="email_ids"
                      id="emailIds"
                      rows="3"
                      placeholder="Multiple emails can be added by separating with a comma(,)."
                      value={emailIds}
                      onChange={(e) => setEmailIds(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label for="item_unitname">Message(optional)</label>
                    <textarea
                      name="email_message"
                      id="email_message"
                      className="form-control"
                      cols=""
                      rows="4"
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      placeholder="This message will be sent along with Bill details."
                    />
                  </div>
                </div>
                <div
                  className="modal-footer d-flex justify-content-center w-100"
                  style={{ borderTop: "1px solid #ffffff" }}
                >
                  <button
                    type="submit"
                    id="share_with_email"
                    className="submitShareEmailBtn w-50 text-uppercase"
                  >
                    SEND MAIL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>



      
                                    
                       
                        
    
        </>
    )
}
export default View_vendor;