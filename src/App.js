import "./App.scss";
import { useState, createContext, useEffect } from "react";
import Navbar from "components/common/Navbar";
import RouterList from "routes/routes";
import { InitLoading, ProgressLoading } from "components/common/Loading";
import { Dialog, DialogTitle } from "@mui/material";
import {
  getJwtToken,
  getRefreshToken,
  removeJwtToken,
  removeRefreshToken,
} from "utils/cookie";
import { getCurrentUser } from "utils/jwtToken";
import classNames from "classnames";
import { useCookies } from "react-cookie";
import NotificationSnackbar from "components/common/NotificationSnackbar";
import Footer from "components/common/Footer";

export const AuthUser = createContext();
export const Loading = createContext();
export const Snackbar = createContext();
export const UpdateProfile = createContext();

function App(props) {
  const [openApp, setOpenApp] = useState(false);
  const [auth, setAuth] = useState({
    isLogin: false,
    isAdmin: true,
  });
  const [loading, setLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    title: "",
    content: "",
    type: "SUCCESS",
  });
  const [isExpiredToken, setIsExpiredToken] = useState(false);
  const [cookies, setCookie] = useCookies(["jwt-token", "refresh-token"]);
  const [isUpdateProfile, setIsUpdateProfile] = useState(false);

  const readCookie = () => {
    const token = getJwtToken();
    const refreshToken = getRefreshToken();
    if (token && refreshToken) {
      if (getCurrentUser().roles.includes("ADMIN")) {
        return {
          isLogin: true,
          isAdmin: true,
        };
      } else {
        return {
          isLogin: true,
          isAdmin: false,
        };
      }
    } else {
      return {
        isLogin: false,
        isAdmin: false,
      };
    }
  };

  useEffect(() => {
    setAuth(readCookie());
  }, []);

  useEffect(() => {
    if (auth && Object.keys(cookies).length === 0) {
      setLoading(false);
      setIsExpiredToken(true);
    }
  }, [cookies]);

  setTimeout(() => {
    setOpenApp(true);
  }, 1000);

  useEffect(() => {
    if (snackbarState.open) {
      setTimeout(() => {
        setSnackbarState({
          open: false,
          title: "",
          content: "",
        });
      }, 2000);
    }
  }, [snackbarState.open]);

  const appWidthClass = classNames("page-content", {
    fullWidth: !auth,
    notFullWidth: auth,
  });
  return (
    <AuthUser.Provider value={{ auth, setAuth }}>
      <UpdateProfile.Provider value={{ isUpdateProfile, setIsUpdateProfile }}>
        <Loading.Provider value={{ loading, setLoading }}>
          <Snackbar.Provider value={{ snackbarState, setSnackbarState }}>
            <div className="App">
              {openApp ? (
                <>
                  {auth.isLogin && (
                    <div className="navbar">
                      <Navbar />
                    </div>
                  )}
                  <div className={appWidthClass}>
                    <RouterList />
                  </div>
                  {loading && <ProgressLoading />}
                  <NotificationSnackbar snackbarState={snackbarState} />
                  <Footer />
                </>
              ) : (
                <InitLoading />
              )}
            </div>{" "}
          </Snackbar.Provider>
        </Loading.Provider>
      </UpdateProfile.Provider>
    </AuthUser.Provider>
  );
}

export default App;
