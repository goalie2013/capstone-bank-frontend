import React, { useState } from "react";
import DatabaseDown from "../components/DatabaseDown";
import NotAuthorized from "../components/NotAuthorized";

export default function LoginStep({ user }) {
  const [showModal, setShowModal] = useState(false);
  const { email } = user;

  if (!user.accessToken) return <NotAuthorized />;

  const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
    // pollInterval: 1000,
  });
  if (loading) console.error("LOADINGGGGG");
  if (error) console.error("ERROR");

  if (data) {
    if (data.getUserByEmail && data.getUserByEmail.id !== id) {
      console.log("data.getUserByEmail.id", data.getUserByEmail.id);
      return <NotAuthorized id={data.getUserByEmail.id} />;
    }

    if (token && data.getUserByEmail) {
      return (
        <Deposit
          token={token}
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
