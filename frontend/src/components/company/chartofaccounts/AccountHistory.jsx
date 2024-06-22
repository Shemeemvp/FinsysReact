import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";

function AccountHistory() {
  const ID = Cookies.get("Login_id");
  const { accountId } = useParams();
  const [history, setHistory] = useState([]);
  const [account, setAccount] = useState({});

  const fetchItemHistory = () => {
    axios
      .get(`${config.base_url}/fetch_account_history/${accountId}/`)
      .then((res) => {
        console.log("ACC HIST=", res);
        if (res.data.status) {
          var itm = res.data.account;
          var hist = res.data.history;
          setAccount(itm);
          setHistory([]);
          hist.map((i) => {
            setHistory((prevState) => [...prevState, i]);
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

  useEffect(() => {
    fetchItemHistory();
  }, []);

  return (
    <>
      <FinBase />
      <div
        className="page-content"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <Link
          className="d-flex justify-content-end p-2"
          style={{ cursor: "pointer" }}
          to={`/view_account/${accountId}/`}
        >
          <i
            className="fa fa-times-circle text-white"
            style={{ fontSize: "1.2rem" }}
          ></i>
        </Link>
        <div className="card radius-15">
          <div className="card-body" style={{ width: "100%" }}>
            <div className="card-title">
              <center>
                <h3
                  className="card-title"
                  style={{ textTransform: "Uppercase" }}
                >
                  {account.account_name}
                </h3>
                {account.status == "inactive" ? (
                  <h6
                    className="blinking-text"
                    style={{ color: "red", width: "140px", fontWeight: "bold" }}
                  >
                    INACTIVE
                  </h6>
                ) : (
                  <h6
                    style={{
                      width: "140px",
                      color: "green",
                      fontWeight: "bold",
                    }}
                  >
                    ACTIVE
                  </h6>
                )}
              </center>
            </div>
          </div>
        </div>

        <div
          className="card card-registration card-registration-2"
          style={{ borderRadius: "15px" }}
        >
          <div className="card-body p-0">
            <div id="history">
              <center>
                <h3 className="mt-3 text-uppercase">
                  {account.account_name} - TRANSACTIONS
                </h3>
              </center>
              <div className="table-responsive px-2">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="text-center">SL NO.</th>
                      <th className="text-center">DATE</th>
                      <th className="text-center">ACTION</th>
                      <th className="text-center">DONE BY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history &&
                      history.map((h, index) => (
                        <tr>
                          <td style={{ textAlign: "center" }}>{index + 1}</td>
                          <td style={{ textAlign: "center" }}>{h.date}</td>
                          {h.action == "Created" ? (
                            <td className="text-success text-center">
                              {h.action}
                            </td>
                          ) : (
                            <td className="text-warning text-center">
                              {h.action}
                            </td>
                          )}
                          <td style={{ textAlign: "center" }}>{h.name}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountHistory;
