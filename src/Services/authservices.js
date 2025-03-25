import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";



const provider = new GoogleAuthProvider();
const authGoogle = getAuth();

export const loginWithGoogle = () => {
    return signInWithPopup(authGoogle, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
        
            return user
            
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
}
export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
        .then((res) => res)
        .catch(err => console.log(err))
};

export const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((res) => res)
        .catch(err => console.log(err.message))

};


export const logout = () => {
    signOut(auth)
        .then(res => res)
        .catch(err => err)
};