import { Route, Navigate, Routes, BrowserRouter, Link } from "react-router-dom";
import PostsListPage from "components/pages/PostsListPage";
import NotFoundPage from "components/pages/NotFoundPage";
import LoginPage from "components/pages/LoginPage";
import ProfilePage from "components/pages/ProfilePage";
import { useContext } from "react";
import { AuthUser } from "App";
import { Switch } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Dashboard from "components/dashboard/src";

const RouterList = () => {
  const Auth = useContext(AuthUser);
  return (
    <Switch>
      {!Auth.auth.isAdmin && (
        <>
          <PrivateRoute exact path="/" component={PostsListPage} />
          <PrivateRoute exact path="/not-found" component={NotFoundPage} />
          <PrivateRoute exact path="/login" component={LoginPage} />
          <PrivateRoute
            exact
            path="/profile/:username"
            component={ProfilePage}
          />
        </>
      )}
      {Auth.auth.isAdmin && (
        <>
          <PrivateRoute exact path="/not-found" component={NotFoundPage} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
        </>
      )}
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
          !Auth.auth.isLogin ? (
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
          Auth.auth.isLogin ? (
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
