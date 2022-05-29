import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Login from "./Components/Home/Login/Login";
import Registration from "./Components/Home/Registration/Registration";
import Verify from "./Components/Home/Verify/Verify";
export const UserContext = createContext();
function App() {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [tokenData, setTokenData] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      const newUser = { ...loggedInUser };
      newUser.name = user.name;
      newUser.email = user.email;
      newUser.avatar = user.image;
      newUser.id = user.id;
      setLoggedInUser(newUser);
      setTokenData(user.token);
    }
  }, []);
  return (
    <UserContext.Provider
      value={{
        log: [loggedInUser, setLoggedInUser],
        token: [tokenData, setTokenData],
      }}
    >
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/registration">
            <Registration />
          </Route>
          <Route path="/users/activate/:param">
            <Verify />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
