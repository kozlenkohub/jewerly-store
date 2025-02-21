import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Add from './pages/Add';
import AddNewProduct from './pages/Add/AddNewProduct';
import AddNewCategory from './pages/Add/AddNewCategory';
import Edit from './pages/Edit';
import EditFilters from './pages/Edit/EditFilters';
import EditProducts from './pages/Edit/EditProducts';
import EditCategories from './pages/Edit/EditCategories';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <>
        <Navbar toggleSidebar={toggleSidebar} />
        <hr />
        <div className="flex w-full">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className="flex-1">
            <Routes>
              <Route path="/add" element={<Add />} />
              <Route path="/add-new-product" element={<AddNewProduct />} />
              <Route path="/add-new-category" element={<AddNewCategory />} />
              <Route path="/edit" element={<Edit />} />
              <Route path="/edit/filters" element={<EditFilters />} />
              <Route path="/edit/products" element={<EditProducts />} />
              <Route path="/edit/categories" element={<EditCategories />} />
            </Routes>
          </div>
        </div>
      </>
    </div>
  );
};

export default App;
