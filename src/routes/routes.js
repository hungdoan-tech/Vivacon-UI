import { Route, Navigate, Routes, BrowserRouter, Link } from "react-router-dom";
import PostsListPage from "components/pages/PostsListPage";
import NotFoundPage from "components/pages/NotFoundPage";
import LoginPage from "components/pages/LoginPage";
import { useContext } from "react";
import { AuthUser } from "App";
import { Switch } from "react-router-dom";
import { Redirect } from "react-router-dom";

const RouterList = () => {
  const Auth = useContext(AuthUser);

  const PrivateRoute = ({ component: Component, ...rest }) => {
    if(Component.name === 'LoginPage'){
      return ( <Route
        {...rest}
        render={({ location }) =>
          !Auth.auth ? (
            <Component />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location },
              }}
            />
          )
        }
      />)
    }
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
  };
  return (
    <Switch>
      <PrivateRoute exact path="/" component={PostsListPage} />
      <PrivateRoute exact path="/not-found"component={NotFoundPage} />
      <PrivateRoute exact path="/login"component={LoginPage} />
      <Route path="*">
        <Redirect to="/not-found" replace />
      </Route>
    </Switch>
  );
};

export default RouterList;
