import React, { useRef, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import './GameOver.css';

const GameOver = () => {
    const location = useLocation();
    const { score } = location.state || {};

    return <div className='container'>
        <p className='game-over'>GAME OVER</p>
        <span className='your-score'>Your score is: {score}</span>
        <div className='buttons'>
            <Nav.Link className='try-again-button' as={Link} to="/">Try again</Nav.Link>
            <Nav.Link className='logout-button' as={Link} to="/logout">Logout</Nav.Link>
        </div>

    </div>
}

export default GameOver