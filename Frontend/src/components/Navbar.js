import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'; // If using React Router

const Navbar = () => {
	return (
	  <AppBar position="static">
		<Toolbar>
		  <Typography variant="h6" style={{ flexGrow: 1 }}>
			SDP-1
		  </Typography>
		  <Button color="inherit" component={Link} to="/">
			Home
		  </Button>
		  <Button color="inherit" component={Link} to="/signin">
			Sign In
		  </Button>
		  <Button color="inherit" component={Link} to="/signup">
			Sign Up
		  </Button>
		  <Button color="inherit" component={Link} to="/bot">
			Virtual Assistance
		  </Button>
		  <Button color="inherit" component={Link} to="/teammanagment">
			Create Team
		  </Button>
		  {/* Add more navigation links as needed */}
		</Toolbar>
	  </AppBar>
	);
  };
  
  
  export default Navbar;