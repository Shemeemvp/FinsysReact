import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Select from "react-select";
import config from "../../../functions/config";
import Swal from "sweetalert2";

function AddSalaryDetails() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

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
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
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
      status: status,
    };

    axios
      .post(`${config.base_url}/create_new_salary_details/`, dt)
      .then((res) => {
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Salary Created",
          });
          navigate("/salary_details");
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
          <Link to={"/salary_details"}>
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
                <h2 className="mt-3">ADD SALARY DETAILS</h2>
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
                    name="Draft"
                    onClick={() => setStatus("Draft")}
                    value="Draft"
                    style={{ width: "fit-content", height: "fit-content" }}
                  />
                  <input
                    type="submit"
                    className="btn btn-outline-secondary w-100 ml-1 text-light"
                    name="Save"
                    onClick={() => setStatus("Saved")}
                    value="Save"
                    style={{ width: "fit-content", height: "fit-content" }}
                  />
                </div>
                <div className="col-4"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddSalaryDetails;
