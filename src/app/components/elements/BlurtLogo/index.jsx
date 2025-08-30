import React from 'react';

const BlurtLogo = () => {
    return (
        <span className="logo">
            <img alt="Logo" src={`${process.env.PUBLIC_URL}/images/logo.png`} width="150" height="40" />
        </span>
    );
};

export default BlurtLogo;
