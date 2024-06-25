import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
function EditTransactions() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();

  const { transId } = useParams();

  var currentDate = new Date();
  var formattedDate = currentDate.toISOString().slice(0, 10);

  const [transactionDetails, setTransactionDetails] = useState({});
  const [bankDetails, setBankDetails] = useState({});

  const fetchTransactionDetails = () => {
    axios
      .get(`${config.base_url}/fetch_transaction_details/${transId}/`)
      .then((res) => {
        console.log("TRNS RES=", res);
        var tr = res.data.transaction;
        var bnk = res.data.bank;
        var othBank = res.data.otherBank;
        setBankDetails(bnk);
        setTransactionDetails(tr);
        if (tr.transaction_type == "Cash Withdraw") {
          setFrom(tr.banking);
          setTo("Cash");
          setAmount(tr.amount);
          setDate(formatDate(tr.adjustment_date));
          setDescription(tr.description);
        }
        if (tr.transaction_type == "Cash Deposit") {
          setFrom("Cash");
          setTo(tr.banking);
          setAmount(tr.amount);
          setDate(formatDate(tr.adjustment_date));
          setDescription(tr.description);
        }

        if (tr.transaction_type == "From Bank Transfer") {
          setFrom(tr.banking);
          setTo(othBank);
          setAmount(tr.amount);
          setDate(formatDate(tr.adjustment_date));
          setDescription(tr.description);
        }

        if (tr.transaction_type == "To Bank Transfer") {
          setFrom(othBank);
          setTo(tr.banking);
          setAmount(tr.amount);
          setDate(formatDate(tr.adjustment_date));
          setDescription(tr.description);
        }

        if (tr.transaction_type == "Adjust bank Balance") {
          setFrom(tr.banking);
          setType(tr.adjustment_type);
          setAmount(tr.amount);
          setDate(formatDate(tr.adjustment_date));
          setDescription(tr.description);
        }
      })
      .catch((err) => {
        console.log("ERROR=", err);
      });
  };

  useEffect(() => {
    fetchTransactionDetails();
  }, []);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const [banks, setBanks] = useState([]);

  const fetchBanks = () => {
    axios
      .get(`${config.base_url}/fetch_banks/${ID}/`)
      .then((res) => {
        console.log("BNK RES=", res);
        if (res.data.status) {
          var bnks = res.data.banks;
          setBanks([]);
          bnks.map((i) => {
            setBanks((prevState) => [...prevState, i]);
          });
        }
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  function formatDate(value) {
    if (value && !isNaN(Date.parse(value))) {
      var date = new Date(value);
      return date.toISOString().slice(0, 10);
    } else {
      return "";
    }
  }

  const handleBankToCashUpdate = (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
      t_id: transId,
      bank: from,
      amount: amount,
      date: date,
      description: description,
    };

    axios
      .post(`${config.base_url}/update_bank_to_cash/`, dt)
      .then((res) => {
        console.log("BTC RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Transaction Updated",
          });
          navigate(`/view_bank/${bankDetails.id}/`);
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

  const handleCashToBankUpdate = (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
      t_id: transId,
      bank: to,
      amount: amount,
      date: date,
      description: description,
    };

    axios
      .post(`${config.base_url}/update_cash_to_bank/`, dt)
      .then((res) => {
        console.log("BTC RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Transaction Updated",
          });
          navigate(`/view_bank/${bankDetails.id}/`);
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

  const handleBankAdjustUpdate = (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
      t_id: transId,
      bank: from,
      type: type,
      amount: amount,
      date: date,
      description: description,
    };

    axios
      .post(`${config.base_url}/update_bank_adjust/`, dt)
      .then((res) => {
        console.log("BTC RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Transaction Updated",
          });
          navigate(`/view_bank/${bankDetails.id}/`);
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

  const handleBankToBankUpdate = (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
      t_id: transId,
      f_bank: from,
      t_bank: to,
      amount: amount,
      date: date,
      description: description,
    };

    axios
      .post(`${config.base_url}/update_bank_to_bank/`, dt)
      .then((res) => {
        console.log("BTC RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Transaction Updated",
          });
          navigate(`/view_bank/${bankDetails.id}/`);
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
          <Link to={`/view_bank/${bankDetails.id}/`}>
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
                <h2 className="mt-3">EDIT TRANSACTIONS</h2>
              </center>
              <hr />
            </div>
          </div>
        </div>

        <div className="card radius-15">
          <div className="card-body">
            <div className="container-fluid">
              {transactionDetails &&
              transactionDetails.transaction_type == "Cash Withdraw" ? (
                <form
                  id="bankForm"
                  className="px-1"
                  onSubmit={handleBankToCashUpdate}
                >
                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">From</label>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2">
                      <label for="">To</label>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <select
                        class="form-control"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        name=""
                        id=""
                        required
                      >
                        {banks &&
                          banks.map((b) => (
                            <>
                              {b.id == from ? (
                                <option value={b.id}>
                                  {b.bank_name} ({b.account_number})
                                </option>
                              ) : null}
                            </>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-2"></div>
                    <div class="col-md-5 p-2">
                      <select
                        class="form-control"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        name="cash"
                        id=""
                      >
                        <option class="form-control" selected value="Cash">
                          Cash
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Amount</label>
                    </div>
                    <div className="col-md-2"></div>

                    <div className="col-md-5 p-2">
                      <label for="">Adjustment Date</label>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <input
                        className="form-control"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        name="Opening"
                        required
                      />
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

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Description</label>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2"></div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <input
                        className="form-control"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2"></div>
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
                        to={`/view_bank/${bankDetails.id}/`}
                        className="btn btn-outline-secondary ml-1 text-light"
                        style={{ width: "fit-content", height: "fit-content" }}
                      >
                        CANCEL
                      </Link>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </form>
              ) : null}

              {transactionDetails &&
              transactionDetails.transaction_type == "Cash Deposit" ? (
                <form
                  id="bankForm"
                  className="px-1"
                  onSubmit={handleCashToBankUpdate}
                >
                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">From</label>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2">
                      <label for="">To</label>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <select
                        class="form-control"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        name="cash"
                        id=""
                      >
                        <option class="form-control" selected value="Cash">
                          Cash
                        </option>
                      </select>
                    </div>
                    <div className="col-md-2"></div>
                    <div class="col-md-5 p-2">
                      <select
                        class="form-control"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        name=""
                        id=""
                        required
                      >
                        {banks &&
                          banks.map((b) => (
                            <>
                              {
                                (b.id = to ? (
                                  <option value={b.id}>
                                    {b.bank_name} ({b.account_number})
                                  </option>
                                ) : null)
                              }
                            </>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Amount</label>
                    </div>
                    <div className="col-md-2"></div>

                    <div className="col-md-5 p-2">
                      <label for="">Adjustment Date</label>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <input
                        className="form-control"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        name="Opening"
                        required
                      />
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

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Description</label>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2"></div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <input
                        className="form-control"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2"></div>
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
                        to={`/view_bank/${bankDetails.id}/`}
                        className="btn btn-outline-secondary ml-1 text-light"
                        style={{ width: "fit-content", height: "fit-content" }}
                      >
                        CANCEL
                      </Link>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </form>
              ) : null}

              {transactionDetails &&
              transactionDetails.adjustment_type == "Increase Balance" ? (
                <form
                  id="bankForm"
                  className="px-1"
                  onSubmit={handleBankAdjustUpdate}
                >
                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Account Name</label>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2">
                      <label for="">Type</label>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <select
                        class="form-control"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        name=""
                        id=""
                        required
                      >
                        <option value="">Select Bank</option>
                        {banks &&
                          banks.map((b) => (
                            <option value={b.id}>
                              {b.bank_name} ({b.account_number})
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-2"></div>
                    <div class="col-md-5 p-2">
                      <select
                        class="form-control"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        name="type"
                        id=""
                      >
                        <option value={type}>{type}</option>
                      </select>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Amount</label>
                    </div>
                    <div className="col-md-2"></div>

                    <div className="col-md-5 p-2">
                      <label for="">Adjustment Date</label>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <input
                        className="form-control"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        name="Opening"
                        required
                      />
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

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Description</label>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2"></div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <input
                        className="form-control"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2"></div>
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
                        to={`/view_bank/${bankDetails.id}/`}
                        className="btn btn-outline-secondary ml-1 text-light"
                        style={{ width: "fit-content", height: "fit-content" }}
                      >
                        CANCEL
                      </Link>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </form>
              ) : null}

              {transactionDetails &&
              transactionDetails.adjustment_type == "Reduce Balance" ? (
                <form
                  id="bankForm"
                  className="px-1"
                  onSubmit={handleBankAdjustUpdate}
                >
                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Account Name</label>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2">
                      <label for="">Type</label>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <select
                        class="form-control"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        name=""
                        id=""
                        required
                      >
                        <option value="">Select Bank</option>
                        {banks &&
                          banks.map((b) => (
                            <option value={b.id}>
                              {b.bank_name} ({b.account_number})
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-2"></div>
                    <div class="col-md-5 p-2">
                      <select
                        class="form-control"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        name="type"
                        id=""
                      >
                        <option value={type}>{type}</option>
                      </select>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Amount</label>
                    </div>
                    <div className="col-md-2"></div>

                    <div className="col-md-5 p-2">
                      <label for="">Adjustment Date</label>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <input
                        className="form-control"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        name="Opening"
                        required
                      />
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

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Description</label>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2"></div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <input
                        className="form-control"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2"></div>
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
                        to={`/view_bank/${bankDetails.id}/`}
                        className="btn btn-outline-secondary ml-1 text-light"
                        style={{ width: "fit-content", height: "fit-content" }}
                      >
                        CANCEL
                      </Link>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </form>
              ) : null}

              {transactionDetails &&
              transactionDetails.transaction_type == "To Bank Transfer" ? (
                <form id="bankForm" className="px-1" onSubmit={handleBankToBankUpdate}>
                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">From</label>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2">
                      <label for="">To</label>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <select
                        class="form-control"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        name=""
                        id=""
                        required
                      >
                        {banks &&
                          banks.map((b) => (
                            <>
                              {b.id == from ? (
                                <option value={b.id}>
                                  {b.bank_name} ({b.account_number})
                                </option>
                              ) : null}
                            </>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-2"></div>
                    <div class="col-md-5 p-2">
                      <select
                        class="form-control"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        name=""
                        id=""
                        required
                      >
                        <option value="">Select Bank</option>
                        {banks &&
                          banks.map((b) => (
                            <option value={b.id}>
                              {b.bank_name} ({b.account_number})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Amount</label>
                    </div>
                    <div className="col-md-2"></div>

                    <div className="col-md-5 p-2">
                      <label for="">Adjustment Date</label>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <input
                        className="form-control"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        name="Opening"
                        required
                      />
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

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Description</label>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2"></div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <input
                        className="form-control"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2"></div>
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
                        to={`/view_bank/${bankDetails.id}/`}
                        className="btn btn-outline-secondary ml-1 text-light"
                        style={{ width: "fit-content", height: "fit-content" }}
                      >
                        CANCEL
                      </Link>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </form>
              ) : null}

              {transactionDetails &&
              transactionDetails.transaction_type == "From Bank Transfer" ? (
                <form id="bankForm" className="px-1" onSubmit={handleBankToBankUpdate}>
                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">From</label>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2">
                      <label for="">To</label>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <select
                        class="form-control"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        name=""
                        id=""
                        required
                      >
                        {banks &&
                          banks.map((b) => (
                            <>
                              {b.id == from ? (
                                <option value={b.id}>
                                  {b.bank_name} ({b.account_number})
                                </option>
                              ) : null}
                            </>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-2"></div>
                    <div class="col-md-5 p-2">
                      <select
                        class="form-control"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        name=""
                        id=""
                        required
                      >
                        <option value="">Select Bank</option>
                        {banks &&
                          banks.map((b) => (
                            <option value={b.id}>
                              {b.bank_name} ({b.account_number})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Amount</label>
                    </div>
                    <div className="col-md-2"></div>

                    <div className="col-md-5 p-2">
                      <label for="">Adjustment Date</label>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <input
                        className="form-control"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        name="Opening"
                        required
                      />
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

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <label for="">Description</label>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2"></div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-5 p-2">
                      <input
                        className="form-control"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-5 p-2"></div>
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
                        to={`/view_bank/${bankDetails.id}/`}
                        className="btn btn-outline-secondary ml-1 text-light"
                        style={{ width: "fit-content", height: "fit-content" }}
                      >
                        CANCEL
                      </Link>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditTransactions;
