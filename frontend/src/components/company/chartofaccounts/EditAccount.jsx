import React, { useEffect, useState } from "react";
import FinBase from "../FinBase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import config from "../../../functions/config";
import Swal from "sweetalert2";
import Select from "react-select";

function EditAccount() {
  const ID = Cookies.get("Login_id");
  const navigate = useNavigate();
  const { accountId } = useParams();
  const [accountDetails, setAccountDetails] = useState({});

  const fetchAccountDetails = () => {
    axios
      .get(`${config.base_url}/fetch_account_details/${accountId}/`)
      .then((res) => {
        console.log("ACC DATA=", res);
        if (res.data.status) {
          var acc = res.data.account;
          setAccountDetails(acc);
          setAccType(acc.account_type);
          setAccName(acc.account_name);
          setParentAccount(acc.parent_account);
          setSubAcc(acc.sub_account);
          setAccCode(acc.account_code);
          setAccNumber(acc.bank_account_no);
          setAccDesc(acc.description);

          setAccData(acc.account_type);
          checkSubAcc(acc.sub_account);
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
    fetchAccountDetails();
  }, []);

  const [accType, setAccType] = useState("Other Asset");
  const [accName, setAccName] = useState("");
  const [parentAccount, setParentAccount] = useState("");
  const [subAcc, setSubAcc] = useState(false);
  const [accCode, setAccCode] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [accDesc, setAccDesc] = useState("");
  const [parentAccounts, setParentAccounts] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    var dt = {
      Id: ID,
      ac_id: accountId,
      account_type: accType,
      account_name: accName,
      account_code: accCode,
      description: accDesc,
      balance: 0.0,
      balance_type: null,
      credit_card_no: null,
      sub_account: subAcc,
      parent_account: parentAccount,
      bank_account_no: accNumber,
    };

    axios
      .put(`${config.base_url}/update_account/`, dt)
      .then((res) => {
        console.log("ACC RES=", res);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: "Account Updated",
          });
          navigate(`/view_account/${accountId}/`);
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

  function setAccData(value) {
    var Acnt_desc = document.getElementById("acnt-desc");
    var selectedValue = value;
    var acctype = document.getElementById("acctype");

    switch (value) {
      case "Other Asset":
        Acnt_desc.innerHTML = `<b>Asset</b> <br> Track special assets like goodwill and other intangible assets<br/>`;
        acctype.value = "Asset";
        break;
      case "Other Current Asset":
        Acnt_desc.innerHTML = `
                    <b>Asset</b> <br> Any short term asset that can be converted into cash or cash equivalents easily<br/>
                    <ul>
                        <li>1.Prepaid expenses</li>
                        <li>2.Stocks and Mutual Funds</li>
                    </ul>`;
        acctype.value = "Asset";
        break;
      case "Cash":
        Acnt_desc.innerHTML = `<b>Asset</b> <br> To keep track of cash and other cash equivalents like petty cash, undeposited funds, etc.<br/>`;
        acctype.value = "Asset";
        break;
      case "Bank":
        Acnt_desc.innerHTML = `<b>Asset</b> <br> To keep track of bank accounts like Savings, Checking, and Money Market accounts<br/>`;
        acctype.value = "Asset";
        break;
      case "Fixed Asset":
        Acnt_desc.innerHTML = `
                    <b>Asset</b> <br> Any long term investment or an asset that cannot be converted into cash easily like:<br/>
                    <ul>
                        <li>1.Land and Buildings</li>
                        <li>2.Plant, Machinery and Equipment</li>
                        <li>3.Computers</li>
                        <li>3.Furniture</li>
                    </ul>`;
        acctype.value = "Asset";
        break;
      case "Stock":
        Acnt_desc.innerHTML = `<b>Asset</b> <br> To keep track of your inventory assets.<br/>`;
        acctype.value = "Asset";
        break;
      case "Payment Clearing":
        Acnt_desc.innerHTML = `<b>Asset</b> <br> To keep track of funds moving in and out via payment processors like Stripe, PayPal, etc.<br/>`;
        acctype.value = "Asset";
        break;
      case "Other Current Liability":
        Acnt_desc.innerHTML = `
                    <b>Liability</b> <br> Any short term liability like:<br/>
                    <ul>
                        <li>1.Customer Deposits</li>
                        <li>2.Tax Payable</li>
                    </ul>`;
        acctype.value = "Liability";
        break;
      case "Credit Card":
        Acnt_desc.innerHTML = `<b>Liability</b> <br>Create a trail of all your credit card transactions by creating a credit card account<br/>`;
        acctype.value = "Liability";
        break;
      case "Long Term Liability":
        Acnt_desc.innerHTML = `<b>Liability</b> <br> Liabilities that mature after a minimum period of one year like Notes Payable, Debentures, and Long Term Loans<br/>`;
        acctype.value = "Liability";
        break;
      case "Other Liability":
        Acnt_desc.innerHTML = `
                    <b>Liability</b> <br>Obligation of an entity arising from past transactions or events which would require repayment.<br/>
                    <ul>
                        <li>1.Tax to be paid</li>
                        <li>2.Loan to be Repaid</li>
                        <li>3.Accounts Payable etc</li>
                    </ul>`;
        acctype.value = "Liability";
        break;
      case "Overseas Tax Payable":
        Acnt_desc.innerHTML = `<b>Liability</b> <br> Track your taxes in this account if your business sells digital services to foreign customers.<br/>`;
        acctype.value = "Liability";
        break;
      case "Equity":
        Acnt_desc.innerHTML = `<b>Equity</b> <br>Owners or stakeholders interest on the assets of the business after deducting all the liabilities<br/>`;
        acctype.value = "Equity";
        break;
      case "Income":
        Acnt_desc.innerHTML = `<b>Income</b> <br>Income or Revenue earned from normal business activities like sale of goods and services to customers<br/>`;
        acctype.value = "Income";
        break;
      case "Other Income":
        Acnt_desc.innerHTML = `
                    <b>Income</b> <br>Income or revenue earned from activities not directly related to your business like :<br/>
                    <ul>
                        <li>1.Interest Earned</li>
                        <li>2.Dividend Earned</li>
                    </ul>`;
        acctype.value = "Income";
        break;
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
    if (value == "Bank") {
      document.getElementById("bankAccNum").style.display = "block";
      document.getElementById("account_number").required = true;
    } else {
      document.getElementById("bankAccNum").style.display = "none";
      document.getElementById("account_number").required = false;
    }
    var a = {
      Id: ID,
      type: value,
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

  function checkSubAcc(val) {
    var parentAccountValue = document.getElementById("parentAccountValue");
    var parentAccount = document.getElementById("parentAccount");
    if (val == true) {
      parentAccountValue.style.display = "block";
      parentAccount.required = true;
    } else {
      parentAccountValue.style.display = "none";
      parentAccount.required = false;
    }
  }

  return (
    <>
      <FinBase />
      <div
        className="page-content mt-0 pt-0"
        style={{ backgroundColor: "#2f516f", minHeight: "100vh" }}
      >
        {/* <div className="d-flex justify-content-end mb-1">
          <Link to={"/items"}>
            <i
              className="fa fa-times-circle text-white mx-4 p-1"
              style={{ fontSize: "1.2rem", marginRight: "0rem !important" }}
            ></i>
          </Link>
        </div> */}
        <div className="card radius-15 h-20">
          <div className="row">
            <div className="col-md-12">
              <center>
                <h2 className="mt-3">EDIT ACCOUNT</h2>
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
              className="needs-validation px-1"
              onSubmit={handleSubmit}
              validate
            >
              <div className="row w-100">
                <div className="col-md-12 mx-0">
                  <div className="row mt-2 mb-2">
                    <div className="col-md-6">
                      <div className="row mt-2">
                        <div className="col-12">
                          <label htmlFor="acctyp">Account Type</label>
                          <input
                            type="text"
                            value="Assets"
                            id="acctype"
                            name="acctype"
                            hidden
                          />
                          {/* <Select
                            options={groupedOptions}
                            styles={customStyles}
                            defaultValue={defaultValue}
                            onChange={(selectedOption) =>
                              handleAccountTypeChange(
                                selectedOption ? selectedOption.value : ""
                              )
                            }
                            isClearable
                            isSearchable
                          /> */}
                          <select
                            name="account_type"
                            id="Account_type"
                            className="custom-select-md form-control w-100"
                            value={accType}
                            required
                          >
                            <option value={accType}>{accType}</option>
                          </select>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12">
                          <label htmlFor="name">*Name</label>
                          {accountDetails.create_status == "default" ? (
                            <input
                              name="account_name"
                              id="name"
                              readOnly
                              value={accName}
                              className="custom-select-md form-control w-100"
                            />
                          ) : (
                            <input
                              name="account_name"
                              id="name"
                              required
                              value={accName}
                              onChange={(e) => setAccName(e.target.value)}
                              className="custom-select-md form-control w-100"
                            />
                          )}
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
                              checked={subAcc ? true : false}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="subAccountCheckBox"
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
                          <label htmlFor="parentAccount">Parent Account</label>
                          <select
                            name="parent_account"
                            id="parentAccount"
                            className="custom-select-md form-control w-100"
                            value={parentAccount}
                            onChange={(e) => setParentAccount(e.target.value)}
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
                          <label htmlFor="acc_code">Account Code</label>
                          <input
                            type="text"
                            name="account_code"
                            id="account_code"
                            value={accCode != "" ? accCode : ""}
                            onChange={(e) => setAccCode(e.target.value)}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div
                        className="row mt-2"
                        id="bankAccNum"
                        style={{ display: "none" }}
                      >
                        <div className="col-12">
                          <label htmlFor="acc_code">Account Number</label>
                          <input
                            type="number"
                            name="account_number"
                            id="account_number"
                            value={accNumber}
                            onChange={(e) => setAccNumber(e.target.value)}
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
                            value={accDesc}
                            onChange={(e) => setAccDesc(e.target.value)}
                            name="description"
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
                        to={`/view_account/${accountId}/`}
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
    </>
  );
}

export default EditAccount;
