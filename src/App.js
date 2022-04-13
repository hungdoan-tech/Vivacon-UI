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
import classNames from "classnames";
import { useCookies } from "react-cookie";
import NotificationSnackbar from "components/common/NotificationSnackbar";

export const AuthUser = createContext();
export const Loading = createContext();
export const Snackbar = createContext();

function App(props) {
  const [openApp, setOpenApp] = useState(false);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    title: "",
    content: "",
  });
  const [isExpiredToken, setIsExpiredToken] = useState(false);
  const [cookies, setCookie] = useCookies(["jwt-token", "refresh-token"]);

  const readCookie = () => {
    const token = getJwtToken();
    const refreshToken = getRefreshToken();
    if (token && refreshToken) {
      return true;
    } else {
      return false;
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
      <Loading.Provider value={{ loading, setLoading }}>
        <Snackbar.Provider value={{ snackbarState, setSnackbarState }}>
          <div className="App">
            {openApp ? (
              <>
                {auth && (
                  <div className="navbar">
                    <Navbar />
                  </div>
                )}
                <div className={appWidthClass}>
                  <RouterList />
                </div>
                {loading && <ProgressLoading />}
                <NotificationSnackbar snackbarState={snackbarState} />
              </>
            ) : (
              <InitLoading />
            )}
          </div>{" "}
        </Snackbar.Provider>
      </Loading.Provider>
    </AuthUser.Provider>
  );
}

export default App;
