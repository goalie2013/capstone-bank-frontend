import React, { useState, useEffect, useContext } from "react";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import NavBar from "../components/NavBar";
import NotAuthorized from "../components/NotAuthorized";
import UserData from "./UserData";
import DatabaseDown from "../components/DatabaseDown";
import PageNotFound from "../components/PageNotFound";
import { UserContext } from "../index";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_EMAIL } from "../queries/userQueries";
import axios from "axios";

export default function AuthWrapperNew({ pageComponent }) {
  console.log("----- AUTHWRAPPERNew ------");
  const [showModal, setShowModal] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [email, setEmail] = useState("");
  const [jwt, setJwt] = useState("");
  const firebaseAuth = getAuth(app);
  const { id } = useParams();
  const ctx = useContext(UserContext);
  const userId = ctx.user && ctx.user.id;

  console.log("pageComponent", pageComponent);
  console.log("EMAIL", email);

  // GET USER BY EMAIL GRAPHQL QUERY
  const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
    // pollInterval: 1000,
  });
  if (loading) console.error("LOADINGGGGG");
  if (error) console.error("ERROR");

  console.log("GET_USER_BY_EMAIL DATA", data);

  // Authorize user by sending JWT to Server & verifying
  useEffect(() => {
    console.log("useEffect");
    // Use firebaseAuth to get user's email, so can use it to query for user in DB
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred) {
        console.log("userCred EMAIL", userCred.email);
        setEmail(userCred.email);

        // User authenticated; now need to authorize by passing JWT to Server to verify
        const token = localStorage.getItem("token");
        console.log("token from localStorage", token);
        // if (token && token !== jwt) setJwt(token);

        axios
          .post("http://localhost:5050/authorize", ctx.user, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log("axios response", response);
            console.log("userId", userId);
            if (userId) {
              setShowPage(true);
            } else {
              setJwt(token);
            }
          })
          .catch((err) => {
            console.error("axios ERROR", err.message);
            setShowModal(true);
          });
      } else {
        console.warn("NO USER CREDENTIAL");
        window.localStorage.setItem("token", "");
        setJwt("");
        setShowModal(true);
      }
    });
  }, []);

  console.log("ctx.user & id", ctx.user, ctx.user.id);
  if (ctx.user && ctx.user.id && ctx.user.id !== id) {
    return <NotAuthorized id={ctx.user.id} />;
  }

  if (data) {
    const userData = data.getUserByEmail;
    if (userData && userData.id !== id) {
      console.log("userData.id", userData.id);
      return <NotAuthorized id={userData.id} />;
    }

    if ((jwt && userData) || showPage) {
      switch (pageComponent) {
        case "Deposit":
          return <Deposit userId={userData.id} userEmail={userData.email} />;
        case "Withdraw":
          return (
            <Withdraw
              token={jwt}
              userId={userData.id}
              userEmail={userData.email}
            />
          );
        case "UserData":
          return (
            <UserData
              token={jwt}
              userId={userData.id}
              userEmail={userData.email}
            />
          );
      }
    }
  } else {
    //TODO: What if data not found?
    const startTime = new Date();

    const endTime = new Date();
    let timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds
    const seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");

    if (seconds > 8 && !data) return <PageNotFound />;
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
          {/*
          <div
            style={{
              display: "flex",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              // top: "60%",
            }}
          >
            <AccessCard
              bodyTxt="Must be signed in to access Bank Transactions."
              handleClick={(e) => handleNavigate(e, navigate)}
            />

            <div className="overlay"></div>
          </div> */}
          <NotAuthorized id={id} />
        </>
      ) : (
        <>
          <NavBar id={id} />
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
