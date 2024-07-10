import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import Select from "react-select";

function EditPaymentReceived() {
  const ID = Cookies.get("Login_id");
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [terms, setTerms] = useState([]);
  const [banks, setBanks] = useState([]);
  const [customerPriceLists, setCustomerPriceLists] = useState([]);
  const [customerValue, setCustomerValue] = useState({});
  const fetchPaymentData = () => {
    axios
      .get(`${config.base_url}/fetch_payment_received_data/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          let cust = res.data.customers;
          let trms = res.data.paymentTerms;
          let bnks = res.data.banks;
          let clst = res.data.custPriceList;
          setCustomerPriceLists([]);
          clst.map((c) => {
            setCustomerPriceLists((prevState) => [...prevState, c]);
          });
          setBanks([]);
          bnks.map((b) => {
            setBanks((prevState) => [...prevState, b]);
          });
          setTerms([]);
          trms.map((i) => {
            setTerms((prevState) => [...prevState, i]);
          });
          setCustomers([]);
          const newCustOptions = cust.map((item) => ({
            label: item.first_name + " " + item.last_name,
            value: item.id,
          }));
          setCustomers(newCustOptions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function fetchPaymentTerms() {
    axios
      .get(`${config.base_url}/fetch_payment_received_data/${ID}/`)
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
    fetchPaymentData();
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

  const fetchPaymentDetails = () => {
    axios
      .get(`${config.base_url}/fetch_payment_received_details/${paymentId}/`)
      .then((res) => {
        if (res.data.status) {
          var pay = res.data.payment;
          var itms = res.data.items;
          var cust = res.data.otherDetails;

          var c = {
            value: pay.Customer,
            label: res.data.otherDetails.customerName,
          };
          setCustomerValue(c);

          setCustomer(pay.Customer);
          setEmail(cust.customerEmail);
          setGstType(cust.gstType);
          setGstIn(cust.gstIn);
          setBillingAddress(cust.customerAddress);
          setRefNo(pay.reference_no);
          setPaymentNo(pay.payment_no);
          setDate(pay.payment_date);
          setPaymentMethod(pay.payment_method);
          setChequeNumber(pay.cheque_no);
          setUpiId(pay.upi_no);
          setAccountNumber(pay.bank_acc_no);
          setTotalAmount(pay.total_amount)
          setTotalPayment(pay.total_payment)
          setTotalBalance(pay.total_balance)
          setPaymentItems([]);
          const pyItems = itms.map((i, index) => {
            return {
              id: index + 1,
              date: i.date,
              dueDate: i.duedate,
              invoiceType: i.invoice_type,
              invoiceNumber: i.invoice_no,
              total: i.invoice_amount,
              payment: i.invoice_payment,
              balance: i.invoice_balance
            };
          });

          setPaymentItems(pyItems);

          if (pay.payment_method != "null") {
            paymentMethodChange(pay.payment_method);
          }
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
    fetchPaymentDetails();
  }, []);

  var currentDate = new Date();
  var formattedDate = currentDate.toISOString().slice(0, 10);

  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [gstType, setGstType] = useState("");
  const [gstIn, setGstIn] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [refNo, setRefNo] = useState("");
  const [paymentNo, setPaymentNo] = useState("");
  const [nextPaymentNo, setNextPaymentNo] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [totalAmount, setTotalAmount] = useState(0.0);
  const [totalPayment, setTotalPayment] = useState(0.0);
  const [totalBalance, setTotalBalance] = useState(0.0);

  const [paymentItems, setPaymentItems] = useState([
    {
      id: 1,
      date: "",
      dueDate: "",
      invoiceType: "",
      invoiceNumber: "",
      total: "",
      payment: "",
      balance: "",
    },
  ]);

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
    formData.append("pay_id", paymentId);
    formData.append("Customer", customer);
    formData.append("reference_no", refNo);
    formData.append("payment_no", paymentNo);
    formData.append("payment_date", date);
    formData.append("payment_method", checkForNull(paymentMethod));
    formData.append("cheque_no", checkForNull(chequeNumber));
    formData.append("upi_no", checkForNull(upiId));
    formData.append("bank_acc_no", checkForNull(accountNumber));
    formData.append("total_payment", checkForZero(totalPayment));
    formData.append("total_amount", checkForZero(totalAmount));
    formData.append("total_balance", checkForZero(totalBalance));
    formData.append("paymentItems", JSON.stringify(paymentItems));

    axios
      .put(`${config.base_url}/update_payment_received/`, formData)
      .then((res) => {
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Payment Updated",
          });
          navigate(`/view_payment_received/${paymentId}/`);
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
    getCustomerInvoices(value);
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
            var cust = res.data.customerDetails;
            setEmail(cust.email);
            setGstType(cust.gstType);
            setGstIn(cust.gstIn);
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

  function getCustomerInvoices(customerId) {
    if (customerId != "") {
      var data = {
        Id: ID,
        custId: customerId,
      };

      axios
        .get(`${config.base_url}/get_payment_invoices/`, { params: data })
        .then((res) => {
          if (res.data.status) {
            setPaymentItems([]);
            var payItms = res.data.payItems;
            const payItems =payItms.map((i, index) => {
              var obj = {
                id: index + 1,
                date: i.date,
                dueDate: i.dueDate,
                invoiceType: i.type,
                invoiceNumber: i.number,
                total: i.total,
                payment: i.paid,
                balance: i.bal,
              };
              return obj;
            });
            setPaymentItems(payItems);
            setTotalAmount(res.data.totalAmount.toFixed(2));
            setTotalPayment(res.data.totalPayment.toFixed(2));
            setTotalBalance(res.data.totalBalance.toFixed(2));
          } else {
            if (!res.data.status) {
              Swal.fire({
                icon: "error",
                title: `${res.data.message}`,
              });

              setPaymentItems({
                id: 1,
                date: "",
                dueDate: "",
                invoiceType: "",
                invoiceNumber: "",
                total: "",
                payment: "",
                balance: "",
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
          setPaymentItems({
            id: 1,
            date: "",
            dueDate: "",
            invoiceType: "",
            invoiceNumber: "",
            total: "",
            payment: "",
            balance: "",
          });
        });
    } else {
      setPaymentItems({
        id: 1,
        date: "",
        dueDate: "",
        invoiceType: "",
        invoiceNumber: "",
        total: "",
        payment: "",
        balance: "",
      });
    }
  }

  function handlePaymentNoChange(val) {
    setPaymentNo(val);
    checkPaymentNo(val);
  }

  function checkPaymentNo(val) {
    document.getElementById("PAYNoErr").innerText = "";
    var pay_num = val;
    if (pay_num != "") {
      var s = {
        Id: ID,
        PAYNum: pay_num,
      };
      axios
        .get(`${config.base_url}/check_payment_no/`, { params: s })
        .then((res) => {
          if (!res.data.status) {
            document.getElementById("PAYNoErr").innerText = res.data.message;
          } else {
            document.getElementById("PAYNoErr").innerText = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const handleInvoiceItemsInputChange = (id, value) => {
    const payItems = paymentItems.map((item) => {
      return item.id === id
        ? {
            ...item,
            payment: parseFloat(value),
            balance: (parseFloat(item.total || 0) - parseFloat(value || 0)).toFixed(2),
          }
        : item;
    });
    setPaymentItems(payItems);
    calc(payItems);
  };

  const calc = (payItems) => {
    var total = 0;
    var payment = 0;
    var balance = 0;
    payItems.map((item) => {
      total += parseFloat(item.total || 0);
    });
    payItems.map((item) => {
      payment += parseFloat(item.payment || 0);
    });
    payItems.map((item) => {
      balance += parseFloat(item.balance || 0);
    });

    setTotalAmount(total.toFixed(2));
    setTotalPayment(payment.toFixed(2));
    setTotalBalance(balance.toFixed(2));
  };

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
          fetchPaymentData();
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
          <Link to={`/view_payment_received/${paymentId}/`}>
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
                <h2 className="mt-3">EDIT PAYMENT RECEIVED</h2>
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
                        value={customerValue || null}
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
                      <label className="">Payment No.</label>
                      <span className="text-danger ml-3" id="PAYNoErr"></span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      name="payment_no"
                      id="paymentNumber"
                      value={paymentNo}
                      onChange={(e) => handlePaymentNoChange(e.target.value)}
                      style={{ backgroundColor: "#43596c" }}
                      placeholder={nextPaymentNo}
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
                    <label className="">Payment Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="payment_date"
                      id="paymentDate"
                      style={{ backgroundColor: "#43596c", color: "white" }}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row">
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

                <div className="row clearfix ">
                  <div className="col-md-12 table-responsive-md mt-3">
                    <table
                      className="table table-bordered table-hover mt-3"
                      id="invoiceItemsTable"
                    >
                      <thead>
                        <tr>
                          <th className="text-center">#</th>
                          <th className="text-center">DATE</th>
                          <th className="text-center">DUE DATE</th>
                          <th className="text-center">INVOICE TYPE</th>
                          <th className="text-center">INVOICE NUMBER</th>
                          <th className="text-center">INVOICE AMOUNT</th>
                          <th className="text-center">PAYMENT</th>
                          <th className="text-center">BALANCE</th>
                        </tr>
                      </thead>
                      <tbody id="items-table-body">
                        {paymentItems.length > 0 && paymentItems.map((row) => (
                          <tr key={row.id} id={`tab_row${row.id}`}>
                            <td className="" style={{ textAlign: "center" }}>
                              {row.id}
                            </td>
                            <td>
                              <input
                                type="text"
                                name="date"
                                value={row.date}
                                id={`date${row.id}`}
                                className="form-control"
                                style={{
                                  backgroundColor: "#43596c",
                                  color: "white",
                                }}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="due_date"
                                value={row.dueDate}
                                id={`dueDate${row.id}`}
                                className="form-control"
                                style={{
                                  backgroundColor: "#43596c",
                                  color: "white",
                                }}
                                readOnly
                              />
                            </td>
                            <td style={{width:"20%"}}>
                              <input
                                type="text"
                                name="invoice_type"
                                id={`invoiceType${row.id}`}
                                className="form-control"
                                style={{
                                  backgroundColor: "#43596c",
                                  color: "white",
                                }}
                                value={row.invoiceType}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="invoice_number"
                                id={`invoiceNumber${row.id}`}
                                className="form-control"
                                style={{
                                  backgroundColor: "#43596c",
                                  color: "white",
                                }}
                                value={row.invoiceNumber}
                                readOnly
                              />
                            </td>

                            <td style={{ width: "13%" }}>
                              <input
                                type="number"
                                name="invoice_amount"
                                id={`invoiceAmount${row.id}`}
                                className="form-control"
                                style={{
                                  backgroundColor: "#43596c",
                                  color: "white",
                                }}
                                value={row.total}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                name="payment"
                                id={`payment${row.id}`}
                                value={row.payment}
                                onChange={(e) =>
                                  handleInvoiceItemsInputChange(
                                    row.id,
                                    e.target.value
                                  )
                                }
                                className="form-control payment"
                                step="any"
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
                                name="balance"
                                id={`balance${row.id}`}
                                className="form-control bal"
                                value={row.balance}
                                readOnly
                                style={{
                                  backgroundColor: "#43596c",
                                  color: "white",
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row clearfix" style={{ marginTop: "20px" }}>
                  <div className="col-md-7"></div>
                  <div
                    className="col-md-5 table-responsive-md mt-3 "
                    id="paymentItemsTableTotal"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(128, 128, 128, 0.6)",
                      marginLeft: "-2vh",
                    }}
                  >
                    <div className="p-3">
                      <div className="row container-fluid p-2 m-0">
                        <div className="col-sm-4 mt-2">
                          <label className="text-center">Total Amount</label>
                        </div>
                        <div className="col-sm-1 mt-2">:</div>
                        <div className="col-sm-7 mt-2">
                          <input
                            type="number"
                            step="any"
                            name="totalAmount"
                            value={totalAmount}
                            readOnly
                            style={{ backgroundColor: "#37444f" }}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="row container-fluid p-2 m-0">
                        <div className="col-sm-4 mt-2">
                          <label className="text-center">Total Payment</label>
                        </div>
                        <div className="col-sm-1 mt-2">:</div>
                        <div className="col-sm-7 mt-2">
                          <input
                            type="number"
                            step="any"
                            name="totalPayment"
                            style={{ backgroundColor: "#37444f" }}
                            value={totalPayment}
                            readOnly
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="row container-fluid p-2 m-0">
                        <div className="col-sm-4 mt-2">
                          <label className="text-center">Total Balance</label>
                        </div>
                        <div className="col-sm-1 mt-2">:</div>
                        <div className="col-sm-7 mt-2">
                          <input
                            type="number"
                            name="totalBalance"
                            value={totalBalance}
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
                  <div className="col-md-7 mt-3"></div>
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
                      onClick={() => navigate(`/view_payment_received/${paymentId}/`)}
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
                        placeholder="finsys@gmail.com"
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
                        placeholder="www.finsys.com"
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
    </>
  );
}

export default EditPaymentReceived;
