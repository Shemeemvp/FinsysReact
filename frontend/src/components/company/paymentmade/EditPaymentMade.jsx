import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import Select from "react-select";

function EditPaymentMade() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const [vendors, setVendors] = useState([]);
  const [terms, setTerms] = useState([]);
  const [banks, setBanks] = useState([]);
  const [vendorPriceLists, setVendorPriceLists] = useState([]);
  const [vendorValue, setVendorValue] = useState({});

  const fetchPaymentData = () => {
    axios
      .get(`${config.base_url}/fetch_payment_made_data/${ID}/`)
      .then((res) => {
        if (res.data.status) {
          let vend = res.data.vendors;
          let trms = res.data.paymentTerms;
          let bnks = res.data.banks;
          let clst = res.data.vendPriceList;
          setVendorPriceLists([]);
          clst.map((c) => {
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
      .get(`${config.base_url}/fetch_payment_made_data/${ID}/`)
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
      .get(`${config.base_url}/fetch_payment_made_details/${paymentId}/`)
      .then((res) => {
        if (res.data.status) {
          var pay = res.data.payment;
          var itms = res.data.items;
          var cust = res.data.otherDetails;

          var c = {
            value: pay.Vendor,
            label: pay.vendor_name,
          };
          setVendorValue(c);

          setVendor(pay.Customer);
          setEmail(pay.vendor_email);
          setGstType(pay.vendor_gst_type);
          setGstIn(pay.vendor_gstin);
          setBillingAddress(pay.vendor_address);
          setSourceOfSupply(pay.vendor_source_of_supply)
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
              billType: i.bill_type,
              billNumber: i.bill_number,
              total: i.total_amount,
              payment: i.payment,
              balance: i.balance_amount
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

  const [vendor, setVendor] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [email, setEmail] = useState("");
  const [gstType, setGstType] = useState("");
  const [gstIn, setGstIn] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [sourceOfSupply, setSourceOfSupply] = useState("");
  const [refNo, setRefNo] = useState("");
  const [paymentNo, setPaymentNo] = useState("");
  const [nextPaymentNo, setNextPaymentNo] = useState("");
  const [date, setDate] = useState(formattedDate);
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
      billType: "",
      billNumber: "",
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
    formData.append("Vendor", vendor);
    formData.append("vendor_name", vendorName);
    formData.append("vendor_email", email);
    formData.append("vendor_address", billingAddress);
    formData.append("vendor_gst_type", gstType);
    formData.append("vendor_gstin", gstIn);
    formData.append("vendor_source_of_supply", sourceOfSupply);
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
      .put(`${config.base_url}/update_payment_made/`, formData)
      .then((res) => {
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Payment Updated",
          });
          navigate(`/view_payment_made/${paymentId}/`);
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
    getVendorBills(value);
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
            setVendorName("");
            setEmail("");
            setGstType("");
            setGstIn("");
            setBillingAddress("");
            setSourceOfSupply("");
            var vend = res.data.vendorDetails;
            setVendorName(vend.name);
            setEmail(vend.email);
            setGstType(vend.gstType);
            setGstIn(vend.gstIn);
            setBillingAddress(vend.address);
            setSourceOfSupply(vend.placeOfSupply);
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
        });
    } else {
      setEmail("");
      setVendorName("");
      setSourceOfSupply("");
      setGstType("");
      setGstIn("");
      setBillingAddress("");
    }
  }

  function getVendorBills(vendorId) {
    if (vendorId != "") {
      var data = {
        Id: ID,
        vendId: vendorId,
      };

      axios
        .get(`${config.base_url}/get_payment_bills/`, { params: data })
        .then((res) => {
          if (res.data.status) {
            setPaymentItems([]);
            var payItms = res.data.payItems;
            const payItems = payItms.map((i, index) => {
              var obj = {
                id: index + 1,
                date: i.date,
                billType: i.type,
                billNumber: i.number,
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
                billType: "",
                billNumber: "",
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
            billType: "",
            billNumber: "",
            total: "",
            payment: "",
            balance: "",
          });
        });
    } else {
      setPaymentItems({
        id: 1,
        date: "",
        billType: "",
        billNumber: "",
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
        .get(`${config.base_url}/check_payment_made_no/`, { params: s })
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

  const handleBillItemsInputChange = (id, value) => {
    const payItems = paymentItems.map((item) => {
      return item.id === id
        ? {
            ...item,
            payment: parseFloat(value),
            balance: (
              parseFloat(item.total || 0) - parseFloat(value || 0)
            ).toFixed(2),
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
          <Link to={`/view_payment_made/${paymentId}/`}>
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
                <h2 className="mt-3">EDIT PAYMENT MADE</h2>
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
                        value={vendorValue||null}
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
                          <th className="text-center">BILL TYPE</th>
                          <th className="text-center">BILL NUMBER</th>
                          <th className="text-center">AMOUNT</th>
                          <th className="text-center">PAYMENT</th>
                          <th className="text-center">BALANCE</th>
                        </tr>
                      </thead>
                      <tbody id="items-table-body">
                        {paymentItems.length > 0 &&
                          paymentItems.map((row) => (
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
                              <td style={{ width: "20%" }}>
                                <input
                                  type="text"
                                  name="bill_type"
                                  id={`billType${row.id}`}
                                  className="form-control"
                                  style={{
                                    backgroundColor: "#43596c",
                                    color: "white",
                                  }}
                                  value={row.billType}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="bill_number"
                                  id={`billNumber${row.id}`}
                                  className="form-control"
                                  style={{
                                    backgroundColor: "#43596c",
                                    color: "white",
                                  }}
                                  value={row.billNumber}
                                  readOnly
                                />
                              </td>

                              <td style={{ width: "13%" }}>
                                <input
                                  type="number"
                                  name="amount"
                                  id={`Amount${row.id}`}
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
                                    handleBillItemsInputChange(
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
                      onClick={() => navigate(`/view_payment_made/${paymentId}/`)}
                      value="Cancel"
                      style={{ height: "fit-content" }}
                    />
                  </div>
                </div>
                <div className="notices mt-3">
                  <div className="text-muted">NOTICE:</div>
                  <div className="text-muted">
                    Accuhub Terms and Conditions Apply
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
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

export default EditPaymentMade;
