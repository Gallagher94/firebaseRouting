import { firestore, storage } from './config';

export const CheckUserExists = async (user) => {
  if (!user) return;
  return firestore.collection('users')
.doc(user?.uid).get()
.then(async docSnapshot => {
    if (!docSnapshot.exists) {
  // get a reference to the Firestore document
  const docRef = firestore.doc(`/users/${user.uid}`);

  // create user object
  const userProfile = {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    specialty: '',
    ip: '',
  };

  // write to Cloud Firestore
  const returnUser = docRef.set(userProfile);
  await user.updateProfile({ displayName: user.displayNamefirstName });

  return returnUser;
}
});
};

// export const getUserDocument = async (userId) => firestore.collection('users').doci(userId).get().then(docSnapshot => {
//   if (docSnapshot.exists) {

//   }
// });

export const updateUserDocument = async (user) => {
  const docRef = firestore.doc(`/users/${user.uid}`);
  return docRef.update(user);
};

export const uploadImage = (userId, file, progress) => {
  return new Promise((resolve, reject) => {
    // create file reference
    const filePath = `users/${userId}/profile-image`;
    const fileRef = storage.ref().child(filePath);

    // upload task
    const uploadTask = fileRef.put(file);

    uploadTask.on(
      'state_changed',
      (snapshot) => progress(snapshot),
      (error) => reject(error),
      () => {
        resolve(uploadTask.snapshot.ref);
      }
    );
  });
};

export const getDownloadUrl = (userId) => {
  const filePath = `users/${userId}/profile-image`;
  return storage.ref().child(filePath).getDownloadURL();
};
