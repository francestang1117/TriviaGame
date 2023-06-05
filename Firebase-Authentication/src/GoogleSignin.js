import {signInWithPopup} from 'firebase/auth';
import { auth, provider } from './Firebase';

export const GoogleSignin = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
        window.alert("Success!")
    })
    .catch((error) => {
        window.alert(error);
    })
}