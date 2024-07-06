import React, { useState,useEffect ,useRef} from "react";
import FinBase from "../FinBase";
import { Link,useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";





function Addbankholder() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();
  
  const [holder,setHolder] = useState('')
  const [alias,setAlias] = useState('')
  const [phone,setPhone] = useState('')
  const [mail,setMail] = useState('')
  const [accounttypye,setAccounttype] = useState('')
  const [bank,setBank] = useState('')
  //const [accountno,setAccountno] = useState('')
  //const [ifsc,setIfsc] = useState('')
  const [swift,setSwift] = useState('')
  //const [branch,setBranch] = useState('')
  const [checkbookrange,setCheckbookrange] = useState('')
  const [checkprint,setCheckprint] = useState('')
  const [checkprintconfig,setCheckprintconfig] = useState('')
  const [mailname,setMailname] = useState('')
  const [address,setaddress] = useState('')
  const [country,setCountry] = useState('')
  const [state,setState] = useState('')
  const [pin,setPin] = useState('')
  const [pan,setPan] = useState('')
  const [regtype,setRegtype] = useState('')
  const [gstno,setGstno] = useState('')
  const [altergst,setAltergst] = useState('')
  const [date,setDate] = useState('')
  const [amount,setAmount] = useState('')
  //const [type,setType] = useState('')
  const [panError,setPanError] = useState('')
  const [gstError,setGstError] = useState('')
  const [emailError, setEmailError] = useState('');
 const [phoneError, setPhoneError] = useState('');
  const accountNumberRef = useRef(null);
  const ifscCodeRef = useRef(null);
  const branchNameRef = useRef(null);
  const bankref = useRef(null);
  const type = useRef(null)
  



  const [modalbank,setBankmodal] = useState('')
  const [modalaccountno,setAccountnomodal] = useState('')
  const [modalifsc,setIfscmodal] = useState('')
  
  const [modalbranch,setBranchmodal] = useState('')
  const [openbal,setOpenbal] = useState('')
  const [opentype,setOpentype] = useState('')
  const [bankdate,setBankDate] = useState('')
  const [ifscError, setIfscError] = useState('');
  const [accountNoError, setAccountNoError] = useState('');

  const [banks,setbanks]=useState([])
  const [selectedBank, setSelectedBank] = useState('');
  const [bankDetail, setBankDetail] = useState({ accountNumber: '',ifscCode: '',branchName: '',});




  useEffect(() => {
    
    const getCurrentDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      
      if (month < 10) {
        month = `0${month}`;
      }
      if (day < 10) {
        day = `0${day}`;
      }

      return `${year}-${month}-${day}`;
    };



    
    setDate(getCurrentDate());
    setBankDate(getCurrentDate());
  }, []); 

  const fetchbanks = () => {
    axios
      .get(`${config.base_url}/get_banks/${ID}/`)
      .then((res) => {
        console.log("banks==", res);
        if (res.data.status) {
          
          setbanks(res.data.bank);
         
            
         
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBankDetails = (bankId) => {
    axios
      .get(`${config.base_url}/get_bank_details/${bankId}/${ID}/`)
      .then((res) => {
        console.log("bank details==", res);
        if (res.data.status) {
          const { account_number, ifsc_code, branch_name } = res.data.bank[0];
          setBankDetail({ 
            accountNumber: account_number, 
            ifscCode: ifsc_code, 
            branchName: branch_name 
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchbanks();
  }, []);

  const handleBankChange = (e) => {
    const selectedBankId = e.target.value;
    setSelectedBank(selectedBankId);
    fetchBankDetails(selectedBankId);
    setBank(e.target.value)
  };




  function handleBankModalSubmit(e) {
    e.preventDefault();
    
    if (modalbank != "" && modalaccountno != "" && modalifsc != "" && modalbranch != "" && openbal !="" && opentype !="") {
      var u = {
        Id: ID,
        bank_name: modalbank,
        account_number:modalaccountno,
        ifsc_code : modalifsc,
        branch_name : modalbranch,
        opening_balance : openbal,
        opening_balance_type : opentype,
        date : bankdate,
        bank_status : 'Active'
        
      };
      axios
        .post(`${config.base_url}/holder_create_new_bank/`, u)
        .then((res) => {
          console.log("BANK RES=", res);
          if (res.data.status) {
            Toast.fire({
              icon: "success",
              title: "bank Created",
            });
            //fetchItemUnits();
            //setUnit(u.name);
            //setNewUnit("");
            fetchbanks();
            setSelectedBank()
            setBankmodal("");
            setIfscmodal("");
            setAccountnomodal("");
            setBranchmodal("");
            setOpenbal("");
            
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

  const validateIfsc = (value) => {
    const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscPattern.test(value)) {
      setIfscError('Invalid IFSC code. It should be 11 characters long and follow the pattern: 4 letters, 0, 6 alphanumeric characters.');
    } else {
      setIfscError('');
    }
  };

  const validateAccountNo = (value) => {
    const accountNoPattern = /^\d{9,18}$/;
    if (!accountNoPattern.test(value)) {
      setAccountNoError('Invalid account number. It should be between 9 and 18 digits long.');
    } else {
      setAccountNoError('');
    }
  };

  function validatePan(pan) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i; 
    if (!panRegex.test(pan)) {
      setPanError("Invalid PAN. The PAN should be 10 characters long and follow this pattern: 5 letters (A-Z), 4 digits (0-9), and 1 letter (A-Z). Example: ABCDE1234F.");
    } else {
      setPanError('');
    }
  }
  
  function validateGst(gst) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i; 
    if (!gstRegex.test(gst)) {
      setGstError("Invalid GST. The GST should be 15 characters long and follow this pattern: 2 digits for state code, 10 characters of PAN (5 letters, 4 digits, 1 letter), 1 alphanumeric character (1-9, A-Z), 'Z', and 1 alphanumeric character (0-9, A-Z). Example: 27ABCDE1234F1Z5.");
    } else {
      setGstError('');
    }
  }

  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(mail)) {
      setEmailError("Invalid email. The email should be in the format: example@example.com.");
    } else {
      setEmailError('');
    }
  }
  
  function validatePhone(phone) {
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("Invalid phone number. The phone number should be 10 digits long. ");
    } else {
      setPhoneError('');
    }
  }

  const handleIfscChange = (e) => {
    const value = e.target.value.toUpperCase();
    setIfscmodal(value);
    validateIfsc(value);
  };

  const handleAccountNoChange = (e) => {
    const value = e.target.value;
    setAccountnomodal(value);
    validateAccountNo(value);
  };
  const handlepanChange = (e) => {
    const value = e.target.value;
    setPan(value);
    validatePan(value);
  };
  const handlegstChange = (e) => {
    const value = e.target.value;
    setGstno(value);
    validateGst(value);
  };
  const handlePhone= (e) => {
    const value = e.target.value;
    setPhone(value);
    validatePhone(value);
  };
  const handleEmail = (e) => {
    const value = e.target.value;
    setMail(value);
    validateEmail(value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
   console.log("gst=",gstno)

    var dt = {
      Id: ID,
      Holder_name : holder,
      Alias : alias,
      phone_number :phone,
      Email : mail,
      Account_type : accounttypye,
      Set_cheque_book_range : checkbookrange,
      Enable_cheque_printing : checkprint,
      Set_cheque_printing_configuration : checkprintconfig,
      Mailing_name : mailname,
      Address : address,
      Country :country,
      State : state,
      Pin : pin,
      Pan_it_number : pan,
      Registration_type : regtype,
      Gstin_un : gstno,
      Set_alter_gst_details : altergst,
      Date : date,
      Open_type : type.current.value,
      Swift_code : swift,
      Bank_name : bank,
      Ifsc_code : ifscCodeRef.current.value,
      Branch_name : branchNameRef.current.value,
      Account_number : accountNumberRef.current.value,
      Amount : amount,
      status: "Active",

      
    };
    console.log(dt)
    console.log('bank=',bank,'open_type=',type,'enble check print=',checkprint,date,'acc=',accountNumberRef.current.value,'br=',branchNameRef.current.value,'ifsc=',ifscCodeRef.current.value,'bank=',selectedBank)

    axios
      .post(`${config.base_url}/create_new_bank_holder/`,dt)
      .then((res) => {
        console.log("HOLDER RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Bank Holder Created",
          });
          navigate("/banklist");
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


  
  return (
    <>
      <FinBase />
      <div
        className="page-content mt-0 pt-0"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="d-flex justify-content-end mb-1">
          <Link to={"/banklist"}>
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
                <h2 className="mt-3">ADD BANK HOLDER</h2>
              </center>
              <hr />
            </div>
          </div>
        </div>

        <div className="card radius-15">
          <div className="card-body">
          <form
              className="needs-validation px-1"
              onSubmit={handleSubmit}
              validate
            >
           
              <div className="row w-100">
                <div className="col-md-12 mx-0">
                  <div className="row">
                    <div className="col-md-6">
                      <h4 className="text-center">Bank Account Holder Form</h4>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="name" style={{ color: "white" }}>
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="form-control"
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          autoComplete="off"
                          onChange={(e) => setHolder(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="alias" style={{ color: "white" }}>
                          Alias
                        </label>
                        <input
                          type="text"
                          id="alias"
                          name="alias"
                          className="form-control"
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          autoComplete="off"
                          onChange={(e) => setAlias(e.target.value)}
                         
                        />
                      </div>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="phoneNumber" style={{ color: "white" }}>
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phoneNumber"
                          name="phoneNumber"
                          className="form-control"
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          autoComplete="off"
                          onChange={handlePhone}
                          required
                        />
                        {phoneError && <div className="text-danger mt-2">{phoneError}</div>}
                      </div>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="email" style={{ color: "white" }}>
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          autoComplete="off"
                          onChange={handleEmail}
                          required
                        />
                        {emailError && <div className="text-danger mt-2">{emailError}</div>}
                      </div>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="accountType" style={{ color: "white" }}>
                          Account Type
                        </label>
                        <select
                          name="bankName"
                          className="form-control"
                          id="bankName"
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          onChange={(e) => setAccounttype(e.target.value)}
                          required
                        >
                          <option selected disabled value="">
                            Choose...
                          </option>
                         
                          <option value="BA">Bank Account</option>
                          <option value="CC">Credit Card</option>
                          
                        </select>
                      
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h4 className="text-center">Bank Account Form</h4>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="bankName" style={{ color: "white" }}>
                          Bank Name
                        </label>
                        <div className="d-flex align-items-center">
                        <select
                          name="bankName"
                          className="form-control"
                          id="bankName"
                          onChange={handleBankChange}
                          ref={bankref}
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          required
                        >
                          <option selected disabled value="">
                            Choose...
                          </option>
                         
                          {banks &&
                            banks.map((i) => (
                              <option value={i.id} className="text-uppercase">
                                {i.bank_name}
                              </option>
                            ))}
                        </select>
                      
                       
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
                       
                      </div>
                      </div>
                      <div className="col-md-12 mt-3">
        <label htmlFor="accountNumber" style={{ color: "white" }}>
          Account Number
        </label>
        <input
          type="text"
          id="accountNumber"
          name="accountNumber"
          className="form-control"
          style={{ backgroundColor: "#2a4964", color: "white" }}
          value={bankDetail.accountNumber}
          ref={accountNumberRef}
          readOnly
        />
      </div>
      <div className="col-md-12 mt-3">
        <label htmlFor="ifscCode" style={{ color: "white" }}>
          IFSC Code
        </label>
        <input
          type="text"
          id="ifscCode"
          name="ifscCode"
          className="form-control"
          style={{ backgroundColor: "#2a4964", color: "white" }}
          value={bankDetail.ifscCode}
          ref={ifscCodeRef}
          readOnly
        />
      </div>
      <div className="col-md-12 mt-3">
        <label htmlFor="branchName" style={{ color: "white" }}>
          Branch Name
        </label>
        <input
          type="text"
          id="branchName"
          name="branchName"
          className="form-control"
          style={{ backgroundColor: "#2a4964", color: "white" }}
          value={bankDetail.branchName}
          ref={branchNameRef}
          readOnly
        />
      </div>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="swiftCode" style={{ color: "white" }}>
                          SWIFT Code
                        </label>
                        <input
                          type="text"
                          id="swiftCode"
                          name="swiftCode"
                          className="form-control"
                          onChange={(e) => setSwift(e.target.value)}
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          required
                        />
                      </div>
                    </div>
                  </div> 
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <h4 className="text-center">Bank Configuration Form</h4>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="chequeBookRange" style={{ color: "white" }}>
                          Set Cheque Book Range
                        </label>
                        <select
                          name="chequeBookRange"
                          className="form-control"
                          id="chequeBookRange"
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          onChange={(e) => setCheckbookrange(e.target.value)}
                          required
                        >
                          <option selected disabled value="">
                            Choose...
                          </option>
                          <option value="True">Yes</option>
                          <option value="False">No</option>
                        </select>
                      </div>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="chequePrinting" style={{ color: "white" }}>
                          Enable Cheque Printing
                        </label>
                        <select
                          name="chequePrinting"
                          className="form-control"
                          id="chequePrinting"
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          onChange={(e) => setCheckprint(e.target.value)}
                          required
                        >
                          <option selected disabled value="">
                            Choose...
                          </option>
                          <option value="True">Yes</option>
                          <option value="False">No</option>
                        </select>
                      </div>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="chequePrintingConfig" style={{ color: "white" }}>
                          Set Cheque Printing Configuration
                        </label>
                        <select
                          name="chequePrintingConfig"
                          className="form-control"
                          id="chequePrintingConfig"
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          onChange={(e) => setCheckprintconfig(e.target.value)}
                          required
                        >
                          <option selected disabled value="">
                            Choose...
                          </option>
                          <option value="True">Yes</option>
                          <option value="False">No</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h4 className="text-center">Mailing Address Form</h4>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="mailingName" style={{ color: "white" }}>
                          Mailing Name
                        </label>
                        <input
                          type="text"
                          id="mailingName"
                          name="mailingName"
                          className="form-control"
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          onChange={(e) => setMailname(e.target.value)}
                        />
                      </div>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="address" style={{ color: "white" }}>
                          Address
                        </label>
                        <textarea
                        id="address"
                        name="address"
                        className="form-control"
                        style={{ backgroundColor: "#2a4964", color: "white" }}
                        onChange={(e) => setaddress(e.target.value)}
                      ></textarea>
                      </div>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="country" style={{ color: "white" }}>
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          className="form-control"
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          onChange={(e) => setCountry(e.target.value)}
                        />
                      </div>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="state" style={{ color: "white" }}>
                          State
                        </label>
                        <select
                          type="text"
                          className="form-control"
                          id="state"
                          name="state"
                          
                          required
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          onChange={(e) => setState(e.target.value)}
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
                          <option value="Other Territory">
                            Other Territory
                          </option>
                        </select>
                      </div>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="pin" style={{ color: "white" }}>
                          PIN
                        </label>
                        <input
                          type="text"
                          id="pin"
                          name="pin"
                          className="form-control"
                          onChange={(e) => setPin(e.target.value)}
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <h4 className="text-center">Tax Registration Form</h4>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="panNumber" style={{ color: "white" }}>
                          PAN IT Number
                        </label>
                        <input
                          type="text"
                          id="panNumber"
                          name="panNumber"
                          className="form-control text-uppercase"
                          onChange={handlepanChange}
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                        />
                        {panError && <div className="text-danger mt-2">{panError}</div>}
                      </div>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="registrationType" style={{ color: "white" }}>
                          Registration Type
                        </label>
                        <select
                          name="registrationType"
                          className="form-control"
                          id="registrationType"
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          onChange={(e) => setRegtype(e.target.value)}
                          required
                        >
                          <option selected disabled value="">
                            Choose...
                          </option>
                          <option value="Regular">Regular</option>
                          <option value="Composition">Composition</option>
                          <option value="Consumer">Consumer</option>
                          <option value="Unregister">Unregister</option>
                        </select>
                      </div>
                      {(regtype === 'Regular' || regtype === 'Composition') && (
                        <div className="col-md-12 mt-3">
                          <label htmlFor="gstin" style={{ color: "white" }}>
                            GST IN
                          </label>
                          <input
                            type="text"
                            id="gstin"
                            name="gstin"
                            className="form-control text-uppercase"
                            onChange={handlegstChange}
                            style={{ backgroundColor: "#2a4964", color: "white" }}
                          />
                        </div>
                         
                      )}
                      {gstError && <div className="text-danger mt-2">{gstError}</div>}
                      <div className="col-md-12 mt-3">
                        <label htmlFor="alterGstDetails" style={{ color: "white" }}>
                          Set Alter GST Details
                        </label>
                        <select
                          name="alterGstDetails"
                          className="form-control"
                          id="alterGstDetails"
                          onChange={(e) => setAltergst(e.target.value)}
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                          required
                        >
                          <option selected disabled value="">
                            Choose...
                          </option>
                          <option value="True">Yes</option>
                          <option value="False">No</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h4 className="text-center">Opening Balance Form</h4>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="date" style={{ color: "white" }}>
                          Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          className="form-control"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                        />
                      </div>
                      <div className="col-md-12 mt-3">
                        <label htmlFor="amount" style={{ color: "white" }}>
                          Amount
                        </label>
                        <div className="d-flex">
                        <input
                          type="text"
                          id="amount"
                          name="amount"
                          className="form-control"
                          onChange={(e) => setAmount(e.target.value)}
                          style={{ backgroundColor: "#2a4964", color: "white" }}
                        />
                        <select
                          name="alterGstDetails"
                          className="form-control"
                          id="alterGstDetails"
                          style={{ backgroundColor: "#2a4964", color: "white",width:'150px' }}
                          //onChange={(e) => setType(e.target.value)}
                        ref={type}
                          required
                        >
                          
                          <option value="credit">CREDIT</option>
                          <option value="debit">DEBIT</option>
                        </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-check mt-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="agreeTerms"
                      name="agreeTerms"
                      required
                    />
                    <label
                      className="form-check-label"
                      htmlFor="agreeTerms"
                      style={{ color: "white" }}
                    >
                      Agree to terms and conditions
                    </label>
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
                        to="/banklist"
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




 {/* <!-- bank Create Modal --> */}
 <div className="modal fade" id="createNewUnit">
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">ADD BANK</h5>
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
               
                  <div className="row mt-2 w-100">
                    <div className="col-12">
                      <label for="name">Bank Name</label>
                      <input
                        name="name"
                        id="unit_name"
                        value={modalbank}
                        onChange={(e) => setBankmodal(e.target.value)}
                        className="form-control  w-100"
                        required
                      />
                    </div>
                  
                    <div className="col-12 mt-2">
                      <label for="name">IFSC Code</label>
                      <input
                        name="name"
                        id="unit_name"
                        value={modalifsc}
                        onChange={handleIfscChange}
                        className="form-control  w-100"
                        required
                      />
                       {ifscError && <div className="text-danger mt-2">{ifscError}</div>}
                    </div>


                    <div className="col-12 mt-2">
                      <label for="name">Account Number</label>
                      <input
                        name="name"
                        id="unit_name"
                        value={modalaccountno}
                        onChange={handleAccountNoChange}
                        className="form-control  w-100"
                        required
                      />
                      {accountNoError && <div className="text-danger mt-2">{accountNoError}</div>}
                    </div>
                    <div className="col-12 mt-2">
                      <label for="name">Branch Name</label>
                      <input
                        name="name"
                        id="unit_name"
                        value={modalbranch}
                        onChange={(e) => setBranchmodal(e.target.value)}
                        className="form-control  w-100"
                        required
                      />
                    </div>
                    <div className="col-12 mt-2">
                      <label for="name">Opening Balnce</label>
                      <div className="d-flex">
                      <input
                        name="name"
                        id="unit_name"
                        value={openbal}
                        onChange={(e) => setOpenbal(e.target.value)}
                        className="form-control text-uppercase w-100"
                        required
                      />
                      <select
                          name="alterGstDetails"
                          className="form-control"
                          id="alterGstDetails"
                          
                          onChange={(e) => setOpentype(e.target.value)}
                          style={{ backgroundColor: "#2a4964", color: "white",width:'150px' }}
                          required
                        >
                        
                          <option value="credit">CREDIT</option>
                          <option value="debit">DEBIT</option>
                        </select>

                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <label for="name">Date</label>
                      <input type="date"
                        name="name"
                        id="unit_name"
                        value={bankdate}
                        onChange={(e) => setBankDate(e.target.value)}
                        className="form-control  w-100"
                        required
                      />
                    </div>



                  </div>
                  <div className="row mt-4 w-100">
                    <div className="col-12 d-flex justify-content-center">
                      <button
                        className="btn btn-outline-info text-grey"
                        data-dismiss="modal"
                        type="submit"
                        onClick={handleBankModalSubmit}
                        id="saveItemUnit"
                      >
                        Save
                      </button>
                    </div>
                  </div>
               
              </div>
            </div>
          </div>
        </div>
      </div>




    </>
  );
}

export default Addbankholder;