import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
const Verify = () => {
  let history = useHistory();
  const [success, setSuccess] = useState(true);
  const { param } = useParams();
  console.log(param);
  const verifyEmail = () => {
    fetch("http://localhost:5000/user/verify", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${param}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSuccess(false);
        // setTimeout(() => {
        //   history.push("/login");
        // }, 6000);
        if (data.email) {
          toast.success(data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            history.push("/login");
          }, 6000);
        }
        // if (data.msg) {
        //   toast.success(data.msg, {
        //     position: "top-right",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //   });
        // }
      })

      .catch(function (error) {
        console.log(error.errors);
      });
  };

  return (
    <div className="text-center mt-5">
      {success ? (
        <div className="text-center mt-5">
          <h3>Please verify your mail</h3>
          <button className="btn btn-primary" onClick={verifyEmail}>
            Verify Email
          </button>
        </div>
      ) : (
        <div className="text-center mt-5">
          <h3>Email verification successfully complete....</h3>
          <br />
          <p>We will redirect login page within 6 seconds.</p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Verify;
