import React, { useState } from 'react';
import postUser from '../API/users/postUser';
import { Link, useNavigate } from 'react-router-dom';


const RegistrationPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [teamName, setTeamName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    //
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [winLossRatio, setWinLossRatio] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);

    const isRegistration = true;
    const handleFormSubmit = (event) => {
        event.preventDefault();

        console.log(profileImage);

        if (!profileImage) {
            console.error('Please select a profile image.');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(profileImage);
        reader.onloadend = async()  => {
            const base64Data = reader.result.split(',')[1]; // Extract base64 data without prefix
            console.log('Base64 Image:', base64Data);

            const formData = {
                email,
                teamName,
                phone_number: phoneNumber, // Use phone_number instead of phoneNumber
                address,
                image_data: base64Data, // Use image_data instead of profileImage

                //
                gamesPlayed,
                winLossRatio,
                totalPoints,
            };

            console.log('Form data:', formData);

            // Send the form data to the API using fetch

            const response =await postUser(formData);
            navigate('/Home');

        };
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setProfileImage(file);
    };

    return (
        <div>
            <h1>Registration Form</h1>
            <form onSubmit={handleFormSubmit}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />

                <label>Team Name:</label>
                <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required /><br />

                <label>Phone Number:</label>
                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required /><br />

                <label>Address:</label>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} required></textarea><br />

                <label>Profile Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} required /><br />

                <label>Games Played:</label>
                <input type="number" value={gamesPlayed} onChange={(e) => setGamesPlayed(e.target.value)} required disabled={isRegistration} /><br />

                <label>Win/Loss Ratio:</label>
                <input  type="number" value={winLossRatio} onChange={(e) => setWinLossRatio(e.target.value)} required disabled={isRegistration} /><br/>

                <label>Total Points Earned:</label>
                <input  type="number" value={totalPoints} onChange={(e) => setTotalPoints(e.target.value)}  required disabled={isRegistration} /><br/>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default RegistrationPage;
