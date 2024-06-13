import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";

function AddItem() {
  const ID = Cookies.get("Login_id");

  function ShowHideDiv(track) {
    var inventorytrack = document.getElementById("inventorytrack");
    inventorytrack.style.display = track.checked ? "flex" : "none";
  }

  function validateHSN() {
    var hsnField = document.getElementById("hsnField");
    var errorText = document.getElementById("hsnError");
    var hsnValue = hsnField.value;

    if (hsnValue.length < 6) {
      errorText.innerText = "HSN must contain at least 6 digits";
      hsnField.setCustomValidity("HSN must contain at least 6 digits");
      hsnField.style.borderColor = "red";
    } else {
      errorText.innerText = "";
      hsnField.setCustomValidity("");
      hsnField.style.borderColor = "";
    }
  }

  function validateSAC() {
    var sacField = document.getElementById("sacField");
    var errorText = document.getElementById("sacError");
    var sacValue = sacField.value;

    if (sacValue.length < 6) {
      errorText.innerText = "SAC must contain at least 6 digits";
      sacField.setCustomValidity("SAC must contain at least 6 digits");
      sacField.style.borderColor = "red";
    } else {
      errorText.innerText = "";
      sacField.setCustomValidity("");
      sacField.style.borderColor = "";
    }
  }

  function showdiv() {
    document.getElementById("taxableDiv").style.display = "flex";
  }

  function hidediv() {
    document.getElementById("taxableDiv").style.display = "none";
  }

  function itemTypeChange() {
    var value = document.getElementById("itemType").value;
    var sacField = document.getElementById("sacField");
    var hsnField = document.getElementById("hsnField");
    var hsnDiv = document.getElementById("hsnDiv");
    var sacDiv = document.getElementById("sacDiv");
    var sacError = document.getElementById("sacError");
    var hsnError = document.getElementById("hsnError");
    if (value === "Goods") {
      sacField.value = "";
      hsnField.required = true;
      sacField.required = false;
      hsnDiv.style.display = "block";
      sacDiv.style.display = "none";
      sacError.textContent = "";
      sacField.style.borderColor = "white";
    } else {
      hsnField.value = "";
      hsnField.required = false;
      sacField.required = true;
      sacDiv.style.display = "block";
      hsnDiv.style.display = "none";
      hsnError.textContent = "";
      hsnField.style.borderColor = "white";
    }
  }

  const [units, setUnits] = useState([]);

  const fetchItemUnits = () => {
    axios
      .get(`${config.base_url}/get_company_item_units/${ID}/`)
      .then((res) => {
        console.log("UNITS==", res);
        if (res.data.status) {
          let unt = res.data.units;
          setUnits([]);
          unt.map((i) => {
            let obj = {
              name: i.name,
            };
            setUnits((prevState) => [...prevState, obj]);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchItemUnits();
  }, []);

  return (
    <>
      <FinBase />
      <div
        className="page-content mt-0 pt-0"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="d-flex justify-content-end mb-1">
          <Link to={"/items"}>
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
                <h2 className="mt-3">ADD ITEM</h2>
              </center>
              <hr />
            </div>
          </div>
        </div>

        <div className="card radius-15">
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12"></div>
            </div>
            <form
              action="{% url 'Fin_createNewItem' %}"
              method="post"
              className="needs-validation px-1"
              validate
            >
              <div className="row w-100">
                <div className="col-md-12 mx-0">
                  <div className="row">
                    <div className="col-md-6 mt-3">
                      <label for="itemName" style={{ color: "white" }}>
                        Name
                      </label>
                      <input
                        type="text"
                        id="itemName"
                        name="name"
                        className="form-control"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                        autocomplete="off"
                        required
                      />
                    </div>
                    <div className="col-md-6 mt-3">
                      <label for="itemType" style={{ color: "white" }}>
                        Type
                      </label>
                      <select
                        name="type"
                        className="form-control"
                        id="itemType"
                        onChange={() => {
                          itemTypeChange();
                        }}
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                        required
                      >
                        <option selected disabled value="">
                          Choose...
                        </option>
                        <option value="Goods">Goods</option>
                        <option value="Services">Services</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-3">
                      <label for="itemUnit" style={{ color: "white" }}>
                        Unit
                      </label>
                      <div className="d-flex align-items-center">
                        <select
                          className="custom-select"
                          name="unit"
                          id="itemUnit"
                          required
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                        >
                          <option selected disabled value="">
                            Choose...
                          </option>
                          {units &&
                            units.map((i) => (
                              <option value={i.name} className="text-uppercase">
                                {i.name}
                              </option>
                            ))}
                        </select>
                        <a href="#">
                          <button
                            type="button"
                            className="btn btn-outline-secondary ml-1"
                            data-toggle="modal"
                            data-target="#createNewUnit"
                            style={{
                              width: "fit-content",
                              height: "fit-content",
                            }}
                          >
                            +
                          </button>
                        </a>
                      </div>
                    </div>
                    <div className="col-md-6 mt-3" id="hsnDiv">
                      <label for="hsnField" style={{ color: "white" }}>
                        HSN Code
                      </label>
                      <input
                        type="number"
                        name="hsn"
                        className="form-control"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                        placeholder="Enter a valid HSN code"
                        required
                        id="hsnField"
                        onInput={validateHSN}
                      />
                      <div id="hsnError" style={{ color: "red" }}></div>
                    </div>
                    <div
                      className="col-md-6 mt-3"
                      id="sacDiv"
                      style={{ display: "none" }}
                    >
                      <label for="sacField" style={{ color: "white" }}>
                        SAC Code
                      </label>
                      <input
                        type="number"
                        name="sac"
                        className="form-control"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                        placeholder="Enter a valid SAC code"
                        required
                        id="sacField"
                        onInput={validateSAC}
                      />
                      <div id="sacError" style={{ color: "red" }}></div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-3 mt-3">
                      <label style={{ color: "white" }}>Tax Reference</label>
                    </div>
                    <div className="col-md-3">
                      <div className="form-check mt-1">
                        <input
                          className="form-check-input"
                          name="taxref"
                          type="radio"
                          id="inclusive"
                          value="taxable"
                          onClick={showdiv}
                          required
                        />
                        <label style={{ color: "white" }} for="inclusive">
                          taxable
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-check mt-1">
                        <input
                          className="form-check-input"
                          name="taxref"
                          type="radio"
                          value="non taxable"
                          id="check"
                          onClick={hidediv}
                        />
                        <label style={{ color: "white" }} for="check">
                          non taxable
                        </label>
                      </div>
                    </div>
                  </div>
                  <div
                    className="row"
                    id="taxableDiv"
                    style={{ display: "none" }}
                  >
                    <div className="col-md-6 mt-3">
                      <label for="intraStateTax" style={{ color: "white" }}>
                        Intra State Tax Rate
                      </label>
                      <select
                        name="intra_st"
                        className="form-control"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                        id="intraStateTax"
                      >
                        <option value="0">GST 0 (0%)</option>
                        <option value="3">GST 3 (3%)</option>
                        <option value="5">GST 5 (5%)</option>
                        <option value="12">GST 12 (12%)</option>
                        <option value="18">GST 18 (18%)</option>
                        <option value="28">GST 28 (28%)</option>
                      </select>
                    </div>
                    <div className="col-md-6 mt-3">
                      <label for="interStateTax" style={{ color: "white" }}>
                        Inter State Tax Rate
                      </label>
                      <select
                        name="inter_st"
                        className="form-control"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                        id="interStateTax"
                      >
                        <option value="0">IGST 0 (0%)</option>
                        <option value="3">IGST 3 (3%)</option>
                        <option value="5">IGST 5 (5%)</option>
                        <option value="12">IGST 12 (12%)</option>
                        <option value="18">IGST 18 (18%)</option>
                        <option value="28">IGST 28 (28%)</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-3">
                      <label style={{ color: "white" }}>Purchase Price</label>
                      <div className="row">
                        <div className="col-md-12 d-flex">
                          <input
                            type="text"
                            className="form-control mr-1"
                            value="INR"
                            style={{
                              width: "60px",
                              backgroundColor: "#2a4960",
                              color: "white;",
                            }}
                          />
                          <input
                            type="number"
                            name="pcost"
                            className="form-control"
                            id="purprice"
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
                            value="0"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mt-3">
                      <label style={{ color: "white" }}>Sales Price</label>
                      <div className="row">
                        <div className="col-md-12 d-flex">
                          <input
                            type="text"
                            className="form-control mr-1"
                            value="INR"
                            style={{
                              width: "60px",
                              backgroundColor: "#2a4960",
                              color: "white;",
                            }}
                          />
                          <input
                            type="text"
                            name="salesprice"
                            className="form-control"
                            id="saleprice"
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
                            value="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-3">
                      <label for="purchaseAccount" style={{ color: "white" }}>
                        Account
                      </label>
                      <div className="d-flex align-items-center">
                        <select
                          name="pur_account"
                          className="form-control"
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          id="purchaseAccount"
                        >
                          <option value="" selected disabled>
                            --Choose--
                          </option>
                          {/* {% for a in accounts %} */}
                          <option value="{{ a.account_name }}">
                            {"{ a.account_name }"}
                          </option>
                          {/* {% endfor %} */}
                        </select>
                        <a href="#">
                          <button
                            type="button"
                            className="btn btn-outline-secondary ml-1"
                            data-toggle="modal"
                            data-target="#createNewAccount"
                            style={{
                              width: "fit-content",
                              height: "fit-content",
                            }}
                          >
                            +
                          </button>
                        </a>
                      </div>
                    </div>
                    <div className="col-md-6 mt-3">
                      <label for="salesAccount" style={{ color: "white" }}>
                        Account
                      </label>
                      <select
                        name="sale_account"
                        className="form-control"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                        id="salesAccount"
                      >
                        <option value="" selected disabled>
                          --Choose--
                        </option>
                        <option value="General Income">General Income</option>
                        <option value="Interest Income">Interest Income</option>
                        <option value="Late Fee Income">Late Fee Income</option>
                        <option value="Discount Income">Discount Income</option>
                        <option value="Shipping Charges">
                          Shipping Charges
                        </option>
                        <option value="Other Charges">Other Charges</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mt-3">
                      <label
                        for="purchaseDescription"
                        style={{ color: "white" }}
                      >
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        name="pur_desc"
                        id="purchaseDescription"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                      ></textarea>
                    </div>
                    <div className="col-md-6 mt-3">
                      <label for="salesDescription" style={{ color: "white" }}>
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        name="sale_desc"
                        id="salesDescription"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                      ></textarea>
                    </div>
                  </div>

                  {/* <div className="row mt-3">
                    <div className="col-md-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          onClick="ShowHideDiv(this)"
                          type="checkbox"
                          id="track"
                        />
                        <label className="form-check-label" for="track">
                          Track Inventory
                        </label>
                      </div>
                    </div>
                  </div> */}
                  <div className="row" id="inventorytrack">
                    <div className="col-md-6 mt-3">
                      <label style={{ color: "white" }}>
                        Inventory Account
                      </label>
                      <select
                        name="invacc"
                        className="form-control"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                        required
                      >
                        <option selected disabled value="">
                          Choose...
                        </option>
                        <option value="Inventory Assets">
                          Inventory Assets
                        </option>
                      </select>
                    </div>
                    <div className="col-md-3 mt-3">
                      <label style={{ color: "white" }}>Stock on hand</label>
                      <input
                        type="number"
                        name="stock"
                        className="form-control"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                        value="0"
                        required
                      />
                    </div>
                    <div className="col-md-3 mt-3">
                      <label style={{ color: "white" }}>
                        Stock Rate per Unit
                      </label>
                      <input
                        type="number"
                        name="stock_rate"
                        className="form-control"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                        value="0"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-3 mt-3">
                      <label style={{ color: "white" }}>
                        Minimum Stock to maintain
                      </label>
                      <input
                        type="number"
                        name="min_stock"
                        className="form-control"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                        value="0"
                      />
                    </div>
                  </div>

                  <div className="row mt-5 mb-5">
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
                        to="/items"
                        className="btn btn-outline-secondary ml-1 text-light"
                        style={{ width: "fit-content", height: "fit-content" }}
                      >
                        CANCEL
                      </Link>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddItem;
