import React from 'react';
import firebase from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import {auth} from '../firebase/config'

function Login() {
  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
  };

  return (
    <div className="login-container">
      <div className="ui card login-card">
        <div className="content">
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
        </div>
      </div>
    </div>
  );
}

export default Login;
