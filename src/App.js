import React, { useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Home from './components/Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from './components/Login';
import { useStateValue } from "./StateProvider";
import { actionTypes } from './reducer';
import { auth } from "./firebase";
import Stories from './components/stories/StoryApp.js';


function App() {
  const [state, dispatch] = useStateValue();

  useEffect(_ => {
    auth.onAuthStateChanged(function(user) {
      dispatch({
        type: actionTypes.SET_USER,
        user,
      });

    });
  }, []);


  const signOut = () => {
    auth.signOut()
    .then((result) => {
      dispatch({
        type: actionTypes.SET_USER,
        user: null,
      });
    })
    .catch((error) => alert(error.message));
  }

  return (
    //BEM naming convention
    <div className="app">
      {!state?.user ? (
        <Login />
      ) : (
      <div className="app__body">
        <Router>
          <Sidebar signOut={signOut} />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/stories">
              <Stories />
            </Route>
            <Route path="/rooms/:roomId">
              <Chat />
            </Route>
          </Switch> 
        </Router>
      </div>
      )}
    </div>
  );
}

export default App;
