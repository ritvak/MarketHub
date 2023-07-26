import React from 'react';
import LOGO from '../assets/logo.svg';
import './loader.css';

const Loader = () => (
  <div className="loader">
    <img src={LOGO} alt="logo" />
  </div>
);

export default Loader;
