import React from 'react';
import {Link } from "react-router-dom";

function HomePage() {
    return (
        <div>
            
            <div>
        <Link to="/signin">
          <button>Sign in with Email</button>
        </Link>

        <Link to="/signup">
          <button>Sign up</button>
        </Link>
      </div>
        </div>
    );
}

export default HomePage;