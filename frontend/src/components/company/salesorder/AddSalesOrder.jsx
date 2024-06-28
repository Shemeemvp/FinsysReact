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
            value: item.id,
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

  function fetchPaymentTerms() {
    axios
      .get(`${config.base_url}/fetch_sales_order_data/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          let trms = res.data.paymentTerms;
          setTerms([]);
          trms.map((i) => {
            setTerms((prevState) => [...prevState, i]);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
      priceListPrice: "",
      taxGst: "",
      taxIgst: "",
      discount: "",
      total: "",
      taxAmount: "",
    },
  ]);

  function handlePriceList(val) {
    setPriceList(val);
    applyPriceListChange(val);
  }

  function handlePriceListIdChange(val) {
    setPriceListId(val);
    applyPriceList(val);
  }

  function checkForNull(val) {
    return val !== "" ? val : null;
  }

  function checkForZero(val) {
    return val !== "" ? val : 0.0;
  }

  function checkBalanceVal(val) {
    return val !== "" ? val : grandTotal;
  }

  function checkPriceList(priceList) {
    if (priceList) {
      if (priceListId != "") {
        document.querySelectorAll(".price").forEach(function (ele) {
          ele.style.display = "none";
        });
        document.querySelectorAll(".priceListPrice").forEach(function (ele) {
          ele.style.display = "block";
        });
        document.getElementById("custPriceListName").style.display =
          "inline-flex";
      } else {
        document.querySelectorAll(".price").forEach(function (ele) {
          ele.style.display = "block";
        });
        document.querySelectorAll(".priceListPrice").forEach(function (ele) {
          ele.style.display = "none";
        });
        document.getElementById("custPriceListName").style.display = "none";
      }
    } else {
      document.querySelectorAll(".price").forEach(function (ele) {
        ele.style.display = "block";
      });
      document.querySelectorAll(".priceListPrice").forEach(function (ele) {
        ele.style.display = "none";
      });
      document.getElementById("custPriceListName").style.display = "none";
    }
    calc();
  }

  function checkPriceList2() {
    if (priceList) {
      if (priceListId != "") {
        document.querySelectorAll(".price").forEach(function (ele) {
          ele.style.display = "none";
        });
        document.querySelectorAll(".priceListPrice").forEach(function (ele) {
          ele.style.display = "block";
        });
        document.getElementById("custPriceListName").style.display =
          "inline-flex";
      } else {
        document.querySelectorAll(".price").forEach(function (ele) {
          ele.style.display = "block";
        });
        document.querySelectorAll(".priceListPrice").forEach(function (ele) {
          ele.style.display = "none";
        });
        document.getElementById("custPriceListName").style.display = "none";
      }
    } else {
      document.querySelectorAll(".price").forEach(function (ele) {
        ele.style.display = "block";
      });
      document.querySelectorAll(".priceListPrice").forEach(function (ele) {
        ele.style.display = "none";
      });
      document.getElementById("custPriceListName").style.display = "none";
    }
    calc();
  }

  function applyPriceListChange(val) {
    checkPriceList(val);
    if (val) {
      document.getElementById("custPriceListName").style.display =
        "inline-flex";
      document.getElementById("custPriceListName").innerText =
        "Select Price List..";
    } else {
      setPriceListId("");
      document.getElementById("custPriceListName").style.display = "none";
      document.getElementById("custPriceListName").innerText = "";
    }
  }

  function applyPriceList(priceListId) {
    // document.getElementById("applyPriceList").checked = true;
    if (priceListId == "") {
      document.getElementById("custPriceListAlert").style.display = "block";
      document.getElementById("custPriceListAlert").innerText =
        "Select a Price List..";
      document.getElementById("custPriceListName").innerText = "";
      checkPriceList2();
      calc();
    } else {
      document.getElementById("custPriceListName").innerText =
        "Applied: " +
        document.querySelector("#priceListIds option:checked").textContent;
      const updatedItems = salesOrderItems.map((pItem) => {
        var itemId = pItem.item;

        var plc = placeOfSupply;
        var PLId = priceListId;

        if (PLId != "") {
          if (plc != "") {
            document.getElementById("custPriceListAlert").style.display =
              "none";
            document.getElementById("custPriceListName").innerText =
              "Applied: " +
              document.querySelector("#priceListIds option:checked")
                .textContent;

            var itm = {
              Id: ID,
              item: itemId,
              listId: PLId,
            };

            axios
              .get(`${config.base_url}/get_table_item_data/`, { params: itm })
              .then((res) => {
                console.log("ITEM DATA==", res);
                if (res.data.status) {
                  var itemData = res.data.itemData;

                  setSalesOrderItems((prevItems) =>
                    prevItems.map((item) =>
                      item.id === pItem.id
                        ? {
                            ...item,
                            price: itemData.sales_rate,
                            priceListPrice: itemData.PLPrice,
                            taxGst: itemData.gst,
                            taxIgst: itemData.igst,
                            hsnSac: itemData.hsnSac,
                          }
                        : item
                    )
                  );
                  return {
                    ...pItem,
                    price: itemData.sales_rate,
                    priceListPrice: itemData.PLPrice,
                    taxGst: itemData.gst,
                    taxIgst: itemData.igst,
                    hsnSac: itemData.hsnSac,
                  };
                }
              })
              .catch((err) => {
                console.log("ERROR", err);
              });
          } else {
            alert("Select Place of Supply.!");
          }
        } else {
          document.getElementById("custPriceListAlert").style.display = "block";
          document.getElementById("custPriceListAlert").innerText =
            "Select a Price List..";
          document.getElementById("custPriceListName").innerText = "";
          setPriceList(false);
        }
      });
      checkPriceList2();
      refreshTax(placeOfSupply);
      calc();
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Id", ID);
    formData.append("status", status);
    formData.append("Customer", customer);
    formData.append("customer_email", email);
    formData.append("billing_address", billingAddress);
    formData.append("gst_type", gstType);
    formData.append("gstin", gstIn);
    formData.append("place_of_supply", placeOfSupply);
    formData.append("reference_no", refNo);
    formData.append("sales_order_no", salesOrderNo);
    formData.append("payment_terms", term);
    formData.append("sales_order_date", date);
    formData.append("exp_ship_date", shipmentDate);
    formData.append("price_list_applied", priceList);
    formData.append("price_list", checkForNull(priceListId));
    formData.append("payment_method", checkForNull(paymentMethod));
    formData.append("cheque_no", checkForNull(chequeNumber));
    formData.append("upi_no", checkForNull(upiId));
    formData.append("bank_acc_no", checkForNull(accountNumber));
    formData.append("subtotal", checkForZero(subTotal));
    formData.append("igst", checkForZero(igst));
    formData.append("cgst", checkForZero(cgst));
    formData.append("sgst", checkForZero(sgst));
    formData.append("tax_amount", checkForZero(taxAmount));
    formData.append("adjustment", checkForZero(adjustment));
    formData.append("shipping_charge", checkForZero(shippingCharge));
    formData.append("grandtotal", checkForZero(grandTotal));
    formData.append("paid_off", checkForZero(paid));
    formData.append("balance", checkBalanceVal(balance));
    formData.append("note", description);
    formData.append("salesOrderItems", JSON.stringify(salesOrderItems));

    if (file) {
      formData.append("file", file);
    }

    axios
      .post(`${config.base_url}/create_new_sales_order/`, formData)
      .then((res) => {
        console.log("Sales RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Sales Order Created",
          });
          navigate("/sales_order");
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
            setPlaceOfSupply("");
            var cust = res.data.customerDetails;
            console.log("Cust Details===", cust);
            setEmail(cust.email);
            setGstType(cust.gstType);
            setGstIn(cust.gstIn);
            setPlaceOfSupply(cust.placeOfSupply);
            setBillingAddress(cust.address);
            refreshTax(cust.placeOfSupply);
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
      setPlaceOfSupply("");
    }
  }

  function handleSalesOrderNoChange(val) {
    setSalesOrderNo(val);
    checkSalesOrderNo(val);
  }

  function checkSalesOrderNo(val) {
    document.getElementById("SONoErr").innerText = "";
    var so_num = val;
    if (so_num != "") {
      var s = {
        Id: ID,
        SONum: so_num,
      };
      axios
        .get(`${config.base_url}/check_sales_order_no/`, { params: s })
        .then((res) => {
          console.log("SO NUM Res=", res);
          if (!res.data.status) {
            document.getElementById("SONoErr").innerText = res.data.message;
          } else {
            document.getElementById("SONoErr").innerText = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handlePlaceOfSupply(val) {
    setPlaceOfSupply(val);
    refreshTax(val);
  }

  const addNewRow = () => {
    var newItem = {
      id: "",
      item: "",
      hsnSac: "",
      quantity: "",
      price: "",
      priceListPrice: "",
      taxGst: "",
      taxIgst: "",
      discount: "",
      total: "",
      taxAmount: "",
    };
    setSalesOrderItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];

      return updatedItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    });
  };

  const removeRow = (id) => {
    setSalesOrderItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);

      return updatedItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    });
  };

  const handleSalesOrderItemsInputChange = (id, field, value) => {
    setSalesOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleItemChange = (value, id) => {
    var exists = itemExists(value);
    if (!exists) {
      if (placeOfSupply != "") {
        handleSalesOrderItemsInputChange(id, "item", value);
        getItemData(value, id);
      } else {
        alert("Select Place of Supply.!");
      }
    } else {
      alert(
        "Item already exists in the Sales Order, choose another or change quantity.!"
      );
    }
  };

  const itemExists = (itemToCheck) => {
    for (const item of salesOrderItems) {
      if (item.item === itemToCheck) {
        return true;
      }
    }
    return false;
  };

  function getItemData(item, id) {
    var exists = itemExists(item);
    var plc = placeOfSupply;
    var PLId = priceListId;

    if (!exists) {
      if (plc != "") {
        if (priceList && PLId == "") {
          handleSalesOrderItemsInputChange(id, "item", "");
          alert("Select a Price List from the dropdown..!");
        } else {
          var itm = {
            Id: ID,
            item: item,
            listId: PLId,
          };

          axios
            .get(`${config.base_url}/get_table_item_data/`, { params: itm })
            .then((res) => {
              console.log("ITEM DATA==", res);
              if (res.data.status) {
                var itemData = res.data.itemData;

                setSalesOrderItems((prevItems) =>
                  prevItems.map((item) =>
                    item.id === id
                      ? {
                          ...item,
                          price: itemData.sales_rate,
                          priceListPrice: itemData.PLPrice,
                          taxGst: itemData.gst,
                          taxIgst: itemData.igst,
                          hsnSac: itemData.hsnSac,
                        }
                      : item
                  )
                );
                // checkPriceList();
                // refreshTax2();
                // calc();
              }
            })
            .catch((err) => {
              console.log("ERROR", err);
            });
        }
      } else {
        alert("Select Place of Supply.!");
      }
    } else {
      alert(
        "Item already exists in the Sales Order, choose another or change quantity.!"
      );
    }
  }

  function refreshValues() {
    checkPriceList(priceList);
    refreshTax2();
    calc();
  }

  function resetItem(id) {
    setSalesOrderItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, item: "" } : item))
    );
  }

  function refreshTax(plc) {
    var cmp = cmpState;
    if (cmp == plc) {
      document.querySelectorAll(".tax_ref").forEach(function (ele) {
        ele.style.display = "none";
      });
      document.querySelectorAll(".tax_ref_gst").forEach(function (ele) {
        ele.style.display = "block";
      });
      document.getElementById("taxamountCGST").style.display = "flex";
      document.getElementById("taxamountSGST").style.display = "flex";
      document.getElementById("taxamountIGST").style.display = "none";
    } else {
      document.querySelectorAll(".tax_ref").forEach(function (ele) {
        ele.style.display = "none";
      });
      document.querySelectorAll(".tax_ref_igst").forEach(function (ele) {
        ele.style.display = "block";
      });
      document.getElementById("taxamountCGST").style.display = "none";
      document.getElementById("taxamountSGST").style.display = "none";
      document.getElementById("taxamountIGST").style.display = "flex";
    }
    calc2(plc);
  }

  function refreshTax2() {
    if (cmpState == placeOfSupply) {
      document.querySelectorAll(".tax_ref").forEach(function (ele) {
        ele.style.display = "none";
      });
      document.querySelectorAll(".tax_ref_gst").forEach(function (ele) {
        ele.style.display = "block";
      });
      document.getElementById("taxamountCGST").style.display = "flex";
      document.getElementById("taxamountSGST").style.display = "flex";
      document.getElementById("taxamountIGST").style.display = "none";
    } else {
      document.querySelectorAll(".tax_ref").forEach(function (ele) {
        ele.style.display = "none";
      });
      document.querySelectorAll(".tax_ref_igst").forEach(function (ele) {
        ele.style.display = "block";
      });
      document.getElementById("taxamountCGST").style.display = "none";
      document.getElementById("taxamountSGST").style.display = "none";
      document.getElementById("taxamountIGST").style.display = "flex";
    }
  }

  function handleOrderDateChange(date) {
    setDate(date);
    findShipmentDate();
  }

  function handlePaymentTermChange(term) {
    setTerm(term);
    findShipmentDate();
  }

  function findShipmentDate() {
    var paymentTerm = document.querySelector("#paymentTerm");
    var selectedOption = paymentTerm.options[paymentTerm.selectedIndex];
    var days = parseInt(selectedOption.getAttribute("text"));
    var order_date = new Date(document.getElementById("salesOrderDate").value);
    console.log(days);
    console.log(order_date);
    if (!isNaN(order_date.getTime())) {
      const endDate = new Date(order_date);
      endDate.setDate(endDate.getDate() + days);

      const isoString = endDate.toISOString();
      const day = isoString.slice(8, 10);
      const month = isoString.slice(5, 7);
      const year = isoString.slice(0, 4);

      const formattedDate = `${day}-${month}-${year}`;
      setShipmentDate(formattedDate);
    } else {
      alert("Please enter a valid date.");
      setTerm("");
    }
  }
  const calc3 = (salesOrderItems) => {
    const updatedItems = salesOrderItems.map((item) => {
      if(item.quantity){
        var qty = parseInt(item.quantity || 0);
        if (priceList) {
          var price = parseFloat(item.priceListPrice || 0);
        } else {
          var price = parseFloat(item.price || 0);
        }
        var dis = parseFloat(item.discount || 0);
  
        if (placeOfSupply == cmpState) {
          var tax = parseInt(item.taxGst || 0);
        } else {
          var tax = parseInt(item.taxIgst || 0);
        }
        let total = parseFloat(qty) * parseFloat(price) - parseFloat(dis);
        let taxAmt = (qty * price - dis) * (tax / 100);
        return {
          ...item,
          total: total,
          taxAmount: taxAmt,
        };
      }
    });

    setSalesOrderItems(updatedItems);
    calc_total(updatedItems);
  };

  function calc2(placeOfSupply) {
    const updatedItems = salesOrderItems.map((item) => {
      var qty = parseInt(item.quantity || 0);
      if (priceList) {
        var price = parseFloat(item.priceListPrice || 0);
      } else {
        var price = parseFloat(item.price || 0);
      }
      var dis = parseFloat(item.discount || 0);

      if (placeOfSupply == cmpState) {
        var tax = parseInt(item.taxGst || 0);
      } else {
        var tax = parseInt(item.taxIgst || 0);
      }
      let total = parseFloat(qty) * parseFloat(price) - parseFloat(dis);
      let taxAmt = (qty * price - dis) * (tax / 100);
      return {
        ...item,
        total: total,
        taxAmount: taxAmt,
      };
    });

    setSalesOrderItems(updatedItems);
    calc_total2(updatedItems, placeOfSupply);
  }

  const calc = () => {
    const updatedItems = salesOrderItems.map((item) => {
      var qty = parseInt(item.quantity || 0);
      if (priceList) {
        var price = parseFloat(item.priceListPrice || 0);
      } else {
        var price = parseFloat(item.price || 0);
      }
      var dis = parseFloat(item.discount || 0);

      if (placeOfSupply == cmpState) {
        var tax = parseInt(item.taxGst || 0);
      } else {
        var tax = parseInt(item.taxIgst || 0);
      }
      let total = parseFloat(qty) * parseFloat(price) - parseFloat(dis);
      let taxAmt = (qty * price - dis) * (tax / 100);
      return {
        ...item,
        total: total,
        taxAmount: taxAmt,
      };
    });

    setSalesOrderItems(updatedItems);
    calc_total(updatedItems);
  };

  function calc_total(salesOrderItems) {
    var total = 0;
    var taxamount = 0;
    salesOrderItems.map((item) => {
      total += parseFloat(item.total || 0);
    });
    salesOrderItems.map((item) => {
      taxamount += parseFloat(item.taxAmount || 0);
    });
    setSubTotal(total.toFixed(2));
    setTaxAmount(taxamount.toFixed(2));

    var ship = parseFloat(shippingCharge || 0);
    var adj_val = parseFloat(adjustment || 0);
    var gtot = taxamount + total + ship + adj_val;

    setGrandTotal(gtot.toFixed(2));

    var adv_val = parseFloat(paid || 0);
    var bal = gtot - adv_val;
    setBalance(bal.toFixed(2));
    splitTax(taxamount, placeOfSupply);
  }

  function splitTax(taxamount, placeOfSupply) {
    var d = 0;
    if (placeOfSupply == cmpState) {
      var gst = taxamount / 2;
      setCgst(parseFloat(gst.toFixed(2)));
      setSgst(parseFloat(gst.toFixed(2)));
      setIgst(parseFloat(d.toFixed(2)));
    } else {
      setIgst(taxamount.toFixed(2));
      setCgst(d.toFixed(2));
      setSgst(d.toFixed(2));
    }
  }

  function calc_total2(salesOrderItems, placeOfSupply) {
    var total = 0;
    var taxamount = 0;
    salesOrderItems.map((item) => {
      total += parseFloat(item.total || 0);
    });
    salesOrderItems.map((item) => {
      taxamount += parseFloat(item.taxAmount || 0);
    });
    setSubTotal(total.toFixed(2));
    setTaxAmount(taxamount.toFixed(2));

    var ship = parseFloat(shippingCharge || 0);
    var adj_val = parseFloat(adjustment || 0);
    var gtot = taxamount + total + ship + adj_val;

    setGrandTotal(gtot.toFixed(2));

    var adv_val = parseFloat(paid || 0);
    var bal = gtot - adv_val;
    setBalance(bal.toFixed(2));
    splitTax2(taxamount, placeOfSupply);
  }

  function splitTax2(taxamount, placeOfSupply) {
    var d = 0;
    if (placeOfSupply == cmpState) {
      var gst = taxamount / 2;
      setCgst(parseFloat(gst.toFixed(2)));
      setSgst(parseFloat(gst.toFixed(2)));
      setIgst(parseFloat(d.toFixed(2)));
    } else {
      setIgst(taxamount.toFixed(2));
      setCgst(d.toFixed(2));
      setSgst(d.toFixed(2));
    }
  }

  function handleShippingCharge(val) {
    setShippingCharge(val);
    updateGrandTotalShip(val);
  }

  function handleAdjustment(val) {
    setAdjustment(val);
    updateGrandTotalAdj(val);
  }

  function handlePaid(val) {
    setPaid(val);
    updateBalance(val);
  }

  function updateGrandTotalShip(val) {
    var subtot = subTotal;
    var tax = taxAmount;
    var sh = val;
    var adj = adjustment;
    var gtot = (
      parseFloat(subtot || 0) +
      parseFloat(tax || 0) +
      parseFloat(sh || 0) +
      parseFloat(adj || 0)
    ).toFixed(2);
    setGrandTotal(gtot);
    setBalance((parseFloat(gtot) - parseFloat(paid)).toFixed(2));
  }

  function updateGrandTotalAdj(val) {
    var subtot = subTotal;
    var tax = taxAmount;
    var sh = shippingCharge;
    var adj = val;
    var gtot = (
      parseFloat(subtot || 0) +
      parseFloat(tax || 0) +
      parseFloat(sh || 0) +
      parseFloat(adj || 0)
    ).toFixed(2);
    setGrandTotal(gtot);
    setBalance((parseFloat(gtot) - parseFloat(paid)).toFixed(2));
  }

  function updateBalance(val) {
    var tot_val = grandTotal;
    var adv_val = val;
    if (adv_val != "") {
      if (parseFloat(tot_val) < parseFloat(adv_val)) {
        setPaid(parseFloat(tot_val));
        setBalance.val(0);
        alert("Advance Greater than Total Amount");
      } else {
        var bal = parseFloat(tot_val) - parseFloat(adv_val);
        setBalance(bal.toFixed(2));
      }
    } else {
      setBalance(parseFloat(tot_val));
    }
  }

  const [newTermName, setNewTermName] = useState("");
  const [newTermDays, setNewTermDays] = useState("");
  function handleTermModalSubmit(e) {
    e.preventDefault();
    var term = newTermName;
    var days = newTermDays;
    if (term != "" && days != "") {
      var u = {
        Id: ID,
        term_name: newTermName,
        days: newTermDays,
      };
      axios
        .post(`${config.base_url}/create_new_payment_term/`, u)
        .then((res) => {
          console.log("NTrm RES=", res);
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Term Created",
            });
            fetchPaymentTerms();
            // setTerm(res.data.term.id);
            setNewTermName("");
            setNewTermDays("");

            document.getElementById("termModalDismiss").click();
          }
          // findShipmentDate();
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

  function handlePaymentMethodChange(val) {
    setPaymentMethod(val);
    paymentMethodChange(val);
  }

  function paymentMethodChange(val) {
    if (val === "Cash") {
      document.getElementById("chequediv").style.display = "none";
      document.getElementById("bnkdiv").style.display = "none";
      document.getElementById("upidiv").style.display = "none";
      setChequeNumber("");
      setUpiId("");
      setAccountNumber("");
    } else if (val === "Cheque") {
      document.getElementById("chequediv").style.display = "block";
      document.getElementById("bnkdiv").style.display = "none";
      document.getElementById("upidiv").style.display = "none";
      setUpiId("");
      setAccountNumber("");
    } else if (val === "UPI") {
      document.getElementById("chequediv").style.display = "none";
      document.getElementById("bnkdiv").style.display = "none";
      document.getElementById("upidiv").style.display = "block";
      setChequeNumber("");
      setAccountNumber("");
    } else {
      document.getElementById("chequediv").style.display = "none";
      document.getElementById("bnkdiv").style.display = "block";
      document.getElementById("upidiv").style.display = "none";
      setChequeNumber("");
      setUpiId("");

      var bnk = document.querySelector("#paymentMethod");
      var selectedOption = bnk.options[bnk.selectedIndex];
      var bank_id = parseInt(selectedOption.getAttribute("text"));

      axios
        .get(`${config.base_url}/get_bank_account_data/${bank_id}/`)
        .then((res) => {
          if (res.data.status) {
            setChequeNumber("");
            setUpiId("");
            setAccountNumber(res.data.account);
          }
        })
        .catch((err) => {
          console.log(err);
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
          onSubmit={handleSubmit}
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
                      onChange={(e) => handleSalesOrderNoChange(e.target.value)}
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
                      onChange={(e) => handlePlaceOfSupply(e.target.value)}
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
                      onChange={(e) => handleOrderDateChange(e.target.value)}
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
                        onChange={(e) =>
                          handlePaymentTermChange(e.target.value)
                        }
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
                      onChange={(e) =>
                        handlePaymentMethodChange(e.target.value)
                      }
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
                        onChange={() => handlePriceList(!priceList)}
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
                    <div
                      id="priceListDropdown"
                      style={{ display: priceList ? "block" : "none" }}
                    >
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
                        onChange={(e) =>
                          handlePriceListIdChange(e.target.value)
                        }
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
                        {salesOrderItems.map((row) => (
                          <tr key={row.id} id={`tab_row${row.id}`}>
                            <td
                              className="nnum"
                              style={{ textAlign: "center" }}
                            >
                              {row.id}
                            </td>
                            <td style={{ width: "20%" }}>
                              <div className="d-flex align-items-center">
                                <Select
                                  options={items}
                                  styles={customStyles}
                                  name="item"
                                  className="w-100"
                                  id={`item${row.id}`}
                                  required
                                  defaultInputValue={row.item}
                                  onChange={(selectedOption) =>
                                    handleItemChange(
                                      selectedOption
                                        ? selectedOption.value
                                        : "",
                                      row.id
                                    )
                                  }
                                  onBlur={refreshValues}
                                  isClearable
                                  isSearchable
                                />
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
                                type="text"
                                name="hsnSac"
                                value={row.hsnSac}
                                id={`hsn${row.id}`}
                                placeholder="HSN/SAC Code"
                                className="form-control HSNCODE"
                                style={{
                                  backgroundColor: "#43596c",
                                  color: "white",
                                }}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                name="qty[]"
                                id={`qty${row.id}`}
                                className="form-control qty"
                                step="0"
                                min="1"
                                style={{
                                  backgroundColor: "#43596c",
                                  color: "white",
                                }}
                                value={row.quantity}
                                onChange={(e) =>
                                  handleSalesOrderItemsInputChange(
                                    row.id,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                                onBlur={refreshValues}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                name="price"
                                id={`price${row.id}`}
                                className="form-control price"
                                step="0.00"
                                min="0"
                                style={{
                                  backgroundColor: "#43596c",
                                  color: "white",
                                  display: "block",
                                }}
                                value={row.price}
                                readOnly
                              />
                              <input
                                type="number"
                                name="priceListPrice"
                                id={`priceListPrice${row.id}`}
                                className="form-control priceListPrice"
                                step="0.00"
                                min="0"
                                style={{
                                  backgroundColor: "#43596c",
                                  color: "white",
                                  display: "none",
                                }}
                                value={row.priceListPrice}
                                readOnly
                              />
                            </td>

                            <td style={{ width: "13%" }}>
                              <select
                                name="taxGST"
                                id={`taxGST${row.id}`}
                                className="form-control tax_ref tax_ref_gst"
                                style={{ display: "block" }}
                                value={row.taxGst}
                                onChange={(e) =>
                                  handleSalesOrderItemsInputChange(
                                    row.id,
                                    "taxGst",
                                    e.target.value
                                  )
                                }
                                onBlur={refreshValues}
                              >
                                <option value="">Select GST</option>
                                <option value="28">28.0% GST</option>
                                <option value="18">18.0% GST</option>
                                <option value="12">12.0% GST</option>
                                <option value="5">05.0% GST</option>
                                <option value="3">03.0% GST</option>
                                <option value="0">0.0% GST</option>
                              </select>
                              <select
                                name="taxIGST"
                                id={`taxIGST${row.id}`}
                                className="form-control tax_ref tax_ref_igst"
                                style={{ display: "none" }}
                                value={row.taxIgst}
                                onChange={(e) =>
                                  handleSalesOrderItemsInputChange(
                                    row.id,
                                    "taxIgst",
                                    e.target.value
                                  )
                                }
                                onBlur={refreshValues}
                              >
                                <option value="">Select IGST</option>
                                <option value="28">28.0% IGST</option>
                                <option value="18">18.0% IGST</option>
                                <option value="12">12.0% IGST</option>
                                <option value="5">05.0% IGST</option>
                                <option value="3">03.0% IGST</option>
                                <option value="0">0.0% IGST</option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                name="discount"
                                placeholder="Enter Discount"
                                id={`disc${row.id}`}
                                value={row.discount}
                                onChange={(e) =>
                                  handleSalesOrderItemsInputChange(
                                    row.id,
                                    "discount",
                                    e.target.value
                                  )
                                }
                                onBlur={refreshValues}
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
                                name="total"
                                id={`total${row.id}`}
                                className="form-control total"
                                value={row.total}
                                readOnly
                                style={{
                                  backgroundColor: "#43596c",
                                  color: "white",
                                }}
                              />
                              <input
                                type="hidden"
                                id={`taxamount${row.id}`}
                                className="form-control itemTaxAmount"
                                value={row.taxAmount}
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                id={`${row.id}`}
                                style={{
                                  width: "fit-content",
                                  height: "fit-content",
                                }}
                                onClick={() => removeRow(row.id)}
                                className="btn btn-danger remove_row px-2 py-1 mx-1 fa fa-close"
                                title="Remove Row"
                              ></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tr>
                        <td style={{ border: "none" }}>
                          <a
                            className="btn btn-secondary ml-1"
                            role="button"
                            id="add"
                            onClick={addNewRow}
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
                            onChange={(e) =>
                              handleShippingCharge(e.target.value)
                            }
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
                            onChange={(e) => handleAdjustment(e.target.value)}
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
                            onChange={(e) => handlePaid(e.target.value)}
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
                      onClick={() => setStatus("Draft")}
                      value="Draft"
                    />
                    <input
                      type="submit"
                      className="btn btn-outline-secondary w-50 ml-1 text-light"
                      onClick={() => setStatus("Saved")}
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

      {/* <!-- New Payment Term Modal --> */}
      <div className="modal fade" id="newPaymentTerm">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">New Payment Term</h5>
              <button
                type="button"
                className="close"
                id="termModalDismiss"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body w-100">
              <div className="card p-3">
                <form
                  method="post"
                  id="newTermForm"
                  onSubmit={handleTermModalSubmit}
                >
                  <div className="row mt-2 w-100">
                    <div className="col-6">
                      <label for="name">Term Name</label>
                      <input
                        type="text"
                        name="term_name"
                        id="termName"
                        value={newTermName}
                        onChange={(e) => setNewTermName(e.target.value)}
                        className="form-control w-100"
                      />
                    </div>
                    <div className="col-6">
                      <label for="name">Days</label>
                      <input
                        type="number"
                        name="days"
                        id="termDays"
                        value={newTermDays}
                        onChange={(e) => setNewTermDays(e.target.value)}
                        className="form-control w-100"
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>
                  <div className="row mt-4 w-100">
                    <div className="col-4"></div>
                    <div className="col-4 d-flex justify-content-center">
                      <button
                        className="btn btn-outline-secondary text-grey w-75"
                        type="submit"
                        id="savePaymentTerm"
                      >
                        Save
                      </button>
                    </div>
                    <div className="col-4"></div>
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

export default AddSalesOrder;
