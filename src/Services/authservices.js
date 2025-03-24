import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

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