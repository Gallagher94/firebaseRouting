import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../firebase/auth';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
 

import {auth} from '../firebase/config'

function Login(props) {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setLoading] = useState(false);

  const routeOnLogin = async (user) => {
    const token = await user.getIdTokenResult();
    if (token.claims.admin) {
      props.history.push('/users');
    } else {
      props.history.push(`/profile/${user.uid}`);
    }
  };

  const onSubmit = async (data) => {
    let user;
    setLoading(true);
    try {
      user = await login(data);
      reset();
    } catch (error) {
      console.log(error);
    }

    if (user) {
      routeOnLogin(user);
    } else {
      setLoading(false);
    }
  };

  const google = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('profile');
    provider.addScope('email');
    auth.signInWithPopup(provider).then(async function(result) {
        // This gives you a Google Access Token.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        console.log({user})

  // await user.updateProfile({ displayName: `${firstName} ${lastName}` });
  // await createUserDocument(user);
       }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log({error})
        // ...
      });
};

  const formClassName = `ui form ${isLoading ? 'loading' : ''}`;

  return (
    <div className="login-container">
      <div className="ui card login-card">
        <div className="content">
          <form className={formClassName} onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  ref={register}
                />
              </label>
            </div>
            <div className="field">
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  ref={register}
                />
              </label>
            </div>
            <div className="field actions">
              <button className="ui primary button login" type="submit">
                Login
              </button>
              or
              <Link to="/signup">Sign Up</Link>
            </div>
          </form>
          <button onClick={google}>Google</button>

        </div>
      </div>
    </div>
  );
}

export default Login;
