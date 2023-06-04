import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {auth} from './firebase';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';

function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

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

  
  createUserWithEmailAndPassword(auth, email, password)
  .then ((userCredentials) => {
    //   TODO: Try to store the other information as well i.e., firstName and lastName
  })
  .catch((error) => {
      window.alert(error);
  })
  };

  return (
    <div>
      <h1>Sign Up</h1>

      <form>
        <div>
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={handleFirstNameChange} />
        </div>

        <div>
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={handleLastNameChange} />
        </div>

        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>

        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>

        <div>
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
        </div>

        <button type="button" onClick={handleSignup}>Sign Up</button>
      </form>

      {error && <p>{error}</p>}

      <p>
        Already have an account? <Link to="/signin">Sign in</Link> instead.
      </p>
    </div>
  );
}

export default SignupPage;
