import React, { useContext } from "react";
import CustomCard from "../components/Card";
import moneyBag from "../assets/money-bag.png";
import moneyPic from "../assets/home-pic.png";
import transactionPic from "../assets/transaction-vector.png";
import mobilePayPic from "../assets/mobile-pay.png";

import peoplePic from "../assets/busy-people.jpg";
import { COLORS } from "../themes.js";
// import moneyIcon from "../assets/money-icon.png";
import NavBar from "../components/NavBar";
import { UserContext } from "../index";

export default function Home() {
  const ctx = useContext(UserContext);
  let id;
  console.log("ctx", ctx);
  ctx.user.id ? (id = ctx.user.id) : (id = "bad-request");

  return (
    <>
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
