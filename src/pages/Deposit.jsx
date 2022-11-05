import React, { useState, useContext } from "react";
import SubmitBtn from "../components/SubmitBtn";
import CustomCard from "../components/Card";
import Form from "react-bootstrap/Form";
import { UserContext } from "../index";
import PageNotFound from "../components/PageNotFound";
import { handleChange } from "../helper/handleHelper";
import Base64Downloader from "react-base64-downloader";
import {
  QueryGetUser,
  MutationUpdateUser,
  QueryGetUserByEmail,
} from "../helper/queryMutationHelper";
import dayjs from "dayjs";
import { COLORS } from "../themes";
import { useParams } from "react-router-dom";
import NotAuthorized from "../components/NotAuthorized";
import axios from "axios";
import { Button } from "react-bootstrap";

// ** If grabbing value from onChange on each keychange, use ref OR e.target.value; NOT depositValue
// ** setState won't update until next render, so messes up disabled/abled button
function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}
export default function Deposit({ userId, userEmail }) {
  console.log("----- DEPOSIT -----");
  // const ref = useRef(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [status, setStatus] = useState("");
  const [switchState, setSwitchState] = useState(false);
  const [showDownload, setDownload] = useState(false);
  const [depositValue, setDepositValue] = useState("");
  const [textColor, setTextColor] = useState("");
  const { id: paramId } = useParams();
  const ctx = useContext(UserContext);
  console.log("ctx", ctx);

  let balance, transactions, base64, screenshot, imgStr;

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
    const timeStamp = dayjs().format("MM/DD/YYYY HH:mm:ss");
    balance += depositInt;
    transactions = [
      ...transactions,
      {
        info: `Deposit $${depositInt}`,
        timeStamp,
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

    if (switchState) {
      console.log("take screenshot");

      axios
        //https://betterbank.herokuapp.com/screenshot
        .get("http://localhost:5050/screenshot", {
          params: {
            date: timeStamp,
            type: "Deposit",
            id: userId,
          },
          // responseType: "arraybuffer",
        })
        .then((result) => {
          console.log("screenshot done", result);
          // if (!fs.existsSync("screenshots")) fs.mkdirSync("screenshots");
          // const buffer = Buffer.from(result.data, "screenshot");
          screenshot = result.data;

          imgStr = arrayBufferToBase64(result.data);
          base64 = `data:image/jpeg;base64,${result.data}`;
          // base64 = imgStr;
          console.log(base64);
          const linkSource = `data:image/jpeg;base64,${base64}`;
          const downloadLink = document.createElement("a");
          const fileName = "vct_illustration.jpeg";

          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();

          setDownload(true);

          setTextColor(COLORS.transactionComplete);
          setStatus("Screenshot Complete");
        })
        .catch((err) => {
          console.error("screenshot Error", err.message);
          setTextColor("red");
          setStatus("Could not complete Screenshot");
        });
    }

    setShowSubmit(false);
    setDepositValue("");
  }

  return (
    <>
      {/* <NavBar id={userId} /> */}
      <div className="page-wrapper">
        <Form
          style={{
            position: "absolute",
            top: "125px",
            left: "75px",
            margin: "0 auto",
          }}
        >
          <Form.Check
            type="switch"
            id="snapshot-switch"
            label="Snapshot of Transaction"
            defaultChecked={switchState}
            onChange={() => setSwitchState((prevVal) => !prevVal)}
          />
        </Form>
        <h1>Deposit</h1>

        <CustomCard
          bgHeaderColor={COLORS.darkerTheme}
          header="Deposit Into Account"
          bgColor={COLORS.cardBodyBg}
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
                <SubmitBtn
                  name="Deposit"
                  handleClick={handleDeposit}
                  bgColor={COLORS.darkerTheme}
                />
              ) : (
                <SubmitBtn name="Deposit" disabled="true" />
              )}
            </Form>
          }
        />

        {showDownload ? (
          <>
            <Base64Downloader base64={imgStr} downloadName="1x1_red_pixel">
              Click to download
            </Base64Downloader>
            {/* <img src={URL.createObjectURL(baseArr[0])} /> */}
            <Button
              onClick={() => {
                // const byteChars = btoa(base64);
                const fileUrl = URL.createObjectURL(
                  new Blob([screenshot], { type: "mimeType" })
                );
                let alink = document.createElement("a");
                alink.href = { base64 };
                alink.download = "SamplePDF.jpeg";
                alink.click();
              }}
            >
              Download
            </Button>
            <img src={base64} />
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
