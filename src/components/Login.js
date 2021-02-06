import React, { useState }  from 'react';
import {Button, InputLabel} from "@material-ui/core";
import "./Login.css";
import { auth, fprovider, gprovider } from "../firebase";
import { actionTypes } from '../reducer';
import { useStateValue } from "../StateProvider";
import Logo from "./logo.png";
import firebase from "firebase";

function Login() {
  const [inputE, setInputE] = useState("")
  const [inputP, setInputP] = useState("")
  const [, dispatch] = useStateValue();
  

  const signInGoogle = () => {
    auth.signInWithRedirect(gprovider)
    .then((result) => {
      dispatch({
        type: actionTypes.SET_USER,
       user: result.user,
      });
    })
    .catch((error) => alert(error.message));
  };
  const signInFacebook = () => {
    firebase.auth().signInWithRedirect(fprovider).then(function(result) {
      dispatch({
        type: actionTypes.SET_USER,
       user: result.user,
      })
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
  
  const signInAnonimous = () => {
    firebase.auth().signInAnonymously()
  .then(() => {
    // Signed in..
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
  }

  return (
    <div className="login">
      <div className="login__container">
        <img
         src={Logo}
         alt="Whastapp-logo"/>
         <div className="login__text">
           <h1 style={{fontSize: 38}}>Hello, <br /> Wheresapp?</h1>
         </div>
         <div className="login__buttons">
          <Button className="login__google" onClick={signInGoogle}>
            Sign In With Google
          </Button>
          <Button className="login__facebook" onClick={signInFacebook}>
            Sign In With Facebook
          </Button>
          <Button className="login__demo" onClick={signInAnonimous}>Demo</Button>
           </div>
      </div>
    </div>
  )
}

export default Login
