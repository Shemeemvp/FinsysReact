import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";

function StockAdjustHistory() {
  const ID = Cookies.get("Login_id");
  const { stockId } = useParams();
  const [history, setHistory] = useState([]);
  const [stock, setStock] = useState({});

  const fetchStockAdjustHistory = () => {
    axios
      .get(`${config.base_url}/fetch_stock_adjust_history/${stockId}/`)
      .then((res) => {
        console.log("STOCK HIST=", res);
        if (res.data.status) {
          var stk = res.data.stock;
          var hist = res.data.history;
          setStock(stk);
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
    fetchStockAdjustHistory();
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
          to={`/view_stock_adjust/${stockId}/`}
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
                  STOCK ADJUSTMENT HISTORY
                </h3>
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

export default StockAdjustHistory;
