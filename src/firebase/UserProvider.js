import React, { useEffect, useState, useContext } from 'react';
import firebase from 'firebase/app';

import { CheckUserExists } from './user';

export const UserContext = React.createContext();

export const UserProvider = (props) => {
  const [session, setSession] = useState({
    user: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      console.log('change', {user})

      await CheckUserExists(user);
    
      let isAdmin = false;

      if (user) {
        const token = await user.getIdTokenResult();
        if (token.claims?.admin) {
        isAdmin = true;
        setSession({ loading: false, user, isAdmin });
        } else {
          const idToken = await firebase.auth().currentUser.getIdToken();

          // not done the claims yet
          await fetch(`https://us-central1-fir-linkedinrouter.cloudfunctions.net/expressApp/register`,
          {method: 'GET',
          credentials: 'include',
          mode: 'cors',
      headers: {
          Authorization: `Bearer ${idToken}`
      }}).then(async result => {
          if (result.status !== 200) {
              throw new Error('this failed')
          }
              await firebase.auth().currentUser.getIdToken(true);
              await firebase.auth().currentUser.sendEmailVerification();
              setSession({ loading: false, user, isAdmin: true });
      });
        }
      } else {
      setSession({ loading: false, user, isAdmin });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={session}>
      {!session.loading && props.children}
    </UserContext.Provider>
  );
};

export const useSession = () => {
  const session = useContext(UserContext);
  return session;
};
