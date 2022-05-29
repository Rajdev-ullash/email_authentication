import React, { useEffect } from "react";
import Content from "./Content/Content";
import Profile from "./Profile/Profile";

const Home = () => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    console.log(user);
  }, []);
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4 mt-5">
          <Profile />
        </div>
        <div className="col-md-8">
          <Content />
        </div>
      </div>
    </div>
  );
};

export default Home;
