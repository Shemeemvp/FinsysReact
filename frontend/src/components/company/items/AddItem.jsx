import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";

function AddItem() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();

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
  const [accounts, setAccounts] = useState([]);

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

  const fetchPurchaseAccounts = () => {
    axios
      .get(`${config.base_url}/get_company_accounts/${ID}/`)
      .then((res) => {
        console.log("ACCNTS==", res);
        if (res.data.status) {
          let acc = res.data.accounts;
          setAccounts([]);
          acc.map((i) => {
            let obj = {
              account_name: i.account_name,
            };
            setAccounts((prevState) => [...prevState, obj]);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchPurchaseAccounts();
  }, []);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [unit, setUnit] = useState("");
  const [hsn, setHsn] = useState("");
  const [sac, setSac] = useState("");
  const [taxRef, setTaxRef] = useState("");
  const [interStateTax, setInterStateTax] = useState("");
  const [intraStateTax, setIntraStateTax] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [purchaseAccount, setPurchaseAccount] = useState("");
  const [purchaseDescription, setPurchaseDescription] = useState("");
  const [salesPrice, setSalesPrice] = useState(0);
  const [salesAccount, setSalesAccount] = useState("");
  const [salesDescription, setSalesDescription] = useState("");
  const [inventoryAccount, setInventoryAccount] = useState("");
  const [stock, setStock] = useState(0);
  const [stockUnitRate, setStockUnitRate] = useState(0);
  const [minStock, setMinStock] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
      name: name,
      item_type: type,
      unit: unit,
      hsn: hsn,
      sac: sac,
      tax_reference: taxRef,
      intra_state_tax: intraStateTax,
      inter_state_tax: interStateTax,
      sales_account: salesAccount,
      selling_price: salesPrice,
      sales_description: salesDescription,
      purchase_account: purchaseAccount,
      purchase_price: purchasePrice,
      purchase_description: purchaseDescription,
      min_stock: minStock,
      inventory_account: inventoryAccount,
      opening_stock: stock,
      current_stock: stock,
      stock_in: 0,
      stock_out: 0,
      stock_unit_rate: stockUnitRate,
      status: "Active",
    };

    axios
      .post(`${config.base_url}/create_new_item/`, dt)
      .then((res) => {
        console.log("ITM RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Item Created",
          });
          navigate("/items");
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
              className="needs-validation px-1"
              onSubmit={handleSubmit}
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        value={type}
                        onChange={(e) => {
                          setType(e.target.value);
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
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
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
                        value={hsn}
                        onChange={(e) => setHsn(e.target.value)}
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
                        value={sac}
                        onChange={(e) => setSac(e.target.value)}
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
                          onChange={(e) => setTaxRef(e.target.value)}
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
                          onChange={(e) => setTaxRef(e.target.value)}
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
                        value={intraStateTax}
                        onChange={(e) => setIntraStateTax(e.target.value)}
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
                        value={interStateTax}
                        onChange={(e) => setInterStateTax(e.target.value)}
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
                            value={purchasePrice}
                            onChange={(e) => setPurchasePrice(e.target.value)}
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
                            value={salesPrice}
                            onChange={(e) => setSalesPrice(e.target.value)}
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
                          value={purchaseAccount}
                          onChange={(e) => setPurchaseAccount(e.target.value)}
                        >
                          <option value="" selected disabled>
                            --Choose--
                          </option>
                          {accounts &&
                            accounts.map((i) => (
                              <option
                                value={i.account_name}
                                className="text-uppercase"
                              >
                                {i.account_name}
                              </option>
                            ))}
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
                        value={salesAccount}
                        onChange={(e) => setSalesAccount(e.target.value)}
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
                        value={purchaseDescription}
                        onChange={(e) => setPurchaseDescription(e.target.value)}
                      />
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
                        value={salesDescription}
                        onChange={(e) => setSalesDescription(e.target.value)}
                      />
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
                        value={inventoryAccount}
                        onChange={(e) => setInventoryAccount(e.target.value)}
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
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
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
                        value={stockUnitRate}
                        onChange={(e) => setStockUnitRate(e.target.value)}
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
                        value={minStock}
                        onChange={(e) => setMinStock(e.target.value)}
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
