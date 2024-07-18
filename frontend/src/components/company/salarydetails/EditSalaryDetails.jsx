import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Select from "react-select";
import config from "../../../functions/config";
import Swal from "sweetalert2";

function EditSalaryDetails() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const { salaryId } = useParams();
  const [employeeValue, setEmployeeValue] = useState({});

  const fetchSalaryDetailsData = () => {
    axios
      .get(`${config.base_url}/fetch_salary_details_data/${ID}/`)
      .then((res) => {
        console.log("SD Data==", res);
        if (res.data.status) {
          let emp = res.data.employees;
          let mnt = res.data.months;
          let yr = res.data.years;
          setMonths(mnt);
          setYears(yr);
          setLeave(res.data.leave);
          setHoliday(res.data.holiday);
          setWorkingDays(res.data.working_days);
          setEmployees([]);
          const newOptions = emp.map((item) => ({
            label: item.first_name + " " + item.last_name,
            value: item.id,
          }));
          setEmployees(newOptions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSalaryDetailsData();
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

  const fetchSalaryDetails = () => {
    axios
      .get(`${config.base_url}/fetch_salary_details/${salaryId}/`)
      .then((res) => {
        console.log("SLRY DET=", res);
        if (res.data.status) {
          var sal = res.data.salary;
          var details = res.data.otherDetails;

          var c = {
            value: sal.Employee,
            label: res.data.otherDetails.employeeName,
          };
          setEmployeeValue(c);

          setEmployee(sal.Employee);
          setEmpId(details.employeeId);
          setJoiningDate(details.joiningDate);
          setEmail(details.email);
          setDesignation(details.designation);
          setSalary(details.salary);
          setMonth(sal.month);
          setYear(sal.year);
          setSalaryDate(sal.salary_date);
          setLeave(sal.leave);
          setHoliday(sal.holiday);
          setWorkingDays(sal.total_working_days);
          setHra(parseInt(sal.hra));
          setCasualLeave(sal.casual_leave);
          setBasicSalary(sal.basic_salary);
          setConveyanceAllowance(parseInt(sal.conveyance_allowance));
          setOtherAllowance(parseInt(sal.other_allowance));
          setOtherCutting(parseInt(sal.other_cuttings));
          setBonus(parseInt(sal.add_bonus));
          setLeaveDeduction(sal.leave_deduction);
          setTotalSalary(sal.total_salary);
          setDescription(sal.description);
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
    fetchSalaryDetails();
  }, []);

  const [employee, setEmployee] = useState("");
  const [empId, setEmpId] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [salary, setSalary] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [salaryDate, setSalaryDate] = useState("");
  const [leave, setLeave] = useState("");
  const [holiday, setHoliday] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [hra, setHra] = useState("");
  const [casualLeave, setCasualLeave] = useState(0);
  const [basicSalary, setBasicSalary] = useState(0);
  const [conveyanceAllowance, setConveyanceAllowance] = useState(0);
  const [otherCutting, setOtherCutting] = useState(0);
  const [otherAllowance, setOtherAllowance] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [leaveDeduction, setLeaveDeduction] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
      sal_id: salaryId,
      Employee: employee,
      salary_date: salaryDate,
      casual_leave: casualLeave,
      month: month,
      year: year,
      attendance: leave,
      leave: leave,
      basic_salary: basicSalary,
      Conveyance_Allowance: conveyanceAllowance,
      HRA: hra,
      Other_Allowance: otherAllowance,
      working_days: workingDays,
      other_cuttings: otherCutting,
      add_bonus: bonus,
      holidays: holiday,
      salary: salary,
      description: description,
      monthly_salary: totalSalary,
      leave_deduction: leaveDeduction,
    };

    axios
      .put(`${config.base_url}/update_salary_details/`, dt)
      .then((res) => {
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Salary Updated",
          });
          navigate(`/view_salary_details/${salaryId}/`);
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

  function handleEmployeeChange(val) {
    setEmployee(val);
    getEmployeeData(val);
    fetchDays(val, month, year);
  }

  function getEmployeeData(employee) {
    var cst = {
      Id: ID,
      e_id: employee,
    };

    if (employee != "") {
      axios
        .get(`${config.base_url}/get_employee_data/`, { params: cst })
        .then((res) => {
          if (res.data.status) {
            setEmpId("");
            setEmail("");
            setJoiningDate("");
            setDesignation("");
            setSalary("");
            setHra("");
            var emp = res.data.employeeDetails;
            // console.log("Emp Details===", emp);
            setEmpId(emp.employee_no);
            setEmail(emp.email);
            setJoiningDate(emp.join_date);
            setDesignation(emp.designation);
            setSalary(emp.salary);
            setHra(emp.hra);
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
        });
    } else {
      setEmpId("");
      setEmail("");
      setJoiningDate("");
      setDesignation("");
      setSalary("");
      setHra("");
    }
  }

  function handleMonthChange(val) {
    setMonth(val);
    fetchDays(employee, val, year);
  }
  function handleYearChange(val) {
    setYear(val);
    fetchDays(employee, month, val);
  }

  function setCurrentDate() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth() + 1;
    var currentDay = currentDate.getDate();
    var formattedDate =
      currentYear +
      "-" +
      (currentMonth < 10 ? "0" : "") +
      currentMonth +
      "-" +
      (currentDay < 10 ? "0" : "") +
      currentDay;
    setSalaryDate(formattedDate);
    setMonth(currentMonth);
    setYear(currentYear);
    console.log(formattedDate, currentMonth, currentYear);
  }

  useEffect(() => {
    setCurrentDate();
  }, []);

  function fetchDays(emp, month, year) {
    var selectedEmployeeId = employee;
    var sd = salaryDate;
    var selectedMonth = month;
    var selectedYear = year;
    document.getElementById("error_msg").innerHTML = "";
    if (emp != "") {
      var dys = {
        Id: ID,
        sd: sd,
        id: emp,
        month: selectedMonth,
        year: selectedYear,
      };
      axios
        .get(`${config.base_url}/get_days/`, { params: dys })
        .then((res) => {
          if (res.data.status) {
            document.getElementById("error_msg").innerHTML = "";
            setHoliday(res.data.holiday);
            setLeave(res.data.leave);
            setWorkingDays(res.data.working_days);
          } else {
            document.getElementById("error_msg").innerHTML = res.data.message;
          }
        })
        .catch((err) => {
          alert("Something wrong.!");
        });
    }
  }

  function calculateSalary() {
    var cL = casualLeave;
    var oC = otherCutting;
    var addBonus = bonus;
    var salary = basicSalary;
    var hldy = holiday;
    var lv = leave;
    var mnt = month;
    var yr = year;
    var Other_Allowance = otherAllowance;
    var HRA = hra;
    var Conveyance_Allowance = conveyanceAllowance;
    var sl = {
      Id: ID,
      leave: lv,
      holiday: hldy,
      attendance: leave,
      casual_leave: cL,
      other_cuttings: oC,
      add_bonus: addBonus,
      salary: salary,
      month: mnt,
      year: yr,
      Other_Allowance: Other_Allowance,
      hra: HRA,
      Conveyance_Allowance: Conveyance_Allowance,
    };
    axios
      .get(`${config.base_url}/calculate_salary/`, { params: sl })
      .then((res) => {
        if (res.data.status) {
          var formattedSalary = parseFloat(res.data.monthly_salary).toFixed(2);
          setTotalSalary(formattedSalary);
          setLeaveDeduction(res.data.leave_deduction);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert("Something wrong.!");
      });
  }

  // New Employee

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

  function handleUnitModalSubmit(e) {
    e.preventDefault();
    var name = newUnit;
    console.log(name);
    if (name != "") {
      var u = {
        Id: ID,
        blood_group: newUnit,
      };
      console.log(u);
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
  const [tdsApplicable, setTdsApplicable] = useState("");
  const [tdsType, setTdsType] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [age, setAge] = useState("");
  const [EmpJoiningDate, setEmpJoiningDate] = useState("");
  const [isBankInfoVisible, setIsBankInfoVisible] = useState(false);
  const [isTdsInfoVisible, setIsTdsInfoVisible] = useState(false);
  const [isTdsPercentageVisible, setIsTdsPercentageVisible] = useState(false);
  const [isTdsAmountVisible, setIsTdsAmountVisible] = useState(false);
  const [salaryType, setSalaryType] = useState("");
  const [amountPerHour, setAmountPerHour] = useState(0);
  const [workingHours, setWorkingHours] = useState(0);
  const [salaryAmount, setSalaryAmount] = useState("");
  const [presentAddress, setPresentAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });
  const [permanentAddress, setPermanentAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });
  const [Title, setTitle] = useState("");
  const [First_Name, setFirstName] = useState("");
  const [Last_Name, setLastName] = useState("");
  const [Alias, setAlias] = useState("");

  const [EmpEmail, setEmpEmail] = useState("");
  const [Employee_Number, setEmployee_Number] = useState("");
  const [EmpDesignation, setEmpDesignation] = useState("");
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
  const [TDS_Amount, setTdsAmount] = useState("0");
  const [TDS_Percentage, setTdsPercentage] = useState("0");
  const [formData, setFormData] = useState({});
  const [EmpSalary_Date, setEmpSalaryDate] = useState(new Date());
  const [contact, setContact] = useState("");
  const [image, setimage] = useState("");

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setimage(image);
  };

  const handleEmployeeModalSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Id", ID);
    formData.append("Title", Title);
    formData.append("First_Name", First_Name);
    formData.append("Last_Name", Last_Name);
    formData.append("Joining_Date", EmpJoiningDate);
    formData.append("Salary_Date", EmpSalary_Date);
    formData.append("Salary_Type", salaryType);
    formData.append("Salary_Amount", salaryAmount);
    formData.append("Amount_Per_Hour", amountPerHour);
    formData.append("Working_Hours", workingHours);
    formData.append("Alias", Alias);
    formData.append("Employee_Number", Employee_Number);
    formData.append("Designation", EmpDesignation);
    formData.append("Location", CurrentLocation);
    formData.append("Gender", Gender);
    formData.append("DOB", DOB);
    formData.append("Age", age);
    formData.append("Blood_Group", Blood);
    formData.append("Contact_Number", contact);
    formData.append("Emergency_Contact_Number", Number2);
    formData.append("Personal_Email", EmpEmail);
    formData.append("Parent_Name", parent);
    formData.append("Spouse_Name", Spouse);
    formData.append("file", file);
    formData.append("image", image);
    formData.append("Bank_Details", bankDetails);
    formData.append("TDS_Applicable", tdsApplicable);
    formData.append("Account_Number", Account_Number);
    formData.append("IFSC", IFSC);
    formData.append("Bank_Name", BankName);
    formData.append("Branch_Name", branch_name);
    formData.append("Transaction_Type", transactionType);
    formData.append("TDS_Type", tdsType);
    formData.append("TDS_Amount", TDS_Amount);
    formData.append("TDS_Percentage", TDS_Percentage);

    formData.append("Present_Address", JSON.stringify(presentAddress));
    formData.append("Permanent_Address", JSON.stringify(permanentAddress));
    formData.append("PAN", PAN);
    formData.append("Income_Tax", Income_Tax);
    formData.append("Aadhar", Aadhar);
    formData.append("UAN", UAN);
    formData.append("PF", PF);
    formData.append("PR", PR);

    axios
      .post(`${config.base_url}/employee_save/`, formData)

      .then((res) => {
        console.log("ITM RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Employee Created",
          });
          document.getElementById("closeEmployeeModal").click();
          fetchSalaryDetailsData();
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
      case "Title":
        setTitle(value);
        break;
      case "First_Name":
        setFirstName(value);
        break;
      case "Last_Name":
        setLastName(value);
        break;
      case "Alias":
        setAlias(value);
        break;
      case "Salary_Date":
        setEmpSalaryDate(value);
        break;
      case "Joining_Date":
        setEmpJoiningDate(value);
        break;
      case "Employee_Number":
        setEmployee_Number(value);
        break;
      case "Designation":
        setEmpDesignation(value);
        break;
      case "Location":
        setCurrentLocation(value);
        break;
      case "Gender":
        setGender(value);
        break;
      case "Blood":
        setBlood(value);
        break;
      case "Contact_Number":
        setContact(value);
        break;
      case "Emergency_Contact_Number":
        setNumber2(value);
        break;
      case "Personal_Email":
        setEmpEmail(value);
        break;
      case "Parent":
        setparent(value);
        break;
      case "Spouse":
        setSpouse(value);
        break;
      case "Bank_Details":
        setBankDetails(value);
        break;
      case "tds_applicable":
        setTdsApplicable(value);
        break;
      case "Income_Tax":
        setIncome_Tax(value);
        break;
      case "Aadhar":
        setAadhar(value);
        break;
      case "UAN":
        setUAN(value);
        break;
      case "PF":
        setPF(value);
        break;
      case "PAN":
        setPAN(value);
        break;
      case "PR":
        setPR(value);
        break;
      case "ESI":
        setESI(value);
        break;
      case "Account_Number":
        setAccountNumber(value);
        break;
      case "IFSC":
        setIFSC(value);
        break;
      case "BankName":
        setBankName(value);
        break;
      case "BranchName":
        setBranchName(value);
        break;
      case "Transaction_Type":
        setTransactionType(value);
        break;
      case "TDS_Type":
        setTdsType(value);
        break;
      case "TDS_Percentage":
        setTdsPercentage(value);
        break;
      case "TDS_Amount":
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

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
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
    setEmpJoiningDate(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (sameAddress) {
      setPermanentAddress({ ...presentAddress });
    }
  }, [sameAddress, presentAddress]);

  useEffect(() => {
    if (bankDetails === "Yes") {
      setIsBankInfoVisible(true);
    } else {
      setIsBankInfoVisible(false);
    }
  }, [bankDetails]);

  useEffect(() => {
    if (tdsApplicable === "Yes") {
      setIsTdsInfoVisible(true);
    } else {
      setIsTdsInfoVisible(false);
    }
  }, [tdsApplicable]);

  useEffect(() => {
    if (tdsType === "Percentage") {
      setIsTdsPercentageVisible(true);
      setIsTdsAmountVisible(false);
    } else if (tdsType === "Amount") {
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
    if (e.target.value !== "Time Based") {
      setSalaryAmount("");
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
    if (salaryType === "Time Based") {
      if (amountPerHour > 0 && workingHours > 0) {
        setSalaryAmount(amountPerHour * workingHours);
      } else {
        setSalaryAmount("0");
      }
    }
  }, [salaryType, amountPerHour, workingHours]);

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
          <Link to={`/view_salary_details/${salaryId}/`}>
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
                <h2 className="mt-3">EDIT SALARY DETAILS</h2>
              </center>
              <hr />
            </div>
          </div>
        </div>
        <div className="card radius-15">
          <div className="card-body w-100">
            <form
              className="needs-validation px-1"
              onSubmit={handleSubmit}
              validate
            >
              <div className="row mt-3 w-100">
                <div className="col-md-6">
                  <label className="col-form-label">Employee*</label>
                  <div className="d-flex align-items-center">
                    <Select
                      options={employees}
                      styles={customStyles}
                      name="employee"
                      className="w-100"
                      id="employee"
                      required
                      value={employeeValue || null}
                      onChange={(selectedOption) =>
                        handleEmployeeChange(
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      isClearable
                      isSearchable
                    />
                    <button
                      type="button"
                      data-toggle="modal"
                      data-target="#newEmployee"
                      className="btn btn-outline-secondary ml-1"
                      style={{ width: "fit-content", height: "fit-content" }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-md-6 mt-1">
                  <label className="col-form-label">Employee Id</label>
                  <input
                    type="text"
                    className="form-control"
                    id="eid"
                    name="employeeno"
                    value={empId}
                    placeholder="Employee Id"
                    required
                  />
                </div>
              </div>

              <div className="row mt-3 w-100">
                <div className="col-md-6 ">
                  <label className="col-form-label">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Join Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="joindate"
                    name="joindate"
                    value={joiningDate}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    id="designation"
                    name="designation"
                    placeholder="Designation"
                    value={designation}
                  />
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Salary</label>
                  <input
                    type="number"
                    name="Salary"
                    className="form-control"
                    id="sal"
                    value={salary}
                    readOnly
                  />
                </div>
              </div>
              <div className="row mt-3 w-100">
                <div className="col-md-6">
                  <label className="col-form-label">Salary Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="salary_date"
                    value={salaryDate}
                    onChange={(e) => setSalaryDate(e.target.value)}
                    id="salary_date"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Month</label>
                  <select
                    name="month"
                    id="month"
                    className="form-control"
                    required
                    value={month}
                    onChange={(e) => handleMonthChange(e.target.value)}
                  >
                    {months.map((month, index) => (
                      <option value={index + 1}>{month}</option>
                    ))}
                  </select>
                  <p id="error_msg" className="text-danger"></p>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Year</label>
                  <select
                    name="year"
                    id="year_"
                    className="form-control"
                    required
                    value={year}
                    onChange={(e) => handleYearChange(e.target.value)}
                  >
                    {years.map((year, index) => (
                      <option value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">Leave</label>
                  <input
                    type="text"
                    className="form-control"
                    id="leave"
                    value={leave}
                    name="leave"
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Casual Leave</label>
                  <input
                    type="number"
                    className="form-control"
                    id="casual_leave"
                    name="casual_leave"
                    value={casualLeave}
                    onChange={(e) => setCasualLeave(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Holiday</label>
                  <input
                    type="text"
                    className="form-control"
                    id="holidays"
                    name="holidays"
                    value={holiday}
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Working Day</label>
                  <input
                    type="text"
                    className="form-control"
                    id="working_days"
                    name="working_days"
                    value={workingDays}
                    readOnly
                  />
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">Basic Salary</label>
                  <input
                    type="number"
                    name="Salary"
                    className="form-control"
                    id="bassal"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">HRA</label>
                  <input
                    type="number"
                    name="HRA"
                    className="form-control"
                    id="hra"
                    value={hra}
                    onChange={(e) => setHra(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Conveyance Allowance</label>
                  <input
                    type="number"
                    name="Conveyance_Allowance"
                    className="form-control"
                    id="Conveyance_Allowance"
                    value={conveyanceAllowance}
                    onChange={(e) => setConveyanceAllowance(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Other Allowance</label>
                  <input
                    type="number"
                    name="Other_Allowance"
                    className="form-control"
                    id="Other_Allowance"
                    value={otherAllowance}
                    onChange={(e) => setOtherAllowance(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">Other Cuttings</label>
                  <input
                    type="number"
                    className="form-control"
                    name="other_cuttings"
                    id="other_cuttings"
                    value={otherCutting}
                    onChange={(e) => setOtherCutting(e.target.value)}
                    placeholder="Other Cuttings"
                  />
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Add Bonus</label>
                  <input
                    type="number"
                    className="form-control"
                    name="add_bonus"
                    id="add_bonus"
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                    placeholder="Add Bonus"
                  />
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">Salary</label>
                  <input
                    type="text"
                    className="form-control"
                    id="monthly_salary"
                    name="monthly_salary"
                    value={totalSalary}
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-50 text-light mt-2"
                    onClick={calculateSalary}
                    style={{ width: "fit-content", height: "fit-content" }}
                  >
                    Calculate Salary
                  </button>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="row mt-3 w-100">
                <div className="col">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="invalidCheck"
                      required
                    />
                    <label htmlFor="invalidCheck">
                      Agree to terms and conditions
                    </label>
                    <div className="invalid-feedback">
                      You must agree before submitting.
                    </div>
                  </div>
                </div>
              </div>
              <div className="row w-100">
                <div className="col-4"></div>
                <div className="col-4 d-flex">
                  <input
                    type="submit"
                    className="btn btn-outline-secondary w-100 text-light"
                    name=""
                    value="Save"
                    style={{ width: "fit-content", height: "fit-content" }}
                  />
                  <input
                    type="reset"
                    className="btn btn-outline-secondary w-100 ml-1 text-light"
                    onClick={() => navigate(`/view_salary_details/${salaryId}/`)}
                    value="Cancel"
                    style={{ width: "fit-content", height: "fit-content" }}
                  />
                </div>
                <div className="col-4"></div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <!-- New Employee Blood Group Modal --> */}

      <div className="modal fade" id="createNewBloodGroup">
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">New Blood Group</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                data-toggle="modal"
                data-target="#newEmployee"
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
                        data-toggle="modal"
                        data-target="#newEmployee"
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

      {/* <!-- New Employee Modal --> */}

      <div className="modal fade" id="newEmployee">
        <div className="modal-dialog modal-xl">
          <div className="modal-content" style={{ backgroundColor: "#213b52" }}>
            <div className="modal-header">
              <h5 className="m-3">New Employee</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                id="closeEmployeeModal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body w-100">
              <div className="card p-3">
                <form
                  method="post"
                  id="newEmployeeForm"
                  className="px-1"
                  onSubmit={handleEmployeeModalSubmit}
                >
                  <div className="row w-100">
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
                          cursor: "pointer",
                          padding: "20% 35%",
                          backgroundImage:
                            "url('static/assets/images/upload.png')",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "contain",
                        }}
                      ></label>
                      <br />
                      <span className="ml-5">Upload Image</span>
                      <input
                        type="file"
                        name="Image"
                        id="Image"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  <div className="row w-100">
                    <div className="col">
                      <div className="form-group">
                        <label>Alias (optional)</label>
                        <input
                          placeholder="Alias"
                          type="text"
                          id="Alias"
                          name="Alias"
                          className="form-control"
                          onChange={handleChange}
                          value={Alias}
                        />
                      </div>
                      <div className="form-group">
                        <label>Date of Joining</label>
                        <input
                          placeholder="Joining Date"
                          required
                          type="date"
                          id="Joining_Date"
                          name="Joining_Date"
                          className="form-control"
                          onChange={handleChange}
                          value={EmpJoiningDate}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label>Salary Date</label>
                        <select
                          type="date"
                          id="Salary_Date"
                          name="Salary_Date"
                          className="form-control"
                          onChange={handleChange}
                          value={EmpSalary_Date}
                        >
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

                        {(salaryType === "Fixed" ||
                          salaryType === "Temporary" ||
                          salaryType === "Time Based") && (
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
                              readOnly={salaryType === "Time Based"}
                            />
                          </div>
                        )}

                        {salaryType === "Time Based" && (
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
                    <p>
                      <b>General Information</b>
                    </p>
                  </center>

                  <div className="row w-100">
                    <div className="form-group col">
                      <label>Employee Number</label>
                      <input
                        placeholder="Employee Number"
                        required
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
                      <input
                        placeholder="Designation"
                        required
                        type="text"
                        id="Designation"
                        name="Designation"
                        className="form-control"
                        onChange={handleChange}
                        value={EmpDesignation}
                      />
                    </div>
                    <div className="form-group col">
                      <label>Location</label>
                      <input
                        placeholder="Current Location"
                        name="Location"
                        type="text"
                        className="form-control"
                        onChange={handleChange}
                        value={CurrentLocation}
                      />
                    </div>
                  </div>
                  <div className="row w-100">
                    <div className="form-group col">
                      <label>Gender</label>
                      <select
                        required
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
                      <label>Date Of Birth </label>

                      <label style={{ float: "right", marginRight: "50px" }}>
                        Age
                      </label>
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
                          <input
                            id="age"
                            disabled
                            className="form-control"
                            type="text"
                            readOnly
                            value={age}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group col">
                      <label>Blood Group</label>

                      <div style={{ display: "flex" }}>
                        <select
                          id="Blood"
                          name="Blood"
                          style={{ width: "80%" }}
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
                            <option
                              key={bloodGroup.id}
                              value={bloodGroup.blood_group}
                            >
                              {bloodGroup.blood_group}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className="btn btn-outline-secondary text-grey mt-0 mb-2 ml-1"
                          data-toggle="modal"
                          data-dismiss="modal"
                          data-target="#createNewBloodGroup"
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
                  <div className="row w-100">
                    <div className="form-group col">
                      <label>Contact Number</label>
                      <input
                        placeholder="Contact Number"
                        required
                        name="Contact_Number"
                        type="text"
                        pattern="^\d{10}$"
                        className="form-control"
                        onChange={handleChange}
                        value={contact}
                      />
                    </div>
                    <div className="form-group col">
                      <label>Emergency Contact Number</label>
                      <input
                        placeholder="Emergency Contact Number"
                        required
                        name="Emergency_Contact_Number"
                        pattern="^\d{10}$"
                        type="text"
                        className="form-control"
                        onChange={handleChange}
                        value={Number2}
                      />
                    </div>
                    <div className="form-group col">
                      <label> Email</label>
                      <input
                        placeholder=" Email"
                        required
                        name="Personal_Email"
                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        type="email"
                        className="form-control"
                        onChange={handleChange}
                        value={EmpEmail}
                      />
                    </div>
                  </div>
                  <div className="row w-100">
                    <div className="form-group col">
                      <label>Father's Name / Mother's Name</label>
                      <input
                        placeholder="Father's Name / Mother's Name"
                        type="text"
                        id="Parent"
                        name="Parent"
                        className="form-control"
                        onChange={handleChange}
                        value={parent}
                      />
                    </div>
                    <div className="form-group col">
                      <label>Spouse's Name</label>
                      <input
                        placeholder="Spouse's Name"
                        name="Spouse"
                        type="text"
                        className="form-control"
                        onChange={handleChange}
                        value={Spouse}
                      />
                    </div>
                    <div className="form-group col">
                      <label>File</label>
                      <input
                        type="file"
                        class="form-control"
                        name="file"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <br />
                  <br />

                  <div className="row w-100">
                    <div className="col">
                      <div className="form-group col" id="perAddress">
                        <br />
                        <label style={{ fontSize: "large" }}>
                          Permanent Address
                        </label>
                        <br />
                        <br />
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
                        <label style={{ fontSize: "large" }}>
                          Temporary Address
                        </label>
                        <label style={{ float: "right" }}>
                          <input
                            type="checkbox"
                            id="sameAddress"
                            checked={sameAddress}
                            onChange={handleSameAddressChange}
                          />
                          Same as permanent address
                        </label>
                        <br />
                        <br />
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

                  <div className="row w-100">
                    <div className="form-group col">
                      <label>Provide bank Details</label>
                      <select
                        className="form-control"
                        name="Bank_Details"
                        value={bankDetails}
                        onChange={(e) => setBankDetails(e.target.value)}
                      >
                        <option value="">--select--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="form-group col">
                      <label>TDS Applicable</label>
                      <select
                        className="form-control"
                        name="tds_applicable"
                        value={tdsApplicable}
                        onChange={(e) => setTdsApplicable(e.target.value)}
                      >
                        <option value="">--select--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                  {isBankInfoVisible && (
                    <div className="row w-100">
                      <div className="form-group col" id="BankInfo">
                        <center>
                          <p>
                            <b>Banking Information</b>
                          </p>
                        </center>
                        <div>
                          <label>Account Number</label>
                          <input
                            placeholder="Account Number"
                            name="Account_Number"
                            type="text"
                            className="form-control"
                            onChange={handleChange}
                            value={Account_Number}
                          />
                        </div>
                        <div>
                          <label>IFSC</label>
                          <input
                            placeholder="SBIN0071242"
                            pattern="^[A-Za-z]{4}0[A-Za-z0-9]{6}$"
                            name="IFSC"
                            type="text"
                            className="form-control"
                            onChange={handleChange}
                            value={IFSC}
                          />
                        </div>
                        <div>
                          <label>Name of Bank</label>
                          <input
                            placeholder="Name Of Bank"
                            name="BankName"
                            type="text"
                            className="form-control"
                            onChange={handleChange}
                            value={BankName}
                          />
                        </div>
                        <div>
                          <label>Branch Name</label>
                          <input
                            placeholder="Branch Name"
                            name="BranchName"
                            type="text"
                            className="form-control"
                            onChange={handleChange}
                            value={branch_name}
                          />
                        </div>
                        <center>
                          <p>
                            <b>For Banking</b>
                          </p>
                        </center>
                        <div>
                          <label>Transaction Type</label>
                          <select
                            className="form-control"
                            name="Transaction_Type"
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                          >
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
                    <div className="row w-100">
                      <div className="form-group col" id="TDSinfo">
                        <center>
                          <p>
                            <b>TDS Application</b>
                          </p>
                        </center>
                        <div>
                          <label>Percentage/Amount</label>
                          <select
                            className="form-control"
                            id="TDStype"
                            name="TDS_Type"
                            value={tdsType}
                            onChange={(e) => setTdsType(e.target.value)}
                          >
                            <option value="">--select--</option>
                            <option value="Percentage">Percentage</option>
                            <option value="Amount">Amount</option>
                          </select>
                        </div>

                        {isTdsPercentageVisible && (
                          <div id="TDSpercentage">
                            <label>Enter TDS Percentage</label>
                            <input
                              placeholder="TDS Percentage"
                              name="TDS_Percentage"
                              type="text"
                              className="form-control"
                              onChange={handleChange}
                              value={TDS_Percentage}
                            />
                          </div>
                        )}

                        {isTdsAmountVisible && (
                          <div id="TDSamount">
                            <label>Enter TDS Amount</label>
                            <input
                              placeholder="TDS Amount"
                              name="TDS_Amount"
                              type="text"
                              className="form-control"
                              onChange={handleChange}
                              value={TDS_Amount}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <br />
                  <center>
                    <p>
                      <b>Statutory Information</b>
                    </p>
                  </center>
                  <div className="row w-100">
                    <div className="col">
                      <div>
                        <label>Income Tax Number</label>
                        <input
                          placeholder="Income Tax Number"
                          name="Income_Tax"
                          type="text"
                          className="form-control"
                          onChange={handleChange}
                          value={Income_Tax}
                        />
                      </div>
                      <div>
                        <label>Aadhar Number</label>
                        <input
                          name="Aadhar"
                          placeholder="12 Digit Unique Number"
                          pattern="\d{4} \d{4} \d{4}"
                          maxLength="14"
                          type="text"
                          className="form-control"
                          onChange={handleChange}
                          value={Aadhar}
                        />
                      </div>
                      <div>
                        <label>Universal Account Number (UAN)</label>
                        <input
                          placeholder="12 digit number"
                          pattern="\d{12}"
                          maxLength="12"
                          name="UAN"
                          type="text"
                          className="form-control"
                          onChange={handleChange}
                          value={UAN}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div>
                        <label>PF Account Number</label>
                        <input
                          placeholder="MH/PUN/1234567/12"
                          pattern="[A-Z]{2}/[A-Z0-9]{3}/[0-9]{7}/[0-9]{0,2}"
                          name="PF"
                          type="text"
                          className="form-control"
                          onChange={handleChange}
                          value={PF}
                        />
                      </div>
                      <div>
                        <label>PAN Number</label>
                        <input
                          placeholder="ABCDE1234F"
                          name="PAN"
                          pattern="[A-Z]{5}[0-9]{4}[A-Z]"
                          maxlength="10"
                          type="text"
                          className="form-control"
                          onChange={handleChange}
                          value={PAN}
                        />
                      </div>
                      <div>
                        <label>PR Account Number</label>
                        <input
                          placeholder="12 digit number"
                          pattern="\d{12}"
                          name="PR"
                          type="text"
                          className="form-control"
                          onChange={handleChange}
                          value={PR}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4 w-100">
                    <div className="col-4"></div>
                    <div className="col-4 d-flex justify-content-center">
                      <button
                        className="btn btn-outline-secondary text-grey w-75"
                        type="submit"
                        id="newEmployeeSave"
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

export default EditSalaryDetails;
