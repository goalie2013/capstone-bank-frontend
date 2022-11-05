import React, { useState, useEffect, useContext } from "react";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import NotAuthorized from "../components/NotAuthorized";
import UserData from "./UserData";
import DeleteAccount from "./DeleteAccount";
import DatabaseDown from "../components/DatabaseDown";
import PageNotFound from "../components/PageNotFound";
import { UserContext } from "../index";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import { siteAuth } from "../helper/authHelper";
// import { logout } from "../components/NavBar";
import axios from "axios";
import Loading from "../components/Loading";
import { QueryGetUserByEmail } from "../helper/queryMutationHelper";

export default function AuthWrapperNew({ pageComponent }) {
  const navigate = useNavigate();
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

  function logout() {
    console.log("logout FUNCTION Called");
    firebaseAuth.signOut();
    ctx.user = {};
    localStorage.removeItem("token");
    navigate("/");
  }

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
      // https://betterbank.herokuapp.com/authorize
      .post("http://localhost:5050/authorize", ctx.user, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("axios response", response);

        // If already have user Id -> Go to page;
        // Else, set token globally & wait for data to get user Id
        console.log("userId", userId);
        // if (userId && email) setShowPage(true);
        // else setJwt(token);
        setJwt(token);
      })
      .catch((err) => {
        console.error("axios ERROR", err.message);
        if (err.message === "Network Error") setServerDown(true);
        // Invalid or Expired token --> Log user out
        else if (err.message === "Request failed with status code 403") {
          logout();
        }
        // Else if: Token sent to /authorize was null -->
        // send request for new access token using refresh token
        else if (err.message === "Request failed with status code 401") {
          const refreshToken = localStorage.getItem("refresh token");
          // If No refresh token either --> Log user out
          if (refreshToken == null || !refreshToken) logout();

          axios
            // https://betterbank.herokuapp.com/newtoken
            .post("http://localhost:5050/newtoken", {
              token: refreshToken,
            })
            .then((response) => {
              console.log("newtoken response", response);
              localStorage.setItem("token", response.data.accessToken);
              setJwt(response.data.accessToken);
            })
            .catch((err) => {
              console.error("newtoken Error", err.message);
              if (err.message === "Request failed with status code 403")
                logout();
              else setShowModal(true);
            });
        } else setShowModal(true);
      });
  }, []);

  // GET USER BY EMAIL GRAPHQL QUERY
  let userData;
  try {
    let { user, loading } = QueryGetUserByEmail(email);
    if (loading) return <Loading id={paramId} />;

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

  // If user ID does NOT equal the parameter ID ==> Not Authorized
  //   console.log("ctx.user & ctx.user.id", ctx.user.id);
  //   console.log("PARAM ID", paramId);
  //   if (ctx.user && ctx.user.id && ctx.user.id !== paramId) {
  //     console.log("USER ID AND PARAM ID NOT THE SAME");
  //     return <NotAuthorized id={ctx.user.id} />;
  //   }
  const startTime = new Date();
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
        case "DeleteAccount":
          return <DeleteAccount user={userData} />;
      }
    }
  } else {
    // If takes longer than 8 seconds to find user data, show Page Not Found

    const endTime = new Date();
    let timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds
    const seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");

    if (seconds > 8) return <PageNotFound id={paramId} />;
  }

  return (
    <>
      {showModal ? (
        <NotAuthorized id={paramId} />
      ) : showServerDown ? (
        <DatabaseDown />
      ) : (
        <Loading id={paramId} />
      )}
    </>
  );
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
