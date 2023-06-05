import { React, useState } from "react";
import {auth} from './Firebase';
import {  sendPasswordResetEmail  } from 'firebase/auth';

function PasswordRecovery() {

    const [email, setEmail] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleRecovery = () => {
        sendPasswordResetEmail(auth, email)
        .then((message) => {
            window.alert("Mail sent!");
            window.open("/", '_self');
        })
        .catch((error) => {
            window.alert(error);
        })
    }

    return (
        <div>
            <form>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>

        <button type="button" onClick={handleRecovery}>Send Recovery Mail</button>
      </form>
        </div>
    );
}

export default PasswordRecovery;