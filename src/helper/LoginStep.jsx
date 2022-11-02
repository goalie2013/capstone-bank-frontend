import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_EMAIL } from "../queries/userQueries";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import { UserContext } from "../index";

import NavBar from "../components/NavBar";
import NotAuthorized from "../components/NotAuthorized";

// Need a LoginStep bc Query functions for GraphQL run right away, so create issues in Login component.
// Also can retrieve id from DB for Google Login
export default function LoginStep() {
  console.log("---LOGINSTEP---");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const ctx = useContext(UserContext);
  const firebaseAuth = getAuth(app);
  const { email } = useParams();
  let id;
  let token = window.localStorage.getItem("token") || "";

  const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
    // pollInterval: 1000,
  });
  if (loading) console.warn("Loading", loading);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      console.log("firebase auth state changed");
      console.log("user", user);
      if (user) {
        token = user.accessToken;
        console.log("token", token);
        if (localStorage.getItem("token")) localStorage.removeItem("token");
        window.localStorage.setItem("token", token);
        ctx.user = { email: user.email };
      } else {
        navigate("/");
      }
    });
  }, []);

  if (loading) console.error("LOADINGGGGG");
  //   if (error) return <DatabaseDown />;

  if (data) {
    if (data.getUserByEmail) {
      console.log("data.getUserByEmail", data.getUserByEmail);
      ctx.user.id = data.getUserByEmail;
      if (token && data.getUserByEmail.id) {
        console.log("navigate to Deposit..");
        navigate(`/deposit/${data.getUserByEmail.id}`);
      } else if (!token) {
        console.log("NO TOKEN");
        return <NotAuthorized />;
      }
    }
  } else {
    console.log("NO DATA");
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
