import React, { useState, useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import moneyBag from "../assets/money-bag.png";
import { Button } from "react-bootstrap";
import { COLORS } from "../themes";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../index";

export default function NavBar({ id }) {
  const ctx = useContext(UserContext);
  const firebaseAuth = getAuth(app);
  const [expanded, setExpanded] = useState(false);
  const [btnTxt, setBtnTxt] = useState(
    firebaseAuth.currentUser ? "Logout" : "Log In"
  );
  const navigate = useNavigate();

  // console.log("NAVBAR ID", id);
  // console.log("loggedIn", loggedIn);
  console.log("---NAVBAR---");
  console.log("button txt", btnTxt);
  console.log("firebaseAuth.currentUser", firebaseAuth.currentUser);

  useEffect(() => {
    console.count("NAVBAR useEffect");
    if (firebaseAuth.currentUser !== null) setBtnTxt("Logout");
  }, [firebaseAuth.currentUser]);

  const style = {
    backgroundColor: "#89abe3ff",
    color: "#fcf6f5ff",
    minHeight: "9vh",
  };

  function login() {
    console.log("Login");
    navigate("/login");
  }

  function logout() {
    console.log("Logout FUNCTION");
    console.log("currentUser before", firebaseAuth.currentUser);
    firebaseAuth.signOut();
    console.log("currentUser after", firebaseAuth.currentUser);
    // setLoggedIn(false);
    setBtnTxt("Log In");
    ctx.user = {};
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <>
      <Navbar
        variant="light"
        expand="md"
        expanded={expanded}
        className="p-3 navbar"
        style={style}
      >
        <Container>
          <Navbar.Brand>
            <Link
              to="/"
              style={style}
              onClick={() => setExpanded(false)}
              id={id}
            >
              <span
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <img
                  src={moneyBag}
                  className="img-fluid logo"
                  alt="Money Bag"
                  style={{
                    width: "2.5rem",
                    marginRight: "0.5rem",
                  }}
                />
              </span>
            </Link>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              {btnTxt === "Log In" ? (
                <Nav.Item>
                  <Nav.Link>
                    <Link
                      to="/createaccount"
                      style={style}
                      className="link"
                      onClick={() => setExpanded(false)}
                    >
                      Create Account
                    </Link>
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <></>
              )}

              <Nav.Item>
                <Nav.Link>
                  <Link
                    to={`/deposit/${id}`}
                    style={style}
                    className="link"
                    onClick={() => setExpanded(false)}
                  >
                    Deposit
                  </Link>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>
                  <Link
                    to={`/withdraw/${id}`}
                    style={style}
                    className="link"
                    onClick={() => setExpanded(false)}
                  >
                    Withdraw
                  </Link>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>
                  <Link
                    to={`/data/${id}`}
                    style={style}
                    className="link"
                    onClick={() => setExpanded(false)}
                  >
                    Transactions
                  </Link>
                </Nav.Link>
              </Nav.Item>
              <Button
                className="loginOutBtn"
                style={{
                  background: COLORS.lighterTheme,
                  color: COLORS.darkerTheme,
                  fontWeight: 800,
                  boxShadow: "0 0.2rem 0.75rem rgba(0, 0, 0, 0.3)",
                  marginLeft: "1rem",
                }}
                onClick={() => {
                  btnTxt === "Logout" ? logout() : login();
                  setExpanded(false);
                }}
              >
                {btnTxt}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
