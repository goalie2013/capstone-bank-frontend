// import { useContext } from "react";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import { UserContext } from "../index";

// const navigate = useNavigate();
// const ctx = useContext(UserContext);
const firebaseAuth = getAuth(app);

export const siteAuth = {
  logout(navigate) {
    console.log("Logout FUNCTION");
    console.log("currentUser before", firebaseAuth.currentUser);
    firebaseAuth.signOut();
    console.log("currentUser after", firebaseAuth.currentUser);
    // ctx.user = {};
    localStorage.removeItem("token");
    navigate("/");
  },
  login(navigate) {
    console.log("Login");
    navigate("/login");
  },
};

module.exports = { siteAuth };
