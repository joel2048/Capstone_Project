import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 

import Home from './pages/Home'
import NavBar from './components/NavBar';
import CardSwipe from './pages/CardSwipe';
import Collections from './pages/Collections';
import Dictionary from './pages/Dictionary';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Statistics from './pages/Statistics';

function App() {
  return (
    <Router>
    <div className="min-h-screen w-full bg-stone-700">
      <main className="p-4">
        <NavBar/>
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

              <Route path="/Statistics" element={<Statistics />} />
                
            </Routes>
       
      </main>
    </div>
    </Router>
  )
}

export default App