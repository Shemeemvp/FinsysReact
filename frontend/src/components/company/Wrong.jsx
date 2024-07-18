import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../styles/CompanyReg2.css";
import axios from "axios";
import config from "../../functions/config";
import Swal from "sweetalert2";

function Wrong() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();

  const [terms, setTerms] = useState([
    {
      value: "",
      text: "Choose Payment terms",
    },
  ]);

  function fetchPaymentTerms() {
    axios
      .get(`${config.base_url}/get_payment_terms/`)
      .then((res) => {
        const trms = res.data;
        setTerms([
          {
            value: "",
            text: "Choose Payment terms",
          },
        ]);
        trms.map((term, index) => {
          var obj = {
            value: term.id,
            text: term.payment_terms_number + " " + term.payment_terms_value,
          };
          setTerms((prevState) => [...prevState, obj]);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchPaymentTerms();
  }, []);

  const [logDetails, setLogDetails] = useState({});
  const [term, setTerm] = useState("");

  function fetchLogDetails() {
    axios
      .get(`${config.base_url}/get_log_details/${ID}/`)
      .then((res) => {
        const det = res.data.logDetails;
        setLogDetails(det);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchLogDetails();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
      term: term
    };

    axios
      .post(`${config.base_url}/create_payment_term_request/`, dt)
      .then((res) => {
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Request Sent",
          });
          if(res.data.redirect != ""){
            navigate(res.data.redirect);
          }
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
      <div
        className="row"
        style={{ minHeight: "100vh", backgroundColor: "#213b52" }}
      >
        <div className="col-md-7 mx-auto">
          <form id="msform" onSubmit={handleSubmit}>
            {/* <!-- fieldsets --> */}
            <fieldset className="active_fieldset">
              <h2 className="mb-4">Upgrade Your Payment Terms</h2>
              <label
                for=""
                style={{ float: "left", marginTop: "8px", fontWeight: "bold" }}
              >
                {logDetails.type == "Company" ? "Company" : "Distributor"} Name
              </label>
              <input
                type="text"
                name=""
                value={logDetails.name}
                placeholder="Name"
                readOnly
              />
              <label
                for=""
                style={{ float: "left", marginTop: "8px", fontWeight: "bold" }}
              >
                Current Payment Terms
              </label>
              <input
                type="text"
                name=""
                value={logDetails.currentPaymentTerm}
                placeholder="Payment Term"
                readOnly
              />
              <label
                for=""
                style={{ float: "left", marginTop: "8px", fontWeight: "bold" }}
              >
                Current End Date
              </label>
              <input
                type="text"
                value={logDetails.endDate}
                style={{ border: "1px solid red" }}
              />

              <label
                for=""
                style={{ float: "left", marginTop: "8px", fontWeight: "bold" }}
              >
                Upgrade Payment Term
              </label>
              <select name="payment_term" id="" value={term} onChange={(e)=>setTerm(e.target.value)} style={{ fontWeight: "500" }} required>
                {terms &&
                  terms.map((term) => (
                    <option value={term.value}>{term.text}</option>
                  ))}
              </select>
              <input
                type="submit"
                name="submit"
                className="next action-button"
                style={{ marginTop: "30px" }}
                value="Submit"
              />
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
}

export default Wrong;
