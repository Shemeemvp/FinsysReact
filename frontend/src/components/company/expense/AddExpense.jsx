import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import Select from "react-select";

function AddExpense() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [terms, setTerms] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [customerPriceLists, setCustomerPriceLists] = useState([]);
  const [vendorPriceLists, setVendorPriceLists] = useState([]);

  const fetchExpenseData = () => {
    axios
      .get(`${config.base_url}/fetch_expense_data/${ID}/`)
      .then((res) => {
        console.log("RBL Data==", res);
        if (res.data.status) {
          let cust = res.data.customers;
          let vend = res.data.vendors;
          let trms = res.data.paymentTerms;
          let bnks = res.data.banks;
          let clst = res.data.custPriceList;
          let vlst = res.data.vendPriceList;
          let acc = res.data.accounts;
          
          setCustomerPriceLists([]);
          setVendorPriceLists([]);
          clst.map((c) => {
            setCustomerPriceLists((prevState) => [...prevState, c]);
          });
          vlst.map((v) => {
            setVendorPriceLists((prevState) => [...prevState, v]);
          });
          setBanks([]);
          bnks.map((b) => {
            setBanks((prevState) => [...prevState, b]);
          });
          setTerms([]);
          trms.map((i) => {
            setTerms((prevState) => [...prevState, i]);
          });
          setAccounts([]);
          acc.map((a) => {
            setAccounts((prevState) => [...prevState, a]);
          });
          setCustomers([]);
          const newCustOptions = cust.map((item) => ({
            label: item.first_name + " " + item.last_name,
            value: item.id,
          }));
          setCustomers(newCustOptions);
          setVendors([]);
          const newVendOptions = vend.map((item) => ({
            label: item.First_name + " " + item.Last_name,
            value: item.id,
          }));
          setVendors(newVendOptions);
          setRefNo(res.data.refNo);
          setNextExpenseNo(res.data.expNo);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function fetchPaymentTerms() {
    axios
      .get(`${config.base_url}/fetch_expense_data/${ID}/`)
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
    fetchExpenseData();
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

  const [vendor, setVendor] = useState("");
  const [vendEmail, setVendEmail] = useState("");
  const [vendName, setVendName] = useState("");
  const [vendGstType, setVendGstType] = useState("");
  const [vendGstIn, setVendGstIn] = useState("");
  const [vendBillingAddress, setVendBillingAddress] = useState("");
  const [vendPlaceOfSupply, setVendPlaceOfSupply] = useState("");

  const [customer, setCustomer] = useState("");
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custGstType, setCustGstType] = useState("");
  const [custGstIn, setCustGstIn] = useState("");
  const [custBillingAddress, setCustBillingAddress] = useState("");
  const [custPlaceOfSupply, setCustPlaceOfSupply] = useState("");

  const [refNo, setRefNo] = useState("");
  const [expenseNo, setExpenseNo] = useState("");
  const [nextExpenseNo, setNextExpenseNo] = useState("");
  const [date, setDate] = useState(formattedDate);
  const [expenseAccount, setExpenseAccount] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [HSN, setHSN] = useState("");
  const [SAC, setSAC] = useState("");
  const [amountType, setAmountType] = useState("");
  const [amount, setAmount] = useState(0.0);
  const [taxRateGst, setTaxRateGst] = useState("");
  const [taxRateIgst, setTaxRateIgst] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);

  function checkForNull(val) {
    return val !== "" ? val : null;
  }

  function checkForZero(val) {
    return val !== "" ? val : 0.0;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Id", ID);
    formData.append("status", status);
    formData.append("Vendor", vendor);
    formData.append("vendor_name", vendName);
    formData.append("vendor_email", vendEmail);
    formData.append("vendor_billing_address", vendBillingAddress);
    formData.append("vendor_gst_type", vendGstType);
    formData.append("vendor_gstin", vendGstIn);
    formData.append("vendor_place_of_supply", vendPlaceOfSupply);

    formData.append("Customer", customer);
    formData.append("customer_name", custName);
    formData.append("customer_email", custEmail);
    formData.append("customer_billing_address", custBillingAddress);
    formData.append("customer_gst_type", custGstType);
    formData.append("customer_gstin", custGstIn);
    formData.append("customer_place_of_supply", custPlaceOfSupply);

    formData.append("reference_no", refNo);
    formData.append("expense_no", expenseNo);
    formData.append("expense_date", date);
    formData.append("expense_account", expenseAccount);
    formData.append("expense_type", expenseType);
    formData.append("hsn", checkForNull(HSN));
    formData.append("sac", checkForNull(SAC));
    formData.append("amount_type", amountType);
    formData.append("amount", checkForZero(amount));
    formData.append("payment_method", checkForNull(paymentMethod));
    formData.append("cheque_no", checkForNull(chequeNumber));
    formData.append("upi_no", checkForNull(upiId));
    formData.append("bank_acc_no", checkForNull(accountNumber));
    formData.append("note", description);
    if (file) {
      formData.append("file", file);
    }

    axios
      .post(`${config.base_url}/create_new_expense/`, formData)
      .then((res) => {
        console.log("RBL RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Expense Created",
          });
          navigate("/expense");
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
            setVendEmail("");
            setVendName("");
            setVendGstType("");
            setVendGstIn("");
            setVendBillingAddress("");
            setVendPlaceOfSupply("");
            var vend = res.data.vendorDetails;
            setVendEmail(vend.email);
            setVendName(vend.name);
            setVendGstType(vend.gstType);
            setVendGstIn(vend.gstIn);
            setVendPlaceOfSupply(vend.placeOfSupply);
            setVendBillingAddress(vend.address);
            refreshTax(vend.custPlaceOfSupply);
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
        });
    } else {
      setVendEmail("");
      setVendName("");
      setVendGstType("");
      setVendGstIn("");
      setVendBillingAddress("");
      setVendPlaceOfSupply("");
    }
  }

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
            setCustEmail("");
            setCustName("");
            setCustGstType("");
            setCustGstIn("");
            setCustBillingAddress("");
            setCustPlaceOfSupply("");
            var cust = res.data.customerDetails;
            console.log("Cust Details===", cust);
            setCustEmail(cust.email);
            setCustName(cust.name);
            setCustGstType(cust.gstType);
            setCustGstIn(cust.gstIn);
            setCustPlaceOfSupply(cust.placeOfSupply);
            setCustBillingAddress(cust.address);
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
        });
    } else {
      setCustEmail("");
      setCustGstType("");
      setCustName("");
      setCustGstIn("");
      setCustBillingAddress("");
      setCustPlaceOfSupply("");
    }
  }

  function handleExpNoChange(val) {
    setExpenseNo(val);
    checkExpenseNo(val);
  }

  function checkExpenseNo(val) {
    document.getElementById("EXPNoErr").innerText = "";
    var exp_num = val;
    if (exp_num != "") {
      var s = {
        Id: ID,
        EXPNum: exp_num,
      };
      axios
        .get(`${config.base_url}/check_expense_no/`, { params: s })
        .then((res) => {
          console.log("INV NUM Res=", res);
          if (!res.data.status) {
            document.getElementById("EXPNoErr").innerText = res.data.message;
          } else {
            document.getElementById("EXPNoErr").innerText = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleVendPlaceOfSupply(val) {
    setVendPlaceOfSupply(val);
    refreshTax(val);
  }

  function handleCustPlaceOfSupply(val) {
    setCustPlaceOfSupply(val);
    refreshTax(val);
  }

  function extractTaxRate(tax) {
    const match = tax.match(/\d+/);

    if (match) {
      return parseInt(match[0], 10);
    }
  }

  function refreshTax() {
    document.getElementById("taxGST").required = false;
    document.getElementById("taxIGST").required = false;
    var vendPlace = document.getElementById("sourceOfSupply").value;
    var custPlace = document.getElementById("placeOfSupply").value;
    if (vendPlace != "" && custPlace != "") {
      if (vendPlace === custPlace) {
        document.getElementById("taxGST").style.display = "block";
        document.getElementById("taxIGST").style.display = "none";
        document.getElementById("taxGST").required = true;
        document.getElementById("taxIGST").required = false;
        if (document.getElementById("taxIGST").value != "") {
          document.getElementById("taxGST").value =
            extractTaxRate(
              document.getElementById("taxIGST").value
            ).toString() + ".0% GST";
        }
      } else {
        document.getElementById("taxGST").style.display = "none";
        document.getElementById("taxIGST").style.display = "block";
        document.getElementById("taxGST").required = false;
        document.getElementById("taxIGST").required = true;
        if (document.getElementById("taxGST").value != "") {
          document.getElementById("taxIGST").value =
            extractTaxRate(document.getElementById("taxGST").value).toString() +
            ".0% IGST";
        }
      }
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

  // NEW CUSTOMER

  const [newPaymentTerm, setNewPaymentTerm] = useState("");
  const [newPaymentTermDays, setNewPaymentTermDays] = useState("");
  function handlePaymentTermModalSubmit(e) {
    e.preventDefault();
    var name = newPaymentTerm;
    var dys = newPaymentTermDays;
    if (name != "" && dys != "") {
      var u = {
        Id: ID,
        term_name: newPaymentTerm,
        days: newPaymentTermDays,
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

            setNewPaymentTerm("");
            setNewPaymentTermDays("");
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

  const [title, setTitle] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [customerPlaceOfSupply, setCustomerPlaceOfSupply] = useState("");
  const [customerGstType, setCustomerGstType] = useState("");
  const [customerGstIn, setCustomerGstIn] = useState("");
  const [panNo, setPanNo] = useState("");
  const [oBalType, setOBalType] = useState("");
  const [oBal, setOBal] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");
  const [customerPriceList, setCustomerPriceList] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [mobile, setMobile] = useState("");

  const [bStreet, setBStreet] = useState("");
  const [bCity, setBCity] = useState("");
  const [bState, setBState] = useState("");
  const [bPincode, setBPincode] = useState("");
  const [bCountry, setBCountry] = useState("");

  const [sStreet, setSStreet] = useState("");
  const [sCity, setSCity] = useState("");
  const [sState, setSState] = useState("");
  const [sPincode, setSPincode] = useState("");
  const [sCountry, setSCountry] = useState("");

  function placeShipAddress() {
    var chkbtn = document.getElementById("shipAddress");
    if (chkbtn.checked == true) {
      setSStreet(bStreet);
      setSCity(bCity);
      setSPincode(bPincode);
      setSCountry(bCountry);
      setSState(bState);
    } else {
      setSStreet("");
      setSCity("");
      setSPincode("");
      setSCountry("");
      setSState("");
    }
  }

  function checkLastName() {
    var fName = firstName.replace(/\d/g, "");
    var lName = lastName.replace(/\d/g, "");
    if (fName != "" && lName != "") {
      checkCustomerName(fName, lName);
    } else {
      alert("Please enter a valid Full Name.!");
      return false;
    }
  }
  function checkFirstName() {
    var fName = firstName.replace(/\d/g, "");
    var lName = lastName.replace(/\d/g, "");
    if (fName != "" && lName != "") {
      checkCustomerName(fName, lName);
    } else if (fName == "" && lName != "") {
      alert("Please enter a valid First Name.!");
    }
  }

  function checkCustomerName(fname, lname) {
    if (fname != "" && lname != "") {
      var u = {
        Id: ID,
        fName: fname,
        lName: lname,
      };
      axios
        .get(`${config.base_url}/check_customer_name/`, { params: u })
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

  function checkCustomerGSTIN(gstin) {
    var gstNo = gstin;
    if (gstNo != "") {
      var u = {
        Id: ID,
        gstin: gstNo,
      };
      axios
        .get(`${config.base_url}/check_gstin/`, { params: u })
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

  function checkCustomerPAN(pan) {
    var panNo = pan;
    if (panNo != "") {
      var u = {
        Id: ID,
        pan: panNo,
      };
      axios
        .get(`${config.base_url}/check_pan/`, { params: u })
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

  function checkCustomerPhone(phone) {
    var phoneNo = phone;
    if (phoneNo != "") {
      var u = {
        Id: ID,
        phone: phoneNo,
      };
      axios
        .get(`${config.base_url}/check_phone/`, { params: u })
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

  function checkCustomerEmail(email) {
    var custEmail = email;
    if (custEmail != "") {
      var u = {
        Id: ID,
        email: custEmail,
      };
      axios
        .get(`${config.base_url}/check_email/`, { params: u })
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

  function handleGstType(value) {
    setCustomerGstType(value);
    checkGstType(value);
  }

  function checkGstType(value) {
    var gstTypeElement = document.getElementById("gstType");
    var gstINElement = document.getElementById("gstIN");
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

  function checkgst(val) {
    var gstinput = val;
    var gstregexp =
      "[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}";

    if (gstinput.length === 15) {
      if (gstinput.match(gstregexp)) {
        document.getElementById("warngst").innerHTML = "";
        checkCustomerGSTIN(val);
      } else {
        document.getElementById("warngst").innerHTML =
          "Please provide a valid GST Number";
        alert("Please provide a valid GST Number");
      }
    } else {
      document.getElementById("warngst").innerHTML =
        "Please provide a valid GST Number";
      alert("Please provide a valid GST Number");
    }
  }

  function checkpan(val) {
    var paninput = val;
    var panregexp = ["[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}"];
    if (val != "") {
      if (paninput.match(panregexp)) {
        document.getElementById("warnpan").innerHTML = "";
        checkCustomerPAN(val);
      } else {
        document.getElementById("warnpan").innerHTML =
          "Please provide a valid PAN Number";
        alert("Please provide a valid PAN Number");
      }
    }
  }

  function checkweb(val) {
    var webinput = val;
    var webregexp = "www.";
    if (val != "") {
      if (webinput.startsWith(webregexp)) {
        document.getElementById("warnweb").innerHTML = "";
      } else {
        document.getElementById("warnweb").innerHTML =
          "Please provide a valid Website Address";
        alert("Please provide a valid Website Address");
      }
    }
  }

  function checkphone(val) {
    var phoneinput = val;
    var phoneregexp = /^\d{10}$/;
    if (val != "") {
      if (phoneinput.match(phoneregexp)) {
        document.getElementById("warnphone").innerHTML = "";
        checkCustomerPhone(val);
      } else {
        document.getElementById("warnphone").innerHTML =
          "Please provide a valid Phone Number";
        alert("Please provide a valid Phone Number");
      }
    }
  }

  function checkemail(val) {
    var emailinput = val;
    var emailregexp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (val != "") {
      if (emailinput.match(emailregexp)) {
        //   document.getElementById("warnemail").innerHTML = "";
        checkCustomerEmail(val);
      } else {
        //   document.getElementById("warnemail").innerHTML =
        //     "Please provide a valid Email ID";
        alert("Please provide a valid Email id");
      }
    }
  }

  function setOpeningBalanceValue(value) {
    var openbal = value;
    if (oBalType == "credit") {
      if (openbal.slice(0, 1) != "-") {
        if (parseFloat(openbal) != 0) {
          setOBal(-1 * openbal);
        } else {
          setOBal(openbal);
        }
      } else {
        if (parseFloat(openbal) != 0) {
          setOBal(openbal);
        } else {
          setOBal(-1 * parseFloat(openbal));
        }
      }
    } else {
      setOBal(openbal);
    }
  }

  function handleOpenBalType(val) {
    setOBalType(val);
    changeOpenBalType(val);
  }

  function changeOpenBalType(type) {
    var openbal = oBal;
    if (openbal != "") {
      if (type == "credit") {
        if (parseFloat(openbal) != 0) {
          setOBal(-1 * openbal);
        } else {
          setOBal(openbal);
        }
      } else {
        if (parseFloat(openbal) < 0) {
          setOBal(Math.abs(openbal));
        } else {
          setOBal(openbal);
        }
      }
    }
  }

  const handleNewCustomerModalSubmit = (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
      title: title,
      first_name: firstName,
      last_name: lastName,
      company: company,
      location: location,
      place_of_supply: customerPlaceOfSupply,
      gst_type: customerGstType,
      gstin: customerGstIn,
      pan_no: panNo,
      email: customerEmail,
      mobile: mobile,
      website: website,
      price_list: customerPriceList,
      payment_terms: paymentTerm,
      opening_balance: oBal,
      open_balance_type: oBalType,
      current_balance: oBal,
      credit_limit: creditLimit,
      billing_street: bStreet,
      billing_city: bCity,
      billing_state: bState,
      billing_pincode: bPincode,
      billing_country: bCountry,
      ship_street: sStreet,
      ship_city: sCity,
      ship_state: sState,
      ship_pincode: sPincode,
      ship_country: sCountry,
      status: "Active",
    };

    axios
      .post(`${config.base_url}/create_new_customer/`, dt)
      .then((res) => {
        console.log("CUST RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Customer Created",
          });
          fetchExpenseData();
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
          fetchExpenseData();
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

  // New ACCOUNT

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
          <Link to={"/expense"}>
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
                <h2 className="mt-3">NEW EXPENSE</h2>
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
                <div className="card-title mt-4">
                  <h4 className="mb-0">Expense Details</h4>
                </div>
                <hr />

                <div className="row">
                  <div className="col-md-4 mt-3">
                    <label className="">Expense Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="start_date"
                      id="startDate"
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div className="col-md-4 mt-3">
                    <label className="">Expense Account</label>
                    <div className="d-flex align-items-center">
                      <select
                        className="form-control"
                        value={expenseAccount}
                        onChange={(e) => setExpenseAccount(e.target.value)}
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        id="expenseAccount"
                        required
                      >
                        <option value="" selected>
                          Select Account
                        </option>
                        {accounts &&
                          accounts.map((acc) => (
                            <option value={acc.id}>{acc.account_name}</option>
                          ))}
                      </select>
                      <a
                        className="btn btn-outline-secondary ml-1"
                        role="button"
                        data-target="#newAccount"
                        data-toggle="modal"
                        style={{ width: "fit-content", height: "fit-content" }}
                        id="termsadd"
                      >
                        +
                      </a>
                    </div>
                  </div>

                  <div className="col-md-4 mt-3">
                    <label className="">Expense Type</label>
                    <select
                      className="form-control my-select"
                      id="expenseType"
                      name="expense_type"
                      value={expenseType}
                      onChange={(e) => setExpenseType(e.target.value)}
                      style={{ backgroundColor: "#43596c" }}
                    >
                      <option value="" selected>
                        Select Expenes Type
                      </option>
                      <option value="Goods">Goods</option>
                      <option value="Service">Service</option>
                    </select>
                  </div>
                  <div
                    className="col-md-4 mt-3"
                    style={{
                      display: expenseType == "Goods" ? "block" : "none",
                    }}
                    id="hsndiv"
                  >
                    <label className="">HSN</label>
                    <input
                      type="number"
                      className="form-control"
                      name="hsn"
                      id="hsn"
                      value={HSN}
                      onChange={(e) => setHSN(e.target.value)}
                      placeholder="Enter HSN"
                      required={expenseType == "Goods" ? true : false}
                    />
                  </div>
                  <div
                    className="col-md-4 mt-3"
                    style={{
                      display: expenseType == "Service" ? "block" : "none",
                    }}
                    id="sacdiv"
                  >
                    <label className="">SAC</label>
                    <input
                      type="text"
                      className="form-control"
                      name="sac"
                      value={SAC}
                      onChange={(e) => setSAC(e.target.value)}
                      id="sac"
                      placeholder="Enter SAC"
                      required={expenseType == "Service" ? true : false}
                    />
                  </div>

                  <div className="col-md-4 mt-3">
                    <div className="d-flex">
                      <label className="">Expense No.</label>
                      <span className="text-danger ml-3" id="EXPNoErr"></span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      name="expense_no"
                      id="expenseNumber"
                      value={expenseNo}
                      onChange={(e) => handleExpNoChange(e.target.value)}
                      style={{ backgroundColor: "#43596c" }}
                      placeholder={nextExpenseNo}
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
                    <label>Amount</label>
                    <div className="d-flex">
                      <select
                        name="amount_type"
                        id="amountType"
                        value={amountType}
                        onChange={(e) => setAmountType(e.target.value)}
                        className="form-control"
                        style={{ width: "100px" }}
                      >
                        <option value="Debit">Debit</option>
                        <option value="Credit">Credit</option>
                      </select>
                      <input
                        type="number"
                        className="form-control ml-1"
                        name="amount"
                        id="amount"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="">Tax Rate</label>
                    <select
                      name="taxGST"
                      id="taxGST"
                      value={taxRateGst}
                      onChange={(e)=> setTaxRateGst(e.target.value)}
                      className="form-control tax_ref tax_ref_gst"
                      style={{ display: "block" }}
                    >
                      <option value="">Select GST</option>
                      <option value="28.0% GST">28.0% GST</option>
                      <option value="18.0% GST">18.0% GST</option>
                      <option value="12.0% GST">12.0% GST</option>
                      <option value="5.0% GST">5.0% GST</option>
                      <option value="3.0% GST">3.0% GST</option>
                      <option value="0.0% GST">0.0% GST</option>
                    </select>
                    <select
                      name="taxIGST"
                      id="taxIGST"
                      value={taxRateIgst}
                      onChange={(e)=> setTaxRateIgst(e.target.value)}
                      className="form-control tax_ref tax_ref_igst"
                      style={{ display: "none" }}
                    >
                      <option value="">Select IGST</option>
                      <option value="28.0% IGST">28.0% IGST</option>
                      <option value="18.0% IGST">18.0% IGST</option>
                      <option value="12.0% IGST">12.0% IGST</option>
                      <option value="3.0% IGST">5.0% IGST</option>
                      <option value="3.0% IGST">3.0% IGST</option>
                      <option value="0.0% IGST">0.0% IGST</option>
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

                <div className="card-title my-4">
                  <h4 className="mb-0">Vendor Details</h4>
                </div>
                <hr />
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
                      id="vendGstType"
                      name="vend_gst_type"
                      placeholder="GST Treatment"
                      value={vendGstType}
                      style={{ backgroundColor: "#43596c" }}
                      readOnly
                    />
                  </div>

                  <div className="col-md-4 mt-3">
                    <label className="">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      name="vendorEmail"
                      placeholder="Email"
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      id="vendorEmail"
                      value={vendEmail}
                      readOnly
                    />
                    {vendGstIn != "None" && (
                      <div
                        className="mt-3"
                        id="gstInDisplay"
                        style={{ display: "block" }}
                      >
                        <label className="">GSTIN</label>
                        <input
                          type="text"
                          className="form-control"
                          id="vendGstin"
                          name="vendGstin"
                          placeholder="GSTIN"
                          style={{ backgroundColor: "#43596c" }}
                          value={vendGstIn}
                          readOnly
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 mt-3">
                    <label className="">Billing Address</label>
                    <textarea
                      className="form-control"
                      name="vend_bill_address"
                      id="vendBillAddress"
                      rows="4"
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      value={vendBillingAddress}
                      readOnly
                    />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="">Place of supply</label>
                    <select
                      type="text"
                      className="form-control"
                      id="vendPlaceOfSupply"
                      name="vend_place_of_supply"
                      value={vendPlaceOfSupply}
                      onChange={(e) => handleVendPlaceOfSupply(e.target.value)}
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

                <div className="card-title my-4">
                  <h4 className="mb-0">Customer Details</h4>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-4 mt-3">
                    <label className="">Select Customer</label>
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
                      id="custGstType"
                      name="cust_gst_type"
                      placeholder="GST Treatment"
                      value={custGstType}
                      style={{ backgroundColor: "#43596c" }}
                      readOnly
                    />
                  </div>

                  <div className="col-md-4 mt-3">
                    <label className="">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      name="custEmail"
                      placeholder="Email"
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      id="custEmail"
                      value={custEmail}
                      readOnly
                    />
                    {custGstIn != "None" && (
                      <div
                        className="mt-3"
                        id="gstInDisplay"
                        style={{ display: "block" }}
                      >
                        <label className="">GSTIN</label>
                        <input
                          type="text"
                          className="form-control"
                          id="custGstin"
                          name="custGstin"
                          placeholder="GSTIN"
                          style={{ backgroundColor: "#43596c" }}
                          value={custGstIn}
                          readOnly
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 mt-3">
                    <label className="">Billing Address</label>
                    <textarea
                      className="form-control"
                      name="cust_bill_address"
                      id="custBillAddress"
                      rows="4"
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      value={custBillingAddress}
                      readOnly
                    />
                  </div>
                  <div className="col-md-4 mt-3">
                    <label className="">Place of supply</label>
                    <select
                      type="text"
                      className="form-control"
                      id="custPlaceOfSupply"
                      name="cust_place_of_supply"
                      value={custPlaceOfSupply}
                      onChange={(e) => setCustPlaceOfSupply(e.target.value)}
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
                <hr />
                <div className="row clearfix" style={{ marginTop: "20px" }}>
                  <div className="col-md-6">
                    <input
                      type="file"
                      name="file"
                      style={{ marginTop: "15px 0px", width: "70%" }}
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <textarea
                      className="form-control mt-3"
                      id=""
                      name="note"
                      placeholder="Note"
                      style={{ height: "190px" }}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="col-md-1"></div>
                  <div className="col-md-5 mt-3"></div>
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
                  <div className="col-md-5 mt-3"></div>
                </div>
                <div className="row">
                  <div className="col-md-3 mt-3"></div>
                  <div className="col-md-6 mt-3 d-flex">
                    <input
                      type="submit"
                      className="btn btn-outline-secondary w-50 text-light"
                      onClick={() => setStatus("Draft")}
                      value="Draft"
                      style={{ height: "fit-content" }}
                    />
                    <input
                      type="submit"
                      className="btn btn-outline-secondary w-50 ml-1 text-light"
                      onClick={() => setStatus("Saved")}
                      value="Save"
                      style={{ height: "fit-content" }}
                    />
                  </div>
                  <div className="col-md-3 mt-3"></div>
                </div>
                <div className="notices mt-3">
                  <div className="text-muted">NOTICE:</div>
                  <div className="text-muted">
                    Accuhub Terms and Conditions Apply
                  </div>
                </div>
                <span className="text-muted">
                  Expense was created on a computer and is valid without the
                  signature and seal.
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* <!-- New Cust Payment Term Modal --> */}

      <div className="modal fade" id="newCustomerPaymentTerm">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">New Customer Payment Term</h5>
              <button
                type="button"
                className="close"
                data-toggle="modal"
                data-dismiss="modal"
                data-target="#newCustomer"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body w-100">
              <div className="card p-3">
                <form
                  method="post"
                  id="newCustomerPaymentTermForm"
                  onSubmit={handlePaymentTermModalSubmit}
                >
                  <div className="row mt-2 w-100">
                    <div className="col-6">
                      <label for="name">Term Name</label>
                      <input
                        type="text"
                        name="term_name"
                        value={newPaymentTerm}
                        onChange={(e) => setNewPaymentTerm(e.target.value)}
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
                        value={newPaymentTermDays}
                        onChange={(e) => setNewPaymentTermDays(e.target.value)}
                        step="1"
                      />
                    </div>
                  </div>
                  <div className="row mt-4 w-100">
                    <div className="col-4"></div>
                    <div className="col-4 d-flex justify-content-center">
                      <button
                        className="btn btn-outline-secondary text-grey w-75"
                        onClick={handlePaymentTermModalSubmit}
                        data-toggle="modal"
                        data-target="#newCustomer"
                        type="button"
                        id="saveCustomerPaymentTerm"
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

      {/* <!-- New Customer Modal --> */}

      <div className="modal fade" id="newCustomer">
        <div className="modal-dialog modal-xl">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">New Customer</h5>
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
                <form method="post" id="newCustomerForm" className="px-1">
                  <div className="row mt-3 w-100">
                    <div className="col-md-4">
                      <label for="title">Title</label>
                      <select
                        name="title"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                      >
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                        <option value="Ms">Ms</option>
                      </select>
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div className="col-md-4">
                      <label for="firstName">First Name*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="first_name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={checkFirstName}
                        required
                        style={{ backgroundColor: "#43596c", color: "white" }}
                      />
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div className="col-md-4">
                      <label for="lastName">Last Name*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="last_name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={checkLastName}
                        required
                        style={{ backgroundColor: "#43596c", color: "white" }}
                      />
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                  </div>

                  <div className="row mt-3 w-100">
                    <div className="col-md-4">
                      <label for="companyName">Company</label>
                      <input
                        type="text"
                        className="form-control"
                        id="companyName"
                        name="company_name"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        style={{ backgroundColor: "#43596c", color: "white" }}
                      />
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div className="col-md-4">
                      <label for="location">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ backgroundColor: "#43596c", color: "white" }}
                      />
                      <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div className="col-md-4">
                      <label for="custPlaceOfSupply">Place of Supply*</label>
                      <select
                        className="custom-select form-control"
                        id="custPlaceOfSupply"
                        name="place_of_supply"
                        value={customerPlaceOfSupply}
                        onChange={(e) =>
                          setCustomerPlaceOfSupply(e.target.value)
                        }
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        required
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

                  <div className="row mt-3 w-100">
                    <div className="col-md-4">
                      <label for="gstType">GST Type*</label>
                      <select
                        className="form-control"
                        id="custGstType"
                        name="gst_type"
                        value={customerGstType}
                        onChange={(e) => handleGstType(e.target.value)}
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        required
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

                    <div className="col-md-4 gstrow d-block" id="gstInValue">
                      <div>
                        <label for="custGstIN">GSTIN*</label>
                        <input
                          type="text"
                          className="form-control"
                          value={customerGstIn}
                          onChange={(e) => setCustomerGstIn(e.target.value)}
                          onBlur={(e) => checkgst(e.target.value)}
                          id="gstIN"
                          name="gstin"
                          style={{ backgroundColor: "#43596c", color: "white" }}
                          placeholder="29APPCK7465F1Z1"
                        />
                        <a
                          data-toggle="modal"
                          href="#exampleModal"
                          style={{ color: "#3dd5f3" }}
                        >
                          Get Taxpayer Details
                        </a>
                        <div className="text-danger m-2" id="warngst"></div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label for="panNo">PAN No.*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="panNo"
                        name="pan_no"
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        required
                        value={panNo}
                        onChange={(e) => setPanNo(e.target.value)}
                        onBlur={(e) => checkpan(e.target.value)}
                        placeholder="APPCK7465F"
                      />
                      <div className="text-danger m-2" id="warnpan"></div>
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col-md-4 mt-3">
                      <label for="validationCustom05">Opening Balance</label>
                      <div className="d-flex">
                        <select
                          name="balance_type"
                          id="bal"
                          className="form-select text-white mr-1 px-1"
                          value={oBalType}
                          onChange={(e) => handleOpenBalType(e.target.value)}
                          style={{
                            backgroundColor: "#243e54",
                            width: "25%",
                            borderRadius: "5px",
                          }}
                        >
                          <option value="debit">Debit</option>
                          <option value="credit">Credit</option>
                        </select>
                        <input
                          type="text"
                          className="form-control"
                          name="open_balance"
                          id="openbalance"
                          value={oBal}
                          onChange={(e) => setOBal(e.target.value)}
                          onBlur={(e) => setOpeningBalanceValue(e.target.value)}
                          step="any"
                          style={{ backgroundColor: "#43596c", color: "white" }}
                        />
                        <div className="text-danger m-2"></div>
                      </div>
                    </div>

                    <div className="col-md-4 mt-3">
                      <label for="creditLimit">Credit Limit</label>
                      <input
                        type="text"
                        className="form-control"
                        name="credit_limit"
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        step="any"
                        value={creditLimit}
                        onChange={(e) => setCreditLimit(e.target.value)}
                        id="creditLimit"
                      />
                      <div className="text-danger m-2"></div>
                    </div>

                    <div className="col-md-4 mt-3">
                      <label for="custPaymentTerms">Payment Terms</label>
                      <div className="d-flex align-items-center">
                        <select
                          name="payment_terms"
                          id="custPaymentTerms"
                          value={paymentTerm}
                          onChange={(e) => setPaymentTerm(e.target.value)}
                          className="form-control"
                        >
                          <option value="" selected>
                            Choose
                          </option>
                          {terms.map((p) => (
                            <option value={p.id}>{p.term_name}</option>
                          ))}
                        </select>
                        <a
                          href="#newCustomerPaymentTerm"
                          data-dismiss="modal"
                          data-toggle="modal"
                          style={{
                            width: "fit-content",
                            height: "fit-content",
                          }}
                          className="btn btn-outline-secondary ml-1"
                        >
                          +
                        </a>
                      </div>
                    </div>

                    <div className="col-md-4 mt-3">
                      <label for="priceList">Price List</label>
                      <select
                        name="price_list"
                        id="priceList"
                        value={customerPriceList}
                        onChange={(e) => setCustomerPriceList(e.target.value)}
                        className="form-control"
                      >
                        <option value="" selected>
                          Choose
                        </option>
                        {customerPriceLists.map((l) => (
                          <option value={l.id}>{l.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row mt-3 w-100">
                    <div className="col-md-4">
                      <label for="custEmail">Email*</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        id="custEmail"
                        name="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        onBlur={(e) => checkemail(e.target.value)}
                        style={{ backgroundColor: "#43596c", color: "white" }}
                        placeholder="Accuhub@gmail.com"
                      />
                      <div id="warnemail" className="text-danger"></div>
                    </div>
                    <div className="col-md-4">
                      <label for="custWebsite">Website</label>
                      <input
                        type="text"
                        className="form-control"
                        id="custWebsite"
                        required
                        placeholder="www.Accuhub.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        onBlur={(e) => checkweb(e.target.value)}
                        name="website"
                        style={{ backgroundColor: "#43596c", color: "white" }}
                      />
                      <div id="warnweb" className="text-danger"></div>
                    </div>
                    <div className="col-md-4">
                      <label for="custMobile">Mobile*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="custMobile"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        onBlur={(e) => checkphone(e.target.value)}
                        name="mobile"
                        style={{ backgroundColor: "#43596c", color: "white" }}
                      />
                      <div className="text-danger m-2" id="warnphone"></div>
                    </div>
                  </div>
                  <hr />
                  <div className="row mt-5 w-100">
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-12 card-title">
                          <h5 className="mb-0">Billing Address</h5>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 mt-3">
                          <div className="form-row">
                            <label for="street">Street*</label>
                            <textarea
                              className="form-control street"
                              required
                              id="street"
                              value={bStreet}
                              onChange={(e) => setBStreet(e.target.value)}
                              name="street"
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
                            <label for="city">City*</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              id="city"
                              name="city"
                              value={bCity}
                              onChange={(e) => setBCity(e.target.value)}
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
                            <label for="state">State*</label>
                            <select
                              type="text"
                              className="form-control"
                              id="state"
                              name="state"
                              required
                              value={bState}
                              onChange={(e) => setBState(e.target.value)}
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
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
                            <label for="pinco">Pin Code*</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              id="pinco"
                              value={bPincode}
                              onChange={(e) => setBPincode(e.target.value)}
                              name="pincode"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              placeholder="PIN code"
                            />
                            <div className="invalid-feedback">
                              Please provide a valid Pin Code
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mt-3">
                          <div className="form-row">
                            <label for="country">Country*</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              id="country"
                              name="country"
                              value={bCountry}
                              onChange={(e) => setBCountry(e.target.value)}
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              placeholder="Country"
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
                            onClick={placeShipAddress}
                            id="shipAddress"
                            name="ship_address"
                          />
                          <label className="ml-2 mt-1 ml-2" for="shipAddress">
                            Same As Billing Address
                          </label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 mt-3">
                          <div className="form-row">
                            <label for="shipstreet">Street</label>
                            <textarea
                              className="form-control"
                              id="shipstreet"
                              name="shipstreet"
                              value={sStreet}
                              onChange={(e) => setSStreet(e.target.value)}
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
                            <label for="shipcity">City</label>
                            <input
                              type="text"
                              className="form-control"
                              id="shipcity"
                              value={sCity}
                              onChange={(e) => setSCity(e.target.value)}
                              name="shipcity"
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
                            <label for="shipstate">State</label>
                            <select
                              type="text"
                              className="form-control"
                              id="shipState"
                              value={sState}
                              onChange={(e) => setSState(e.target.value)}
                              name="shipstate"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
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
                            <label for="shippinco">Pin Code</label>
                            <input
                              type="text"
                              className="form-control"
                              id="shippinco"
                              value={sPincode}
                              onChange={(e) => setSPincode(e.target.value)}
                              name="shippincode"
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              placeholder="PIN code"
                            />
                            <div className="invalid-feedback">
                              Please provide a valid Pin Code
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mt-3">
                          <div className="form-row">
                            <label for="shipcountry">Country</label>
                            <input
                              type="text"
                              className="form-control"
                              id="shipcountry"
                              name="shipcountry"
                              value={sCountry}
                              onChange={(e) => setSCountry(e.target.value)}
                              style={{
                                backgroundColor: "#43596c",
                                color: "white",
                              }}
                              placeholder="Country"
                            />
                            <div className="invalid-feedback">
                              Please provide a valid Country
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4 w-100">
                    <div className="col-4"></div>
                    <div className="col-4 d-flex justify-content-center">
                      <button
                        className="btn btn-outline-secondary text-grey w-75"
                        onClick={handleNewCustomerModalSubmit}
                        data-dismiss="modal"
                        type="button"
                        id="newCustomerSave"
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
    </>
  );
}

export default AddExpense;
