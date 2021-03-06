import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users }) => (
  <div className="chat-textContainer">
    {
      users
        ? (
          <div>
            <h1>Usuário online:</h1>
            <div className="chat-activeContainer">
              <h2>
                {users.map(({name}) => (
                  <div key={name} className="chat-activeItem">
                    {name}
                    <img alt="Online Icon" src={onlineIcon}/>
                  </div>
                ))}
              </h2>
            </div>
          </div>
        )
        : null
    }
  </div>
);

export default TextContainer;