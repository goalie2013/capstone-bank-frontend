import React, { useState, useEffect, useContext } from "react";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import NotAuthorized from "../components/NotAuthorized";
import UserData from "./UserData";
import DatabaseDown from "../components/DatabaseDown";
import PageNotFound from "../components/PageNotFound";
import { UserContext } from "../index";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_EMAIL } from "../queries/userQueries";
import axios from "axios";
import Loading from "../components/Loading";
import { QueryGetUserByEmail } from "../helper/queryMutationHelper";

export default function AuthWrapperNew({ pageComponent }) {
  const [showModal, setShowModal] = useState(false);
  const [showServerDown, setServerDown] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [email, setEmail] = useState("");
  const [jwt, setJwt] = useState("");
  const firebaseAuth = getAuth(app);
  const { id: paramId } = useParams();
  const ctx = useContext(UserContext);
  let userId = ctx.user && ctx.user.id;

  console.count("----- AUTHWRAPPERNew ------");
  console.log("pageComponent", pageComponent);
  console.log("EMAIL", email);

  // Authorize user by sending JWT to Server & verifying
  useEffect(() => {
    console.count("useEffect");

    // if (ctx.user.email && !email) {
    //   console.log("Set email from ctx");
    //   setEmail(ctx.user.email);
    // }

    // Use firebaseAuth to get user's email, so can use it to query for user in DB
    firebaseAuth.onAuthStateChanged((userCredential) => {
      if (userCredential) {
        console.count("userCredential EMAIL");
        if (!email) setEmail(userCredential.email);
      } else {
        console.warn("NO USER CREDENTIAL");
        // window.localStorage.setItem("token", "");
        setJwt("");
        // setShowModal(true);
      }
    });
    // User authenticated; now need to authorize by passing JWT to Server to verify
    const token = localStorage.getItem("token");
    console.log("token from localStorage", token);
    // if (token && token !== jwt) setJwt(token);

    axios
      .post("https://betterbank.herokuapp.com/authorize", ctx.user, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("axios response", response);

        // If already have user Id -> Go to page;
        // Else, set token globally & wait for data to get user Id
        console.log("userId", userId);
        if (userId) {
          setShowPage(true);
        } else {
          setJwt(token);
        }
      })
      .catch((err) => {
        console.error("axios ERROR", err.message);
        if (err.message === "Network Error") setServerDown(true);
        else setShowModal(true);
      });
  }, []);

  // GET USER BY EMAIL GRAPHQL QUERY
  let userData;
  try {
    let { user, loading } = QueryGetUserByEmail(email);
    userData = user;
    // if (loading) return <Loading id={paramId} />;

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

  // If user ID does NOT equal the parameter ID ==> Not Authorized
  //   console.log("ctx.user & ctx.user.id", ctx.user, ctx.user.id);
  //   console.log("PARAM ID", paramId);
  //   if (ctx.user && ctx.user.id && ctx.user.id !== paramId) {
  //     console.log("USER ID AND PARAM ID NOT THE SAME");
  //     return <NotAuthorized id={ctx.user.id} />;
  //   }

  if (userData) {
    console.log("DATA FOUND");
    console.log("jwt", jwt);
    // const userData = data.getUserByEmail;
    userId = userData.id;

    // If user ID does NOT equal the parameter ID ==> Not Authorized
    if (userData && userId !== paramId) {
      console.log("userData.id", userId);
      return <NotAuthorized id={userId} />;
    }

    if ((jwt && userData) || showPage) {
      console.log("switching page...");
      switch (pageComponent) {
        case "Deposit":
          return <Deposit userId={userId} userEmail={userData.email} />;
        case "Withdraw":
          return <Withdraw userId={userId} userEmail={userData.email} />;
        case "UserData":
          return <UserData userId={userId} userEmail={userData.email} />;
      }
    }
  } else {
    //TODO: Doesn't work
    // If takes longer than 8 seconds to find user data, show Page Not Found
    const startTime = new Date();

    const endTime = new Date();
    let timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds
    const seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");

    if (seconds > 8 && !userData) return <PageNotFound id={paramId} />;
  }

  // ** setState in global scope is BAD. rerender loop
  //   if (showPage) {
  //     switch (pageComponent) {
  //       case "Deposit":
  //         return <Deposit userId={userId} userEmail={email} />;
  //       case "Withdraw":
  //         return <Withdraw userId={id} userEmail={email} />;
  //       case "UserData":
  //         return <UserData userId={id} userEmail={email} />;
  //     }
  //   }
  return (
    <>
      {showModal ? (
        <>
          <NotAuthorized id={paramId} />
        </>
      ) : showServerDown ? (
        <>
          <DatabaseDown />
        </>
      ) : (
        <>
          <Loading id={paramId} />
        </>
      )}
    </>
  );
}
