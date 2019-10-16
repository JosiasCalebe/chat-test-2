import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Join.css';

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <div className="chat-joinOuterContainer">
            <div className="chat-joinInnerContainer">
                <h1 className="chat-heading">Login</h1>
                <div><input placeholder="Nome" className="chat-joinInput" type="text" onChange={(event) => setName(event.target.value)}/></div>
                <div><input placeholder="Sala" className="chat-joinInput chat-mt-20" type="text" onChange={(event) => setRoom(event.target.value)}/></div>
                <Link onClick={event => (!name || !room)?event.preventDefault():null} to={`/chat?name=${name}&room=${room}`}>
                    <button className="chat-button chat-mt-20" type="submit">Entrar</button>
                </Link>
            </div>
        </div>
    )
};

export default Join;