import {React, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {auth} from "../config/Firebase";
import {GoogleSignin} from "./GoogleSignin";
import axios from "axios";
import API from "../config/constants";

function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleGoogleSignin = (e) => {

        GoogleSignin();

    }

    const handleSignin = () => {

        console.log('Email:', email);
        console.log('Password:', password);

        axios.post(`${API}/user/login`, {
                email: email,
                password: password
            })
            .then((response) => {
                window.alert('Sign in successful!');
                console.log(response);
                if(response.status === 200) {
                    console.log(response.data);
                    navigate('/signin/security-questions', {state: {uid: response.data.userId, email: email}});
                } else {
                    throw new Error(response.data.body.errorCode);
                }

            })
            .catch((error) => {
                window.alert('Error signing in! ');
            })

        // Reset the form
        setEmail('');
        setPassword('');
    };

    return (
        <div>
            <h1>Sign In</h1>

            <form>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={handleEmailChange}/>
                </div>

                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePasswordChange}/>
                </div>

                <button type="button" onClick={handleSignin}>Sign In</button>

                <button type="button" onClick={handleGoogleSignin}>Google Signin</button>
            </form>

            <p>
                Forgot Password? <Link to="/password-recover"> Recover password</Link>
            </p>
            <p>
                Don't have an account? <Link to="/signup">Sign up</Link> instead.
            </p>
        </div>
    );
}

export default Signin;