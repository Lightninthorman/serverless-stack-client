import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Settings from "./containers/Settings";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";

export default function Routes() {
  return (
    <Switch>
        <Route exact path="/">
            <Home />
        </Route>

        <UnauthenticatedRoute exact path="/Login">
            <Login />
        </UnauthenticatedRoute>

        <UnauthenticatedRoute exact path="/signup">
          <Signup />
        </UnauthenticatedRoute>

        <AuthenticatedRoute exact path="/settings">
          <Settings />
        </AuthenticatedRoute>

        <AuthenticatedRoute exact path="/notes/new">
          <NewNote />
        </AuthenticatedRoute>

        <AuthenticatedRoute exact path="/notes/:id">
          <Notes />
        </AuthenticatedRoute>

        <Route>
            <NotFound />
        </Route>
    </Switch>
  );
}
