import React, { useState } from "react";
import "../styles/CompanyReg.css";
import config from "../../functions/config";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function StaffReg() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [logUsername, setLogUsername] = useState("");
  const [logPassword, setLogPassword] = useState("");

  const navigate = useNavigate();

  function validate() {
    var pwd = document.getElementById("pwd").value;
    var cnfpwd = document.getElementById("cnfpwd").value;

    if (pwd.length < 8 || pwd.length > 18) {
      alert("Password length is invalid");
      return false;
    }
    if (pwd != cnfpwd) {
      alert("password and confirm password does not match");
      return false;
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = validate();
    if (valid) {
      const data = {
        First_name: firstName,
        Last_name: lastName,
        User_name: username,
        Company_code: companyCode,
        Email: email,
        password: password,
      };
      axios
        .post(`${config.base_url}/Fin_staffReg_action/`, data, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          console.log("RESPONSE==", res);
          if (res.data.status) {
            Cookies.set("Login_id", res.data.data.Login_Id);
            navigate("/staff_registration2");
          }

          // Toast.fire({
          //   icon: "success",
          //   title: "Registered successfully",
          // });
        })
        .catch((err) => {
          console.log("ERROR==", err);
          // if(!err.response.data.status){
          //   alert(err.response.data.message)
          // }
          if (!err.response.data.status) {
            Swal.fire({
              icon: "error",
              title: `${err.response.data.message}`,
            });
          }
        });
    }
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

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = {
      username: logUsername,
      password: logPassword,
    };

    axios
      .post(`${config.base_url}/LogIn/`, loginData)
      .then((res) => {
        console.log('==RESPONSE==',res)
        if(res.data.status){
          Cookies.set('User',res.data.user)
          Cookies.set('Login_id',res.data.Login_id)
          if(res.data.redirect != ""){
            navigate('/'+res.data.redirect)
          }
        }else if(!res.data.status && res.data.redirect != ""){
          Swal.fire({
            icon: "error",
            title: `${res.data.message}`,
          });
          navigate('/'+res.data.redirect)
        }
      })
      .catch((err) => {
        console.log('===ERROR===',err)
        if(!err.response.data.status){
          Swal.fire({
            icon: "error",
            title: `${err.response.data.message}`,
          });
          if(err.response.data.redirect && err.response.data.redirect != ""){
            navigate('/'+err.response.data.redirect)
          }
        }
      });
  };

  return (
    <>
      <div className="container_div">
        <div className="forms-container">
          <div className="signin-signup">
            <form
              onSubmit={handleLogin}
              className="sign-in-form"
            >
              {/* {% for message in messages %}
                    {% if message %}
                        <div className="alert">
                            <span className="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                            {{ message }}
                        </div>
                    {% endif %}
                {% endfor %} */}
              <h2 className="titleh2" style={{fontWeight:"bolder"}}>Sign in</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={logUsername}
                  onChange={(e) => setLogUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={logPassword}
                  onChange={(e) => setLogPassword(e.target.value)}
                  required
                />
              </div>
              <input type="submit" value="Login" className="btn solid" />
              <a className="forgot-password">Forgot password...?</a>
              <msg></msg>
            </form>
            <form action="#" className="sign-up-form" onSubmit={handleSubmit}>
              <h2 className="titleh2" style={{fontWeight:"bolder"}}>Sign up</h2>

              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Firstname"
                  name="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Lastname"
                  name="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Username"
                  name="cusername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  id="user"
                  required
                />
              </div>
              <div class="input-field">
                <i class="fa fa-codepen"></i>
                <input
                  type="text"
                  name="Company_Code"
                  placeholder="Company Code"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                  name="cpassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="pwd"
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                  name="cconformpassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id="cnfpwd"
                />
              </div>
              <input type="submit" className="btn" value="Sign up" />
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>Join here to start a business with FinsYs!</p>
              <button
                className="btn transparent"
                id="sign-up-btn"
                onClick={() => {
                  document
                    .querySelector(".container_div")
                    .classList.add("sign-up-mode");
                }}
              >
                Sign up
              </button>
            </div>
            <img
              src={`${process.env.PUBLIC_URL}/static/assets/img/log.svg`}
              className="image"
              alt=""
            />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>click here for work with FinsYs.</p>
              <button
                className="btn transparent"
                id="sign-in-btn"
                onClick={() => {
                  document
                    .querySelector(".container_div")
                    .classList.remove("sign-up-mode");
                }}
              >
                Sign in
              </button>
            </div>
            <img
              src={`${process.env.PUBLIC_URL}/static/assets/img/register.svg`}
              className="image"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default StaffReg;
