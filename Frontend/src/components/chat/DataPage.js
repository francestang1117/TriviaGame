import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const DataPage = () => {
    const navigate = useNavigate();

    const { gameId } = useParams();

    const body = {
        quiz_id: gameId
    }

    axios.post(`https://us-central1-csci-5410-s23-sdp1.cloudfunctions.net/store`, 
        {headers: { 'Content-Type': 'application/json' }},
            body

    ) 
    .then(response => {
    // Redirect to the "hello" page in your React app
        navigate(`/hello/${gameId}`);
    })
    .catch(error => {
        console.error('Error while fetching Cloud Function:', error);
    });
  
  
    return (
        <div>
            <h1>Leaderboard</h1>
            <iframe
                width="1200"
                height="900"
            src="https://lookerstudio.google.com/embed/reporting/9a0ed02b-89b0-46cc-9114-bc5d305b5e4b/page/P82YD"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
        ></iframe>
    </div>
  );
};

export default DataPage;