import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_EMAIL } from "../queries/userQueries";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";

import NavBar from "../components/NavBar";
import NotAuthorized from "../components/NotAuthorized";
import Deposit from "../pages/Deposit";
import DatabaseDown from "../components/DatabaseDown";

export default function LoginStep() {
  console.log("---LOGINSTEP---");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const firebaseAuth = getAuth(app);
  const { email } = useParams();
  let id;
  let token = window.localStorage.getItem("token") || "";

  const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
    // pollInterval: 1000,
  });

  onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      token = user.accessToken;
      window.localStorage.setItem("token", token);
    } else {
      navigate("/");
    }
  });

  if (loading) console.error("LOADINGGGGG");
  if (error) return <DatabaseDown />;

  if (data) {
    if (data.getUserByEmail) {
      console.log("data.getUserByEmail", data.getUserByEmail);
      if (token && data.getUserByEmail.id) {
        navigate(`/deposit/${data.getUserByEmail.id}`);
      } else if (!token) {
        console.log("NO TOKEN");
        return <NotAuthorized />;
      }
    }
  } else {
    console.log("NO DATA");
    setTimeout(() => navigate("/"), 8000);
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
