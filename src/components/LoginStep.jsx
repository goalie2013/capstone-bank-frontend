import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_EMAIL } from "../queries/userQueries";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import { UserContext } from "../index";

import NavBar from "./NavBar";
import NotAuthorized from "./NotAuthorized";
import { QueryGetUserByEmail } from "../helper/queryMutationHelper";
import axios from "axios";
import Loading from "./Loading";

// Need a LoginStep bc Query functions for GraphQL run right away, so create issues in Login component.
// Also can retrieve id from DB for Google Login
export default function LoginStep({ email, password }) {
  console.log("---LOGINSTEP---");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const ctx = useContext(UserContext);
  const firebaseAuth = getAuth(app);
  // const { email } = useParams();
  let id;
  let userData;
  let token = localStorage.getItem("token") || "";

  // const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
  //   variables: { email },
  //   // pollInterval: 1000,
  // });
  // if (loading) console.warn("Loading", loading);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      console.log("firebase auth state changed");
      console.log("user", user);
      if (user) {
        console.log("token", token);
        if (token) localStorage.removeItem("token");
        localStorage.setItem("token", token);
        ctx.user = { email: user.email };
      } else {
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    if (userData) {
      ctx.user.id = userData.id;
      // if (token && data.getUserByEmail.id) {
      //   console.log("navigate to Deposit..");
      //   navigate(`/deposit/${data.getUserByEmail.id}`);
      // } else if (!token) {
      //   console.log("NO TOKEN");
      //   return <NotAuthorized />;
      // }
      const userObj = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      };
      console.log("axios call", userObj);
      axios
        .post("https://betterbank.herokuapp.com/login", userObj)
        .then((response) => {
          console.log("axios response", response);
          console.log("axios response", response.data.token);

          // Reset context if user already created bc don't want id bug
          ctx.user = {};
          ctx.user = { ...userObj };

          // Reset localStorage token in case not empty, then add new token
          // localStorage.setItem("token", "");
          // if (localStorage.getItem("token") ) localStorage.removeItem("token");
          localStorage.removeItem("token");
          localStorage.setItem("token", response.data.token);
        })
        .then(() => {
          navigate(`/deposit/${userObj.id}`);
        })
        .catch((err) => console.error("axios ERROR", err.message));
    } else {
      console.log("NO DATA");
    }
  });

  try {
    let { user, loading } = QueryGetUserByEmail(email);
    if (loading) return <Loading />;
    userData = user;

    console.log("USER DATA", userData);
  } catch (err) {
    console.error("ERRORROROROROR", err.message);

    if (err.message == "Data is null") {
      console.error("DATA IS NULL");
      // setShowPage(false);
      //   return <PageNotFound id={paramId} />;
    } else if (err.message == "Error getting User Data") {
      return (
        <h1 style={{ color: "red" }}>ERROR GETTING USER DATA: {err.message}</h1>
      );
    }
  }

  return (
    <>
      {showModal ? (
        <>
          <NotAuthorized id={id} />
        </>
      ) : (
        //TODO:
        // <NotAuthorized />
        <>
          {/* <NavBar id={id} /> */}
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
          >
            <div
              className="spinner-border text-primary"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="sr-only"></span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
