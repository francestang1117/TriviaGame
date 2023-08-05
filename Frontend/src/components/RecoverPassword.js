import { React, useState } from "react";
import {auth} from '../config/Firebase';
import {  sendPasswordResetEmail  } from 'firebase/auth';
import axios from "axios";
import API from '../config/constants';

function PasswordRecovery() {

    const [email, setEmail] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleRecovery = () => {
        axios.post(`${API}/user/reset-password`, {
          email: email
        })
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