import React from 'react';
import firebase from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import {auth} from '../firebase/config'
import { useSession } from '../firebase/UserProvider';

function Login({history}) {
  const { user, completeSignUp, admin, loading } = useSession();

  const getIntoApp = async () => {
    await firebase.auth().currentUser.getIdToken(true);
    history.push('/');

  }

  const renderScreenContent = () => {
    if (!user) {
      // no user
      return (<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>);
    }
      return (
        <>
      <div>Do something else to complete</div>
      <button onClick={getIntoApp} disabled={!completeSignUp}>Get in</button>
      </>
      );


  }
  

  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/login',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
  };

  return (
    <div className="login-container">
      <div className="ui card login-card">
        <div className="content">
          {renderScreenContent()}
        </div>
      </div>
    </div>
  );
}

export default Login;
