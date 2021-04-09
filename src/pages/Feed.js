import React, { useEffect, useState } from 'react';
import { useSession } from '../firebase/UserProvider';
import { firestore, timeStamp } from '../firebase/config';


const Feed = () => {
  const { user } = useSession();
  const [allPosts, setPosts] = useState([]);
  const [input, setInput] = useState('');


  useEffect(() => {
    const docRef = firestore.collection('posts')
    const unsubscribe = docRef.onSnapshot((snapshot) => {
    const documentsData = snapshot.docs.map(doc=>({
          id:doc.id,
          data:doc.data()
    }));
    
    setPosts(documentsData)
    console.log(documentsData)

    });
    return unsubscribe;
  }, []);

  const sendPost = (e) => {
    e.preventDefault();
    firestore.collection('posts').add({
    name: user.displayName,
    description: user.email,
    message: input,
    photoUrl: user.photoUrl || '',
    timestamp: timeStamp()})
      
    setInput('');
}

  return (
   <div>
     <form className="feed__form">
                        <input 
                        type="text" 
                        value={input} 
                        onChange={e => setInput(e.target.value)}
                        />
                        <button type="Submit" onClick={sendPost}>Send</button>
                    </form>
    
     <ul>
       {allPosts.map(({data}) => <li>{data.message}</li>)}
     </ul>
    </div> );
};

export default Feed;
