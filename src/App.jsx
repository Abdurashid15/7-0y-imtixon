import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Countries from './pages/Countries';
import CountryDetails from './pages/CountryDetails';
import ThemeSwitcher from './components/ThemeSwitcher';

function App() {
  return (
    <div className=''>
    <ThemeSwitcher></ThemeSwitcher>
      <Routes>
        <Route path="/" element={<Countries />} />
        <Route path="/country/:slug" element={<CountryDetails />} />
      </Routes>
      </div>
  );
}

export default App;
