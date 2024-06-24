import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";

function EditBank() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();
  const { bankId } = useParams();

  var currentDate = new Date();
  var formattedDate = currentDate.toISOString().slice(0, 10);

  const [bankDetails, setBankDetails] = useState({});

  const fetchBankDetails = () => {
    axios
      .get(`${config.base_url}/fetch_bank_details/${bankId}/`)
      .then((res) => {
        console.log("BNK DATA=", res);
        if (res.data.status) {
          var bnk = res.data.bank;
          setBankDetails(bnk);
          setBankName(bnk.bank_name);
          setIfscCode(bnk.ifsc_code);
          setAccountNumber(bnk.account_number);
          setBranchName(bnk.branch_name);
          setOpeningBalance(bnk.opening_balance);
          setBalanceType(bnk.opening_balance_type);
          setDate(formatDate(bnk.date));
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

  useEffect(() => {
    fetchBankDetails();
  }, []);

  function formatDate(value) {
    if (value != "") {
      var date = new Date(value);
      return date.toISOString().slice(0, 10);
    } else {
      return "";
    }
  }

  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchName, setBranchName] = useState("");
  const [openingBalance, setOpeningBalance] = useState(0);
  const [balanceType, setBalanceType] = useState("DEBIT");
  const [date, setDate] = useState(formattedDate);

  const handleSubmit = (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
      b_id: bankId,
      bank_name: bankName,
      ifsc_code: ifscCode,
      branch_name: branchName,
      opening_balance: openingBalance,
      opening_balance_type: balanceType,
      date: date,
      current_balance: openingBalance,
      account_number: accountNumber,
    };

    axios
      .put(`${config.base_url}/update_bank/`, dt)
      .then((res) => {
        console.log("BNK RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Updated",
          });
          navigate(`/view_bank/${bankId}/`);
        }
        if (!res.data.status && res.data.message != "") {
          Swal.fire({
            icon: "error",
            title: `${res.data.message}`,
          });
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

  function checkAccountNumber(value) {
    if (value != "" && value != bankDetails.account_number)
      var a = {
        Id: ID,
        bank: bankName,
        number: accountNumber,
      };
    axios
      .get(`${config.base_url}/check_bank_account_number/`, { params: a })
      .then((res) => {
        console.log("ACC RES", res);
        if (res.data.is_exist) {
          document.getElementById("accountNumberError").innerText =
            "Account number already exists.";
        } else {
          document.getElementById("accountNumberError").innerText = "";
        }
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  }

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
  return (
    <>
      <FinBase />
      <div
        className="page-content mt-0 pt-0"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="d-flex justify-content-end mb-1">
          <Link to={`/view_bank/${bankId}/`}>
            <i
              className="fa fa-times-circle text-white mx-4 p-1"
              style={{ fontSize: "1.2rem", marginRight: "0rem !important" }}
            ></i>
          </Link>
        </div>
        <div className="card radius-15 h-20">
          <div className="row">
            <div className="col-md-12">
              <center>
                <h2 className="mt-3">EDIT BANK</h2>
              </center>
              <hr />
            </div>
          </div>
        </div>

        <div className="card radius-15">
          <div className="card-body">
            <div className="container-fluid">
              <form id="bankForm" className="px-1" onSubmit={handleSubmit}>
                <div className="row w-100">
                  <div className="col-md-5 p-2">
                    <label for="">BANK NAME</label>
                  </div>
                  <div className="col-md-2"></div>
                  <div className="col-md-5 p-2">
                    <label for="">ACCOUNT NUMBER</label>
                  </div>
                </div>

                <div className="row w-100">
                  <div className="col-md-5 p-2">
                    <input
                      className="form-control"
                      type="text"
                      name="bname"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      id="bname"
                      required
                    />
                  </div>
                  <div className="col-md-2"></div>
                  <div className="col-md-5 p-2">
                    <input
                      className="form-control"
                      type="number"
                      name="acc_num"
                      id="acc_num"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      onBlur={(e) => checkAccountNumber(e.target.value)}
                      required
                    />
                    <span
                      id="accountNumberError"
                      className="text-danger"
                    ></span>
                  </div>
                </div>

                <div className="row w-100">
                  <div className="col-md-5 p-2">
                    <label for="">BANK IFSC CODE</label>
                  </div>
                  <div className="col-md-2"></div>
                  <div className="col-md-5 p-2">
                    <label for="">BRANCH NAME</label>
                  </div>
                </div>

                <div className="row w-100">
                  <div className="col-md-5 p-2">
                    <input
                      className="form-control"
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      name="ifsc"
                      required
                    />
                  </div>
                  <div className="col-md-2"></div>

                  <div className="col-md-5 p-2">
                    <input
                      className="form-control"
                      type="text"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      name="branch"
                      required
                    />
                  </div>
                </div>

                <div className="row w-100">
                  <div className="col-md-5 p-2">
                    <label for="">OPENING BALANCE</label>
                  </div>
                  <div className="col-md-2"></div>

                  <div className="col-md-5 p-2">
                    <label for="">DATE</label>
                  </div>
                </div>

                <div className="row w-100">
                  <div className="col-md-5 form-inline p-2">
                    <input
                      className="form-control"
                      type="number"
                      value={openingBalance}
                      onChange={(e) => setOpeningBalance(e.target.value)}
                      name="Opening"
                      required
                    />
                    <select
                      className="form-control ml-1"
                      value={balanceType}
                      onChange={(e) => setBalanceType(e.target.value)}
                      name="op_type"
                      id=""
                    >
                      <option value="DEBIT">DEBIT</option>
                      <option value="CREDIT">CREDIT</option>
                    </select>
                  </div>
                  <div className="col-md-2"></div>

                  <div className="col-md-5 p-2">
                    <input
                      className="form-control"
                      type="date"
                      name="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      id="dateInput"
                    />
                  </div>
                </div>

                <div className="row mt-5 mb-5 w-100">
                  <div className="col-md-4"></div>
                  <div className="col-md-4 d-flex justify-content-center">
                    <button
                      className="btn btn-outline-secondary text-light"
                      type="submit"
                      style={{ width: "50%", height: "fit-content" }}
                    >
                      SAVE
                    </button>
                    <Link
                      to={`/view_bank/${bankId}/`}
                      className="btn btn-outline-secondary ml-1 text-light"
                      style={{ width: "fit-content", height: "fit-content" }}
                    >
                      CANCEL
                    </Link>
                  </div>
                  <div className="col-md-4"></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditBank;
