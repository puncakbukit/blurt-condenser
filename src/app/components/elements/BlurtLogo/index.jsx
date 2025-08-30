import React from 'react';
import logo from '../../../assets/images/logo.png'; // relative to js file or use alias

<img src={logo} alt="Logo" />

const BlurtLogo = () => {
    return (
        <span className="logo">
            <img alt="Logo" src={logo} width="150" height="40" />
        </span>
    );
};

export default BlurtLogo;
