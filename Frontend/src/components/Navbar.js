import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
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
		  {/* Add more navigation links as needed */}
		</Toolbar>
	  </AppBar>
	);
  };
  
  
  export default Navbar;