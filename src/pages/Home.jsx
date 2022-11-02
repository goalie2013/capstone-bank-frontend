import React, { useState, useContext, useEffect } from "react";
import CustomCard from "../components/Card";
import moneyBag from "../assets/money-bag.png";
import moneyPic from "../assets/home-pic.png";
import transactionPic from "../assets/transaction-vector.png";
import mobilePayPic from "../assets/mobile-pay.png";
import peoplePic from "../assets/busy-people.jpg";
import { COLORS } from "../themes.js";
import NavBar from "../components/NavBar";
import { UserContext } from "../index";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import { QueryGetUserByEmail } from "../helper/queryMutationHelper";

export default function Home() {
  console.count("---- HOME ----");
  const ctx = useContext(UserContext);
  const firebaseAuth = getAuth(app);
  let id;
  const [loggedIn, setLoggedIn] = useState(
    firebaseAuth.currentUser ? true : false
  );
  const [email, setEmail] = useState("");

  console.log("ctx", ctx);
  ctx.user.id ? (id = ctx.user.id) : (id = "");

  console.log("loggedIn state", loggedIn);
  console.log("firebaseAuth.currentUser", firebaseAuth.currentUser);

  useEffect(() => {
    console.count("HOME useEffect");
    firebaseAuth.onAuthStateChanged((userCredential) => {
      console.log("HOME ONAUTHSTATECHANGED");
      if (userCredential) {
        console.log(userCredential.email);
        if (!email) setEmail(userCredential.email);
        // setLoggedIn(true);
      } else {
        id = "";
        setLoggedIn(false);
      }
    });
    if (firebaseAuth.currentUser !== null) setLoggedIn(true);
  }, [email]);

  // GET USER BY EMAIL GRAPHQL QUERY
  try {
    let { user } = QueryGetUserByEmail(email);

    console.log("USER DATA", user);

    if (user) id = user.id;
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
      {/* {id ? (
        <NavBar id={id} loggedIn={true} />
      ) : (
        <NavBar id={id} loggedIn={false} />
      )} */}
      <NavBar id={id} />
      <div className="page-wrapper">
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <img
            src={moneyBag}
            className="img-fluid"
            alt="Money Bag"
            style={{ width: "5rem", marginRight: "1.5rem" }}
          />
          <h1 style={{ fontWeight: 900 }}>Bad Bank</h1>
        </span>
        <CustomCard
          bgHeaderColor={COLORS.cardHeader}
          txtColor="#000"
          bgColor={COLORS.cardBackground}
          header="Welcome"
          title="Welcome to our Bank"
          text="Deposit and withdraw savings, and view your transaction history."
          body={
            <img
              src={moneyPic}
              className="img-fluid"
              alt="Bad Bank Logo. Palm with Coin"
            />
          }
        />
        <div className="homeImgsWrapper" style={{ marginTop: "5rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={transactionPic}
              className="img-fluid homeImg"
              alt="Illustration Outline of UI with Graph"
              style={{
                width: "10rem",
                marginBottom: "1.5rem",
              }}
            />
            <p
              style={{
                fontSize: "0.75rem",
                textAlign: "center",
                marginTop: "-1rem",
                marginRight: "0.5rem",
              }}
            >
              <a href="https://iconscout.com/contributors/chanut-is-industries">
                Image by IconScout
              </a>
            </p>
            <h5 style={{ marginRight: "1rem", marginBottom: "2rem" }}>
              Simple & Clean UI
            </h5>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={peoplePic}
              className="img-fluid homeImg"
              alt="People Illustration Working in Tech"
              style={{
                width: "13rem",
                height: "10rem",
                boxShadow: "0 3rem 5rem rgba(0, 0, 0, 0.2)",
                borderRadius: "20px",
                marginTop: "0.25rem",
              }}
            />
            <p
              style={{
                fontSize: "0.75rem",
                textAlign: "center",
                marginTop: "0.25rem",
                marginRight: "0.5rem",
              }}
            >
              <a href="https://www.freepik.com/free-vector/startup-managers-presenting-analyzing-sales-growth-chart-group-workers-with-heap-cash-rocket-bar-diagrams-with-arrow-heap-money_12291285.htm#query=finance&position=2&from_view=search&track=sph">
                Image by pch.vector
              </a>{" "}
              on Freepik
            </p>
            <h5 style={{ marginBottom: "2rem" }}>
              Easy tracking of finances
              <br /> with Transaction History
            </h5>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={mobilePayPic}
              className="img-fluid homeImg"
              alt="Illustration Outline of UI with Graph"
              style={{
                width: "10rem",
                marginBottom: "1.5rem",
              }}
            />
            <p
              style={{
                fontSize: "0.75rem",
                textAlign: "center",
                marginTop: "-1rem",
              }}
            >
              <a href="https://iconscout.com/contributors/chanut-is-industries">
                Image by IconScout
              </a>
            </p>
            <h5 style={{ textAlign: "center" }}>Fast Payment</h5>
          </div>
        </div>
      </div>
    </>
  );
}
