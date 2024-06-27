import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import Select from "react-select";

function AddSalesOrder() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [terms, setTerms] = useState([]);
  const [banks, setBanks] = useState([]);
  const [priceLists, setPriceLists] = useState([]);
  const [cmpState, setCmpState] = useState("");

  const fetchSalesOrderData = () => {
    axios
      .get(`${config.base_url}/fetch_sales_order_data/${ID}/`)
      .then((res) => {
        console.log("SO Data==", res);
        if (res.data.status) {
          let itms = res.data.items;
          let cust = res.data.customers;
          let trms = res.data.paymentTerms;
          let bnks = res.data.banks;
          let lst = res.data.priceList;
          setCmpState(res.data.state);
          setPriceLists([]);
          lst.map((p) => {
            setPriceLists((prevState) => [...prevState, p]);
          });
          setBanks([]);
          bnks.map((b) => {
            setBanks((prevState) => [...prevState, b]);
          });
          setTerms([]);
          trms.map((i) => {
            setTerms((prevState) => [...prevState, i]);
          });
          setItems([]);
          const newOptions = itms.map((item) => ({
            label: item.name,
            value: item.name,
          }));
          setItems(newOptions);

          setCustomers([]);
          const newCustOptions = cust.map((item) => ({
            label: item.first_name + " " + item.last_name,
            value: item.id,
          }));
          setCustomers(newCustOptions);
          setRefNo(res.data.refNo);
          setNextSalesOrderNo(res.data.soNo);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSalesOrderData();
  }, []);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "rgb(255 255 255 / 14%)",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "lightgray"
        : state.isFocused
        ? "lightgray"
        : "white",
      color: state.isSelected ? "black" : "black",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

  var currentDate = new Date();
  var formattedDate = currentDate.toISOString().slice(0, 10);

  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [gstType, setGstType] = useState("");
  const [gstIn, setGstIn] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [refNo, setRefNo] = useState("");
  const [salesOrderNo, setSalesOrderNo] = useState("");
  const [nextSalesOrderNo, setNextSalesOrderNo] = useState("");
  const [date, setDate] = useState(formattedDate);
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [shipmentDate, setShipmentDate] = useState("");
  const [term, setTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [priceList, setPriceList] = useState(false);
  const [priceListId, setPriceListId] = useState("");

  const [subTotal, setSubTotal] = useState(0.0);
  const [igst, setIgst] = useState(0.0);
  const [cgst, setCgst] = useState(0.0);
  const [sgst, setSgst] = useState(0.0);
  const [taxAmount, setTaxAmount] = useState(0.0);
  const [shippingCharge, setShippingCharge] = useState(0.0);
  const [adjustment, setAdjustment] = useState(0.0);
  const [grandTotal, setGrandTotal] = useState(0.0);
  const [paid, setPaid] = useState(0.0);
  const [balance, setBalance] = useState(0.0);

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);

  const [salesOrderItems, setSalesOrderItems] = useState([
    {
      id: 1,
      item: "",
      hsnSac: "",
      quantity: "",
      price: "",
      taxGst: "",
      taxIgst: "",
      discount: "",
      total: "",
    },
  ]);

  const [isRequired, setIsRequired] = useState(true);

  function handlePriceList() {
    setPriceList(!priceList);
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Id", ID);

    formData.append("description", description);
    formData.append("status", status);
    // if (mode === 'Quantity') {
    //   formData.append('stock_items', JSON.stringify(salesOrderItems));
    // } else if (mode === 'Value') {
    //   formData.append('stock_items', JSON.stringify(itemsValue));
    // } else {
    //   formData.append('stock_items', null);
    // }
    if (file) {
      formData.append("attach_file", file);
    }

    axios
      .post(`${config.base_url}/create_new_stock_adjust/`, formData)
      .then((res) => {
        console.log("Stk RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Stock Adjustment Created",
          });
          navigate("/stock_adjust");
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

  const addNewRowQ = () => {
    var newItem = {
      id: "",
      item: "",
      quantity: "",
      quantityInHand: "",
      difference: "",
    };
    setSalesOrderItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];

      return updatedItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    });
  };

  const calculateQtyDiff = (id, val) => {
    if (val != "") {
      setSalesOrderItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, difference: item.quantityInHand - item.quantity }
            : item
        )
      );
    } else {
      setSalesOrderItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, difference: "" } : item
        )
      );
    }
  };

  const removeRowQ = (id) => {
    setSalesOrderItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);

      return updatedItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    });
  };

  const handleItemsQInputChange = (id, field, value) => {
    setSalesOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCustomerChange = (value) => {
    setCustomer(value);
    getCustomerData(value);
  };

  function getCustomerData(customer) {
    var cst = {
      Id: ID,
      c_id: customer,
    };

    if (customer != "") {
      axios
        .get(`${config.base_url}/get_customer_data/`, { params: cst })
        .then((res) => {
          if (res.data.status) {
            setEmail("");
            setGstType("");
            setGstIn("");
            setBillingAddress("");
            setPlaceOfSupply("")
            var cust = res.data.customerDetails;
            console.log("Cust Details===", cust);
            setEmail(cust.email);
            setGstType(cust.gstType);
            setGstIn(cust.gstIn);
            setPlaceOfSupply(cust.placeOfSupply);
            setBillingAddress(cust.address);
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
        });
    } else {
      setEmail("");
      setGstType("");
      setGstIn("");
      setBillingAddress("");
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
      <FinBase />
      <div
        className="page-content mt-0 pt-0"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="d-flex justify-content-end mb-1">
          <Link to={"/sales_order"}>
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
                <h2 className="mt-3">NEW SALES ORDER</h2>
              </center>
              <hr />
            </div>
          </div>
        </div>

        <form
          className="needs-validation px-1"
          encType="multipart/form-data"
          onsubmit="return validateForm()"
        >
          <div className="card radius-15">
            <div className="card-body">
              <div id="salesOrder">
                <div className="row">
                  <div className="col-md-4 mt-3">
                    <label className="">Select Customer</label>
                    <span className="text-danger ml-3" id="custErr"></span>
                    <input
                      type="hidden"
                      name="customerId"
                      id="customerId"
                      value=""
                    />
                    <div className="d-flex align-items-center">
                      <Select
                        options={customers}
                        styles={customStyles}
                        name="customer"
                        className="w-100"
                        id="customer"
                        required
                        onChange={(selectedOption) =>
                          handleCustomerChange(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        isClearable
                        isSearchable
                      />
                      <button
                        type="button"
                        data-toggle="modal"
                        data-target="#newCustomer"
                        className="btn btn-outline-secondary ml-1"
                        style={{ width: "fit-content", height: "fit-content" }}
                      >
                        +
                      </button>
                    </div>
                    <label className="mt-3">GST Type</label>
                    <input
                      type="text"
                      className="form-control"
                      id="gstType"
                      name="gst_type"
                      placeholder="GST Treatment"
                      value={gstType}
                      style={{ backgroundColor: "#43596c" }}
                      readOnly
                    />
                  </div>

                  <div className="col-md-4 mt-3">
                    <label className="">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      name="customerEmail"
                      placeholder="Email"
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      id="customerEmail"
                      value={email}
                      readOnly
                    />
                    {gstIn != "None" && (
                      <div
                        className="mt-3"
                        id="gstInDisplay"
                        style={{ display: "block" }}
                      >
                        <label className="">GSTIN</label>
                        <input
                          type="text"
                          className="form-control"
                          id="gstin"
                          name="gstin"
                          placeholder="GSTIN"
                          style={{ backgroundColor: "#43596c" }}
                          value={gstIn}
                          readOnly
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 mt-3">
                    <label className="">Billing Address</label>
                    <textarea
                      className="form-control"
                      name="bill_address"
                      id="billAddress"
                      rows="4"
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      value={billingAddress}
                      readOnly
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mt-3">
                    <div className="d-flex">
                      <label className="">Sales Order No.</label>
                      <span className="text-danger ml-3" id="SONoErr"></span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      name="sales_order_no"
                      id="salesOrderNumber"
                      value={salesOrderNo}
                      onChange={(e) => setSalesOrderNo(e.target.value)}
                      style={{ backgroundColor: "#43596c" }}
                      placeholder={nextSalesOrderNo}
                      required
                    />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="">Reference Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="reference_number"
                      value={refNo}
                      style={{ backgroundColor: "#43596c" }}
                      readOnly
                    />
                  </div>
                  <div className="col-md-4 mt-3">
                    <input hidden value="{{cmp.State}}" id="cmpstate" />
                    <label className="">Place of supply</label>
                    <select
                      type="text"
                      className="form-control"
                      id="placeOfSupply"
                      name="place_of_supply"
                      value={placeOfSupply}
                      onChange={(e) => setPlaceOfSupply(e.target.value)}
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      required
                    >
                      <option value="" selected>
                        --Choose--
                      </option>
                      <option value="Andaman and Nicobar Islads">
                        Andaman and Nicobar Islads
                      </option>
                      <option value="Andhra Predhesh">Andhra Predhesh</option>
                      <option value="Arunachal Predesh">
                        Arunachal Predesh
                      </option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chandigarh">Chandigarh</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Dadra and Nagar Haveli">
                        Dadra and Nagar Haveli
                      </option>
                      <option value="Damn anad Diu">Damn anad Diu</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Predesh">Himachal Predesh</option>
                      <option value="Jammu and Kashmir">
                        Jammu and Kashmir
                      </option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Ladakh">Ladakh</option>
                      <option value="Lakshadweep">Lakshadweep</option>
                      <option value="Madhya Predesh">Madhya Predesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Puducherry">Puducherry</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Predesh">Uttar Predesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Other Territory">Other Territory</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mt-3">
                    <label className="">Sales Order Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="sales_order_date"
                      id="salesOrderDate"
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="">Expected Shipment Date:</label>
                    <input
                      type="text"
                      id="shipmentDate"
                      className="form-control"
                      name="shipment_date"
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      value={shipmentDate}
                      readOnly
                    />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="">Terms </label>
                    <div className="d-flex align-items-center">
                      <select
                        className="form-control"
                        name="payment_term"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        id="paymentTerm"
                        required
                      >
                        <option value="" selected>
                          Select Payment Term
                        </option>
                        {terms &&
                          terms.map((term) => (
                            <option value={term.id} text={term.days}>
                              {term.term_name}
                            </option>
                          ))}
                      </select>
                      <a
                        className="btn btn-outline-secondary ml-1"
                        role="button"
                        data-target="#newPaymentTerm"
                        data-toggle="modal"
                        style={{ width: "fit-content", height: "fit-content" }}
                        id="termsadd"
                      >
                        +
                      </a>
                    </div>
                  </div>

                  <div className="col-md-4 mt-3">
                    <label className="">Payment Type</label>
                    <select
                      className="form-control my-select"
                      id="paymentMethod"
                      name="payment_method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ backgroundColor: "#43596c" }}
                    >
                      <option value="" selected>
                        Select Payment Method
                      </option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                      <option value="UPI">UPI</option>
                      {banks &&
                        banks.map((b) => (
                          <option value={b.bank_name} text={b.id}>
                            {b.bank_name} ({b.account_number})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div
                    className="col-md-4 mt-3"
                    style={{ display: "none" }}
                    id="chequediv"
                  >
                    <label className="">Cheque No</label>
                    <input
                      type="text"
                      className="form-control"
                      name="cheque_id"
                      id="cheque_id"
                      value={chequeNumber}
                      onChange={(e) => setChequeNumber(e.target.value)}
                      placeholder="Enter Cheque No"
                    />
                  </div>
                  <div
                    className="col-md-4 mt-3"
                    style={{ display: "none" }}
                    id="upidiv"
                  >
                    <label className="">UPI ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="upi_id"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      id="upi_id"
                      placeholder="Enter UPI ID"
                    />
                  </div>
                  <div
                    className="col-md-4 mt-3"
                    style={{ display: "none" }}
                    id="bnkdiv"
                  >
                    <label className="">Account#</label>
                    <input
                      type="text"
                      className="form-control"
                      name="bnk_id"
                      id="bnk_id"
                      value={accountNumber}
                      style={{ backgroundColor: "#43596c" }}
                      readOnly
                    />
                  </div>
                </div>

                <div
                  className="row"
                  id="applyPriceListSection"
                  style={{ display: "block" }}
                >
                  <div className="col-md-3 mt-3">
                    <div className="form-group form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="priceList"
                        id="applyPriceList"
                        checked={priceList}
                        onChange={handlePriceList}
                        value="applyPriceList"
                      />
                      <input
                        type="hidden"
                        name="priceListId"
                        value=""
                        id="customerPriceListId"
                      />
                      <label className="form-check-label" for="applyPriceList">
                        Apply Price List
                      </label>
                      <span
                        className="text-success"
                        id="custPriceListName"
                        style={{ display: "none", marginLeft: "5px" }}
                      ></span>
                    </div>
                    <div id="priceListDropdown" style={{ display: priceList? "block":"none" }}>
                      <label className="">Price List</label>
                      <span
                        className="text-danger"
                        id="custPriceListAlert"
                        style={{ display: "none", marginLeft: "5px" }}
                      ></span>
                      <select
                        className="form-control"
                        id="priceListIds"
                        name="price_list_id"
                        value={priceListId}
                        onChange={(e)=>setPriceListId(e.target.value)}
                        style={{ backgroundColor: "#43596c" }}
                      >
                        <option value="">Choose Price List</option>
                        {priceLists &&
                          priceLists.map((p) => (
                            <option value={p.id}>{p.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-3 mt-3"></div>
                </div>

                <div className="row clearfix ">
                  <div className="col-md-12 table-responsive-md mt-3">
                    <table
                      className="table table-bordered table-hover mt-3"
                      id="salesOrderItemsTable"
                    >
                      <thead>
                        <tr>
                          <th className="text-center">#</th>
                          <th className="text-center">PRODUCT / SERVICE</th>
                          <th className="text-center">HSN / SAC</th>
                          <th className="text-center">QTY</th>
                          <th className="text-center">PRICE</th>
                          <th className="text-center">TAX (%)</th>
                          <th className="text-center">DISCOUNT</th>
                          <th className="text-center">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody id="items-table-body">
                        <tr id="tab_row1">
                          <td className="nnum" style={{ textAlign: "center" }}>
                            1
                          </td>
                          <td style={{ width: "20%" }}>
                            <div className="d-flex align-items-center">
                              <div className="w-100">
                                <div
                                  className="p-0 border-0 bg-none position-relative drop-box"
                                  style={{ display: "block" }}
                                >
                                  <input
                                    required
                                    type="text"
                                    id="item1"
                                    value=""
                                    name="item_name[]"
                                    className="dropdown-toggle form-control item-display"
                                    onkeyup="filterFunction($(this).attr('id'))"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                    placeholder="Items.."
                                    autocomplete="off"
                                  />
                                  <ul
                                    className="dropdown-menu w-100 items-available position-absolute"
                                    id="menu1"
                                    style={{
                                      overflowY: "auto",
                                      height: "fit-content",
                                      maxHeight: "40vh",
                                    }}
                                  >
                                    {/* {% for i in items %} */}
                                    <li
                                      className="dropdown-item items-options"
                                      style={{ cursor: "pointer" }}
                                      onclick="getItemDetails($(this).parent().prev().attr('id'),`{{i.name}}`)"
                                    >
                                      {"{i.name}"}
                                    </li>
                                    {/* {% endfor %} */}
                                  </ul>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="btn btn-outline-secondary ml-1"
                                data-target="#newItem"
                                data-toggle="modal"
                                style={{
                                  width: "fit-content",
                                  height: "fit-content",
                                }}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>
                            <input
                              type="hidden"
                              name="item_id[]"
                              id="itemId1"
                            />
                            <input
                              type="text"
                              name="hsn[]"
                              id="hsn1"
                              placeholder="HSN Code"
                              className="form-control HSNCODE"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              readonly
                            />
                            <input
                              type="text"
                              name="sac[]"
                              id="sac1"
                              placeholder="SAC Code"
                              className="form-control HSNCODE"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                                display: "none",
                              }}
                              readonly
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="qty[]"
                              id="qty1"
                              className="form-control qty"
                              step="0"
                              min="1"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              value="0"
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="price[]"
                              id="price1"
                              className="form-control price"
                              step="0.00"
                              min="0"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                                display: "block",
                              }}
                              value="0"
                              readonly
                            />
                            <input
                              type="number"
                              name="priceListPrice[]"
                              id="priceListPrice1"
                              className="form-control priceListPrice"
                              step="0.00"
                              min="0"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                                display: "none",
                              }}
                              value="0"
                              readonly
                            />
                          </td>

                          <td style={{ width: "13%" }}>
                            <select
                              name="taxGST[]"
                              id="taxGST1"
                              className="form-control tax_ref tax_ref_gst"
                              style={{ display: "block" }}
                              onchange="taxchange(this.id)"
                            >
                              <option selected disabled hidden>
                                Select GST
                              </option>
                              <option value="28">28.0% GST</option>
                              <option value="18">18.0% GST</option>
                              <option value="12">12.0% GST</option>
                              <option value="5">05.0% GST</option>
                              <option value="3">03.0% GST</option>
                              <option value="0">0.0% GST</option>
                            </select>
                            <select
                              name="taxIGST[]"
                              id="taxIGST1"
                              className="form-control tax_ref tax_ref_igst"
                              style={{ display: "none" }}
                              onchange="taxchange(this.id)"
                            >
                              <option selected disabled hidden>
                                Select IGST
                              </option>
                              <option value="28">28.0% IGST</option>
                              <option value="18">18.0% IGST</option>
                              <option value="12">12.0% IGST</option>
                              <option value="5">05.0% IGST</option>
                              <option value="3">03.0% IGST</option>
                              <option value="0">0.0% IGST</option>
                            </select>
                            <div
                              className="mt-1"
                              style={{ textAlign: "center", color: "red" }}
                            >
                              <span
                                id="invalidtax1"
                                style={{ display: "none" }}
                              >
                                {" "}
                                Invalid Tax %
                              </span>{" "}
                            </div>
                          </td>
                          <td>
                            <input
                              type="number"
                              name="discount[]"
                              placeholder="Enter Discount"
                              id="disc1"
                              value="0"
                              className="form-control disc"
                              step="0"
                              min="0"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              name="total[]"
                              id="total1"
                              className="form-control total"
                              value="0"
                              readonly
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                            />
                          </td>
                          <td style={{ display: "none" }}>
                            <input
                              type="hidden"
                              id="taxamount1"
                              className="form-control itemTaxAmount"
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              id="1"
                              style={{
                                width: "fit-content",
                                height: "fit-content",
                              }}
                              className="btn btn-danger remove_row px-2 py-1 mx-1 fa fa-close"
                              title="Remove Row"
                            ></button>
                          </td>
                        </tr>
                      </tbody>
                      <tr>
                        <td style={{ border: "none" }}>
                          <a
                            className="btn btn-secondary ml-1"
                            role="button"
                            id="add"
                            style={{
                              width: "fit-content",
                              height: "fit-content",
                            }}
                          >
                            +
                          </a>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div className="row clearfix" style={{ marginTop: "20px" }}>
                  <div className="col-md-6">
                    <textarea
                      className="form-control mt-3"
                      id=""
                      name="note"
                      placeholder="Note"
                      style={{ height: "190px" }}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                      type="file"
                      name="file"
                      style={{ marginTop: "10px", width: "70%" }}
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                  <div className="col-md-1"></div>
                  <div
                    className="col-md-5 table-responsive-md mt-3 "
                    id="salesOrderItemsTableTotal"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(128, 128, 128, 0.6)",
                      marginLeft: "-2vh",
                    }}
                  >
                    <div className="p-3">
                      <div className="row container-fluid p-2 m-0">
                        <div className="col-sm-4 mt-2">
                          <label className="text-center">Sub Total</label>
                        </div>
                        <div className="col-sm-1 mt-2">:</div>
                        <div className="col-sm-7 mt-2">
                          <input
                            type="number"
                            step="any"
                            name="subtotal"
                            value={subTotal}
                            readOnly
                            style={{ backgroundColor: "#37444f" }}
                            className="form-control"
                            id="sub_total"
                          />
                        </div>
                      </div>
                      <div
                        className="row container-fluid p-2 m-0"
                        id="taxamountIGST"
                        style={{ display: "flex" }}
                      >
                        <div className="col-sm-4 mt-2">
                          <label for="a" className="text-center">
                            IGST
                          </label>
                        </div>
                        <div className="col-sm-1 mt-2">:</div>
                        <div className="col-sm-7 mt-2">
                          <input
                            type="number"
                            name="igst"
                            step="any"
                            id="igstAmount"
                            value={igst}
                            readOnly
                            style={{ backgroundColor: "#37444f" }}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div
                        className="row container-fluid p-2 m-0"
                        style={{ display: "none" }}
                        id="taxamountCGST"
                      >
                        <div className="col-sm-4 mt-2">
                          <label for="a" className="text-center">
                            CGST
                          </label>
                        </div>
                        <div className="col-sm-1 mt-2">:</div>
                        <div className="col-sm-7 mt-2">
                          <input
                            type="number"
                            name="cgst"
                            step="any"
                            id="cgstAmount"
                            value={cgst}
                            readOnly
                            style={{ backgroundColor: "#37444f" }}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div
                        className="row container-fluid p-2 m-0"
                        style={{ display: "none" }}
                        id="taxamountSGST"
                      >
                        <div className="col-sm-4 mt-2">
                          <label for="a" className="text-center">
                            SGST
                          </label>
                        </div>
                        <div className="col-sm-1 mt-2">:</div>
                        <div className="col-sm-7 mt-2">
                          <input
                            type="number"
                            name="sgst"
                            step="any"
                            id="sgstAmount"
                            value={sgst}
                            readOnly
                            style={{ backgroundColor: "#37444f" }}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row container-fluid p-2 m-0">
                        <div className="col-sm-4 mt-2">
                          <label for="a" className="text-center">
                            Tax Amount
                          </label>
                        </div>
                        <div className="col-sm-1 mt-2">:</div>
                        <div className="col-sm-7 mt-2">
                          <input
                            type="number"
                            step="any"
                            name="taxamount"
                            id="tax_amount"
                            value={taxAmount}
                            readOnly
                            style={{ backgroundColor: "#37444f" }}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="row container-fluid p-2 m-0">
                        <div className="col-sm-4 mt-2">
                          <label for="a" className="text-center">
                            Shipping Charge
                          </label>
                        </div>
                        <div className="col-sm-1 mt-2">:</div>
                        <div className="col-sm-7 mt-2">
                          <input
                            type="number"
                            step="any"
                            name="ship"
                            id="ship"
                            value={shippingCharge}
                            onChange={(e) => setShippingCharge(e.target.value)}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row container-fluid p-2 m-0">
                        <div className="col-sm-4 mt-2">
                          <label for="a" className="text-center">
                            Adjustment
                          </label>
                        </div>
                        <div className="col-sm-1 mt-2">:</div>
                        <div className="col-sm-7 mt-2">
                          <input
                            type="number"
                            step="any"
                            name="adj"
                            id="adj"
                            value={adjustment}
                            onChange={(e) => setAdjustment(e.target.value)}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row container-fluid p-2 m-0">
                        <div className="col-sm-4 mt-2">
                          <label for="a" className="text-center">
                            Grand Total
                          </label>
                        </div>
                        <div className="col-sm-1 mt-2">:</div>
                        <div className="col-sm-7 mt-2">
                          <input
                            type="number"
                            name="grandtotal"
                            id="grandtotal"
                            value={grandTotal}
                            readOnly
                            style={{ backgroundColor: "#37444f" }}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-7"></div>
                  <div
                    className="col-md-5 table-responsive-md mt-3 "
                    id="salesOrderItemsTablePaid"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(128, 128, 128, 0.6)",
                      marginLeft: "-2vh",
                    }}
                  >
                    <div className="p-3">
                      <div className="row container-fluid p-2 m-0">
                        <div className="col-sm-4 mt-2">
                          <label for="a" className="text-center">
                            Paid Off
                          </label>
                        </div>
                        <div className="col-sm-1 mt-2">:</div>
                        <div className="col-sm-7 mt-2">
                          <input
                            type="number"
                            step="any"
                            name="advance"
                            id="advance"
                            value={paid}
                            onChange={(e) => setPaid(e.target.value)}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row container-fluid p-2 m-0">
                        <div className="col-sm-4 mt-2">
                          <label for="a" className="text-center">
                            Balance
                          </label>
                        </div>
                        <div className="col-sm-1 mt-2">:</div>
                        <div className="col-sm-7 mt-2">
                          <input
                            type="number"
                            name="balance"
                            id="balance"
                            value={balance}
                            readOnly
                            style={{ backgroundColor: "#37444f" }}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-7 mt-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="agreeTerms"
                        required
                        style={{ backgroundColor: "#43596c" }}
                      />
                      <label for="agreeTerms">
                        Agree to terms and conditions
                      </label>
                      <div className="invalid-feedback">
                        You must agree before submitting.
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5 mt-3 d-flex">
                    <input
                      type="submit"
                      className="btn btn-outline-secondary w-50 text-light"
                      name="Draft"
                      value="Draft"
                    />
                    <input
                      type="submit"
                      className="btn btn-outline-secondary w-50 ml-1 text-light"
                      name="Save"
                      value="Save"
                    />
                  </div>
                </div>
                <div className="notices mt-3">
                  <div className="text-muted">NOTICE:</div>
                  <div className="text-muted">
                    Fin sYs Terms and Conditions Apply
                  </div>
                </div>
                <span className="text-muted">
                  Sales Order was created on a computer and is valid without the
                  signature and seal.
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddSalesOrder;
