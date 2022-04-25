import { Route, Navigate, Routes, BrowserRouter, Link } from "react-router-dom";
import PostsListPage from "components/pages/PostsListPage";
import NotFoundPage from "components/pages/NotFoundPage";
import LoginPage from "components/pages/LoginPage";
import ProfilePage from "components/pages/ProfilePage";
import { useContext } from "react";
import { AuthUser } from "App";
import { Switch } from "react-router-dom";
import { Redirect } from "react-router-dom";
import RegisterPage from "components/pages/RegisterPage";
import VerifyPage from "components/pages/VerifyPage";
import ForgotInputEmailPage from "components/pages/ForgotInputEmailPage";
import ForgotPasswordPage from "components/pages/ForgotPasswordPage";

const RouterList = () => {
  const Auth = useContext(AuthUser);
  return (
    <Switch>
      <PrivateRoute exact path="/" component={PostsListPage} />
      <PrivateRoute exact path="/not-found" component={NotFoundPage} />
      <PrivateRoute exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />
      <Route exact path="/verify" component={VerifyPage} />
      <Route
        exact
        path="/forgot-input-email"
        component={ForgotInputEmailPage}
      />
      <Route exact path="/forgot-password" component={ForgotPasswordPage} />
      <PrivateRoute exact path="/profile/:username" component={ProfilePage} />
      <Route path="*">
        <Redirect to="/not-found" replace />
      </Route>
    </Switch>
  );
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  const Auth = useContext(AuthUser);
  if (Component.name === "LoginPage") {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          !Auth.auth ? (
            <Component location={location} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location },
              }}
            />
          )
        }
      />
    );
  } else {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          Auth.auth ? (
            <Component />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location },
              }}
            />
          )
        }
      />
    );
  }
};

export default RouterList;
