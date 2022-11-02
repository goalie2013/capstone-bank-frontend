import React, { useState, useContext } from "react";
import NavBar from "../components/NavBar";
import SubmitBtn from "../components/SubmitBtn";
import CustomCard from "../components/Card";
import Form from "react-bootstrap/Form";
import { UserContext } from "../index";
import PageNotFound from "../components/PageNotFound";
import { handleChange } from "../helper/handleHelper";
import {
  QueryGetUser,
  MutationUpdateUser,
  QueryGetUserByEmail,
} from "../helper/queryMutationHelper";
import dayjs from "dayjs";
import { COLORS } from "../themes";
import { useParams } from "react-router-dom";
import axios from "axios";
import NotAuthorized from "../components/NotAuthorized";
// ** If grabbing value from onChange on each keychange, use ref OR e.target.value; NOT depositValue
// ** setState won't update until next render, so messes up disabled/abled button

export default function Deposit({ userId, userEmail }) {
  console.log("----- DEPOSIT -----");
  // const ref = useRef(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [status, setStatus] = useState("");
  const [depositValue, setDepositValue] = useState("");
  const [textColor, setTextColor] = useState("");
  const { id: paramId } = useParams();
  const ctx = useContext(UserContext);
  console.log("ctx", ctx);

  let balance, transactions;

  if (ctx.user && !ctx.user.id) ctx.user.id = userId;

  // Check if userId matches url parameter; if NOT --> Not Authorized
  console.log("USER ID", userId);
  console.log("PARAM ID", paramId);
  if (userId !== paramId) return <NotAuthorized id={userId} />;

  // Update User using GraphQL Mutation
  const updateUser = MutationUpdateUser(userId, userEmail);

  // Get User Query: Retrieve Balance & Transactions
  try {
    let { loading, currentBalance, xTransactions } = QueryGetUser(userId);
    balance = currentBalance;
    transactions = xTransactions;
  } catch (err) {
    console.error("ERRORROROROROR", err.message);

    if (err.message == "Data is null") {
      console.error("DATA IS NULL");
      // setShowPage(false);
      return <PageNotFound id={paramId} />;
    } else if (err.message == "Error getting User Data") {
      return (
        <h1 style={{ color: "red" }}>ERROR GETTING USER DATA: {err.message}</h1>
      );
    }
  }

  function handleDeposit() {
    // console.log("ref", ref.current.value, typeof ref.current.value);
    console.log("-- handleDeposit FUNCTION --");
    console.log("depositVal", depositValue, typeof depositValue);
    const depositInt = parseInt(depositValue);
    balance += depositInt;
    transactions = [
      ...transactions,
      {
        info: `Deposit $${depositInt}`,
        timeStamp: dayjs().format("MM/DD/YYYY HH:mm:ss"),
      },
    ];

    try {
      updateUser({
        variables: { id: userId, userData: { balance, transactions } },
      });
    } catch (err) {
      console.error("Deposit updateUser Error", err.message);
    }

    setTextColor(COLORS.transactionComplete);
    setStatus("Deposit Complete!");
    setShowSubmit(false);
    setDepositValue("");
  }

  return (
    <>
      {/* <NavBar id={userId} /> */}
      <div className="page-wrapper">
        <h1>Deposit</h1>

        <CustomCard
          bgHeaderColor={COLORS.cardHeader}
          header="Deposit Into Account"
          bgColor={COLORS.cardBackground}
          statusText={status}
          statusColor={textColor}
          body={
            <Form
              className="form"
              // onSubmit={(e) =>
              //   handleKeyPress(e, handleDeposit, setTextColor, showSubmit,setStatus)
              // }
              onSubmit={(e) => e.preventDefault()}
            >
              <Form.Group className="mb-4" controlId="formDeposit">
                <Form.Label style={{ fontSize: "1.5rem" }}>
                  Deposit Amount
                </Form.Label>
                <Form.Control
                  required
                  // ref={ref}
                  size="lg"
                  type="text"
                  placeholder="Deposit"
                  value={depositValue}
                  onChange={(e) =>
                    handleChange(
                      e,
                      setDepositValue,
                      setStatus,
                      setShowSubmit,
                      setTextColor
                    )
                  }
                />
              </Form.Group>

              {showSubmit ? (
                <SubmitBtn name="Deposit" handleClick={handleDeposit} />
              ) : (
                <SubmitBtn name="Deposit" disabled="true" />
              )}
            </Form>
          }
        />
        {/* DEVELOPMENT ONLY */}
        {/* <div>{JSON.stringify(user)}</div> */}
      </div>
    </>
  );
}
