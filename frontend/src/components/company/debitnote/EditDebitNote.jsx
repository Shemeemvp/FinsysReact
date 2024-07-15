import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import Select from "react-select";

function EditDebitNote() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();
  const { debitNoteId } = useParams();
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [terms, setTerms] = useState([]);
  const [banks, setBanks] = useState([]);
  const [priceLists, setPriceLists] = useState([]);
  const [vendorPriceLists, setVendorPriceLists] = useState([]);
  const [cmpState, setCmpState] = useState("");
  const [vendorValue, setVendorValue] = useState({});

  const fetchDebitNoteData = () => {
    axios
      .get(`${config.base_url}/fetch_debit_note_data/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          let itms = res.data.items;
          let vend = res.data.vendors;
          let trms = res.data.paymentTerms;
          let bnks = res.data.banks;
          let lst = res.data.priceList;
          let vlst = res.data.vendPriceList;
          setCmpState(res.data.state);
          setPriceLists([]);
          setVendorPriceLists([]);
          lst.map((p) => {
            setPriceLists((prevState) => [...prevState, p]);
          });
          vlst.map((c) => {
            setVendorPriceLists((prevState) => [...prevState, c]);
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

          setVendors([]);
          const newVendOptions = vend.map((item) => ({
            label: item.First_name + " " + item.Last_name,
            value: item.id,
          }));
          setVendors(newVendOptions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function fetchPaymentTerms() {
    axios
      .get(`${config.base_url}/fetch_debit_note_data/${ID}/`)
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

  function fetchItems() {
    axios
      .get(`${config.base_url}/fetch_debit_note_data/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          let items = res.data.items;
          setItems([]);
          const newOptions = items.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          setItems(newOptions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchDebitNoteData();
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

  const fetchDebitNoteDetails = () => {
    axios
      .get(`${config.base_url}/fetch_debit_note_details/${debitNoteId}/`)
      .then((res) => {
        if (res.data.status) {
          var cNote = res.data.debitNote;
          var itms = res.data.items;

          var c = {
            value: cNote.Vendor,
            label: res.data.otherDetails.vendorName,
          };
          setVendorValue(c);

          setVendor(cNote.Vendor);
          setEmail(cNote.vendor_email);
          setGstType(cNote.gst_type);
          setGstIn(cNote.gstin);
          setBillingAddress(cNote.billing_address);
          setRefNo(cNote.reference_no);
          setDebitNoteNo(cNote.debit_note_no);
          setDate(cNote.debit_note_date);
          setPlaceOfSupply(cNote.place_of_supply);
          setBillType(cNote.bill_type);
          setBillNumber(cNote.bill_number);
          setPaymentMethod(cNote.payment_method);
          setChequeNumber(cNote.cheque_no);
          setUpiId(cNote.upi_no);
          setAccountNumber(cNote.bank_acc_no);
          setPriceList(cNote.price_list_applied);
          setPriceListId(cNote.price_list);
          setSubTotal(cNote.subtotal);
          setIgst(cNote.igst);
          setCgst(cNote.cgst);
          setSgst(cNote.sgst);
          setTaxAmount(cNote.tax_amount);
          setAdjustment(cNote.adjustment);
          setShippingCharge(cNote.shipping_charge);
          setGrandTotal(cNote.grandtotal);
          setPaid(cNote.paid);
          setBalance(cNote.balance);
          setDescription(cNote.note);
          setDebitNoteItems([]);
          const invItems = itms.map((i, index) => {
            if (i.item_type == "Goods") {
              var hsnSac = i.hsn;
            } else {
              var hsnSac = i.sac;
            }
            return {
              id: index + 1,
              item: i.itemId,
              hsnSac: hsnSac,
              quantity: i.quantity,
              initialItem: i.itemId,
              initialQuantity: i.quantity,
              price: i.purchase_price,
              priceListPrice: i.price,
              taxGst: i.tax,
              taxIgst: i.tax,
              discount: i.discount,
              total: i.total,
              taxAmount: "",
            };
          });

          setDebitNoteItems(invItems);
          refreshIndexes(invItems);

          if (cNote.payment_method != "null") {
            paymentMethodChange(cNote.payment_method);
          }

          getBillNumbersEdit(cNote.bill_type, cNote.bill_number, cNote.Vendor);
          checkTax(res.data.otherDetails.State, cNote.place_of_supply);
          checkPL(cNote.price_list_applied);
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
    fetchDebitNoteDetails();
  }, []);

  var currentDate = new Date();
  var formattedDate = currentDate.toISOString().slice(0, 10);

  const [vendor, setVendor] = useState("");
  const [email, setEmail] = useState("");
  const [gstType, setGstType] = useState("");
  const [gstIn, setGstIn] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [refNo, setRefNo] = useState("");
  const [debitNoteNo, setDebitNoteNo] = useState("");
  const [nextDebitNoteNo, setNextDebitNoteNo] = useState("");
  const [date, setDate] = useState(formattedDate);
  const [billType, setBillType] = useState("");
  const [billNumber, setBillNumber] = useState("");
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

  const [debitNoteItems, setDebitNoteItems] = useState([
    {
      id: 1,
      item: "",
      hsnSac: "",
      quantity: "",
      initialItem: "",
      initialQuantity: "",
      price: "",
      priceListPrice: "",
      taxGst: "",
      taxIgst: "",
      discount: "",
      total: "",
      taxAmount: "",
    },
  ]);

  function getBillNumbersEdit(type, number, vendor) {
    if (type != "" && number != "") {
      var i = {
        Id: ID,
        vendId: vendor,
        billType: type,
        billNum: number,
      };
      axios
        .get(`${config.base_url}/get_bill_numbers_edit/`, { params: i })
        .then((res) => {
          if (res.data.status) {
            var inv = res.data.bills;
            setBillNumbers([]);
            inv.map((i) => {
              setBillNumbers((prevState) => [...prevState, i]);
            });
          } else {
            if (!res.data.status) {
              Swal.fire({
                icon: "error",
                title: `${res.data.message}`,
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
          setBillNumbers([]);
        });
    }
  }

  function handlePriceList(val) {
    setPriceList(val);
    applyPriceListChange(val);
  }

  function handlePriceListIdChange(val) {
    setPriceListId(val);
    // applyPriceList(val);
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
      const updatedItems = debitNoteItems.map((item) => {
        return {
          ...item,
          priceListPrice: "",
        };
      });
      setDebitNoteItems(updatedItems);
      refreshIndexes(updatedItems);
    }
  }

  async function applyPriceList(priceListId) {
    if (priceListId === "") {
      document.getElementById("custPriceListAlert").style.display = "block";
      document.getElementById("custPriceListAlert").innerText =
        "Select a Price List..";
      document.getElementById("custPriceListName").innerText = "";
      setPriceList(false);
      checkPriceList2();
      calc3(debitNoteItems);
    } else {
      let updatedItems = await Promise.all(
        debitNoteItems.map(async (pItem) => {
          var itemId = pItem.item;
          var plc = placeOfSupply;
          var PLId = priceListId;

          if (PLId !== "") {
            if (plc !== "") {
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

              try {
                let res = await axios.get(
                  `${config.base_url}/get_purchase_table_item_data/`,
                  { params: itm }
                );
                if (res.data.status) {
                  var itemData = res.data.itemData;
                  pItem.price = itemData.purchase_rate;
                  pItem.priceListPrice = itemData.PLPrice;
                  pItem.taxGst = itemData.gst;
                  pItem.taxIgst = itemData.igst;
                  pItem.hsnSac = itemData.hsnSac;
                }
              } catch (err) {
                console.log("ERROR", err);
              }
            } else {
              alert("Select Place of Supply.!");
            }
          } else {
            document.getElementById("custPriceListAlert").style.display =
              "block";
            document.getElementById("custPriceListAlert").innerText =
              "Select a Price List..";
            document.getElementById("custPriceListName").innerText = "";
            setPriceList(false);
          }
          return pItem;
        })
      );

      setDebitNoteItems(updatedItems);
      refreshIndexes(updatedItems);
      checkPriceList2();
      refreshTax(placeOfSupply);
      calc3(updatedItems);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Id", ID);
    formData.append("dn_id", debitNoteId);
    formData.append("Vendor", vendor);
    formData.append("vendor_email", email);
    formData.append("billing_address", billingAddress);
    formData.append("gst_type", gstType);
    formData.append("gstin", gstIn);
    formData.append("place_of_supply", placeOfSupply);
    formData.append("reference_no", refNo);
    formData.append("debit_note_no", debitNoteNo);
    formData.append("debit_note_date", date);
    formData.append("bill_type", billType);
    formData.append("bill_number", billNumber);
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
    formData.append("paid", checkForZero(paid));
    formData.append("balance", checkBalanceVal(balance));
    formData.append("note", description);
    formData.append("debitNoteItems", JSON.stringify(debitNoteItems));

    if (file) {
      formData.append("file", file);
    }

    axios
      .put(`${config.base_url}/update_debit_note/`, formData)
      .then((res) => {
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Debit Note Updated",
          });
          navigate(`/view_debit_note/${debitNoteId}/`);
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

  const handleVendorChange = (value) => {
    setVendor(value);
    getVendorData(value);
  };

  function getVendorData(vendor) {
    var cst = {
      Id: ID,
      v_id: vendor,
    };

    if (vendor != "") {
      axios
        .get(`${config.base_url}/get_vendor_data/`, { params: cst })
        .then((res) => {
          if (res.data.status) {
            setBillType("");
            setBillNumbers([]);
            setEmail("");
            setGstType("");
            setGstIn("");
            setBillingAddress("");
            setPlaceOfSupply("");
            var cust = res.data.vendorDetails;
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
      setBillType("");
      setBillNumber("");
    }
  }

  const [billNumbers, setBillNumbers] = useState([]);

  function handleBillTypeChange(val) {
    setBillType(val);
    getBillNumbers(val);
  }

  function getBillNumbers(val) {
    var billType = val;
    var vendorId = vendor;
    if (vendorId != "") {
      if (billType != "") {
        var i = {
          Id: ID,
          vendId: vendor,
          billType: val,
        };
        axios
          .get(`${config.base_url}/get_bill_numbers_edit/`, { params: i })
          .then((res) => {
            if (res.data.status) {
              var inv = res.data.bills;
              setBillNumbers([]);
              inv.map((i) => {
                setBillNumbers((prevState) => [...prevState, i]);
              });
            } else {
              if (!res.data.status) {
                Swal.fire({
                  icon: "error",
                  title: `${res.data.message}`,
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
            setBillNumbers([]);
          });
      } else {
        setBillNumbers([]);
        alert("Select an Bill Type.!");
      }
    } else {
      alert("Select a vendor.!");
      setBillType("");
    }
  }

  function handleBillNumberChange(val) {
    setBillNumber(val);
    getBillItems(val);
  }

  function getBillItems(val) {
    var blType = billType;
    var id = val;
    if (billType != "" && id != "") {
      var data = {
        Id: ID,
        id: val,
        type: blType,
      };

      axios
        .get(`${config.base_url}/get_bill_items/`, { params: data })
        .then((res) => {
          setDebitNoteItems([]);
          if (res.data.status) {
            setPriceList(res.data.priceList);
            setPriceListId(res.data.listId);

            var bill = res.data.billItems;
            const dnItems = bill.map((i, index) => {
              if (i.item_type == "Goods") {
                var hsnSac = i.hsn;
              } else {
                var hsnSac = i.sac;
              }
              var obj = {
                id: index + 1,
                item: i.itemId,
                hsnSac: hsnSac,
                quantity: i.quantity,
                initialItem: i.itemId,
                initialQuantity: i.quantity,
                price: i.purchase_price,
                priceListPrice: i.price,
                taxGst: i.tax,
                taxIgst: i.tax,
                discount: i.discount,
                total: i.total,
                taxAmount: "",
              };
              return obj;
            });
            setDebitNoteItems(dnItems);

            setPaid(res.data.advance);
            setBalance(res.data.balance);
            checkPL(res.data.priceList);
            checkTax(cmpState, placeOfSupply);
            calc4(dnItems, res.data.priceList);
          } else {
            if (!res.data.status) {
              Swal.fire({
                icon: "error",
                title: `${res.data.message}`,
              });

              var o = {
                id: 1,
                item: "",
                hsnSac: "",
                quantity: "",
                initialItem: "",
                initialQuantity: "",
                price: "",
                priceListPrice: "",
                taxGst: "",
                taxIgst: "",
                discount: "",
                total: "",
                taxAmount: "",
              };
              setDebitNoteItems((prevState) => [...prevState, o]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
          setDebitNoteItems([]);
        });
    } else {
      alert("Bill Type and Number Should be selected.");
    }
  }

  function checkPL(priceList) {
    if (priceList) {
      document.querySelectorAll(".price").forEach(function (ele) {
        ele.style.display = "none";
      });
      document.querySelectorAll(".priceListPrice").forEach(function (ele) {
        ele.style.display = "block";
      });
    } else {
      document.querySelectorAll(".price").forEach(function (ele) {
        ele.style.display = "block";
      });
      document.querySelectorAll(".priceListPrice").forEach(function (ele) {
        ele.style.display = "none";
      });
    }
  }

  function checkTax(cmp, plc) {
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
  }

  function handleDebitNoteNoChange(val) {
    setDebitNoteNo(val);
    checkDebitNoteNo(val);
  }

  function checkDebitNoteNo(val) {
    document.getElementById("DNNoErr").innerText = "";
    var cnote_num = val;
    if (cnote_num != "") {
      var s = {
        Id: ID,
        DNNum: cnote_num,
      };
      axios
        .get(`${config.base_url}/check_debit_note_no/`, { params: s })
        .then((res) => {
          console.log("CN NUM Res=", res);
          if (!res.data.status) {
            document.getElementById("DNNoErr").innerText = res.data.message;
          } else {
            document.getElementById("DNNoErr").innerText = "";
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
      initialItem: "",
      initialQuantity: "",
      price: "",
      priceListPrice: "",
      taxGst: "",
      taxIgst: "",
      discount: "",
      total: "",
      taxAmount: "",
    };
    setDebitNoteItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];

      return updatedItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    });
  };

  const removeRow = (id) => {
    setDebitNoteItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);

      return updatedItems.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    });
  };

  const handleDebitNoteItemsInputChange = (id, field, value) => {
    setDebitNoteItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleItemChange = (value, id) => {
    var exists = itemExists(value);
    if (!exists) {
      if (placeOfSupply != "") {
        handleDebitNoteItemsInputChange(id, "item", value);
        getItemData(value, id);
        checkItemName(id, value);
      } else {
        alert("Select Place of Supply.!");
      }
    } else {
      alert(
        "Item already exists in the Debit Note, choose another or change quantity.!"
      );
    }
  };

  function checkItemName(id, val) {
    var itmName = document.getElementById("invItemName" + id).value;
    if (itmName != "" && val != itmName) {
      document.getElementById("invNameErr" + id).innerText = "Item changed.!";
    } else {
      document.getElementById("invNameErr" + id).innerText = "";
    }
  }

  const handleQuantityChange = (id, value) => {
    handleDebitNoteItemsInputChange(id, "quantity", value);
    checkItemQty(id, value);
  };

  function checkItemQty(id, val) {
    var itmQty = document.getElementById("invItemQty" + id).value;
    if (itmQty != "" && val != itmQty) {
      document.getElementById("invQtyErr" + id).innerText =
        "Item Quantity is changed.!";
    } else {
      document.getElementById("invQtyErr" + id).innerText = "";
    }
  }

  const itemExists = (itemToCheck) => {
    for (const item of debitNoteItems) {
      if (item.item === itemToCheck) {
        return true;
      }
    }
    return false;
  };

  function changeItemQty(id, value) {
    var qty = value;
    var avl_val = document.getElementById(`avl${id}`).textContent;

    if (value != "") {
      if (parseInt(qty) > parseInt(avl_val)) {
        alert("Quantity Greater than Available Quantity");
        handleDebitNoteItemsInputChange(id, "quantity", parseInt(avl_val));
        document.getElementById(`qtyspan${id}`).textContent = "0";
      } else {
        document.getElementById(`qtyspan${id}`).textContent =
          parseInt(avl_val) - parseInt(qty);
      }
    } else {
      document.getElementById(`qtyspan${id}`).textContent = avl_val;
    }
  }

  function getItemData(item, id) {
    var exists = itemExists(item);
    var plc = placeOfSupply;
    var PLId = priceListId;

    if (!exists) {
      if (plc != "") {
        if (priceList && PLId == "") {
          handleDebitNoteItemsInputChange(id, "item", "");
          alert("Select a Price List from the dropdown..!");
        } else {
          var itm = {
            Id: ID,
            item: item,
            listId: PLId,
          };

          axios
            .get(`${config.base_url}/get_purchase_table_item_data/`, {
              params: itm,
            })
            .then((res) => {
              console.log("ITEM DATA==", res);
              if (res.data.status) {
                var itemData = res.data.itemData;

                setDebitNoteItems((prevItems) =>
                  prevItems.map((item) =>
                    item.id === id
                      ? {
                          ...item,
                          price: itemData.purchase_rate,
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
        "Item already exists in the Debit Note, choose another or change quantity.!"
      );
    }
  }

  function refreshValues() {
    checkPriceList(priceList);
    refreshTax2();
    calc();
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

  const calc4 = (debitNoteItems, priceList) => {
    const updatedItems = debitNoteItems.map((item) => {
      let qty = parseInt(item.quantity || 0);
      let price = priceList
        ? parseFloat(item.priceListPrice || 0)
        : parseFloat(item.price || 0);
      let dis = parseFloat(item.discount || 0);

      let tax =
        placeOfSupply === cmpState
          ? parseInt(item.taxGst || 0)
          : parseInt(item.taxIgst || 0);

      let total = parseFloat(qty) * parseFloat(price) - parseFloat(dis);
      let taxAmt = (qty * price - dis) * (tax / 100);

      return {
        ...item,
        total: total.toFixed(2),
        taxAmount: taxAmt.toFixed(2),
      };
    });

    calc_total3(updatedItems);
  };

  const calc3 = (debitNoteItems) => {
    const updatedItems = debitNoteItems.map((item) => {
      console.log("CALC3==", item);

      let qty = parseInt(item.quantity || 0);
      let price = priceList
        ? parseFloat(item.priceListPrice || 0)
        : parseFloat(item.price || 0);
      let dis = parseFloat(item.discount || 0);

      let tax =
        placeOfSupply === cmpState
          ? parseInt(item.taxGst || 0)
          : parseInt(item.taxIgst || 0);

      let total = parseFloat(qty) * parseFloat(price) - parseFloat(dis);
      let taxAmt = (qty * price - dis) * (tax / 100);

      return {
        ...item,
        total: total.toFixed(2),
        taxAmount: taxAmt.toFixed(2),
      };
    });

    calc_total(updatedItems);
  };

  function calc2(placeOfSupply) {
    const updatedItems = debitNoteItems.map((item) => {
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
        total: total.toFixed(2),
        taxAmount: taxAmt.toFixed(2),
      };
    });

    setDebitNoteItems(updatedItems);
    refreshIndexes(updatedItems);
    calc_total2(updatedItems, placeOfSupply);
  }

  const calc = () => {
    const updatedItems = debitNoteItems.map((item) => {
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
        total: total.toFixed(2),
        taxAmount: taxAmt.toFixed(2),
      };
    });

    setDebitNoteItems(updatedItems);
    refreshIndexes(updatedItems);
    calc_total(updatedItems);
  };

  function calc_total3(debitNoteItems) {
    var total = 0;
    var taxamount = 0;
    debitNoteItems.map((item) => {
      total += parseFloat(item.total || 0);
    });
    debitNoteItems.map((item) => {
      taxamount += parseFloat(item.taxAmount || 0);
    });
    setSubTotal(total.toFixed(2));
    setTaxAmount(taxamount.toFixed(2));

    var ship = parseFloat(shippingCharge || 0);
    var adj_val = parseFloat(adjustment || 0);
    var gtot = taxamount + total + ship + adj_val;

    setGrandTotal(gtot.toFixed(2));
    splitTax(taxamount, placeOfSupply);
  }

  function calc_total(debitNoteItems) {
    var total = 0;
    var taxamount = 0;
    debitNoteItems.map((item) => {
      total += parseFloat(item.total || 0);
    });
    debitNoteItems.map((item) => {
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

  function calc_total2(debitNoteItems, placeOfSupply) {
    var total = 0;
    var taxamount = 0;
    debitNoteItems.map((item) => {
      total += parseFloat(item.total || 0);
    });
    debitNoteItems.map((item) => {
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
        setBalance(0);
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

  function refreshIndexes(items) {
    const itms = items.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    setDebitNoteItems(itms);
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

  // New Vendor

  // NEW VENDOR

  const [newVendPaymentTerm, setNewVendPaymentTerm] = useState("");
  const [newVendPaymentTermDays, setNewVendPaymentTermDays] = useState("");
  function handleVendPaymentTermModalSubmit(e) {
    e.preventDefault();
    var name = newVendPaymentTerm;
    var dys = newVendPaymentTermDays;
    if (name != "" && dys != "") {
      var u = {
        Id: ID,
        term_name: newVendPaymentTerm,
        days: newVendPaymentTermDays,
      };
      axios
        .post(`${config.base_url}/create_new_company_payment_term/`, u)
        .then((res) => {
          console.log("PTRM RES=", res);
          if (!res.data.status && res.data.message != "") {
            Swal.fire({
              icon: "error",
              title: `${res.data.message}`,
            });
          }
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Term Created",
            });
            fetchPaymentTerms();

            setNewVendPaymentTerm("");
            setNewVendPaymentTermDays("");
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

  const [Vtitle, setVTitle] = useState("Mr");
  const [VfirstName, setVFirstName] = useState("");
  const [VlastName, setVLastName] = useState("");
  const [Vcompany, setVCompany] = useState("");
  const [Vlocation, setVLocation] = useState("");
  const [VplaceOfSupply, setVPlaceOfSupply] = useState("");
  const [VgstType, setVeGstType] = useState("");
  const [VgstIn, setVGstIn] = useState("");
  const [VpanNo, setVPanNo] = useState("");
  const [VoBalType, setVOBalType] = useState("");
  const [VoBal, setVOBal] = useState("");
  const [VcreditLimit, setVCreditLimit] = useState("");
  const [VpaymentTerm, setVPaymentTerm] = useState("");
  const [VpriceList, setVPriceList] = useState("");
  const [Vmail, setVEmail] = useState("");
  const [Vwebsite, setVWebsite] = useState("");
  const [Vmobile, setVMobile] = useState("");
  const [Vcurrency, setVCurrency] = useState("");
  const [VbStreet, setVBStreet] = useState("");
  const [VbCity, setVBCity] = useState("");
  const [VbState, setVBState] = useState("");
  const [VbPincode, setVBPincode] = useState("");
  const [VbCountry, setVBCountry] = useState("");
  const [VsStreet, setVSStreet] = useState("");
  const [VsCity, setVSCity] = useState("");
  const [VsState, setVSState] = useState("");
  const [VsPincode, setVSPincode] = useState("");
  const [VsCountry, setVSCountry] = useState("");

  const add_vendor_new = (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
      Title: Vtitle,
      Firstname: VfirstName,
      Lastname: VlastName,
      Company: Vcompany,
      Location: Vlocation,
      Email: Vmail,
      Website: Vwebsite,
      Mobile: Vmobile,
      Gsttype: VgstType,
      Gstno: VgstIn,
      Panno: VpanNo,
      Placeofsupply: VplaceOfSupply,
      Currency: Vcurrency,
      Openingbalance: VoBal,
      Openingbalatype: VoBalType,
      Creditlimit: VcreditLimit,
      Payment: VpaymentTerm,
      Billingstreet: VbStreet,
      Billingcity: VbCity,
      Billingcountry: VbCountry,
      Billingstate: VbState,
      Billingpin: VbPincode,
      Shipstreet: VsStreet,
      Shipcity: VsCity,
      Shipstate: VsState,
      Shippin: VsPincode,
      Shipcountry: VsCountry,
      status: "Active",
    };

    axios
      .post(`${config.base_url}/add_vendor_new/`, dt)
      .then((res) => {
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Vendor Added",
          });
          fetchDebitNoteData();
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

  function VplaceShipAddress() {
    var chkbtn = document.getElementById("vendShipAddress");
    if (chkbtn.checked == true) {
      setVSStreet(VbStreet);
      setVSCity(VbCity);
      setVSPincode(VbPincode);
      setVSCountry(VbCountry);
      setVSState(VbState);
    } else {
      setVSStreet("");
      setVSCity("");
      setVSPincode("");
      setVSCountry("");
      setVSState("");
    }
  }

  function checkVLastName() {
    var fName = VfirstName.replace(/\d/g, "");
    var lName = VlastName.replace(/\d/g, "");
    if (fName != "" && lName != "") {
      checkVendorName(fName, lName);
    } else {
      alert("Please enter a valid Full Name.!");
      return false;
    }
  }
  function checkVFirstName() {
    var fName = VfirstName.replace(/\d/g, "");
    var lName = VlastName.replace(/\d/g, "");
    if (fName != "" && lName != "") {
      checkVendorName(fName, lName);
    } else if (fName == "" && lName != "") {
      alert("Please enter a valid First Name.!");
    }
  }

  function checkVendorName(fname, lname) {
    if (fname != "" && lname != "") {
      var u = {
        Id: ID,
        fName: fname,
        lName: lname,
      };
      axios
        .get(`${config.base_url}/check_vend_name/`, { params: u })
        .then((res) => {
          console.log(res);
          if (res.data.is_exist) {
            Swal.fire({
              icon: "error",
              title: `${res.data.message}`,
            });
          }
        })
        .catch((err) => {
          console.log("ERROR=", err);
          if (!err.response.data.status && err.response.data.message) {
            Swal.fire({
              icon: "error",
              title: `${err.response.data.message}`,
            });
          }
        });
    }
  }

  function checkVendorGSTIN(gstin) {
    var gstNo = gstin;
    if (gstNo != "") {
      var u = {
        Id: ID,
        gstin: gstNo,
      };
      axios
        .get(`${config.base_url}/check_vgstin/`, { params: u })
        .then((res) => {
          console.log(res);
          if (res.data.is_exist) {
            Swal.fire({
              icon: "error",
              title: `${res.data.message}`,
            });
          }
        })
        .catch((err) => {
          console.log("ERROR=", err);
          if (!err.response.data.status && err.response.data.message) {
            Swal.fire({
              icon: "error",
              title: `${err.response.data.message}`,
            });
          }
        });
    }
  }

  function checkVendorPAN(pan) {
    var panNo = pan;
    if (panNo != "") {
      var u = {
        Id: ID,
        pan: panNo,
      };
      axios
        .get(`${config.base_url}/check_vpan/`, { params: u })
        .then((res) => {
          console.log(res);
          if (res.data.is_exist) {
            Swal.fire({
              icon: "error",
              title: `${res.data.message}`,
            });
          }
        })
        .catch((err) => {
          console.log("ERROR=", err);
          if (!err.response.data.status && err.response.data.message) {
            Swal.fire({
              icon: "error",
              title: `${err.response.data.message}`,
            });
          }
        });
    }
  }

  function checkVendorPhone(phone) {
    var phoneNo = phone;
    if (phoneNo != "") {
      var u = {
        Id: ID,
        phone: phoneNo,
      };
      axios
        .get(`${config.base_url}/check_vphone/`, { params: u })
        .then((res) => {
          console.log(res);
          if (res.data.is_exist) {
            Swal.fire({
              icon: "error",
              title: `${res.data.message}`,
            });
          }
        })
        .catch((err) => {
          console.log("ERROR=", err);
          if (!err.response.data.status && err.response.data.message) {
            Swal.fire({
              icon: "error",
              title: `${err.response.data.message}`,
            });
          }
        });
    }
  }

  function checkVendorEmail(email) {
    var custEmail = email;
    if (custEmail != "") {
      var u = {
        Id: ID,
        email: custEmail,
      };
      axios
        .get(`${config.base_url}/check_vemail/`, { params: u })
        .then((res) => {
          console.log(res);
          if (res.data.is_exist) {
            Swal.fire({
              icon: "error",
              title: `${res.data.message}`,
            });
          }
        })
        .catch((err) => {
          console.log("ERROR=", err);
          if (!err.response.data.status && err.response.data.message) {
            Swal.fire({
              icon: "error",
              title: `${err.response.data.message}`,
            });
          }
        });
    }
  }

  function handleVGstType(value) {
    setVeGstType(value);
    checkVGstType(value);
  }

  function checkVGstType(value) {
    var gstINElement = document.getElementById("vendGstIN");
    var gstRowElements = document.getElementsByClassName("gstrow");

    var x = value;
    if (x === "Unregistered Business" || x === "Overseas" || x === "Consumer") {
      Array.prototype.forEach.call(gstRowElements, function (element) {
        element.classList.remove("d-block");
        element.classList.add("d-none");
      });
      gstINElement.required = false;
    } else {
      gstINElement.required = true;
      Array.prototype.forEach.call(gstRowElements, function (element) {
        element.classList.remove("d-none");
        element.classList.add("d-block");
      });
    }
  }

  function checkvgst(val) {
    var gstinput = val;
    var gstregexp =
      "[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}";

    if (gstinput.length === 15) {
      if (gstinput.match(gstregexp)) {
        document.getElementById("warnvgst").innerHTML = "";
        checkVendorGSTIN(val);
      } else {
        document.getElementById("warnvgst").innerHTML =
          "Please provide a valid GST Number";
        alert("Please provide a valid GST Number");
      }
    } else {
      document.getElementById("warnvgst").innerHTML =
        "Please provide a valid GST Number";
      alert("Please provide a valid GST Number");
    }
  }

  function checkvpan(val) {
    var paninput = val;
    var panregexp = ["[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}"];
    if (val != "") {
      if (paninput.match(panregexp)) {
        document.getElementById("warnvpan").innerHTML = "";
        checkVendorPAN(val);
      } else {
        document.getElementById("warnvpan").innerHTML =
          "Please provide a valid PAN Number";
        alert("Please provide a valid PAN Number");
      }
    }
  }

  function checkvweb(val) {
    var webinput = val;
    var webregexp = "www.";
    if (val != "") {
      if (webinput.startsWith(webregexp)) {
        document.getElementById("warnvweb").innerHTML = "";
      } else {
        document.getElementById("warnvweb").innerHTML =
          "Please provide a valid Website Address";
        alert("Please provide a valid Website Address");
      }
    }
  }

  function checkvphone(val) {
    var phoneinput = val;
    var phoneregexp = /^\d{10}$/;
    if (val != "") {
      if (phoneinput.match(phoneregexp)) {
        document.getElementById("warnvphone").innerHTML = "";
        checkVendorPhone(val);
      } else {
        document.getElementById("warnvphone").innerHTML =
          "Please provide a valid Phone Number";
        alert("Please provide a valid Phone Number");
      }
    }
  }

  function checkvemail(val) {
    var emailinput = val;
    var emailregexp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (val != "") {
      if (emailinput.match(emailregexp)) {
        //   document.getElementById("warnemail").innerHTML = "";
        checkVendorEmail(val);
      } else {
        //   document.getElementById("warnemail").innerHTML =
        //     "Please provide a valid Email ID";
        alert("Please provide a valid Email id");
      }
    }
  }

  function setVOpeningBalanceValue(value) {
    var openbal = value;
    if (VoBalType == "credit") {
      if (openbal.slice(0, 1) != "-") {
        if (parseFloat(openbal) != 0) {
          setVOBal(-1 * openbal);
        } else {
          setVOBal(openbal);
        }
      } else {
        if (parseFloat(openbal) != 0) {
          setVOBal(openbal);
        } else {
          setVOBal(-1 * parseFloat(openbal));
        }
      }
    } else {
      setVOBal(openbal);
    }
  }

  function handleVOpenBalType(val) {
    setVOBalType(val);
    changeVOpenBalType(val);
  }

  function changeVOpenBalType(type) {
    var openbal = VoBal;
    if (openbal != "") {
      if (type == "credit") {
        if (parseFloat(openbal) != 0) {
          setVOBal(-1 * openbal);
        } else {
          setVOBal(openbal);
        }
      } else {
        if (parseFloat(openbal) < 0) {
          setVOBal(Math.abs(openbal));
        } else {
          setVOBal(openbal);
        }
      }
    }
  }

  // New Item

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

  const handleItemModalSubmit = (e) => {
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
          fetchItems();
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

  const [newUnit, setNewUnit] = useState("");
  function handleUnitModalSubmit(e) {
    e.preventDefault();
    var name = newUnit;
    if (name != "") {
      var u = {
        Id: ID,
        name: newUnit,
      };
      axios
        .post(`${config.base_url}/create_new_unit/`, u)
        .then((res) => {
          console.log("UNIT RES=", res);
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Unit Created",
            });
            fetchItemUnits();
            setUnit(u.name);
            setNewUnit("");
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

  function accountTypeChange(val) {
    var selectElement = document.getElementById("Account_type");
    // var selectedValue = selectElement.value;
    var selectedValue = val;
    var Acnt_desc = document.getElementById("acnt-desc");
    var acctype = document.getElementById("acctype");

    switch (selectedValue) {
      case "Expense":
        Acnt_desc.innerHTML = `
                <b>Expense</b> <br>Reflects expenses incurred for running normal business operations, such as :<br/>
                <ul>
                    <li>1.Advertisements and Marketing</li>
                    <li>2.Business Travel Expenses</li>
                    <li>3.License Fees</li>
                    <li>4.Utility Expenses</li>
                </ul>`;
        acctype.value = "Expense";
        break;
      case "Cost Of Goods Sold":
        Acnt_desc.innerHTML = `
                <b>Expense</b> <br>This indicates the direct costs attributable to the production of the goods sold by a company such as:<br/>
                <ul>
                    <li>1.Material and Labor costs</li>
                    <li>2.Cost of obtaining raw materials</li>
                </ul>`;
        acctype.value = "Expense";
        break;
      case "Other Expense":
        Acnt_desc.innerHTML = `
                <b>Expense</b> <br>Track miscellaneous expenses incurred for activities other than primary business operations or create additional accounts to track default expenses like insurance or contribution towards charity.<br/>`;
        acctype.value = "Expense";
        break;

      default:
        Acnt_desc.innerHTML = `<b>Account Type</b> <br>Select an account type..<br/>`;
    }

    if (selectedValue != "") {
      document.getElementById("subAccountCheck").style.display = "none";
      document.getElementById("subAccountCheckBox").checked = false;
      document.getElementById("parentAccountValue").style.display = "none";

      var a = {
        Id: ID,
        type: selectedValue,
      };
      console.log("ACC DATA==", a);
      axios
        .get(`${config.base_url}/check_accounts/`, { params: a })
        .then((res) => {
          console.log("P ACC==", res);
          if (res.data.status) {
            document.getElementById("subAccountCheck").style.display = "block";
            var pAcc = res.data.accounts;
            setParentAccounts([]);
            pAcc.map((i) => {
              setParentAccounts((prevState) => [...prevState, i]);
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
    }
  }

  function showParentAccounts() {
    var parentAccountValue = document.getElementById("parentAccountValue");
    var parentAccount = document.getElementById("parentAccount");

    if (document.getElementById("subAccountCheckBox").checked) {
      setSubAcc(true);
      parentAccountValue.style.display = "block";
      parentAccount.required = true;
    } else {
      setSubAcc(false);
      parentAccountValue.style.display = "none";
      parentAccount.required = false;
    }
  }

  const [accType, setAccType] = useState("Expense");
  const [accName, setAccName] = useState("");
  const [parentAccount, setParentAccount] = useState("");
  const [subAcc, setSubAcc] = useState(false);
  const [accCode, setAccCode] = useState("");
  const [accDesc, setAccDesc] = useState("");
  const [parentAccounts, setParentAccounts] = useState([]);

  function setAccData() {
    var Acnt_desc = document.getElementById("acnt-desc");
    Acnt_desc.innerHTML = `
        <b>Expense</b> <br>Reflects expenses incurred for running normal business operations, such as :<br/>
        <ul>
            <li>1.Advertisements and Marketing</li>
            <li>2.Business Travel Expenses</li>
            <li>3.License Fees</li>
            <li>4.Utility Expenses</li>
        </ul>`;
    var selectedValue = accType;
    var a = {
      Id: ID,
      type: selectedValue,
    };
    axios
      .get(`${config.base_url}/check_accounts/`, { params: a })
      .then((res) => {
        console.log("P ACC==", res);
        if (res.data.status) {
          document.getElementById("subAccountCheck").style.display = "block";
          var pAcc = res.data.accounts;
          setParentAccounts([]);
          pAcc.map((i) => {
            setParentAccounts((prevState) => [...prevState, i]);
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
  }

  useEffect(() => {
    setAccData();
  }, []);

  function handleAccountTypeChange(value) {
    setAccType(value);
    accountTypeChange(value);
  }

  function handleNewAccSubmit(e) {
    e.preventDefault();
    var ac = {
      Id: ID,
      account_type: accType,
      account_name: accName,
      account_code: accCode,
      description: accDesc,
      sub_account: subAcc,
      parent_account: parentAccount,
    };
    if (subAcc && parentAccount == "") {
      alert("Select a parent account.!");
      return;
    }
    if (accName != "" && accType != "") {
      axios
        .post(`${config.base_url}/create_new_account_from_items/`, ac)
        .then((res) => {
          console.log("ACC RES=", res);
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "Account Created",
            });
            fetchPurchaseAccounts();
            setPurchaseAccount(ac.account_name);
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
      alert("Account name or Type cannot be blank.!");
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
          <Link to={`/view_debit_note/${debitNoteId}/`}>
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
                <h2 className="mt-3">EDIT DEBIT NOTE</h2>
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
          <div className="card radius-15" style={{ minWidth: "100%" }}>
            <div className="card-body">
              <div id="salesOrder">
                <div className="row">
                  <div className="col-md-4 mt-3">
                    <label className="">Select Vendor</label>
                    <div className="d-flex align-items-center">
                      <Select
                        options={vendors}
                        styles={customStyles}
                        name="vendor"
                        className="w-100"
                        id="vendor"
                        required
                        value={vendorValue || null}
                        onChange={(selectedOption) =>
                          handleVendorChange(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        isClearable
                        isSearchable
                      />
                      <button
                        type="button"
                        data-toggle="modal"
                        data-target="#newVendor"
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
                      <label className="">Debit Note No.</label>
                      <span className="text-danger ml-3" id="DNNoErr"></span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      name="debit_note_no"
                      id="creditNoteNumber"
                      value={debitNoteNo}
                      onChange={(e) => handleDebitNoteNoChange(e.target.value)}
                      style={{ backgroundColor: "#43596c" }}
                      placeholder={nextDebitNoteNo}
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
                    <label className="">Debit Note Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="debit_note_date"
                      id="creditNoteDate"
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div className="col-md-4 mt-3">
                    <label className="">Bill Type</label>
                    <select
                      type="text"
                      className="form-control"
                      id="billType"
                      name="bill_type"
                      value={billType}
                      onChange={(e) => handleBillTypeChange(e.target.value)}
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      required
                    >
                      <option value="" selected disabled>
                        Select Bill Type
                      </option>
                      <option value="Bill">Bill</option>
                      <option value="Recurring Bill">Recurring Bill</option>
                    </select>
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="">Bill Number </label>
                    <select
                      className="form-control"
                      value={billNumber}
                      onChange={(e) => handleBillNumberChange(e.target.value)}
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      id="billNumber"
                    >
                      <option value="" selected>
                        Select Bill Number
                      </option>
                      {billNumbers &&
                        billNumbers.map((i) => (
                          <option value={i.number}>{i.number}</option>
                        ))}
                    </select>
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
                        onBlur={calc}
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
                        onBlur={(e) => applyPriceList(e.target.value)}
                      >
                        <option value="" disabled>
                          Choose Price List
                        </option>
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
                      id="creditNoteItemsTable"
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
                        {debitNoteItems.map((row) => {
                          const selectedOptionI = items.find(
                            (option) => option.value === row.item
                          );

                          return (
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
                                    value={selectedOptionI || null}
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
                                <input
                                  type="hidden"
                                  id={`invItemName${row.id}`}
                                  value={row.initialItem}
                                />
                                <span
                                  id={`invNameErr${row.id}`}
                                  className="text-danger"
                                  style={{
                                    fontSize: "0.8rem",
                                    display: "block",
                                    width: "max-content",
                                  }}
                                ></span>
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
                                    handleQuantityChange(row.id, e.target.value)
                                  }
                                  onBlur={refreshValues}
                                  required
                                />
                                <input
                                  type="hidden"
                                  id={`invItemQty${row.id}`}
                                  value={row.initialQuantity}
                                />
                                <span
                                  id={`invQtyErr${row.id}`}
                                  className="text-danger"
                                  style={{
                                    fontSize: "0.8rem",
                                    display: "block",
                                    width: "max-content",
                                  }}
                                ></span>
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
                                    handleDebitNoteItemsInputChange(
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
                                    handleDebitNoteItemsInputChange(
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
                                    handleDebitNoteItemsInputChange(
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
                          );
                        })}
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
                    id="creditNoteItemsTableTotal"
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
                    id="creditNoteItemsTablePaid"
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
                      value="Save"
                      style={{ height: "fit-content" }}
                    />
                    <input
                      type="reset"
                      className="btn btn-outline-secondary w-50 ml-1 text-light"
                      onClick={() =>
                        navigate(`/view_debit_note/${debitNoteId}/`)
                      }
                      value="Cancel"
                      style={{ height: "fit-content" }}
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
                  Debit Note was created on a computer and is valid without the
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

      {/* <!-- New Vend Payment Term Modal --> */}

      <div className="modal fade" id="newVendorPaymentTerm">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">New Vendor Payment Term</h5>
              <button
                type="button"
                className="close"
                data-toggle="modal"
                data-dismiss="modal"
                data-target="#newVendor"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body w-100">
              <div className="card p-3">
                <form
                  method="post"
                  id="newVendorPaymentTermForm"
                  onSubmit={handleVendPaymentTermModalSubmit}
                >
                  <div className="row mt-2 w-100">
                    <div className="col-6">
                      <label for="name">Term Name</label>
                      <input
                        type="text"
                        name="term_name"
                        value={newVendPaymentTerm}
                        onChange={(e) => setNewVendPaymentTerm(e.target.value)}
                        id="custTermName"
                        className="form-control w-100"
                      />
                    </div>
                    <div className="col-6">
                      <label for="name">Days</label>
                      <input
                        type="number"
                        name="days"
                        id="custTermDays"
                        className="form-control w-100"
                        min="0"
                        value={newVendPaymentTermDays}
                        onChange={(e) =>
                          setNewVendPaymentTermDays(e.target.value)
                        }
                        step="1"
                      />
                    </div>
                  </div>
                  <div className="row mt-4 w-100">
                    <div className="col-4"></div>
                    <div className="col-4 d-flex justify-content-center">
                      <button
                        className="btn btn-outline-secondary text-grey w-75"
                        onClick={handleVendPaymentTermModalSubmit}
                        data-toggle="modal"
                        data-target="#newVendor"
                        type="button"
                        id="saveVendorPaymentTerm"
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

      {/* Add Vendor */}
      <div className="modal fade" id="newVendor">
        <div className="modal-dialog modal-xl">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">New Vendor</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="card p-3">
                <form method="post" id="newVendorForm" className="px-1">
                  <div className="row mt-3">
                    <div
                      className="col-md-3"
                      style={{ position: "relative", right: "20px" }}
                    >
                      <label for="vendTitle">Title</label>
                      <select
                        name="vendTitle"
                        id="vendTitle"
                        className="form-control"
                        style={{ backgroundColor: "#43596c", width: "240px" }}
                        value={Vtitle}
                        onChange={(e) => setVTitle(e.target.value)}
                      >
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                      </select>
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div
                      className="col-md-3"
                      style={{ position: "relative", right: "10px" }}
                    >
                      <label for="vendFirstName">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="vendFirstName"
                        name="first_name"
                        required
                        style={{
                          backgroundColor: "#43596c",
                          color: "white",
                          width: "240px",
                        }}
                        value={VfirstName}
                        onChange={(e) => setVFirstName(e.target.value)}
                        onBlur={checkVFirstName}
                      />
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div className="col-md-3">
                      <label for="vendLastName">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="vendLastName"
                        name="last_name"
                        required
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        value={VlastName}
                        onChange={(e) => setVLastName(e.target.value)}
                        onBlur={checkVLastName}
                      />
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div className="col-md-3">
                      <label for="vendCompanyName">Company</label>
                      <input
                        type="text"
                        className="form-control"
                        id="vendCompanyName"
                        name="company_name"
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        value={Vcompany}
                        onChange={(e) => setVCompany(e.target.value)}
                      />
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div
                      className="col-md-3"
                      style={{ position: "relative", right: "20px" }}
                    >
                      <label for="vendLocation">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        id="vendLocation"
                        name="vendLocation"
                        style={{
                          backgroundColor: "#43596c",
                          color: "white",
                          width: "240px",
                        }}
                        value={Vlocation}
                        onChange={(e) => setVLocation(e.target.value)}
                      />
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div
                      className="col-md-3"
                      style={{ position: "relative", right: "10px" }}
                    >
                      <label for="vendEmail">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        id="vendEmail"
                        name="email"
                        style={{
                          backgroundColor: "#43596c",
                          color: "white",
                          width: "240px",
                        }}
                        placeholder="accuhub@gmail.com"
                        value={Vmail}
                        onChange={(e) => setVEmail(e.target.value)}
                        onBlur={(e) => checkvemail(e.target.value)}
                      />
                      <div className="invalid-feedback">
                        Please provide a valid Email
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label for="vendWebsite">Website</label>
                      <input
                        type="text"
                        className="form-control"
                        id="vendWebsite"
                        placeholder="www.accuhub.com"
                        name="website"
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        value={Vwebsite}
                        onChange={(e) => setVWebsite(e.target.value)}
                        onBlur={(e) => checkvweb(e.target.value)}
                      />
                      <div id="warnvweb" className="text-danger"></div>
                    </div>
                    <div className="col-md-3">
                      <label for="vendMobile">Mobile</label>
                      <input
                        type="text"
                        className="form-control"
                        id="vendMobile"
                        required
                        name="mobile"
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        value={Vmobile}
                        onChange={(e) => setVMobile(e.target.value)}
                        onBlur={(e) => checkvphone(e.target.value)}
                      />
                      <div className="text-danger m-2" id="warnvphone"></div>
                    </div>
                  </div>

                  <hr />
                  <h4>Other Options</h4>
                  <hr />

                  <div className="row mt-3">
                    <div className="col-md-3">
                      <label for="vendGstType">GST Type</label>
                      <select
                        className="form-control"
                        id="vendGstType"
                        name="gst_type"
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        required
                        value={VgstType}
                        onChange={(e) => handleVGstType(e.target.value)}
                      >
                        <option selected value="">
                          Select GST Type
                        </option>
                        <option value="Registered Business - Regular">
                          Registered Business - Regular{" "}
                          <span>
                            <i>(Business that is registered under gst)</i>
                          </span>
                        </option>
                        <option value="Registered Business - Composition">
                          Registered Business - Composition (Business that is
                          registered under composition scheme in gst)
                        </option>
                        <option value="Unregistered Business">
                          Unregistered Business (Business that has not been
                          registered under gst)
                        </option>
                        <option value="Overseas">
                          Overseas (Import/Export of supply outside india)
                        </option>
                        <option value="Consumer">Consumer</option>
                        <option value="Special Economic Zone (SEZ)">
                          Special Economic Zone (SEZ) (Business that is located
                          in a special economic zone of india or a SEZ
                          developer)
                        </option>
                        <option value="Demed Exports">
                          Demed Exports (Supply of woods to an exports oriented
                          unit or againsed advanced authorization or export
                          promotion capital woods)
                        </option>
                        <option value="Tax Deductor">
                          Tax Deductor (State of central gov,government agencies
                          or local authority)
                        </option>
                        <option value="SEZ Developer">
                          SEZ Developer (A person or organization who owns
                          atleast 26% equality in creating business units in
                          special economic zone)
                        </option>
                      </select>
                      <div className="invalid-feedback">
                        Please select a valid registration type.
                      </div>
                    </div>

                    <div className="col-md-3 gstrow d-block" id="vgstInValue">
                      <div>
                        <label for="vendGstIN">GSTIN</label>
                        <input
                          type="text"
                          className="form-control"
                          id="vendGstIN"
                          name="vendGstIN"
                          style={{ backgroundColor: "#43596c", color: "white" }}
                          placeholder="29APPCK7465F1Z1"
                          value={VgstIn}
                          onChange={(e) => setVGstIn(e.target.value)}
                          onBlur={(e) => checkvgst(e.target.value)}
                        />
                        <a
                          data-toggle="modal"
                          href="#exampleModal"
                          style={{ color: "#3dd5f3" }}
                        >
                          Get Taxpayer Details
                        </a>
                        <div className="text-danger m-2" id="warnvgst"></div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <label for="vendPanNo">PAN No.</label>
                      <input
                        type="text"
                        className="form-control"
                        id="vendPanNo"
                        name="pan_no"
                        style={{
                          backgroundColor: "#43596c",
                          color: "white",
                          width: "240px",
                        }}
                        required
                        placeholder="APPCK7465F"
                        value={VpanNo}
                        onChange={(e) => setVPanNo(e.target.value)}
                        onBlur={(e) => checkvpan(e.target.value)}
                      />
                      <div className="text-danger m-2" id="warnvpan"></div>
                    </div>

                    <div className="col-md-3">
                      <label for="vendPlaceOfSupply">Place of Supply</label>
                      <select
                        className="custom-select form-control"
                        id="vendPlaceOfSupply"
                        name="place_of_supply"
                        style={{
                          backgroundColor: "#43596c",
                          color: "white",
                          width: "220px",
                        }}
                        required
                        value={VplaceOfSupply}
                        onChange={(e) => setVPlaceOfSupply(e.target.value)}
                      >
                        <option selected value="">
                          Select Place of Supply
                        </option>
                        <option value="Andaman and Nicobar Islads">
                          Andaman and Nicobar Islands
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
                        <option value="Himachal Predesh">
                          Himachal Predesh
                        </option>
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
                      <div className="invalid-feedback">
                        Please select a valid registration type.
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-3 mt-3">
                      <label for="">Currency</label>
                      <select
                        name="vendCurrency"
                        id="vendCurrency"
                        className="form-control"
                        style={{ backgroundColor: "#43596c", width: "240px" }}
                        value={Vcurrency}
                        onChange={(e) => setVCurrency(e.target.value)}
                      >
                        <option value="INR - Indian Rupee">
                          INR - Indian Rupee
                        </option>
                      </select>
                    </div>

                    <div className="col-md-3 mt-3">
                      <label for="">Opening Balance</label>
                      <div className="d-flex">
                        <select
                          name="balance_type"
                          id="vend_bal_type"
                          className="form-select text-white mr-1"
                          style={{
                            backgroundColor: "#243e54",
                            width: "100px",
                            borderRadius: "5px",
                          }}
                          value={VoBalType}
                          onChange={(e) => handleVOpenBalType(e.target.value)}
                        >
                          <option value="credit">Credit</option>
                          <option value="debit">Debit</option>
                        </select>
                        <input
                          type="text"
                          className="form-control"
                          name="open_balance"
                          id="vendopenbalance"
                          step="any"
                          style={{
                            backgroundColor: "#43596c",
                            color: "white",
                            width: "145px",
                          }}
                          value={VoBal}
                          onChange={(e) => setVOBal(e.target.value)}
                          onBlur={(e) =>
                            setVOpeningBalanceValue(e.target.value)
                          }
                        />
                        <div className="text-danger m-2"></div>
                      </div>
                    </div>

                    <div className="col-md-3 mt-3">
                      <label for="vendCreditLimit">Credit Limit</label>
                      <input
                        type="text"
                        className="form-control"
                        name="credit_limit"
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        step="any"
                        id="vendCreditLimit"
                        value={VcreditLimit}
                        onChange={(e) => setVCreditLimit(e.target.value)}
                      />
                      <div className="text-danger m-2"></div>
                    </div>

                    <div className="col-md-3 mt-3">
                      <label for="vendPaymentTerms">Payment Terms</label>
                      <div className="d-flex">
                        <select
                          name="payment_terms"
                          id="vendPaymentTerms"
                          className="form-control"
                          style={{ backgroundColor: "#43596c", width: "180px" }}
                          onChange={(e) => setVPaymentTerm(e.target.value)}
                          value={VpaymentTerm}
                        >
                          <option value="" selected>
                            Choose
                          </option>
                          {terms &&
                            terms.map((term) => (
                              <option value={term.id} text={term.days}>
                                {term.term_name}
                              </option>
                            ))}
                        </select>
                        <a
                          href="#newVendorPaymentTerm"
                          data-dismiss="modal"
                          data-toggle="modal"
                          className="btn btn-outline-secondary ml-1"
                          style={{
                            width: "40px",
                            height: "38px",
                            position: "relative",
                            bottom: "10px",
                          }}
                        >
                          +
                        </a>
                      </div>
                    </div>

                    <div className="col-md-3 mt-3">
                      <label for="vendPriceList">Price List</label>
                      <select
                        name="price_list"
                        id="vendPriceList"
                        className="form-control"
                        style={{ backgroundColor: "#43596c", width: "240px" }}
                        value={VpriceList}
                        onChange={(e) => setVPriceList(e.target.value)}
                      >
                        <option value="" selected>
                          Choose
                        </option>
                        {vendorPriceLists.map((l) => (
                          <option value={l.id}>{l.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <hr />
                  <div className="row mt-5">
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-12 card-title">
                          <h5 className="mb-0">Billing Address</h5>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 mt-3">
                          <div className="form-row">
                            <label htmlFor="street">Street</label>
                            <textarea
                              className="form-control street"
                              required
                              id="vstreet"
                              name="vstreet"
                              value={VbStreet}
                              onChange={(e) => setVBStreet(e.target.value)}
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                            />
                            <div className="invalid-feedback">
                              Please provide a valid Street
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mt-3">
                          <div className="form-row">
                            <label htmlFor="city">City</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              id="vcity"
                              value={VbCity}
                              onChange={(e) => setVBCity(e.target.value)}
                              name="vcity"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              placeholder="City"
                            />
                            <div className="invalid-feedback">
                              Please provide a valid City
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mt-3">
                          <div className="form-row">
                            <label for="vendstate">State</label>
                            <select
                              type="text"
                              className="form-control"
                              id="vstate"
                              name="vstate"
                              required
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              value={VbState}
                              onChange={(e) => setVBState(e.target.value)}
                            >
                              <option value="" selected hidden>
                                Choose
                              </option>
                              <option value="Andaman and Nicobar Islads">
                                Andaman and Nicobar Islands
                              </option>
                              <option value="Andhra Predhesh">
                                Andhra Predhesh
                              </option>
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
                              <option value="Damn anad Diu">
                                Damn anad Diu
                              </option>
                              <option value="Delhi">Delhi</option>
                              <option value="Goa">Goa</option>
                              <option value="Gujarat">Gujarat</option>
                              <option value="Haryana">Haryana</option>
                              <option value="Himachal Predesh">
                                Himachal Predesh
                              </option>
                              <option value="Jammu and Kashmir">
                                Jammu and Kashmir
                              </option>
                              <option value="Jharkhand">Jharkhand</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Kerala">Kerala</option>
                              <option value="Ladakh">Ladakh</option>
                              <option value="Lakshadweep">Lakshadweep</option>
                              <option value="Madhya Predesh">
                                Madhya Predesh
                              </option>
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
                              <option value="Uttar Predesh">
                                Uttar Predesh
                              </option>
                              <option value="Uttarakhand">Uttarakhand</option>
                              <option value="West Bengal">West Bengal</option>
                              <option value="Other Territory">
                                Other Territory
                              </option>
                            </select>
                            <div className="invalid-feedback">
                              Please provide a valid State
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mt-3">
                          <div className="form-row">
                            <label for="vpinco">Pin Code</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              id="vpinco"
                              name="vpincode"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              placeholder="PIN code"
                              value={VbPincode}
                              onChange={(e) => setVBPincode(e.target.value)}
                            />
                            <div className="invalid-feedback">
                              Please provide a valid Pin Code
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mt-3">
                          <div className="form-row">
                            <label for="vcountry">Country</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              id="vcountry"
                              name="vcountry"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              placeholder="Country"
                              value={VbCountry}
                              onChange={(e) => setVBCountry(e.target.value)}
                            />
                            <div className="invalid-feedback">
                              Please provide a valid Country
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-12 d-flex">
                          <h5>Shipping Address</h5>
                          <input
                            className="ml-4 ml-5"
                            type="checkbox"
                            id="vendShipAddress"
                            name="ship_address"
                            onClick={VplaceShipAddress}
                          />
                          <label
                            className="ml-2 mt-1 ml-2"
                            for="vendShipAddress"
                          >
                            Same As Billing Address
                          </label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 mt-3">
                          <div className="form-row">
                            <label htmlFor="shipstreet">Street</label>
                            <textarea
                              className="form-control"
                              id="vshipstreet"
                              name="shipstreet"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              value={VsStreet}
                              onChange={(e) => setVSStreet(e.target.value)}
                            />
                            <div className="invalid-feedback">
                              Please provide a valid Street
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mt-3">
                          <div className="form-row">
                            <label htmlFor="shipcity">City</label>
                            <input
                              type="text"
                              className="form-control"
                              id="vshipcity"
                              name="shipcity"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              placeholder="City"
                              value={VsCity}
                              onChange={(e) => setVSCity(e.target.value)}
                            />
                            <div className="invalid-feedback">
                              Please provide a valid City
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mt-3">
                          <div className="form-row">
                            <label for="vendshipstate">State</label>
                            <select
                              type="text"
                              className="form-control"
                              id="vshipState"
                              name="vendshipstate"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              value={VsState}
                              onChange={(e) => setVSState(e.target.value)}
                            >
                              <option value="" selected>
                                Choose
                              </option>
                              <option value="Andaman and Nicobar Islads">
                                Andaman and Nicobar Islands
                              </option>
                              <option value="Andhra Predhesh">
                                Andhra Predhesh
                              </option>
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
                              <option value="Damn anad Diu">
                                Damn anad Diu
                              </option>
                              <option value="Delhi">Delhi</option>
                              <option value="Goa">Goa</option>
                              <option value="Gujarat">Gujarat</option>
                              <option value="Haryana">Haryana</option>
                              <option value="Himachal Predesh">
                                Himachal Predesh
                              </option>
                              <option value="Jammu and Kashmir">
                                Jammu and Kashmir
                              </option>
                              <option value="Jharkhand">Jharkhand</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Kerala">Kerala</option>
                              <option value="Ladakh">Ladakh</option>
                              <option value="Lakshadweep">Lakshadweep</option>
                              <option value="Madhya Predesh">
                                Madhya Predesh
                              </option>
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
                              <option value="Uttar Predesh">
                                Uttar Predesh
                              </option>
                              <option value="Uttarakhand">Uttarakhand</option>
                              <option value="West Bengal">West Bengal</option>
                              <option value="Other Territory">
                                Other Territory
                              </option>
                            </select>
                            <div className="invalid-feedback">
                              Please provide a valid State
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mt-3">
                          <div className="form-row">
                            <label for="vshippinco">Pin Code</label>
                            <input
                              type="text"
                              className="form-control"
                              id="vshippinco"
                              name="vendshippincode"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              placeholder="PIN code"
                              value={VsPincode}
                              onChange={(e) => setVSPincode(e.target.value)}
                            />
                            <div className="invalid-feedback">
                              Please provide a valid Pin Code
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mt-3">
                          <div className="form-row">
                            <label for="vshipcountry">Country</label>
                            <input
                              type="text"
                              className="form-control"
                              id="vshipcountry"
                              name="vendshipcountry"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              placeholder="Country"
                              value={VsCountry}
                              onChange={(e) => setVSCountry(e.target.value)}
                            />
                            <div className="invalid-feedback">
                              Please provide a valid Country
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-4"></div>
                    <div className="col-4 d-flex justify-content-center">
                      <button
                        className="btn btn-outline-secondary text-grey "
                        type="submit"
                        id="newVendorSave"
                        style={{ width: "100px" }}
                        data-dismiss="modal"
                        onClick={add_vendor_new}
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

      {/* <!-- Item Unit Create Modal --> */}

      <div className="modal fade" id="createNewUnit">
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">New Item Unit</h5>
              <button
                type="button"
                className="close"
                data-toggle="modal"
                data-dismiss="modal"
                data-target="#newItem"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body w-100">
              <div className="card p-3">
                <form
                  onSubmit={handleUnitModalSubmit}
                  id="newUnitForm"
                  className="px-1"
                >
                  <div className="row mt-2 w-100">
                    <div className="col-12">
                      <label for="name">Unit Name</label>
                      <input
                        name="name"
                        id="unit_name"
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                        className="form-control text-uppercase w-100"
                      />
                    </div>
                  </div>
                  <div className="row mt-4 w-100">
                    <div className="col-12 d-flex justify-content-center">
                      <button
                        className="btn btn-outline-info text-grey"
                        type="submit"
                        data-toggle="modal"
                        data-target="#newItem"
                        onClick={handleUnitModalSubmit}
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

      {/* <!-- Account Create Modal --> */}

      <div className="modal fade" id="createNewAccount">
        <div className="modal-dialog modal-xl">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">New Account</h5>
              <button
                type="button"
                className="close"
                data-toggle="modal"
                data-dismiss="modal"
                data-target="#newItem"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div
              className="modal-body w-100"
              style={{ maxHeight: "75vh", overflowY: "auto" }}
            >
              <div className="card p-3 w-100">
                <form id="newAccountForm" className="px-1">
                  <div className="row mt-2 mb-2 w-100">
                    <div className="col-md-6">
                      <div className="row mt-2">
                        <div className="col-12">
                          <label for="acctyp">Account Type</label>
                          <input
                            type="text"
                            value="Assets"
                            id="acctype"
                            name="acctype"
                            hidden
                          />
                          <select
                            name="account_type"
                            id="Account_type"
                            value={accType}
                            className="custom-select-md form-control w-100"
                            onChange={(e) => {
                              handleAccountTypeChange(e.target.value);
                            }}
                            required
                          >
                            <optgroup
                              label="Expense"
                              style={{ backgroundColor: "rgb(47 81 111)" }}
                            >
                              <option value="Expense"> Expense </option>
                              <option value="Cost Of Goods Sold">
                                {" "}
                                Cost Of Goods Sold{" "}
                              </option>
                              <option value="Other Expense">
                                {" "}
                                Other Expense{" "}
                              </option>
                            </optgroup>
                          </select>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12">
                          <label for="name">*Name</label>
                          <input
                            name="account_name"
                            id="accountName"
                            required
                            value={accName}
                            onChange={(e) => setAccName(e.target.value)}
                            className="custom-select-md form-control w-100"
                          />
                        </div>
                      </div>
                      <div
                        className="row mt-1"
                        id="subAccountCheck"
                        style={{ display: "none" }}
                      >
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              name="subAccountCheckBox"
                              className="form-check-input"
                              id="subAccountCheckBox"
                              onChange={showParentAccounts}
                            />
                            <label
                              className="form-check-label"
                              for="subAccountCheckBox"
                            >
                              Make this a sub-account
                            </label>
                            <span>
                              <i
                                className="fa fa-question-circle"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Select this option if you are creating a sub-account."
                              ></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="row mt-2"
                        id="parentAccountValue"
                        style={{ display: "none" }}
                      >
                        <div className="col-12">
                          <label for="parentAccount">Parent Account</label>
                          <select
                            name="parent_account"
                            id="parentAccount"
                            value={parentAccount}
                            onChange={(e) => setParentAccount(e.target.value)}
                            className="custom-select-md form-control w-100"
                          >
                            <option selected disabled value="">
                              --Choose--
                            </option>
                            {parentAccounts &&
                              parentAccounts.map((a) => (
                                <option value={a.name}>{a.name}</option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12">
                          <label for="acc_code">Account Code</label>
                          <input
                            type="text"
                            name="account_code"
                            id="account_code"
                            value={accCode}
                            onChange={(e) => setAccCode(e.target.value)}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12">
                          <label>Description</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            id="description"
                            name="description"
                            value={accDesc}
                            onChange={(e) => setAccDesc(e.target.value)}
                            placeholder="Max. 500 Characters"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mt-4">
                      <div
                        id="acnt-desc"
                        className="form-control"
                        name="detype"
                        style={{ fontSize: "small", height: "fit-content" }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="row w-100">
                      <div className="col-md-4"></div>
                      <div className="col-md-4 d-flex justify-content-center">
                        <button
                          type="button"
                          data-toggle="modal"
                          data-target="#newItem"
                          onClick={handleNewAccSubmit}
                          id="saveNewAccount"
                          className="btn btn-outline-info"
                        >
                          Save
                        </button>
                      </div>
                      <div className="col-md-4"></div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Ietm */}
      <div className="modal fade" id="newItem">
        <div className="modal-dialog modal-xl">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">New Item</h5>
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
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
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
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
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
                              style={{
                                backgroundColor: "#2a4964",
                                color: "white",
                              }}
                            >
                              <option selected disabled value="">
                                Choose...
                              </option>
                              {units &&
                                units.map((i) => (
                                  <option
                                    value={i.name}
                                    className="text-uppercase"
                                  >
                                    {i.name}
                                  </option>
                                ))}
                            </select>
                            <button
                              type="button"
                              className="btn btn-outline-secondary ml-1"
                              data-toggle="modal"
                              data-dismiss="modal"
                              data-target="#createNewUnit"
                              style={{
                                width: "fit-content",
                                height: "fit-content",
                              }}
                            >
                              +
                            </button>
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
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
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
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
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
                          <label style={{ color: "white" }}>
                            Tax Reference
                          </label>
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
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
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
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
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
                          <label style={{ color: "white" }}>
                            Purchase Price
                          </label>
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
                                onChange={(e) =>
                                  setPurchasePrice(e.target.value)
                                }
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
                          <label
                            for="purchaseAccount"
                            style={{ color: "white" }}
                          >
                            Account
                          </label>
                          <div className="d-flex align-items-center">
                            <select
                              name="pur_account"
                              className="form-control"
                              style={{
                                backgroundColor: "#2a4964",
                                color: "white",
                              }}
                              id="purchaseAccount"
                              value={purchaseAccount}
                              onChange={(e) =>
                                setPurchaseAccount(e.target.value)
                              }
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
                            <button
                              type="button"
                              className="btn btn-outline-secondary ml-1"
                              data-toggle="modal"
                              data-dismiss="modal"
                              data-target="#createNewAccount"
                              style={{
                                width: "fit-content",
                                height: "fit-content",
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="col-md-6 mt-3">
                          <label for="salesAccount" style={{ color: "white" }}>
                            Account
                          </label>
                          <select
                            name="sale_account"
                            className="form-control"
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
                            id="salesAccount"
                            value={salesAccount}
                            onChange={(e) => setSalesAccount(e.target.value)}
                          >
                            <option value="" selected disabled>
                              --Choose--
                            </option>
                            <option value="General Income">
                              General Income
                            </option>
                            <option value="Interest Income">
                              Interest Income
                            </option>
                            <option value="Late Fee Income">
                              Late Fee Income
                            </option>
                            <option value="Discount Income">
                              Discount Income
                            </option>
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
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
                            value={purchaseDescription}
                            onChange={(e) =>
                              setPurchaseDescription(e.target.value)
                            }
                          />
                        </div>
                        <div className="col-md-6 mt-3">
                          <label
                            for="salesDescription"
                            style={{ color: "white" }}
                          >
                            Description
                          </label>
                          <textarea
                            className="form-control"
                            name="sale_desc"
                            id="salesDescription"
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
                            value={salesDescription}
                            onChange={(e) =>
                              setSalesDescription(e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="row" id="inventorytrack">
                        <div className="col-md-6 mt-3">
                          <label style={{ color: "white" }}>
                            Inventory Account
                          </label>
                          <select
                            name="invacc"
                            className="form-control"
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
                            required
                            value={inventoryAccount}
                            onChange={(e) =>
                              setInventoryAccount(e.target.value)
                            }
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
                          <label style={{ color: "white" }}>
                            Stock on hand
                          </label>
                          <input
                            type="number"
                            name="stock"
                            className="form-control"
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
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
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
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
                            style={{
                              backgroundColor: "#2a4964",
                              color: "white",
                            }}
                            value={minStock}
                            onChange={(e) => setMinStock(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="row mt-4 w-100">
                        <div className="col-4"></div>
                        <div className="col-4 d-flex justify-content-center">
                          <button
                            className="btn btn-outline-secondary text-grey w-75"
                            onClick={handleItemModalSubmit}
                            data-dismiss="modal"
                            type="button"
                            id="newItemSave"
                          >
                            Save
                          </button>
                        </div>
                        <div className="col-4"></div>
                      </div>
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

export default EditDebitNote;