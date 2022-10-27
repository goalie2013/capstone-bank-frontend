import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_EMAIL } from "../queries/userQueries";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import NotAuthorized from "../components/NotAuthorized";
import Deposit from "../pages/Deposit";
import DatabaseDown from "../components/DatabaseDown";

export default function LoginStep() {
  console.log("---LOGINSTEP---");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  let id;

  const email = window.localStorage.getItem("email");

  const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
    // pollInterval: 1000,
  });

  const token = window.localStorage.getItem("token");
  if (!token) {
    console.log("NO TOKEN");
    return <NotAuthorized />;
  }

  if (loading) console.error("LOADINGGGGG");
  if (error) return <DatabaseDown />;

  if (data) {
    if (data.getUserByEmail) {
      if (token && data.getUserByEmail.id) {
        window.localStorage.setItem("email", "");
        return (
          <Deposit
            token={token}
            userId={data.getUserByEmail.id}
            userEmail={data.getUserByEmail.email}
          />
        );
      }
    }
  } else {
    console.log("NO DATA");
    setTimeout(() => navigate("/"), 4000);
  }

  return (
    <>
      {showModal ? (
        <>
          <NotAuthorized id={id} />
        </>
      ) : (
        // token && <X token={token} />
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
