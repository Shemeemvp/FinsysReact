import React, { useEffect, useState } from "react";
import AdminBase from "./AdminBase";
import axios from "axios";
import config from "../../functions/config";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

function PaymentTerms() {
  const [number, setNumber] = useState("");
  const [termValue, setTermValue] = useState("Months");
  const [terms, setTerms] = useState([]);
  const user = Cookies.get("User");

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      num: number,
      value: termValue,
    };
    if (user === "Admin") {
      axios
        .post(`${config.base_url}/add_payment_terms/`, data)
        .then((res) => {
          console.log("RESPONSE==", res);
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Payment term added",
            });
            fetchPaymentTerms();
          }
        })
        .catch((err) => {
          console.log("ERROR==", err);
          Swal.fire({
            icon: "error",
            title: `${err.response.data.message}`,
          });
        });
    }
  };

  const fetchPaymentTerms = () => {
    axios
      .get(`${config.base_url}/get_payment_terms/`)
      .then((res) => {
        const trms = res.data;
        setTerms([]);
        trms.map((term, index) => {
          var obj = {
            id: term.id,
            paymentTerm:
              term.payment_terms_number + " " + term.payment_terms_value,
            days: term.days,
          };
          setTerms((prevState) => [...prevState, obj]);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchPaymentTerms();
  }, []);

  function removeTerm(id) {
    if (user === "Admin") {
      axios
        .delete(`${config.base_url}/delete_payment_term/${id}/`)
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Payment term deleted",
            });
            fetchPaymentTerms();
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Something went wrong.!");
          fetchPaymentTerms();
        });
    }
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
      <AdminBase />
      <div
        className="body-wrapper p-3"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="container-fluid">
          <center>
            <div className="card radius-15">
              <div className="card-body">
                <div className="card-title">
                  <center>
                    <h2 className="mb-0 h2">ADD PAYMENT TERMS</h2>
                  </center>
                  <hr />
                </div>
                <form className="pt-5" onSubmit={handleSubmit}>
                  <div
                    className="row w-100 d-flex align-items-center"
                    style={{ display: "flex" }}
                  >
                    <div className="col"></div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control w-100"
                        id="num"
                        name="num"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Enter Number Of"
                        required
                      />

                      {/* <!-- <input type="text" name="num" className="form-control mt-5"
                                style="outline: none;border: none;border-bottom: 3px solid rgb(113, 179, 240);" required> --> */}
                    </div>
                    <div className="col-md-4">
                      <select
                        name="select"
                        id=""
                        onChange={(e) => setTermValue(e.target.value)}
                        className="form-control w-100"
                      >
                        <option value="Months">Months</option>
                        <option value="Years">Years</option>
                      </select>
                    </div>
                    <div className="col"></div>
                  </div>
                  <input
                    type="submit"
                    className="btn btn-outline-info rounded-pill  text-grey mt-5 mb-4"
                    style={{ width: "20%" }}
                  />
                  {/* <!-- <center><button type="submit" className="">
                            Submit
                        </button></center> --> */}
                </form>
              </div>
            </div>
          </center>

          <div className="card radius-15">
            <div className="card-body">
              <h4 style={{ textTransform: "uppercase" }}>All Payment Terms</h4>
              <table className="table table-responsive-md mt-4 table-hover">
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      <b>N0</b>
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      <b>Payment Terms</b>
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      <b>No. Of Days</b>
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      <b>Action</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {terms &&
                    terms.map((term, index) => (
                      <tr>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td style={{ textAlign: "center" }}>
                          {term.paymentTerm}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {term.days} days
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            onClick={() => removeTerm(`${term.id}`)}
                            className="btn btn-sm btn-danger"
                            style={{ width: "75px", height: "35px" }}
                          >
                            remove
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentTerms;
