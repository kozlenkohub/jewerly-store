import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Add from './pages/Add';
import AddNewProduct from './pages/Add/AddNewProduct';
import AddNewCategory from './pages/Add/AddNewCategory';

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
              <Route path="/add-new-product" element={<AddNewProduct />} />
              <Route path="/add-new-category" element={<AddNewCategory />} />
            </Routes>
          </div>
        </div>
      </>
    </div>
  );
};

export default App;
