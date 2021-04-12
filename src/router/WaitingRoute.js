import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSession } from '../firebase/UserProvider';


const ProfileRedirect = ({ component: Component, ...rest }) => {
  const { user, isAdmin, loading } = useSession();

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? loading ? (
          <Component {...props} />
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

export default ProfileRedirect;
