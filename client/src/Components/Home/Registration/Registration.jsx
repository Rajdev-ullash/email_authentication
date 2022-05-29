import React, { useState } from "react";
import "./Registration.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines, ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
const Registration = () => {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [pic, setPic] = useState("");

  const [passwordShown, setPasswordShown] = useState(false);

  const [repasswordShown, setRePasswordShown] = useState(false);

  const [loader, setLoader] = useState(false);

  // Password toggle handler
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const togglePassword2 = () => {
    setRePasswordShown(!repasswordShown);
  };
  const postDetails = (pics) => {
    if (pic == undefined) {
      toast.warn({
        title: "Please select an image",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      setLoader(true);
      const data = new FormData();

      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "rajdev");
      fetch("https://api.cloudinary.com/v1_1/rajdev/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoader(false);
        })
        .catch((err) => {
          setLoader(false);
          toast.error({
            title: "Image not uploaded",
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "bottom",
          });
        });
    } else {
      toast.warning({
        title: "Please select an image",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !pic) {
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
    if (password !== confirmPassword) {
      toast.error("Password & Confirm Password is incorrect", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (password === confirmPassword) {
      try {
        if (name && email && password) {
          await fetch("http://localhost:5000/user/register", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, pic }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              if (data.data) {
                toast.success(data.message, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }
              if (data.msg) {
                toast.success(data.msg, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }
            })

            .catch(function (error) {
              console.log(error.errors);
            });
        }
      } catch (err) {
        console.log(err);
      }
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
                    <h2 class="form-title">Create account</h2>
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-input form-control"
                        name="name"
                        id="name"
                        placeholder="Your Name"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
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
                        type={repasswordShown ? "text" : "password"}
                        class="form-input form-control"
                        name="re_password"
                        id="re_password"
                        placeholder="Repeat your password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <span
                        toggle="#password"
                        class="zmdi zmdi-eye field-icon toggle-password"
                      >
                        <i
                          onClick={togglePassword2}
                          class={
                            repasswordShown ? "fas fa-eye-slash" : "fas fa-eye"
                          }
                        ></i>
                      </span>
                    </div>
                    <div class="form-group">
                      <input
                        type="file"
                        class="form-input form-control"
                        name="pic"
                        id="pic"
                        placeholder="Select Picture"
                        accept="image/*"
                        onChange={(e) => postDetails(e.target.files[0])}
                      />
                    </div>

                    <div class="form-group">
                      {loader ? (
                        <div class="d-flex justify-content-center form-submit">
                          <RotatingLines width="20" />
                        </div>
                      ) : (
                        <input
                          type="submit"
                          name="submit"
                          id="submit"
                          class="form-submit"
                          value="Sign up"
                          onClick={(e) => handleRegistration(e)}
                        />
                      )}
                    </div>
                  </form>
                  <p class="loginhere">
                    Have already an account ?{" "}
                    <Link to="/login" class="loginhere-link">
                      Login here
                    </Link>
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

export default Registration;
