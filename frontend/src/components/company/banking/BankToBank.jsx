import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
function BankToBank() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();

  const { bankId } = useParams();

  var currentDate = new Date();
  var formattedDate = currentDate.toISOString().slice(0, 10);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(formattedDate);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
      f_bank: from,
      t_bank: to,
      amount: amount,
      date: date,
      description: description,
    };

    axios
      .post(`${config.base_url}/save_bank_to_bank/`, dt)
      .then((res) => {
        console.log("BTC RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Transaction Created",
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
                <h2 className="mt-3">BANK TO BANK PAYMENT</h2>
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

export default BankToBank;
