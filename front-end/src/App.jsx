import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 

import Home from './pages/Home'
import NavBar from './components/NavBar';
import CardSwipe from './pages/CardSwipe';
import Collections from './pages/Collections';
import Dictionary from './pages/Dictionary';
import Profile from './pages/Profile';

function App() {
  return (
    <>
    <Router>
        <NavBar/>
        <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/CardSwipe/:collectionId" element={<CardSwipe />} />
          <Route path="/Collections" element={<Collections />}/>
          <Route path="/Dictionary" element={<Dictionary />} />
          <Route path="/Profile" element={<Profile />} />

        </Routes>
        </div>
     </Router>
    </>
  )
}

export default App