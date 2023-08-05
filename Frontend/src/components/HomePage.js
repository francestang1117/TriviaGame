import React from 'react';
import {Link, Routes } from "react-router-dom";

function HomePage() {
    return (
        <div>
            
            <div>
        <Link to="/signin">
          <button>Sign in</button>
        </Link>

        <Link to="/signup">
          <button>Sign up</button>
        </Link>
      </div>
        </div>
    );
}

export default HomePage;