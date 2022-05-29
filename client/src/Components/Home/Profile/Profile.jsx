import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../App";
import "./Profile.css";
const Profile = () => {
  const [data, setData] = useState({});
  const [res, setRes] = useState([]);
  const { token } = useContext(UserContext);
  const [tokenData, setTokenData] = token;

  const [result, setResult] = useState({});
  console.log(tokenData);
  useEffect(() => {
    const result = JSON.parse(localStorage.getItem("userInfo"));
    if (result) {
      setData(result);
    }
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/todo/specificUserTodo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data[0].results);
        // setData(data.results);
        setResult(data[0]);
        setRes(data[0].post);
      });
  }, [data]);

  // console.log(res.map((res) => res.likes));
  const datas = res.map((res) => res.likes);
  console.log(datas);
  const results = datas.map((data) => data.length);
  console.log(results);
  const sum = results.reduce((a, b) => a + b, 0);
  console.log(sum);

  console.log(data);
  return (
    <div class="card mt-5 cards">
      <div class="card-content pt20 pb20 profile-header">
        <img
          src={data.image}
          alt=""
          style={{ width: "100px", height: "100px" }}
          class="img-fluid rounded-circle"
        />
        <h4 class="card-title text-center mb20">{data.name}</h4>

        <hr />
        <div class="row">
          <div class="col-md-4 mb20">
            <h5 class="text-center">{sum}</h5>
            <h6 class="text-small text-muted text-center">Total Likes</h6>
          </div>
          <div class="col-md-4 mb20">
            <h5>583</h5>
            <h6 class="text-small text-muted">Tweets</h6>
          </div>
          <div class="col-md-4 mb20">
            <h5 class="text-center">{result.post?.length}</h5>
            <h6 class="text-small text-muted text-center">Posts</h6>
          </div>
        </div>
        <a href="#" class="btn btn-primary btn-rounded">
          Follow
        </a>
        <hr />
      </div>
    </div>
  );
};

export default Profile;
