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
		  {/*<Button color="inherit" component={Link} to="/">*/}
			{/*Home*/}
		  {/*</Button>*/}
		  {/*<Button color="inherit" component={Link} to="/signin">*/}
			{/*Sign In*/}
		  {/*</Button>*/}
		  {/*<Button color="inherit" component={Link} to="/signup">*/}
			{/*Sign Up*/}
		  {/*</Button>*/}
		  {/*<Button color="inherit" component={Link} to="/bot">*/}
			{/*Virtual Assistance*/}
		  {/*</Button>*/}
		  {/*<Button color="inherit" component={Link} to="/teammanagment">*/}
			{/*Create Team*/}
		  {/*</Button>*/}
		  {/* Add more navigation links as needed */}

			{/*<Button color="inherit" component={Link} to="/profile" style={{border: '1px solid #000'}}>*/}
			{/*	Profile*/}
			{/*</Button>*/}
			<Button color="inherit" component={Link} to="/" style={{border: '1px solid #000'}}>
				Home
			</Button>
			<Button color="inherit" component={Link} to="/game" style={{border: '1px solid #000'}}>
				Create Game
			</Button>
			<Button color="inherit" component={Link} to="/question/add" style={{border: '1px solid #000'}}>
				Add Questions
			</Button>
			<Button color="inherit" component={Link} to="/question/list" style={{border: '1px solid #000'}}>
				Filter Questions
			</Button>
			<Button color="inherit" component={Link} to="/teammanagment" style={{border: '1px solid #000'}}>
				Create Team
			</Button>
			<Button color="inherit" component={Link} to="/trivia" style={{border: '1px solid #000'}}>
				Filter Games
			</Button>
			<Button color="inherit" component={Link} to="/data" style={{border: '1px solid #000'}}>
				Leaderboard
			</Button>
			<Button color="inherit" component={Link} to="/chat" style={{border: '1px solid #000'}}>
				Chat
			</Button>
			<Button color="inherit" component={Link} to="/bot" style={{border: '1px solid #000'}}>
				Virtual Assistance
			</Button>
			{/*<Button color="inherit" component={Link} to="/trivia-game" style={{border: '1px solid #000'}}>*/}
			{/*	Trivia Game*/}
			{/*</Button>*/}

		</Toolbar>
	  </AppBar>
	);
  };
  
  
  export default Navbar;