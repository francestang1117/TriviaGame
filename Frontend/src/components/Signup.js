import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {GoogleSignin} from './GoogleSignin';
import axios from "axios";
import API from "../config/constants";

function SignupPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSignup = () => {
        setError('');

        // Password validation regex pattern
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!password.match(passwordPattern)) {
            setError('Password must be at least 6 characters long, containing one uppercase letter, one lowercase letter, one special character, and one number');
            return;
        }

        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }

        axios.post(`${API}/user/signup`, {
            ...data
        }).then((result) => {
            if (result.status === 200) {
                window.alert("Successful");
                navigate('/signup/security-questions', {state: {uid: result.data.userId}});
            } else {
                window.alert('Something went wrong!');
            }
        }).catch((error) => {
                window.alert("Something went wrong!");
                console.log(error);
            });
    };

    const handleGoogleSignup = (e) => {
        GoogleSignin();
    }

    return (
        <div>
            <h1>Sign Up</h1>

            <form>
                <div>
                    <label>First Name:</label>
                    <input type="text" value={firstName} onChange={handleFirstNameChange}/>
                </div>

                <div>
                    <label>Last Name:</label>
                    <input type="text" value={lastName} onChange={handleLastNameChange}/>
                </div>

                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={handleEmailChange}/>
                </div>

                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePasswordChange}/>
                </div>

                <div>
                    <label>Confirm Password:</label>
                    <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange}/>
                </div>

                <button type="button" onClick={handleSignup}>Sign Up</button>

                <button type='button' onClick={handleGoogleSignup}>Google Signup</button>
            </form>

            {error && <p>{error}</p>}

            <p>
                Already have an account? <Link to="/signin">Sign in</Link> instead.
            </p>
        </div>
    );
}

export default SignupPage;
