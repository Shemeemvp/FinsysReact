import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";

function EditPriceList() {
  const ID = Cookies.get("Login_id");
  const { priceListId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  // const fetchItems = () => {
  //   axios
  //     .get(`${config.base_url}/get_new_price_list_items/${ID}/`)
  //     .then((res) => {
  //       if (res.data.status) {
  //         let itms = res.data.items;
  //         setItems([]);
  //         itms.map((i) => {
  //           var obj = {
  //             id: i.id,
  //             item: i.name,
  //             salesRate: i.selling_price,
  //             purchaseRate: i.purchase_price,
  //             customRate: 0,
  //           };
  //           setItems((prevState) => [...prevState, obj]);
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // useEffect(() => {
  //   fetchItems();
  // }, []);

  const fetchPLDetails = () => {
    axios
      .get(`${config.base_url}/fetch_pl_details/${priceListId}/`)
      .then((res) => {
        console.log("PL DATA=", res);
        if (res.data.status) {
          var pl = res.data.priceList;
          var itms = res.data.items;
          setItems([])
          itms.map((i) => {
            setItems((prevState) => [...prevState, i]);
          });
          setName(pl.name)
          setType(pl.type)
          setItemRate(pl.item_rate)
          setDescription(pl.description)
          setUpOrDown(pl.up_or_down)
          setPercentage(pl.percentage)
          setRoundOff(pl.round_off)
          setCurrency(pl.currency)
          checkType(pl.type)
          checkItemRate(pl.item_rate)
          
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
  function checkType(type){
    if(type == 'Sales'){
      showSalesRate();
    }else{
      showPurchaseRate();
    }
  }
  function checkItemRate(val){
    if(val == 'Markup/Markdown by a percentage'){
      showPercentage();
    }else{
      showIndividual();
    }
  }  

  useEffect(() => {
    fetchPLDetails();
  }, []);

  const handleCustomRateChange = (id, newValue) => {
    console.log(id, newValue);
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, customRate: newValue } : item
      )
    );
  };

  const [name, setName] = useState("");
  const [type, setType] = useState("Sales");
  const [itemRate, setItemRate] = useState("Markup/Markdown by a percentage");
  const [description, setDescription] = useState("");
  const [upOrDown, setUpOrDown] = useState("Markup");
  const [percentage, setPercentage] = useState(0);
  const [roundOff, setRoundOff] = useState("Never mind");
  const [currency, setCurrency] = useState("Indian Rupee");

  const handleSubmit = (e) => {
    e.preventDefault();

    var dt = {
        Id: ID,
        pl_id: priceListId,
        name: name,
        type: type,
        item_rate: itemRate,
        description: description,
        currency: currency,
        up_or_down: upOrDown,
        percentage: percentage,
        round_off: roundOff,
        list_items: items
    };

    axios
      .put(`${config.base_url}/update_price_list/`, dt)
      .then((res) => {
        console.log("PL RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Price List Updated",
          });
          navigate(`/view_price_list/${priceListId}/`);
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

  function showPercentage() {
    document.getElementById("fieldSet1").style.display = "block";
    document.getElementById("fieldSet2").style.display = "none";
  }

  function showIndividual() {
    document.getElementById("fieldSet1").style.display = "none";
    document.getElementById("fieldSet2").style.display = "block";
  }

  function handleSalesCheck() {
    setType("Sales");
    showSalesRate();
  }
  function handlePurchaseCheck() {
    setType("Purchase");
    showPurchaseRate();
  }

  function handlePercentage() {
    setItemRate("Markup/Markdown by a percentage");
    showPercentage();
  }

  function handleIndividual() {
    setItemRate("Customized individual rate");
    showIndividual();
  }

  function showSalesRate() {
    document.querySelectorAll(".purchaseRates").forEach(function (el) {
      el.style.display = "none";
    });
    document.querySelectorAll(".salesRates").forEach(function (el) {
      el.style.display = "block";
    });
  }

  function showPurchaseRate() {
    document.querySelectorAll(".salesRates").forEach(function (el) {
      el.style.display = "none";
    });
    document.querySelectorAll(".purchaseRates").forEach(function (el) {
      el.style.display = "block";
    });
  }

  return (
    <>
      <FinBase />
      <div
        className="page-content"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="card radius-15 h-20">
          <div className="row">
            <div className="col-md-12">
              <center>
                <h2 className="mt-3">EDIT PRICE LIST </h2>
              </center>
              <hr />
            </div>
          </div>
        </div>
        <div className="card radius-15">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="needs-validation px-1" validate>
              <div className="row w-100">
                <div className="col-md-12 mx-0">
                  <div className="row mt-3 d-flex justify-content-center w-100">
                    <div className="col-md-2">
                      <label for="PLName" style={{ color: "white" }}>
                        Name
                      </label>
                    </div>
                    <div className="col-md-5">
                      <input
                        type="text"
                        id="PLName"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mt-3 d-flex justify-content-center w-100">
                    <div className="col-md-2">
                      <label for="" style={{ color: "white" }}>
                        Type
                      </label>
                    </div>
                    <div className="col-md-5">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="type"
                          id="typeSale"
                          value="Sales"
                          onClick={handleSalesCheck}
                          checked={type == 'Sales' ? true : false}
                        />
                        <label className="form-check-label" for="typeSale">
                          Sales
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="type"
                          id="typePurchase"
                          onClick={handlePurchaseCheck}
                          value="Purchase"
                          checked={type == 'Purchase' ? true : false}
                        />
                        <label className="form-check-label" for="typePurchase">
                          Purchase
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3 d-flex justify-content-center w-100">
                    <div className="col-md-2">
                      <label for="" style={{ color: "white" }}>
                        Item Rate
                      </label>
                    </div>
                    <div className="col-md-5">
                      {/* <!-- <p className=""></p> --> */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="item_rate"
                          id="itemRatePercentage"
                          value="Markup/Markdown by a percentage"
                          onClick={handlePercentage}
                          checked={itemRate == 'Markup/Markdown by a percentage' ? true : false}
                        />
                        <label
                          className="form-check-label"
                          for="itemRatePercentage"
                        >
                          Markup or Markdown the item rates by a percentage
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="item_rate"
                          id="itemRateIndividual"
                          value="Customized individual rate"
                          onClick={handleIndividual}
                          checked={itemRate == 'Customized individual rate' ? true : false}
                        />
                        <label
                          className="form-check-label"
                          for="itemRateIndividual"
                        >
                          Enter the rate individually for each item
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3 d-flex justify-content-center w-100">
                    <div className="col-md-2">
                      <label for="PLDescription">Description</label>
                    </div>
                    <div className="col-md-5">
                      <textarea
                        className="form-control"
                        id="PLDescription"
                        name="description"
                        placeholder="Enter description.."
                        rows="3"
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                        style={{ backgroundColor: "#2f516f", color: "white" }}
                      />
                    </div>
                  </div>

                  <div id="fieldSet1">
                    <div className="row mt-3 d-flex justify-content-center w-100">
                      <div className="col-md-2">
                        <label>Percentage</label>
                      </div>
                      <div className="col-md-5">
                        <div className="input-group">
                          <select
                            className="form-control"
                            name="up_or_down"
                            value={upOrDown}
                            onChange={(e)=>setUpOrDown(e.target.value)}
                            style={{
                              backgroundColor: "#2f516f",
                              color: "white",
                              maxWidth: "fit-content",
                            }}
                            required
                          >
                            <option
                              selected
                              value="Markup"
                              style={{
                                backgroundColor: "#2f516f",
                                color: "white",
                              }}
                            >
                              Markup
                            </option>
                            <option
                              value="Markdown"
                              style={{
                                backgroundColor: "#2f516f",
                                color: "white",
                              }}
                            >
                              Markdown
                            </option>
                          </select>
                          <input
                            type="number"
                            className="form-control"
                            name="percentage"
                            id="PLPercentage"
                            style={{
                              backgroundColor: "#2f516f",
                              color: "white",
                            }}
                            value={percentage}
                            onChange={(e)=>setPercentage(e.target.value)}
                            min="0"
                            max="100"
                            step="any"
                            required
                          />
                          <input
                            type="button"
                            className="form-control"
                            style={{
                              backgroundColor: "#2f516f",
                              color: "white",
                              maxWidth: "fit-content",
                            }}
                            value=" % "
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row mt-3 d-flex justify-content-center w-100">
                      <div className="col-md-2">
                        <label>Round Off To</label>
                      </div>
                      <div className="col-md-5">
                        <select
                          className="form-control"
                          name="round_off"
                          value={roundOff}
                          onChange={(e)=>setRoundOff(e.target.value)}
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          required
                        >
                          <option
                            selected
                            value="Never mind"
                            style={{
                              backgroundColor: "#2f516f",
                              color: "white",
                            }}
                          >
                            Never mind
                          </option>
                          <option
                            value="Nearest whole number"
                            style={{
                              backgroundColor: "#2f516f",
                              color: "white",
                            }}
                          >
                            Nearest whole number
                          </option>
                          <option
                            value="0.99"
                            style={{
                              backgroundColor: "#2f516f",
                              color: "white",
                            }}
                          >
                            .99
                          </option>
                          <option
                            value="0.50"
                            style={{
                              backgroundColor: "#2f516f",
                              color: "white",
                            }}
                          >
                            .50
                          </option>
                          <option
                            value="0.49"
                            style={{
                              backgroundColor: "#2f516f",
                              color: "white",
                            }}
                          >
                            .49
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div
                    id="fieldSet2"
                    className="container-fluid"
                    style={{ display: "none" }}
                  >
                    <div className="row mt-3 d-flex justify-content-center w-100">
                      <div className="col-md-2">
                        <label>Currency</label>
                      </div>
                      <div className="col-md-5">
                        <select
                          className="form-select form-control"
                          name="currency"
                          value={currency}
                          onChange={(e)=>setCurrency(e.target.value)}
                          style={{ backgroundColor: "#2f516f", color: "white" }}
                          required
                        >
                          <option
                            selected
                            value="Indian Rupee"
                            style={{
                              backgroundColor: "#2f516f",
                              color: "white",
                            }}
                          >
                            Indian Rupee
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="row mt-3 d-flex justify-content-center w-100">
                      <div className="col-md-7">
                        <hr />
                        <h5 className="mt-2">Customize Item Rates in Bulk</h5>
                        <h6 className="mt-0">
                          Add custom rates for each item to be saved as a price
                          list.
                        </h6>
                      </div>
                    </div>

                    <div className="row mt-3 d-flex justify-content-center w-100">
                      <div className="col-md-7">
                        <div className="table-responsive">
                          <table
                            className="table table-striped"
                            style={{
                              backgroundColor: "#2f516f",
                              color: "white",
                            }}
                          >
                            <thead>
                              <tr>
                                <th>ITEM DETAILS</th>
                                <th>STANDARD RATE(INR)</th>
                                <th>CUSTOM RATE(INR)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items &&
                                items.map((i) => (
                                  <tr>
                                    <td>
                                      <input
                                        type="text"
                                        name="itemName[]"
                                        value={i.id}
                                        hidden
                                      />
                                      {i.name}
                                    </td>
                                    <td>
                                      <input
                                        type="number"
                                        className="salesRates border-0 bg-transparent text-white"
                                        name="itemRateSale[]"
                                        value={i.salesRate}
                                        style={{ display: "block" }}
                                        readOnly
                                      />
                                      <input
                                        type="number"
                                        className="purchaseRates border-0 bg-transparent text-white"
                                        name="itemRatePurchase[]"
                                        value={i.purchaseRate}
                                        style={{ display: "none" }}
                                        readOnly
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="number"
                                        name="customRate[]"
                                        value={i.customRate}
                                        onChange={(e) =>
                                          handleCustomRateChange(
                                            i.id,
                                            e.target.value
                                          )
                                        }
                                        required
                                      />
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
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
                        to={`/view_price_list/${priceListId}/`}
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

export default EditPriceList;
