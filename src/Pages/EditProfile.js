import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Paper, Avatar, TextField, Button } from '@material-ui/core';
import postUser from '../API/users/postUser';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '20px auto',
    padding: '20px',
    maxWidth: '400px',
    textAlign: 'center',
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: '10px auto',
  },
  profileData: {
    marginBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: '10px',
    },
  },
  imagePreview: {
    width: '100px',
    height: '100px',
    border: '2px solid #000',
    marginBottom: '10px',
  },
}));

const EditProfile = () => 
{
const [profileImage, setProfileImage] = useState(null);
const navigate = useNavigate();
const location = useLocation();
const { profileData } = location.state || {};
const{state} =location;
const myData = location.state;
console.log("inside edit profile:",profileData)

  const classes = useStyles();

  console.log('printing the state',state.profileData);

  const userProfileData = state.profileData;

  const [formData, setFormData] = useState({
    email: '',
    teamName: '',
    phone_number: '',
    address: '',
    profile_image: null, // To store the selected image file
  });
  
  console.log('formData:', formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  const [previewImageUrl, setPreviewImageUrl] = useState(null); // To store the preview image URL

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!profileImage) {
        console.log('Please select a profile image.');
        const response = postUser(formData);
        return;
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(profileImage);
      reader.onloadend = async() => {
        const base64Data = reader.result.split(',')[1]; // Extract base64 data without prefix
        console.log('Base64 Image:', base64Data);
  
        const newFormData = {
            email: formData['email'],
            address: formData['address'],
            phone_number: formData['phone_number'],
            image_data: base64Data,
            profile_image: formData['profile_image'],
            teamName: formData['teamName']
        };
  
        console.log("newFormData:", newFormData);
        const response = await postUser(newFormData);

        navigate('/Home');

      };
};

useEffect(() => {
    //Check if location.state and location.state.profileData are available
    if (state.profileData) {
      console.log('prevProfileData.profileData:', state.profileData);
     if (state.profileData) {
   //     // If profileData is available in the location state, update the formData with existing profile data
       setFormData((prevData) => ({
         ...prevData,
         ...state.profileData,
        }));
        console.log('Profile Data from Backend:', state.profileData);
     } else {
       console.log('No profileData found in location.state.');
     }
    } else {
      console.log('location.state is empty or undefined.');
    }
 }, [state.profileData]);

  return (
    <div className={classes.root}>
      <Typography variant="h4">Edit Profile</Typography>

      <Paper elevation={3}>
        <Avatar
          className={classes.avatar}
          src={previewImageUrl || formData.profile_image}
          alt="Profile"
          style={{
            width: '100px',
            height: '100px',
            border: '2px solid #000',
          }}
        />
        <div className={classes.profileData}>
          <form className={classes.form} onSubmit={handleSubmit}>
          <input type="file" onChange={handleImageChange} accept="image/*" />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Team Name"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              required
            />
            <TextField
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </form>
        </div>
      </Paper>

      <div>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default EditProfile;
