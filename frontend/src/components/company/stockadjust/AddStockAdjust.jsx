import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import Select from "react-select";

function AddStockAdjust() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const fetchCompanyItems = () => {
    axios
      .get(`${config.base_url}/fetch_items/${ID}/`)
      .then((res) => {
        console.log("ITMS==", res);
        if (res.data.status) {
          let itms = res.data.items;
          setItems([]);
          const newOptions = itms.map((item) => ({
            label: item.name,
            value: item.name,
          }));
          setItems(newOptions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchCompanyItems();
  }, []);

  const [reasons, setReasons] = useState([]);
  const fetchStockReason = () => {
    axios
      .get(`${config.base_url}/get_stock_reason/${ID}/`)
      .then((res) => {
        console.log("REAS==", res);
        if (res.data.status) {
          let rsn = res.data.reason;
          setReasons([]);
          rsn.map((i) => {
            setReasons((prevState) => [...prevState, i]);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchStockReason();
  }, []);

  const fetchStockAdjustRefNo = () => {
    axios
      .get(`${config.base_url}/get_stock_adjust_ref_no/${ID}/`)
      .then((res) => {
        console.log("REF==", res);
        if (res.data.status) {
          let ref = res.data.refNo;
          setRefNo(ref);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchStockAdjustRefNo();
  }, []);

  //   const [options, setOptions] = useState([]);
  //   useEffect(() => {
  //     const newOptions = items.map(item => ({ label: item.name, value: item.name }));
  //     setOptions(newOptions);
  // }, []);

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

  const [accountsBank, setAccountsBank] = useState([]);
  const [accountsCash, setAccountsCash] = useState([]);
  const [accountsCreditCard, setAccountsCreditCard] = useState([]);
  const [accountsPaymentClearing, setAccountsPaymentClearing] = useState([]);

  const fetchAccounts = () => {
    axios
      .get(`${config.base_url}/get_stock_adjust_accounts/${ID}/`)
      .then((res) => {
        console.log("ACCNTS==", res);
        if (res.data.status) {
          let bnk = res.data.bank;
          let csh = res.data.cash;
          let cc = res.data.credit;
          let pc = res.data.payment;
          setAccountsBank([]);
          setAccountsCash([]);
          setAccountsCreditCard([]);
          setAccountsPaymentClearing([]);
          bnk.map((i) => {
            let obj = {
              account_name: i.account_name,
            };
            setAccountsBank((prevState) => [...prevState, obj]);
          });

          csh.map((i) => {
            let obj = {
              account_name: i.account_name,
            };
            setAccountsCash((prevState) => [...prevState, obj]);
          });

          cc.map((i) => {
            let obj = {
              account_name: i.account_name,
            };
            setAccountsCreditCard((prevState) => [...prevState, obj]);
          });

          pc.map((i) => {
            let obj = {
              account_name: i.account_name,
            };
            setAccountsPaymentClearing((prevState) => [...prevState, obj]);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  var currentDate = new Date();
  var formattedDate = currentDate.toISOString().slice(0, 10);

  const [mode, setMode] = useState("Quantity");
  const [refNo, setRefNo] = useState("");
  const [date, setDate] = useState(formattedDate);
  const [account, setAccount] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);

  const [itemsQuantity, setItemsQuantity] = useState([
    {
      id: 1,
      item: "",
      quantity: "",
      quantityInHand: "",
      difference: "",
    },
  ]);

  const [itemsValue, setItemsValue] = useState([
    {
      id: 1,
      item: "",
      value: "",
      changedValue: "",
      difference: "",
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('Id', ID);
    formData.append('mode_of_adjustment', mode);
    formData.append('reference_no', refNo);
    formData.append('adjusting_date', date);
    formData.append('account', account);
    formData.append('reason', reason);
    formData.append('description', description);
    formData.append('status', status);
    if (mode === 'Quantity') {
      formData.append('stock_items', JSON.stringify(itemsQuantity));
    } else if (mode === 'Value') {
      formData.append('stock_items', JSON.stringify(itemsValue));
    } else {
      formData.append('stock_items', null);
    }
    if (file) {
      formData.append('attach_file', file);
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

  function handleModeChange(val) {
    setMode(val);
    toggleTable(val);
  }

  function toggleTable(selectedValue) {
    var quantityDiv = document.getElementById("quantityDiv");
    var valueDiv = document.getElementById("valueDiv");

    if (selectedValue === "Quantity") {
      document.querySelectorAll('.itemsValue').forEach(function(ele) {
        ele.required = false;
      });
      document.querySelectorAll('.itemsQuantity').forEach(function(ele) {
        ele.required = true;
      });
      quantityDiv.style.display = "block";
      valueDiv.style.display = "none";
    } else {
      document.querySelectorAll('.itemsValue').forEach(function(ele) {
        ele.required = true;
      });
      document.querySelectorAll('.itemsQuantity').forEach(function(ele) {
        ele.required = false;
      });
      valueDiv.style.display = "block";
      quantityDiv.style.display = "none";
    }
  }

  const addNewRowQ = () => {
    var newItem = {
      id: "",
      item: "",
      quantity: "",
      quantityInHand: "",
      difference: "",
    };
    setItemsQuantity((prevItems) => {
      const updatedItems = [...prevItems, newItem];

      return updatedItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    });
  };

  const calculateQtyDiff = (id, val) => {
    if (val != "") {
      setItemsQuantity((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, difference: item.quantityInHand - item.quantity }
            : item
        )
      );
    } else {
      setItemsQuantity((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, difference: "" } : item
        )
      );
    }
  };

  const removeRowQ = (id) => {
    setItemsQuantity((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);

      return updatedItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    });
  };

  const handleItemsQInputChange = (id, field, value) => {
    setItemsQuantity((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleQuantityItemChange = (value, id) => {
    handleItemsQInputChange(id, "item", value);
    getQuantityItemData(value, id);
  };

  function getQuantityItemData(item, id) {
    var itm = {
      Id: ID,
      name: item,
    };

    axios
      .get(`${config.base_url}/get_item_quantity_data/`, { params: itm })
      .then((res) => {
        console.log("QTY RES=", res);
        if (res.data.status) {
          var st = res.data.stock;
          console.log("STOCK==", st);
          setItemsQuantity((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, quantity: st } : item
            )
          );
        }
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
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

  const addNewRowV = () => {
    var newItem = {
      id: "",
      item: "",
      value: "",
      changedValue: "",
      difference: "",
    };
    setItemsValue((prevItems) => {
      const updatedItems = [...prevItems, newItem];

      return updatedItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    });
  };

  const calculateVlaDiff = (id, val) => {
    if (val != "") {
      setItemsValue((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, difference: item.value - item.changedValue }
            : item
        )
      );
    } else {
      setItemsValue((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, difference: "" } : item
        )
      );
    }
  };

  const removeRowV = (id) => {
    setItemsValue((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);

      return updatedItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    });
  };

  const handleItemsVInputChange = (id, field, value) => {
    setItemsValue((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleValueItemChange = (value, id) => {
    handleItemsVInputChange(id, "item", value);
    getValueItemData(value, id);
  };

  function getValueItemData(item, id) {
    var itm = {
      Id: ID,
      name: item,
    };

    axios
      .get(`${config.base_url}/get_item_value_data/`, { params: itm })
      .then((res) => {
        console.log("QTY RES=", res);
        if (res.data.status) {
          var val = res.data.value;
          console.log("Value==", val);
          setItemsValue((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, value: val } : item
            )
          );
        }
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  }

  const [newReason, setNewReason] = useState("");
  function handleReasonModalSubmit(e) {
    e.preventDefault();
    var reason = newReason;
    if (reason != "") {
      var u = {
        Id: ID,
        reason: newReason,
      };
      axios
        .post(`${config.base_url}/create_new_reason/`, u)
        .then((res) => {
          console.log("RESN RES=", res);
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Reason Created",
            });
            fetchStockReason();
            setReason(u.reason);
            setNewReason("");
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
    } else {
      alert("Invalid");
    }
  }

  return (
    <>
      <FinBase />
      <div
        className="page-content mt-0 pt-0"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="d-flex justify-content-end mb-1">
          <Link to={"/stock_adjust"}>
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
                <h2 className="mt-3">NEW ADJUSTMENT</h2>
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
              onSubmit={handleSubmit}
              className="needs-validation px-1"
              encType="multipart/form-data"
              id="stockForm"
              validate
            >
              <div className="row w-100">
                <div className="col-md-12 mx-0">
                  <div className="row mt-3">
                    <div className="col-md-3">
                      <label for="" style={{ color: "white" }}>
                        Mode of Adjustment
                      </label>

                      <select
                        name="mode"
                        id="adjust"
                        className="form-control"
                        value={mode}
                        onChange={(e) => handleModeChange(e.target.value)}
                        required
                      >
                        <option selected disabled value="">
                          Choose
                        </option>
                        <option value="Quantity">Quantity Adjustment</option>
                        <option value="Value">Value Adjustment</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-3">
                      <label className="col-form-label">Reference Number</label>
                      <input
                        className="form-control"
                        type="text"
                        id="bname"
                        name="refno"
                        placeholder={refNo}
                        value={refNo}
                        onChange={(e) => setRefNo(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-3 mt-2">
                      <label for="">Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        id="date"
                        name="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>

                    <div className="col-md-3">
                      <label
                        className="col-form-label "
                        for="validationCustom02"
                      >
                        Account *
                      </label>
                      <select
                        name="account"
                        className="form-control text-white "
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        required
                      >
                        <option selected disabled value="">
                          Choose...
                        </option>

                        <optgroup label="Expense" className="text-dark">
                          <option
                            value="Advertising and Marketing"
                            className="text-white"
                          >
                            Advertising and Marketing
                          </option>
                          <option
                            value="Automobile Expense"
                            className="text-white"
                          >
                            Automobile Expense
                          </option>
                          <option value="Bad Debt" className="text-white">
                            Bad Debt
                          </option>
                          <option
                            value="Bank Fees and Charges"
                            className="text-white"
                          >
                            Bank Fees and Charges
                          </option>
                          <option
                            value="Consultant Expense"
                            className="text-white"
                          >
                            Consultant Expense
                          </option>
                          <option
                            value="Credit Card Charges"
                            className="text-white"
                          >
                            Credit Card Charges
                          </option>
                          <option
                            value="Depreciation Expense"
                            className="text-white"
                          >
                            Depreciation Expense
                          </option>
                          <option
                            value="Exchange Gain or Loss"
                            className="text-white"
                          >
                            Exchange Gain or Loss
                          </option>
                          <option
                            value="IT and Internet Expenses"
                            className="text-white"
                          >
                            IT and Internet Expenses
                          </option>
                          <option
                            value="Janitorial Expense"
                            className="text-white"
                          >
                            Janitorial Expense
                          </option>
                          <option value="Lodging" className="text-white">
                            Lodging
                          </option>
                          <option
                            value="Meals and Entertainment"
                            className="text-white"
                          >
                            Meals and Entertainment
                          </option>
                          <option value="Other Expenses" className="text-white">
                            {" "}
                            Other Expenses
                          </option>
                          <option value="Postage" className="text-white">
                            Postage
                          </option>
                          <option
                            value="Salaries and Employee Wages"
                            className="text-white"
                          >
                            Salaries and Employee Wages
                          </option>
                          <option
                            value="Telephone Expense"
                            className="text-white"
                          >
                            Telephone Expense
                          </option>
                          <option value="Travel Expense" className="text-white">
                            Travel Expense
                          </option>
                          <option value="Uncategorized" className="text-white">
                            Uncategorized
                          </option>
                          <option
                            value="Contract Assets"
                            className="text-white"
                          >
                            Contract Assets
                          </option>
                          <option
                            value="Depreciation And Amortisation"
                            className="text-white"
                          >
                            Depreciation And Amortisation
                          </option>
                          <option value="Merchandise" className="text-white">
                            Merchandise
                          </option>
                          <option
                            value="Raw Materials And Consumables"
                            className="text-white"
                          >
                            Raw Materials And Consumables
                          </option>
                          <option
                            value="Transportation Expense"
                            className="text-white"
                          >
                            Transportation Expense
                          </option>
                        </optgroup>

                        <optgroup label="Fixed Asset" className="text-dark">
                          <option
                            value="Furniture and Equipment"
                            className="text-white"
                          >
                            Furniture and Equipment
                          </option>
                        </optgroup>

                        <optgroup
                          label="Other Current Asset"
                          className="text-dark"
                        >
                          <option
                            value="Employee Advance"
                            className="text-white"
                          >
                            Employee Advance
                          </option>
                          <option value="Advance Tax" className="text-white">
                            Advance Tax
                          </option>
                          <option
                            value="Prepaid Expenses"
                            className="text-white"
                          >
                            Prepaid Expenses
                          </option>
                          <option
                            value="GST TCS Receivable"
                            className="text-white"
                          >
                            GST TCS Receivable
                          </option>
                          <option
                            value="GST TDS Receivable"
                            className="text-white"
                          >
                            GST TDS Receivable
                          </option>
                          <option
                            value="Input Tax Credits"
                            className="text-white"
                          >
                            Input Tax Credits{" "}
                          </option>
                          <option value="Input CGST" className="text-white">
                            Input CGST
                          </option>
                          <option
                            value="Reverse Charge Tax Input but not due"
                            className="text-white"
                          >
                            Reverse Charge Tax Input but not due
                          </option>
                          <option
                            value="Sales to Customers (Cash)"
                            className="text-white"
                          >
                            Sales to Customers (Cash)
                          </option>
                          <option value="TDS Receivable" className="text-white">
                            TDS Receivable
                          </option>
                          <option value="Input SGST" className="text-white">
                            Input SGST
                          </option>
                          <option value="Input SGST" className="text-white">
                            Input SGST
                          </option>
                          <option value="Input SGST" className="text-white">
                            Input SGST
                          </option>
                          <option value="Input SGST" className="text-white">
                            Input SGST
                          </option>
                        </optgroup>

                        <optgroup
                          label="Cost Of Goods Sold"
                          className="text-dark"
                        >
                          <option value="Labor" className="text-white">
                            Labor
                          </option>
                          <option value="Materials" className="text-white">
                            Materials
                          </option>
                          <option value="Subcontractor" className="text-white">
                            Subcontractor
                          </option>
                          <option
                            value="Cost of Goods Sold"
                            className="text-white"
                          >
                            Cost of Goods Sold
                          </option>
                          <option value="Job Costing" className="text-white">
                            Job Costing
                          </option>
                        </optgroup>

                        <optgroup
                          label="Long Term Liability"
                          className="text-dark"
                        >
                          <option value="Mortgages" className="text-white">
                            Mortgages
                          </option>
                          <option
                            value="Construction Loans"
                            className="text-white"
                          >
                            Construction Loans
                          </option>
                        </optgroup>

                        <optgroup label="Equity" className="text-dark">
                          <option value="Drawings" className="text-white">
                            Drawings
                          </option>
                          <option
                            value="Opening Balance Offset"
                            className="text-white"
                          >
                            Opening Balance Offset
                          </option>
                          <option value="Owner's Equity" className="text-white">
                            Owner's Equity
                          </option>
                          <option
                            value="Retained Earnings"
                            className="text-white"
                          >
                            Retained Earnings
                          </option>
                          <option value="Capital Stock" className="text-white">
                            Capital Stock
                          </option>
                          <option value="Distributions" className="text-white">
                            Distributions
                          </option>
                          <option value="Dividends Paid" className="text-white">
                            Dividends Paid
                          </option>
                          <option value="Investments" className="text-white">
                            Investments
                          </option>
                        </optgroup>

                        <optgroup
                          label="Other Current Liability"
                          className="text-dark"
                        >
                          <option
                            value="Employee Reimbursements"
                            className="text-white"
                          >
                            Employee Reimbursements
                          </option>
                          <option
                            value="Opening Balance Adjustments"
                            className="text-white"
                          >
                            Opening Balance Adjustments
                          </option>
                          <option
                            value="Unearned Revenue"
                            className="text-white"
                          >
                            Unearned Revenue
                          </option>
                          <option value="GST Payable" className="text-white">
                            GST Payable
                          </option>
                          <option value="Output CGST" className="text-white">
                            Output CGST
                          </option>
                          <option value="Output IGST" className="text-white">
                            Output IGST
                          </option>
                          <option value="Output SGST" className="text-white">
                            Output SGST
                          </option>
                          <option value="TDS Payable" className="text-white">
                            TDS Payable
                          </option>
                        </optgroup>

                        {accountsBank.length > 0 ? (
                          <>
                            <optgroup label="Bank" className="text-dark">
                              {accountsBank.map((a) => (
                                <option
                                  value={a.account_name}
                                  className="text-white"
                                >
                                  {a.account_name}
                                </option>
                              ))}
                            </optgroup>
                          </>
                        ) : null}

                        {accountsCash.length > 0 ? (
                          <>
                            <optgroup label="Cash" className="text-dark">
                              {accountsCash.map((a) => (
                                <option
                                  value={a.account_name}
                                  className="text-white"
                                >
                                  {a.account_name}
                                </option>
                              ))}
                            </optgroup>
                          </>
                        ) : null}

                        {accountsCreditCard.length > 0 ? (
                          <>
                            <optgroup label="Credit Card" className="text-dark">
                              {accountsCreditCard.map((a) => (
                                <option
                                  value={a.account_name}
                                  className="text-white"
                                >
                                  {a.account_name}
                                </option>
                              ))}
                            </optgroup>
                          </>
                        ) : null}

                        {accountsPaymentClearing.length > 0 ? (
                          <>
                            <optgroup
                              label="Payment Clearing Account"
                              className="text-dark"
                            >
                              {accountsPaymentClearing.map((a) => (
                                <option
                                  value={a.account_name}
                                  className="text-white"
                                >
                                  {a.account_name}
                                </option>
                              ))}
                            </optgroup>
                          </>
                        ) : null}
                      </select>
                    </div>

                    <div className="col-md-3 ">
                      <label
                        className="col-form-label"
                        for="validationCustom03"
                      >
                        Reason *
                      </label>

                      <div className="d-flex align-items-center">
                        <select
                          name="reason"
                          className="form-control"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          id="reasons1"
                          required
                        >
                          <option selected disabled value="">
                            Choose...
                          </option>
                          {reasons &&
                            reasons.map((i) => (
                              <option value={i.reason}>{i.reason}</option>
                            ))}
                        </select>

                        <a
                          href="#newReasonModal"
                          className="btn btn-outline-secondary ml-1"
                          data-toggle="modal"
                          style={{
                            width: "fit-content",
                            height: "fit-content",
                          }}
                        >
                          +
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-3 mt-3">
                      <label className="col-form-label">Description</label>
                      <textarea
                        name="desc"
                        rows="5"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3 mt-3"></div>
                    <div className="col-md-3 mt-3"></div>
                    <div className="col-md-3 mt-3"></div>
                  </div>

                  <div className="row" id="quantityDiv">
                    <div className="col-md-12 table-responsive-md mt-3">
                      <table
                        className="table table-bordered table-hover mt-3"
                        id="item_table_quantity"
                      >
                        <thead>
                          <tr>
                            <th className="text-center">Sl No.</th>
                            <th className="text-center">Item details</th>
                            <th className="text-center">Quantity Available</th>
                            <th className="text-center">
                              New Quantity on hand
                            </th>
                            <th className="text-center">Quantity Adjusted</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemsQuantity.map((row) => (
                            <tr key={row.id} id={`row${row.id}`}>
                              <td className="bg-transparent text-white rownum">
                                {row.id}
                              </td>
                              <td>
                                <div className="form-group mt-3">
                                  <Select
                                    options={items}
                                    styles={customStyles}
                                    name="item"
                                    className="itemsQuantity"
                                    id={`item${row.id}`}
                                    required
                                    onChange={(selectedOption) =>
                                      handleQuantityItemChange(
                                        selectedOption
                                          ? selectedOption.value
                                          : "",
                                        row.id
                                      )
                                    }
                                    isClearable
                                    isSearchable
                                  />
                                </div>
                              </td>
                              <td className="text-right text-dark">
                                <input
                                  type="number"
                                  step="0.01"
                                  className="form-control border-1 text-light text-right qty"
                                  value={row.quantity}
                                  onChange={(e) =>
                                    handleItemsQInputChange(
                                      row.id,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  name="quantity"
                                  id={`qty${row.id}`}
                                />
                              </td>
                              <td className="text-right">
                                <input
                                  type="number"
                                  id={`newQty${row.id}`}
                                  className="form-control border-1 text-light text-right rate"
                                  name="quantityInHand"
                                  value={row.quantityInHand}
                                  onChange={(e) =>
                                    handleItemsQInputChange(
                                      row.id,
                                      "quantityInHand",
                                      e.target.value
                                    )
                                  }
                                  onBlur={(e) =>
                                    calculateQtyDiff(row.id, e.target.value)
                                  }
                                />
                              </td>
                              <td className="text-right">
                                <input
                                  type="text"
                                  id={`diff${row.id}`}
                                  className="form-control border-1 text-light text-right discount"
                                  name="difference"
                                  value={row.difference}
                                  onChange={(e) =>
                                    handleItemsQInputChange(
                                      row.id,
                                      "difference",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  onClick={() => removeRowQ(row.id)}
                                  id={`deleteRow${row.id}`}
                                  className="btn btn-outline-secondary delete-row"
                                  style={{
                                    width: "fit-content",
                                    height: "fit-content",
                                  }}
                                >
                                  -
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button
                        type="button"
                        className="btn btn-outline-secondary tab1"
                        id="add-row"
                        onClick={addNewRowQ}
                        title="add row"
                        style={{ width: "fit-content", height: "fit-content" }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div
                    className="row"
                    id="valueDiv"
                    style={{ display: "none" }}
                  >
                    <div className="col-sm-12 col-lg-12 col-md-12 ">
                      <label for="" id="label_tab2" className="tab2"></label>
                      <br />
                      <div style={{ width: "100%" }}>
                        <table
                          className="table  text-black table-bordered tab2"
                          id="item_table_value"
                          style={{ width: "100%" }}
                        >
                          <thead>
                            <tr className="text-center">
                              <th className="" style={{ fontWeight: "bold" }}>
                                Sl No.
                              </th>
                              <th className="" style={{ fontWeight: "bold" }}>
                                Item Details
                              </th>
                              <th className="" style={{ fontWeight: "bold" }}>
                                Current Value
                              </th>
                              <th className="" style={{ fontWeight: "bold" }}>
                                Changed Value
                              </th>
                              <th className="" style={{ fontWeight: "bold" }}>
                                Adjusted Value
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemsValue.map((row) => (
                              <tr key={row.id} id={`row${row.id}`}>
                                <td className="bg-transparent text-white rownum">
                                  {row.id}
                                </td>
                                <td>
                                  <div className="form-group mt-3">
                                    <Select
                                      options={items}
                                      styles={customStyles}
                                      name="item"
                                      className="itemsValue"
                                      id={`item${row.id}`}
                                      onChange={(selectedOption) =>
                                        handleValueItemChange(
                                          selectedOption
                                            ? selectedOption.value
                                            : "",
                                          row.id
                                        )
                                      }
                                      isClearable
                                      isSearchable
                                    />
                                  </div>
                                </td>
                                <td className="text-right text-dark">
                                  <input
                                    type="number"
                                    className="form-control border-1 text-light text-right"
                                    value={row.value}
                                    onChange={(e) =>
                                      handleItemsVInputChange(
                                        row.id,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    name="value"
                                    id={`value${row.id}`}
                                  />
                                </td>
                                <td className="text-right">
                                  <input
                                    type="number"
                                    id={`changedValue${row.id}`}
                                    className="form-control border-1 text-light text-right"
                                    name="changedValue"
                                    value={row.changedValue}
                                    onChange={(e) =>
                                      handleItemsVInputChange(
                                        row.id,
                                        "changedValue",
                                        e.target.value
                                      )
                                    }
                                    onBlur={(e) =>
                                      calculateVlaDiff(row.id, e.target.value)
                                    }
                                  />
                                </td>
                                <td className="text-right">
                                  <input
                                    type="text"
                                    id={`diff${row.id}`}
                                    className="form-control border-1 text-light text-right"
                                    name="difference"
                                    value={row.difference}
                                    onChange={(e) =>
                                      handleItemsVInputChange(
                                        row.id,
                                        "difference",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="text-center">
                                  <button
                                    type="button"
                                    onClick={() => removeRowV(row.id)}
                                    id={`deleteRow${row.id}`}
                                    className="btn btn-outline-secondary delete-row"
                                    style={{
                                      width: "fit-content",
                                      height: "fit-content",
                                    }}
                                  >
                                    -
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button
                          type="button"
                          className="btn btn-outline-secondary tab2 "
                          id="add-row2"
                          onClick={addNewRowV}
                          title="add row"
                          style={{
                            width: "fit-content",
                            height: "fit-content",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="row mt-3">
                    <div class="col-md-3">
                      <input
                        class="form-control"
                        type="file"
                        id="file"
                        name="file"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </div>
                  </div>

                  <div class="notices mt-3">
                    <div class="text-muted text-light">NOTICE:</div>
                    <div class="text-muted text-light">
                      <input type="checkbox" required />
                      Fin sYs Terms and Conditions Apply
                    </div>
                  </div>

                  <div className="row mt-5 mb-3">
                    <div className="col-md-3"></div>
                    <div className="col-md-6 d-flex justify-content-center gap-1">
                      <button
                        type="submit"
                        className="btn btn-outline-secondary text-light"
                        onClick={()=>setStatus('Save')}
                        style={{ width: "50%", height: "fit-content" }}
                      >
                        SAVE
                      </button>
                      <button
                        type="submit"
                        className="btn btn-outline-secondary text-light"
                        onClick={()=>setStatus('Draft')}
                        style={{ width: "50%", height: "fit-content" }}
                      >
                        DRAFT
                      </button>
                    </div>
                    <div className="col-md-3"></div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <!-- Unit Create Modal --> */}
      <div className="modal fade" id="newReasonModal">
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">New Reason</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body w-100">
              <div className="card p-3">
                <form id="newReasonForm" className="px-1">
                  <div className="row mt-2 w-100">
                    <div className="col-12">
                      <label for="name">Reason</label>
                      <input
                        name="name"
                        id="unit_name"
                        value={newReason}
                        onChange={(e) => setNewReason(e.target.value)}
                        className="form-control w-100"
                      />
                    </div>
                  </div>
                  <div className="row mt-4 w-100">
                    <div className="col-12 d-flex justify-content-center">
                      <button
                        className="btn btn-outline-info text-grey"
                        data-dismiss="modal"
                        type="submit"
                        onClick={handleReasonModalSubmit}
                        id="saveItemUnit"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddStockAdjust;
