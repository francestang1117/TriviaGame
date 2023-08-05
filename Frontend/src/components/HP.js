import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { makeStyles } from '@mui/material';
import { Typography, Paper, Avatar } from '@mui/material';

// const useStyles = makeStyles((theme) => ({
//     root: {
//         margin: '20px auto',
//         padding: '20px',
//         maxWidth: '400px',
//         textAlign: 'center',
//     },
//     avatar: {
//         width: theme.spacing(10),
//         height: theme.spacing(10),
//         margin: '10px auto',
//     },
//     profileData: {
//         marginBottom: '10px',
//     },
// }));

const ProfilePage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [profileImageURL, setProfileImageURL] = useState('');
    const [gamesPlayed, setGamesPlayed] = useState(0); // New state for games played
    const [winLossRatio, setWinLossRatio] = useState(0); // New state for win/loss ratio
    const [totalPoints, setTotalPoints] = useState(0);
    // const classes = useStyles();
    // const staticEmail = 'dhana4@gmail.com'; // Static email for testing loca
    const locations = useLocation();
    const staticEmail = locations.state.email;

    const handleCreateProfile = () => {
        navigate('/CreateProfile');
    };

    const handleEditProfile = () => {
        // console.log('handleEditProfile called.');
        //console.log("Profile Data:", profileData); // Check if the profileData is available

        // let myData = {
        //     "name": "Anuj"
        // }

        console.log('handleEditProfile called.');
        console.log("Profile Data:", profileData); // Check if the profileData is available

        navigate('/EditProfile', { state: { profileData } });

        //   const queryString = new URLSearchParams(profileData).toString();
        // navigate(`/EditProfile?${queryString}`);
    };

    // Function to fetch profile data from the backend based on email
    const fetchProfileData = async (email) => {
        try {


            console.log('Sending request to backend with email:', email);
            const response = await fetch('https://f3jyjh5gh8.execute-api.us-east-1.amazonaws.com/Naveen/getdetailsfromdynamo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // Send email as JSON in the request body
            });

            console.log('Response received from backend:', JSON.stringify(response));

            const data = await response.json();

            console.log('Data parsed from response:', data);
            console.log('Data pbody:', data.statusCode);

            const profileDetails = JSON.parse(data.body);
            console.log('Profile Details :',profileDetails)



            if (response.ok && profileDetails.status === 'Data exists') {
                console.log("inside if")
                setProfileData(profileDetails.profile_data);
                setProfileImageURL(profileDetails.profile_data.profile_image);
                setGamesPlayed(profileDetails.profile_data.gamesPlayed || 0);
                setWinLossRatio(profileDetails.profile_data.winLossRatio || 0);
                setTotalPoints(profileDetails.profile_data.totalPoints || 0);
            } else {
                // Profile not found or other error handling
                console.log("in else")
                setProfileData(null);
                setProfileImageURL('');
                setGamesPlayed(0);
                setWinLossRatio(0);
                setTotalPoints(0);
            }
            setIsLoading(false); // Set isLoading to false after receiving the response
        } catch (error) {
            // Error handling
            console.error('Error occurred while fetching profile data:', error);

            setIsLoading(false); // Set isLoading to false in case of error
        }
    };

    // Trigger profile check when the component mounts
    useEffect(() => {
        fetchProfileData(staticEmail);
    }, []); // Empty dependency array ensures it runs only once when the component mounts

    return (
        <div>
            {/* <h1>Welcome to Our Website!</h1> */}
            {/* <p>Thank you for visiting our website. We are delighted to have you here.</p> */}

            {isLoading && <p>Loading...</p>}

            {!isLoading && profileData && (
                // <div>
                //   <h2>Your Profile Details:</h2>
                //   <p>Email: {profileData.email}</p>
                //   <p>Team Name: {profileData.teamName}</p>
                //   <p>Phone Number: {profileData.phone_number}</p>
                //   <p>Address: {profileData.address}</p>

                //   {profileImageURL && (
                //     <div>
                //       <h2>Profile Image:</h2>
                //       <img src={profileImageURL} alt="Profile" />
                //     </div>
                //   )}

                //   {/* You can display other profile data as needed */}
                // </div>
                <div>

                    {isLoading && <Typography variant="body1">Loading...</Typography>}

                    {!isLoading && profileData && (

                        <div>
                            <Typography variant="h4">Welcome to Our Website!</Typography>
                            <Typography variant="body1">
                                Thank you for visiting our website. We are delighted to have you here.
                            </Typography>

                            <Paper elevation={3}>
                                <Avatar src={profileImageURL} alt="Profile" style={{
                                    width: '100px',
                                    height: '100px',
                                    border: '2px solid #000',
                                }} />
                                <div>
                                    <Typography variant="h5">Your Profile Details:</Typography>
                                    <Typography variant="body1">Email: {profileData.email}</Typography>
                                    <Typography variant="body1">Team Name: {profileData.teamName}</Typography>
                                    <Typography variant="body1">Phone Number: {profileData.phone_number}</Typography>
                                    <Typography variant="body1">Address: {profileData.address}</Typography>
                                    <Typography variant="body1">Games Played: {profileData.gamesPlayed}</Typography>
                                    <Typography variant="body1">Win/Loss Ratio: {profileData.winLossRatio}</Typography>
                                    <Typography variant="body1">Total Points Earned: {profileData.totalPoints}</Typography>
                                </div>
                                <button onClick={handleEditProfile}>Edit Profile</button>

                            </Paper>


                        </div>

                    )}

                    {!isLoading && !profileData && (
                        <div>
                            <Typography variant="body1">No profile found for the provided email.</Typography>
                            <Typography variant="body1">
                                <Link to="/CreateProfile">Create/Update Profile</Link>
                            </Typography>
                        </div>
                    )}
                </div>

            )}

            {!isLoading && !profileData && (
                <div>
                    <p>No profile found for the provided email.</p>
                    <p>
                        <Link to="/CreateProfile">Create/Update Profile</Link>
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
