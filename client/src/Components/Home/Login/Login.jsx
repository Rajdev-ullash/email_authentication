import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Registration/Registration.css";
import { useHistory } from "react-router-dom";
const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [data, setData] = useState({});
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warn("Please fill all this field", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    const url = "http://localhost:5000/user/login";

    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.data) {
            setData(data.data);
            toast.success(data.data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              history.push("/");
            }, 6000);
            localStorage.setItem("userInfo", JSON.stringify(data.data));
          }
          if (data.error) {
            toast.error(data.error, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
    } catch (error) {
      toast.error(error.msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div class="main">
            <section class="signup">
              <div class="container w-75 d-flex justify-content-center mt-5">
                <div class="signup-content">
                  <form id="signup-form" class="signup-form">
                    <h2 class="form-title">Login</h2>

                    <div class="form-group">
                      <input
                        type="email"
                        class="form-input form-control"
                        name="email"
                        id="email"
                        placeholder="Your Email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div class="form-group">
                      <input
                        type={passwordShown ? "text" : "password"}
                        class="form-input form-control"
                        name="password"
                        id="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span
                        toggle="#password"
                        class="zmdi zmdi-eye field-icon toggle-password"
                      >
                        <i
                          onClick={togglePassword}
                          class={
                            passwordShown ? "fas fa-eye-slash" : "fas fa-eye"
                          }
                        ></i>
                      </span>
                    </div>

                    <div class="form-group">
                      <input
                        type="submit"
                        name="submit"
                        id="submit"
                        class="form-submit"
                        value="Sign up"
                        onClick={(e) => handleLogin(e)}
                      />
                    </div>
                  </form>
                  <p class="loginhere">
                    New User ?{" "}
                    {/* <Link to="/login" class="loginhere-link">
                      Login here
                    </Link> */}
                  </p>
                </div>
              </div>
            </section>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
