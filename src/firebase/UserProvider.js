import React, { useEffect, useState, useContext } from 'react';
import firebase from 'firebase/app';

import { CheckUserExists } from './user';

export const UserContext = React.createContext();

export const UserProvider = (props) => {
  const [session, setSession] = useState({
    user: null,
    loading: false,
    isAdmin: false,
  });

  useEffect(() => {
    console.log({session})
  }, [session])

  useEffect(() => {
    console.log('runnign useEffect')
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      await CheckUserExists(user);
    
      let isAdmin = false;

      if (user) {
        const token = await user.getIdTokenResult();
        if (token.claims?.admin) {
        isAdmin = true;
        setSession({ loading: !user.emailVerified, user, isAdmin });
        } else {
          console.log('no user, signing up')
          setSession({ loading: true, user, isAdmin: false });
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
              // await firebase.auth().currentUser.getIdToken(true);
              await firebase.auth().currentUser.sendEmailVerification({
                url: 'https://fir-linkedinrouter.firebaseapp.com/verify'
              });
              // setSession({ loading: true, user, isAdmin: true });
      });
        }
      } else {
      setSession({user: null, loading: false, isAdmin });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={session}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useSession = () => {
  const session = useContext(UserContext);
  return session;
};
