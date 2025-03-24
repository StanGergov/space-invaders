import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';



const firebaseConfig = {
  apiKey: "AIzaSyBZsL54WbQXttjURYMs1uS7vaX44ei-b_U",
  authDomain: "fir-game-b8b64.firebaseapp.com",
  projectId: "fir-game-b8b64",
  storageBucket: "fir-game-b8b64.firebasestorage.app",
  messagingSenderId: "536156104495",
  appId: "1:536156104495:web:62b727909f98f714fb63da"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }