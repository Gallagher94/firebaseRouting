import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSession } from '../firebase/UserProvider';


const ProfileRedirect = ({ component: Component, ...rest }) => {
  const { user, isAdmin, done } = useSession();


  return (
    <Route
      {...rest}
      render={(props) =>
        !user || !done ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: isAdmin ? '/users' : `/profile/${user.uid}`,
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default ProfileRedirect;
