import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate,useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";

const EmployeeEdit = () => {
    const { itemId } = useParams();

    const ID = Cookies.get("Login_id");
    const navigate = useNavigate();
    const [bloodGroups, setBloodGroups] = useState([]);
    const [newUnit, setNewUnit] = useState("");
  
  
    const fetchBloodGroups = () => {
      axios
        .get(`${config.base_url}/create_new_employee/${ID}/`)
        .then((res) => {
          if (res.data.status) {
            setBloodGroups(res.data.bloodgp);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };
  
    useEffect(() => {
      fetchBloodGroups();
    }, []);
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
  
    function handleUnitModalSubmit(e) {
      e.preventDefault();
      var name = newUnit;
      console.log(name)
      if (name != "") {
        var u = {
          Id: ID,
          blood_group: newUnit,
        };
        console.log(u)
        axios
          .post(`${config.base_url}/create_new_bloodgroup/`, u)
          .then((res) => {
            console.log("UNIT RES=", res);
            if (res.data.status) {
              Toast.fire({
                icon: "success",
                title: "bloodgroup Created",
              });
              fetchBloodGroups();
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
    const [sameAddress, setSameAddress] = useState(false);
    const [tdsApplicable, setTdsApplicable] = useState('');
    const [tdsType, setTdsType] = useState('');
    const [bankDetails, setBankDetails] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [age, setAge] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [isBankInfoVisible, setIsBankInfoVisible] = useState(false);
    const [isTdsInfoVisible, setIsTdsInfoVisible] = useState(false);
    const [isTdsPercentageVisible, setIsTdsPercentageVisible] = useState(false);
    const [isTdsAmountVisible, setIsTdsAmountVisible] = useState(false);
    const [salaryType, setSalaryType] = useState('');
    const [amountPerHour, setAmountPerHour] = useState(0);
    const [workingHours, setWorkingHours] = useState(0);
    const [salaryAmount, setSalaryAmount] = useState('');
    const [presentAddress, setPresentAddress] = useState({
      address: '',
      city: '',
      state: '',
      pincode: '',
      country:'',
    });
    const [permanentAddress, setPermanentAddress] = useState({
      address: '',
      city: '',
      state: '',
      pincode: '',
      country:'',
    
    });
    const [Title, setTitle] = useState('');
    const [First_Name, setFirstName] = useState('');
    const [Last_Name, setLastName] = useState('');
    const [Alias, setAlias] = useState('');

    const [Email, setEmail] = useState("");
    const [Employee_Number, setEmployee_Number] = useState("");
    const [Designation, setDesignation] = useState("");
    const [CurrentLocation, setCurrentLocation] = useState("");
    const [Gender, setGender] = useState("");
    const [DOB, setDOB] = useState("");
    const [Blood, setBlood] = useState("");
    const [parent, setparent] = useState("");
    const [Spouse, setSpouse] = useState("");
    const [Number2, setNumber2] = useState("");
    const [Account_Number, setAccountNumber] = useState("");
    const [IFSC, setIFSC] = useState("");
    const [BankName, setBankName] = useState("");
    const [branch_name, setBranchName] = useState("");
    const [PAN, setPAN] = useState("");
    const [PR, setPR] = useState(0);
    const [UAN, setUAN] = useState("");
    const [PF, setPF] = useState("");
    const [Income_Tax, setIncome_Tax] = useState("");
    const [Aadhar, setAadhar] = useState(0);
    const [ESI, setESI] = useState("");
    const [salary_details, setSalaryDetails] = useState({});
    const [TDS_Amount, setTdsAmount] = useState('0');
    const [TDS_Percentage, setTdsPercentage] = useState('0');
    const [formData, setFormData] = useState({});
    const [Salary_Date, setSalaryDate] = useState(new Date());
    const [contact, setContact] = useState('');
    const [image, setimage] = useState('');
    
const fetchItemDetails = () => {
    axios
      .get(`${config.base_url}/fetch_employee_details/${itemId}/`)
      .then((res) => {
        console.log("ITEM DATA=", res);
        console.log("ok")
        if (res.data.status) {
          var itm = res.data.item;
          setFirstName(itm.first_name)
          setTitle(itm.title)
          setLastName(itm.last_name)
          setAlias(itm.alias)
          setEmail(itm.employee_mail)
          setEmployee_Number(itm.employee_number)
          setDesignation(itm.employee_designation)
          setCurrentLocation(itm.employee_current_location)
          setJoiningDate(itm.date_of_joining)
          setGender(itm.gender)
          setDOB(itm.date_of_birth)
          setAge(itm.age)
          setBlood(itm.blood_group)
          setparent(itm.fathers_name_mothers_name)
          setSpouse(itm.spouse_name)
          setNumber2(itm.emergency_contact)
          setTransactionType(itm.bank_transaction_type)
          setBankDetails(itm.provide_bank_details)
          setAccountNumber(itm.account_number)
          setIFSC(itm.ifsc)
          setBankName(itm.name_of_bank)
          setBranchName(itm.branch_name)
          setTdsApplicable(itm.tds_applicable)
          setTdsType(itm.tds_type)
          
          setTdsAmount(itm.percentage_amount)
          setTdsPercentage(itm.percentage_amount)
          setSalaryDate(itm.salary_effective_from)
          setSalaryType(itm.employee_salary_type)
          setSalaryAmount(itm.salary_amount)
          setAmountPerHour(itm.amount_per_hour)
          setWorkingHours(itm.total_working_hours)
          setPAN(itm.pan_number)
          setPR(itm.pr_account_number)
          setUAN(itm.universal_account_number)
          setPF(itm.pf_account_number)
          setIncome_Tax(itm.income_tax_number)
          setAadhar(itm.aadhar_number)
          setContact(itm.mobile)
        
          setPresentAddress({
            address: itm.street || '',
            city: itm.city || '',
            state: itm.state || '',
            pincode: itm.pincode || '',
            country: itm.country || ''
          });
          setPermanentAddress({
            address: itm.temporary_street || '',
            city: itm.temporary_city || '',
            state: itm.temporary_state || '',
            pincode: itm.temporary_pincode || '',
            country: itm.temporary_country || ''
          });        }
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

    const handleImageChange= (e) => {
      const image = e.target.files[0];
      setimage(image);
    };
    useEffect(() => {
        fetchItemDetails();
      }, []);

    // const handleSalaryTypeChange = (event) => {
    //   setSalaryType(event.target.value);
    //   // Reset the salary amount and other inputs when the salary type changes
    //   setSalaryAmount('');
    //   setAmountPerHour('');
    //   setWorkingHours('');
    // };
    const handleSubmit = (e) => {
      e.preventDefault();
    
      const formData = new FormData();
      formData.append('Id', ID);
      formData.append('itemId', itemId);
      formData.append('Title', Title);
      formData.append('First_Name', First_Name);
      formData.append('Last_Name', Last_Name);
      formData.append('Joining_Date', joiningDate);
      formData.append('Salary_Date', Salary_Date);
      formData.append('Salary_Type', salaryType);
      formData.append('Salary_Amount', salaryAmount);
      formData.append('Amount_Per_Hour', amountPerHour);
      formData.append('Working_Hours', workingHours);
      formData.append('Alias', Alias);
      formData.append('Employee_Number', Employee_Number);
      formData.append('Designation', Designation);
      formData.append('Location', CurrentLocation);
      formData.append('Gender', Gender);
      formData.append('DOB', DOB);
      formData.append('Age', age);
      formData.append('Blood_Group', Blood);
      formData.append('Contact_Number', contact);
      formData.append('Emergency_Contact_Number', Number2);
      formData.append('Personal_Email', Email);
      formData.append('Parent_Name', parent);
      formData.append('Spouse_Name', Spouse);
      formData.append('file', file);
      formData.append('image', image);
      formData.append('Bank_Details', bankDetails);
      formData.append('TDS_Applicable', tdsApplicable);
      formData.append('Account_Number', Account_Number);
      formData.append('IFSC', IFSC);
      formData.append('Bank_Name', BankName);
      formData.append('Branch_Name', branch_name);
      formData.append('Transaction_Type', transactionType);
      formData.append('TDS_Type', tdsType);
      formData.append('TDS_Amount', TDS_Amount);
      formData.append('TDS_Percentage', TDS_Percentage);

      formData.append('Present_Address', JSON.stringify(presentAddress));
      formData.append('Permanent_Address', JSON.stringify(permanentAddress));
      formData.append('PAN', PAN);
      formData.append('Income_Tax', Income_Tax);
      formData.append('Aadhar', Aadhar);
      formData.append('UAN', UAN);
      formData.append('PF', PF);
      formData.append('PR', PR);
        
      axios.put(`${config.base_url}/update_employee/`, formData)
      
      .then((res) => {
        console.log("ITM RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Employee updated",
          });
          navigate(`/employeeoverview/${itemId}/`);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'Title':
        setTitle(value);
        break;
      case 'First_Name':
        setFirstName(value);
        break;
      case 'Last_Name':
        setLastName(value);
        break;
      case 'Alias':
        setAlias(value);
        break;
      case 'Salary_Date':
        setSalaryDate(value);
        break;
      case 'Joining_Date':
        setJoiningDate(value);
        break;
      case 'Employee_Number':
        setEmployee_Number(value);
        break;
      case 'Designation':
        setDesignation(value);
        break;
      case 'Location':
        setCurrentLocation(value);
        break;
      case 'Gender':
        setGender(value);
        break;
      case 'Blood':
        setBlood(value);
        break;
      case 'Contact_Number':
        setContact(value);
        break;
      case 'Emergency_Contact_Number':
        setNumber2(value);
        break;
      case 'Personal_Email':
        setEmail(value);
        break;
      case 'Parent':
        setparent(value);
        break;
      case 'Spouse':
        setSpouse(value);
        break;
      case 'Bank_Details':
        setBankDetails(value);
        break;
      case 'tds_applicable':
        setTdsApplicable(value);
        break;
      case 'Income_Tax':
        setIncome_Tax(value);
        break;
      case 'Aadhar':
        setAadhar(value);
        break;
      case 'UAN':
        setUAN(value);
        break;
      case 'PF':
        setPF(value);
        break;
      case 'PAN':
        setPAN(value);
        break;
      case 'PR':
        setPR(value);
        break;
      case 'ESI':
        setESI(value);
        break;
      case 'Account_Number':
        setAccountNumber(value);
        break;
      case 'IFSC':
        setIFSC(value);
        break;
      case 'BankName':
        setBankName(value);
        break;
      case 'BranchName':
        setBranchName(value);
        break;
      case 'Transaction_Type':
        setTransactionType(value);
        break;
      case 'TDS_Type':
        setTdsType(value);
        break;
      case 'TDS_Percentage':
        setTdsPercentage(value);
        break;
      case 'TDS_Amount':
        setTdsAmount(value);
        break;
    
      default:
        break;
  }
};
const [file, setFile] = useState(null);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  setFile(file);
};

const handlePresentAddressChange = (e) => {
  const { name, value } = e.target;
  setPresentAddress((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handlePermanentAddressChange = (e) => {
  const { name, value } = e.target;
  setPermanentAddress((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSameAddressChange = () => {
  setSameAddress((prev) => !prev);
};

const handleDOBChange = (e) => {
  const dob = e.target.value;
  setDOB(dob);
  setAge(calculateAge(dob));
};

const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// const handleAmountPerHourChange = (event) => {
//   const value = event.target.value;
//   setAmountPerHour(value);
//   calculateAndSetSalary(value, workingHours);
// };

// const handleWorkingHoursChange = (event) => {
//   const value = event.target.value;
//   setWorkingHours(value);
//   calculateAndSetSalary(amountPerHour, value);
// };

// const calculateAndSetSalary = (perHour, hours) => {
//   const totalSalary = (parseFloat(perHour) || 0) * (parseFloat(hours) || 0);
//   setSalaryAmount(totalSalary.toFixed(2));
// };

// const handleSalaryAmountChange = (event) => {
//   if (salaryType !== 'Time Based') {
//     setSalaryAmount(event.target.value);
//   }
// };

const handleBankDetailsChange = (e) => {
  setBankDetails(e.target.value);
};

const handleTdsApplicableChange = (e) => {
  setTdsApplicable(e.target.value);
};

const handleTdsTypeChange = (e) => {
  setTdsType(e.target.value);
};

useEffect(() => {
  setJoiningDate(new Date().toISOString().split('T')[0]);
}, []);

useEffect(() => {
  if (sameAddress) {
    setPermanentAddress({ ...presentAddress });
  }
}, [sameAddress, presentAddress]);

useEffect(() => {
  if (bankDetails === 'Yes') {
    setIsBankInfoVisible(true);
  } else {
    setIsBankInfoVisible(false);
  }
}, [bankDetails]);

useEffect(() => {
  if (tdsApplicable === 'Yes') {
    setIsTdsInfoVisible(true);
  } else {
    setIsTdsInfoVisible(false);
  }
}, [tdsApplicable]);

useEffect(() => {
  if (tdsType === 'Percentage') {
    setIsTdsPercentageVisible(true);
    setIsTdsAmountVisible(false);
  } else if (tdsType === 'Amount') {
    setIsTdsPercentageVisible(false);
    setIsTdsAmountVisible(true);
  } else {
    setIsTdsPercentageVisible(false);
    setIsTdsAmountVisible(false);
  }
}, [tdsType]);

// useEffect(() => {
//   if (salaryType === 'Temporary' || salaryType === 'Fixed') {
//     setSalaryAmount('');
//   } else if (salaryType === 'Time Based') {
//     calculateSalary();
//   }
// }, [salaryType, amountPerHour, workingHours]);

// const calculateSalary = () => {
//   if (amountPerHour > 0 && workingHours > 0) {
//     setSalaryAmount(amountPerHour * workingHours);
//   } else {
//     setSalaryAmount('');
//   }
// };



const handleSalaryTypeChange = (e) => {
  setSalaryType(e.target.value);
  // Reset salaryAmount if switching from Time Based to Fixed or Temporary
  if (e.target.value !== 'Time Based') {
    setSalaryAmount('');
  }
};

const handleSalaryAmountChange = (e) => {
  setSalaryAmount(e.target.value);
};

const handleAmountPerHourChange = (e) => {
  setAmountPerHour(e.target.value);
};

const handleWorkingHoursChange = (e) => {
  setWorkingHours(e.target.value);
};

useEffect(() => {
  if (salaryType === 'Time Based') {
    if (amountPerHour > 0 && workingHours > 0) {
      setSalaryAmount(amountPerHour * workingHours);
    } else {
      setSalaryAmount('0');
    }
  }
}, [salaryType, amountPerHour, workingHours]);



  
  return (
    <>
      <FinBase />
      <div
        className="page-content mt-0 pt-0"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        <div className="d-flex justify-content-end mb-1">
        <Link to={`/employeeoverview/${itemId}/`}>
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
                <h2 className="mt-3">EDIT EMPLOYEE</h2>
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
            <form  onSubmit={handleSubmit} className="needs-validation px-1" validate>
              <br />
              <div className="row w-100">
                <div className="col-md-12 mx-0">
                    
                <div className="row">
            <div className="col-md-6">
                <div className="form-group">
                    <label>Title</label>
                    <select
                    id="Title"
                    name="Title"
                    className="form-control"
                    onChange={handleChange}
                    value={Title}
                  >
                    <option value="">Choose...</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    placeholder="First Name"
                    type="text"
                    id="First_Name"
                    name="First_Name"
                    className="form-control"
                    onChange={handleChange}
                    value={First_Name}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    placeholder="Last Name"
                    type="text"
                    id="Last_Name"
                    name="Last_Name"
                    className="form-control"
                    onChange={handleChange}
                    value={Last_Name}
                  />
                </div>
              </div>
              <div className="col-md-4">
                       <label
                                                htmlFor="Image"
                                                className="ml-5 mt-5"
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '20% 35%',
                                                    backgroundImage: "url('/static/assets/images/upload.png')",
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize: 'contain'
                                                }}
                                            ></label>
                      <br />
                      <span className="ml-5">Upload Image</span>
                      <input 
                        type="file" 
                        name="Image" 
                        id="Image" 
                        accept="image/*" 
                        
                        style={{ display: 'none' }}
                        onChange={handleImageChange}

                      />
                    </div>
                    
                  </div>                  
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label>Alias (optional)</label>
                        <input placeholder="Alias" type="text"
                        id="Alias"
                        name="Alias"
                        className="form-control"
                        onChange={handleChange}
                        value={Alias}
                      />
                      </div>
                      <div className="form-group">
                        <label>Date of Joining</label>
                        <input placeholder="Joining Date" required  type="date"
                        id="Joining_Date"
                        name="Joining_Date"
                        className="form-control"
                        onChange={handleChange}
                        value={joiningDate}
                      />
                      </div>
                    </div>
                    <div className="col">
                        
                      <div className="form-group">
                        <label>Salary Date</label>
                        <select type="date"
                        id="Salary_Date"
                        name="Salary_Date"
                        className="form-control"
                        onChange={handleChange}
                        value={Salary_Date}>
                          <option value="">--select--</option>
                          <option value="1-10">1-10</option>
                          <option value="11-15">11-15</option>
                          <option value="16-31">16-31</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Define salary details</label>
                        <select
                        id="Salary_Type"
                        name="Salary_Type"
                        className="form-control"
                        onChange={handleSalaryTypeChange}
                        value={salaryType}
                        
                        >
                          <option value="">--select--</option>
                          <option value="Fixed">Fixed</option>
                          <option value="Temporary">Temporary</option>
                          <option value="Time Based">Time Based</option>
                        </select>

                        {(salaryType === 'Fixed' || salaryType === 'Temporary' || salaryType === 'Time Based') && (
                          <div className="form-group" id="salary_amount">
                            <label>Salary Amount</label>
                            <input
                              placeholder="Salary Amount"
                              name="Salary_Amount"
                              id="salary_amount2"
                              type="text"
                              className="form-control"
                              value={salaryAmount}
                              onChange={handleSalaryAmountChange}
                              readOnly={salaryType === 'Time Based'}
                            />
                            
                          </div>
                        )}

                        {salaryType === 'Time Based' && (
                          <div id="salary_timebase">
                            <div className="form-group">
                              <label>Amount Per Hour</label>
                              <input
                                placeholder="Amount Per Hour"
                                name="perhour"
                              
                                id="amount_perhour"
                                type="number"
                                className="form-control"
                                value={amountPerHour}
                              onChange={handleAmountPerHourChange}
                              /> 
                            </div>
                            <div className="form-group">
                              <label>Total Working Hour(s)</label>
                              <input
                                placeholder="Total Working Hour(s)"
                                name="workhour"
                                id="working_hours"
                                type="number"
                                className="form-control"
                                value={workingHours}
                              onChange={handleWorkingHoursChange}
                              /> 
                              
                            </div>
                          </div>
                        )}
                      </div>
  
                     
                     
                         
                    </div>
                  </div>
                  <br />
                  <center>
                    <p><b>General Information</b></p>
                  </center>
                  
                  <div className="row">
                    <div className="form-group col">
                      <label>Employee Number</label>
                      <input placeholder="Employee Number" required  
                        type="text"
                        id="Employee_Number"
                        name="Employee_Number"
                        className="form-control"
                        onChange={handleChange}
                        value={Employee_Number}
                      />
                    </div>
                    <div className="form-group col">
                      <label>Designation</label>
                      <input placeholder="Designation"
                      required
                       type="text"
                        id="Designation"
                        name="Designation"
                        className="form-control"
                        onChange={handleChange}
                        value={Designation}/>
                        
                    </div>
                    <div className="form-group col">
                      <label>Location</label>
                      <input placeholder="Current Location" name="Location" type="text" className="form-control" onChange={handleChange}
                        value={CurrentLocation}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col">
                      <label>Gender</label>
                      <select required
                        id="Gender"
                        name="Gender"
                        className="form-control"
                        onChange={handleChange}
                        value={Gender}
                      >
                        <option value="">--select--</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    
                    <div className="form-group col">
                      <label>
                        Date Of Birth                        </label>

                        <label style={{ float: 'right', marginRight: '50px' }}>Age</label>
                      <div className="row">
                        <div className="col-9">
                          <input
                            placeholder="Date Of Birth"
                            type="date"
                            id="DOB"
                            name="DOB"
                            className="form-control"
                            onChange={handleDOBChange}
                            value={DOB}
                            required
                          />
                        </div>
                        <div className="col-3">
                          <input id="age" disabled className="form-control" type="text" readOnly value={age} />
                        </div>
                      </div>
                    </div>
                    <div className="form-group col">
                      <label>Blood Group</label>
                      
                      <div  style={{ display: 'flex' }}>
                          <select  id="Blood"
                            name="Blood"
                            style={{ width: '80%' }}
                            required
                            className="form-control col-11"
                            onChange={handleChange}
                            value={Blood}
                          >
                            <option value="">--select--</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            {bloodGroups.map((bloodGroup) => (
                              <option key={bloodGroup.id} value={bloodGroup.blood_group}>{bloodGroup.blood_group}</option>
                            ))}

                       
                            </select>


                              <button
                                type="button"
                                className="btn btn-outline-secondary text-grey mt-0 mb-2 ml-1"
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
                  </div>
                  <div className="row">
                  <div className="form-group col">
                      <label>Contact Number</label>
                      <input placeholder="Contact Number" required name="Contact_Number" type="text"   pattern="^\d{10}$"
 className="form-control" onChange={handleChange}
                        value={contact} />
                    </div>
                    <div className="form-group col">
                      <label>Emergency Contact Number</label>
                      <input placeholder="Emergency Contact Number" required name="Emergency_Contact_Number"   pattern="^\d{10}$"
 type="text" className="form-control" onChange={handleChange}
                        value={Number2} />
                    </div>
                    <div className="form-group col">
                      <label> Email</label>
                      <input placeholder=" Email"  required name="Personal_Email"   
 type="email" className="form-control" onChange={handleChange}
                        value={Email} />
                    </div>
                   
                    
                  </div>
                  <div className="row">
                   
                   
                    <div className="form-group col">
                      <label>Father's Name / Mother's Name</label>
                      <input placeholder="Father's Name / Mother's Name" type="text"
                        id="Parent"
                        name="Parent"
                        className="form-control"
                        onChange={handleChange}
                        value={parent} />
                    </div>
                    <div className="form-group col">
                      <label>Spouse's Name</label>
                      <input placeholder="Spouse's Name" name="Spouse" type="text" className="form-control" onChange={handleChange}
                        value={Spouse} />
                    </div>
                    <div className="form-group col">
                      <label>File</label>
                      <input  type="file" class="form-control" name="file" onChange={handleFileChange} />            
                      </div>
                  </div>
                  <br />
                  <br />

    
<div className="row">
    <div className="col">
      <div className="form-group col" id="perAddress">
        <br />
        <label style={{ fontSize: 'large' }}>Permanent Address</label>
        <br /><br />
        <div className="row">
          <div className="col">
            <label>Street</label>
            <input
              placeholder="street"
              type="text"
              name="address"
              className="form-control"
              id="perStreet"
              value={presentAddress.address}
              onChange={handlePresentAddressChange}
             
            />
          </div>
          <div className="col">
            <label>City</label>
            <input
              placeholder="city"
              type="text"
              name="city"
              className="form-control"
              id="perCity"
              value={presentAddress.city}
            onChange={handlePresentAddressChange}
           
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label>State</label>
            <input
              placeholder="state"
              type="text"
              name="state"
              className="form-control"
              id="perState"
              value={presentAddress.state}
            onChange={handlePresentAddressChange}
             
            />
          </div>
          <div className="col">
            <label>Pincode</label>
            <input
              placeholder="pincode"
              type="text"
              name="pincode"
              className="form-control"
              id="perPincode"
              value={presentAddress.pincode}
            onChange={handlePresentAddressChange}
             
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label>Country</label>
            <input
              placeholder="country"
              type="text"
              name="country"
              className="form-control"
              id="perCountry"
              value={presentAddress.country}
              onChange={handlePresentAddressChange}
              
            
            />
          </div>
        </div>
      </div>
    </div>
    <div className="col">
      <div className="form-group col" id="temAddress">
        <br />
        <label style={{ fontSize: 'large' }}>Temporary Address</label>
        <label style={{ float: 'right' }}>
          <input
             type="checkbox"
             id="sameAddress"
             checked={sameAddress}
             onChange={handleSameAddressChange}
            
          />
          Same as permanent address
        </label>
        <br /><br />
        <div className="row">
          <div className="col">
            <label>Street</label>
            <input
              placeholder="street"
              type="text"
              name="address"
              className="form-control"
              id="temStreet"
              value={permanentAddress.address}
            onChange={handlePermanentAddressChange}
            disabled={sameAddress}
            
            />
          </div>
          <div className="col">
            <label>City</label>
            <input
              placeholder="city"
              type="text"
              name="city"
              className="form-control"
              id="temCity"
              value={permanentAddress.city}
            onChange={handlePermanentAddressChange}
            disabled={sameAddress}
             
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label>State</label>
            <input
              placeholder="state"
              type="text"
              name="state"
              className="form-control"
              id="temState"
              value={permanentAddress.state}
            onChange={handlePermanentAddressChange}
            disabled={sameAddress}
          
            />
          </div>
          <div className="col">
            <label>Pincode</label>
            <input
              placeholder="pincode"
              type="text"
              name="pincode"
              className="form-control"
              id="temPincode"
              value={permanentAddress.pincode}
            onChange={handlePermanentAddressChange}
            disabled={sameAddress}
              
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label>Country</label>
            <input
              placeholder="country"
              type="text"
              name="country"
              className="form-control"
              id="temCountry"
              value={permanentAddress.country}
            onChange={handlePermanentAddressChange}
            disabled={sameAddress}
             
            />
          </div>
        </div>
      </div>
    </div>
  </div>
                  <div className="row">
                    <div className="form-group col">
                    <label>Provide bank Details</label>
                    <select className="form-control" name="Bank_Details" value={bankDetails} onChange={(e) => setBankDetails(e.target.value)}>
                        <option value="">--select--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    </div>

                    <div className="form-group col">
                    <label>TDS Applicable</label>
                    <select className="form-control" name="tds_applicable" value={tdsApplicable} onChange={(e) => setTdsApplicable(e.target.value)}>
                        <option value="">--select--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    </div>
                </div>
                {isBankInfoVisible && (
        <div className="row">
          <div className="form-group col" id="BankInfo">
            <center>
              <p><b>Banking Information</b></p>
            </center>
            <div>
              <label>Account Number</label>
              <input placeholder="Account Number" name="Account_Number" type="text" className="form-control" onChange={handleChange}
                        value={Account_Number} />
            </div>
            <div>
              <label>IFSC</label>
              <input placeholder="SBIN0071242" pattern="^[A-Za-z]{4}0[A-Za-z0-9]{6}$" name="IFSC" type="text" className="form-control" onChange={handleChange}
                        value={IFSC} />
            </div>
            <div>
              <label>Name of Bank</label>
              <input placeholder="Name Of Bank" name="BankName" type="text" className="form-control"onChange={handleChange}
                        value={BankName} />
            </div>
            <div>
              <label>Branch Name</label>
              <input placeholder="Branch Name" name="BranchName" type="text" className="form-control" onChange={handleChange}
                        value={branch_name} />
            </div>
            <center>
              <p><b>For Banking</b></p>
            </center>
            <div>
              <label>Transaction Type</label>
              <select className="form-control" name="Transaction_Type" value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                <option value="">--select--</option>
                <option value="ATM">ATM</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {isTdsInfoVisible && (
        <div className="row">
          <div className="form-group col" id="TDSinfo">
            <center>
              <p><b>TDS Application</b></p>
            </center>
            <div>
              <label>Percentage/Amount</label>
              <select className="form-control" id="TDStype" name="TDS_Type" value={tdsType} onChange={(e) => setTdsType(e.target.value)}>
                <option value="">--select--</option>
                <option value="Percentage">Percentage</option>
                <option value="Amount">Amount</option>
              </select>
            </div>

            {isTdsPercentageVisible && (
              <div id="TDSpercentage">
                <label>Enter TDS Percentage</label>
                <input placeholder="TDS Percentage" name="TDS_Percentage" type="text" className="form-control"  onChange={handleChange}
                        value={TDS_Percentage} />
              </div>
            )}

            {isTdsAmountVisible && (
              <div id="TDSamount">
                <label>Enter TDS Amount</label>
                <input placeholder="TDS Amount" name="TDS_Amount" type="text" className="form-control"  onChange={handleChange}
                        value={TDS_Amount} />
              </div>
            )}
          </div>
        </div>
      )}

 

                  <br />
                  <center>
        <p><b>Statutory Information</b></p>
      </center>
      <div className="row">
        <div className="col">
          <div>
            <label>Income Tax Number</label>
            <input placeholder="Income Tax Number" name="Income_Tax" type="text" className="form-control" onChange={handleChange}
                        value={Income_Tax} />
          </div>
          <div>
            <label>Aadhar Number</label>
            <input name="Aadhar" placeholder="12 Digit Unique Number" pattern="\d{4} \d{4} \d{4}"  maxLength="14"  type="text" className="form-control" onChange={handleChange}
                        value={Aadhar} />
          </div>
          <div>
            <label>Universal Account Number (UAN)</label>
            <input placeholder="12 digit number" pattern="\d{12}"  maxLength="12" name="UAN" type="text" className="form-control" onChange={handleChange}
                        value={UAN} />
          </div>
        </div>
        <div className="col">
          <div>
            <label>PF Account Number</label>
            <input placeholder="MH/PUN/1234567/12" pattern="[A-Z]{2}/[A-Z0-9]{3}/[0-9]{7}/[0-9]{0,2}" name="PF"  type="text" className="form-control" onChange={handleChange}
                        value={PF} />
          </div>
          <div>
            <label>PAN Number</label>
            <input placeholder="ABCDE1234F" name="PAN"  pattern="[A-Z]{5}[0-9]{4}[A-Z]" maxlength="10" type="text" className="form-control"onChange={handleChange}
                        value={PAN} />
          </div>
          <div>
            <label>PR Account Number</label>
            <input placeholder="12 digit number"  pattern="\d{12}"  name="PR" type="text" className="form-control" onChange={handleChange}
                        value={PR} />
          </div>
       
        </div>
      </div>
      <center>

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
                        to={`/employeeoverview/${itemId}/`}
                        className="btn btn-outline-secondary ml-1 text-light"
                        style={{ width: "fit-content", height: "fit-content" }}
                      >
                        CANCEL
                      </Link>
        </div>
        <div className="col-md-4"></div>
      </div>
                  </center>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal fade" id="createNewUnit">
  <div className="modal-dialog">
    <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
      <div className="modal-header">
        <h5 className="m-3">New Blood Group</h5>
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
            onSubmit={handleUnitModalSubmit}
            id="newUnitForm"
            className="px-1"
          >
            <div className="row mt-2 w-100">
              <div className="col-12">
                <label for="name">Blood Group</label>
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
                  data-dismiss="modal"
                  type="submit"
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
    </>
    
  );
};
  {/* <!-- Unit Create Modal --> */}
  

export default EmployeeEdit;
