/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../App";
import "./Content.css";
import Moment from "react-moment";
import "moment-timezone";
import ShowMore from "react-show-more";
import ReactPaginate from "react-paginate";
const Content = () => {
  const { token } = useContext(UserContext);
  const [tokenData, setTokenData] = token;

  const { log } = useContext(UserContext);
  const [loggedInUser, setLoggedInUser] = log;
  console.log(loggedInUser);

  const [data, setData] = useState([]);

  const [info, setInfo] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    setInfo(user);
    console.log(user);
  }, []);
  console.log(info.token);
  useEffect(() => {
    fetch("http://localhost:5000/todo/getAllTodo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${info.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data.results);
      });
  }, [info]);

  const likePost = (slug) => {
    fetch(`http://localhost:5000/todo/likeTodo/${slug}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${tokenData}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(slug);
  };
  const unLikePost = (slug) => {
    fetch(`http://localhost:5000/todo/unLikeTodo/${slug}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${tokenData}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // setData(data.results);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(slug);
  };

  // const result = data.likes.map((data) => console.log(data));

  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 4;
  const pageVisited = pageNumber * usersPerPage;
  const displayUsers = data
    .slice(pageVisited, pageVisited + usersPerPage)
    .map((data) => {
      return (
        <div className="time">
          <div class="timeline-header ms-3">
            <span class="userimage">
              <img
                style={{ width: "50px", height: "50px" }}
                src={data.posted_by.avatar}
                alt=""
              />
            </span>
            <span class="username">
              <a href="javascript:;">{data.posted_by.name}</a> <small></small>{" "}
              <span class="text-muted ms-4">
                <Moment fromNow>{data.createdAt}</Moment>
              </span>
            </span>
          </div>
          <div class="timeline-content ms-3">
            <h5 className="text-center mt-3">Title: {data.title}</h5>
            <p className="mt-3">
              <ShowMore
                lines={4}
                more="Show more"
                less="Show less"
                anchorClass=""
              >
                {data?.description}
              </ShowMore>
            </p>
          </div>
          <div class="timeline-likes ms-3">
            <div class="stats mb-3 mt-2">
              <span class="fa-stack fa-fw stats-icon">
                <i class="fa fa-circle fa-stack-2x text-danger"></i>
                <i class="fa fa-heart fa-stack-1x fa-inverse t-plus-1"></i>
              </span>
              <span class="fa-stack fa-fw stats-icon">
                <i class="fa fa-circle fa-stack-2x text-primary"></i>
                <i class="fa fa-thumbs-up fa-stack-1x fa-inverse"></i>
              </span>
              <span class="stats-total">{data.likes?.length}</span>
            </div>
          </div>
          <div class="timeline-footer ms-3">
            {data.likes.includes(info.id) ? (
              <i
                onClick={() => unLikePost(data?.slug)}
                class="fa fa-thumbs-down fa-fw fa-lg m-r-3 cur"
              ></i>
            ) : (
              <i
                onClick={() => likePost(data?.slug)}
                class="fa fa-thumbs-up fa-fw fa-lg m-r-3 cur"
              ></i>
            )}
          </div>
        </div>
      );
    });

  const pageCount = Math.ceil(data.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div class="mt-5">
      <ul class="timeline">
        <div class="timeline-body">
          {displayUsers}

          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            activeClassName={"paginationActive"}
          />
        </div>
      </ul>
    </div>
  );
};

export default Content;
