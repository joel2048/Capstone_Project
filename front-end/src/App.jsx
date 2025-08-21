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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
    <Router>
        <NavBar/>
        <div>
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/CardSwipe/:collectionId" element={
            <ProtectedRoute>
            <CardSwipe />
            </ProtectedRoute>
            } />
          
          <Route path="/Collections" element={
            <ProtectedRoute>
            <Collections />
            </ProtectedRoute>
            }/>
          
          <Route path="/Dictionary" element={
            <ProtectedRoute>
            <Dictionary />
            </ProtectedRoute>
            } />

          <Route path="/Profile" element={
            <ProtectedRoute>
            <Profile />
            </ProtectedRoute>
            } />
            
        </Routes>
        </div>
     </Router>
    </>
  )
}

export default App