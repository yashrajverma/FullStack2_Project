import "./App.css";
import React, {
  useState,
  useEffect,
  createContext,
  useReducer,
  useContext,
} from "react";
import Navbar from "./components/Navbar";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import SignUp from "./components/screens/SignUp";
import Login from "./components/screens/SignIn";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import SubscribedUserPost from "./components/screens/SubscribedUserPost";
import { reducer, initialState } from "./reducers/userReducers";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      // history.push("/");
    } else {
      history.push("/signin");
    }
  }, []);
  return(
    <>
    <Navbar />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/signin" component={Login} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/createpost" component={CreatePost} />
      <Route exact path="/profile/:userid" component={UserProfile} />
      <Route exact path="/myfollowerspost" component={SubscribedUserPost} />
      <Redirect to='/'/>
    </Switch>
  </>
  )
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Routing />
    </UserContext.Provider>
  );
}

export default App;
