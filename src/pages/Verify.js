import React, { useEffect } from 'react';
import firebase from 'firebase/app';

import { Route, Redirect } from 'react-router-dom';
import { useSession } from '../firebase/UserProvider';


const Verify = (props) => {
  const { user, isAdmin, loading } = useSession();

  useEffect(() => {
    firebase.auth().currentUser.getIdToken(true);
  }, [])

  return (
    <Route
      {...props}
      render={(props) =>
        user ? loading ? (
          null
        ) : (
          <Redirect
            to={{
              pathname: isAdmin ? '/users' : `/profile/${user.uid}`,
              state: { from: props.location },
            }}
          />
        ) :           
        <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location },
        }}
      />
      }
    />
  );
};

export default Verify;
