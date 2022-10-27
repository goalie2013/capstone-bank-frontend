import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import { Route, BrowserRouter, Routes, Link } from "react-router-dom";
import NotAuthorized from "./components/NotAuthorized";
import AuthWrapper from "./pages/AuthWrapper";
import PageNotFound from "./components/PageNotFound";
import { UserContext } from "./index";
import Login from "./pages/Login";

// console.log(
//   "process.env.REACT_APP_SERVER_PORT",
//   process.env.REACT_APP_SERVER_PORT
// );

function App() {
  return (
    <div className="app-wrapper">
      <UserContext.Provider
        value={{
          user: {},
        }}
      >
        <BrowserRouter>
          {/* <NavBar /> */}
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/createaccount" element={<CreateAccount />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/deposit/:id"
                // element={<PageWrapper pageComponent={<Deposit />} />}
                element={<AuthWrapper pageComponent="Deposit" />}
              />
              <Route
                path="/withdraw/:id"
                // element={<PageWrapper pageComponent={<Withdraw />} />}
                element={<AuthWrapper pageComponent="Withdraw" />}
              />
              <Route
                path="/data/:id"
                element={<AuthWrapper pageComponent="UserData" />}
              />
              {/*<Route path="/alldata" element={<AllData />} /> */}
              <Route path="/not-authorized" element={<NotAuthorized />} />

              <Route path="*" element={<PageNotFound id="n" />} />
            </Routes>
          </main>

          <Footer />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
