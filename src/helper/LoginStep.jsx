import React, { useState } from "react";
import Deposit from "./Deposit";
import DatabaseDown from "../components/DatabaseDown";
import NotAuthorized from "../components/NotAuthorized";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_EMAIL } from "../queries/userQueries";
import NavBar from "../components/NavBar";

export default function LoginStep({ user }) {
  const [showModal, setShowModal] = useState(false);
  const { email } = user;
  let id;

  const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
    // pollInterval: 1000,
  });

  if (!user.accessToken) return <NotAuthorized />;

  if (loading) console.error("LOADINGGGGG");
  if (error) console.error("ERROR");

  if (data) {
    if (!data.getUserByEmail.id) {
      console.log("data.getUserByEmail.id", data.getUserByEmail.id);
      return <NotAuthorized id={id} />;
    }

    if (user.accessToken && data.getUserByEmail.id) {
      return (
        <Deposit
          token={user.accessToken}
          userId={data.getUserByEmail.id}
          userEmail={data.getUserByEmail.email}
        />
      );
    }
  } else {
    return <DatabaseDown />;
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
            class="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
          >
            <div
              class="spinner-border text-primary"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span class="sr-only"></span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
