import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Add from './pages/Add';

const App = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <>
        <Navbar />
        <hr />
        <div className="flex w-full">
          <Sidebar />
          <div className="flex-1">
            <Routes>
              <Route path="/add" element={<Add />} />
            </Routes>
          </div>
        </div>
      </>
    </div>
  );
};

export default App;
