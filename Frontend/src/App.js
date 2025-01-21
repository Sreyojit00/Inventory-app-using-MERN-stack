import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import PurchaseDetails from "./pages/PurchaseDetails";
import Sales from "./pages/Sales";
import Alert from "./pages/Alert";
import Order from "./components/Order";
import Layout from "./components/Layout";
import NoPageFound from "./pages/NoPageFound";
import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import { useEffect, useState } from "react";
import Header from "./components/Header";

import ContactUs from "./pages/ContactUs";
import MedicineList from "./pages/MedicineList";
import AboutUs from "./pages/AboutUs";
import HomeUser from "./pages/Homeuser";
import Homeuser from "./pages/Homeuser";
import CartPage from "./components/CartPage";
import { useShoppingCartStore } from "./components/useShoppingCartStore";

const App = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(true);
  let myLoginUser = JSON.parse(localStorage.getItem("user"));
  const { clearCart } = useShoppingCartStore();

  useEffect(() => {
    if (myLoginUser) {
      setUser(myLoginUser._id);
      setLoader(false);
    } else {
      setUser("");
      setLoader(false);
    }
  }, [myLoginUser]);

  const signin = (newUser, callback) => {
    setUser(newUser);
    callback();
  

  };

  const signout = () => {
    setUser(null);
    clearCart()
    localStorage.removeItem("user");
    
  };
  
  
  let value = { user, signin, signout };

  if (loader)
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>LOADING...</h1>
      </div>
    );

  return (
    
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Layout */}
          <Route
            path="/"
            element={
          
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchase-details" element={<PurchaseDetails />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/alert" element={<Alert />} />
            <Route path="/order" element={<Order />} />
            <Route path="/homeUser" element={<Homeuser />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/medicine-list" element={<MedicineList />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/cart" element={<CartPage />} />
            
          </Route>

          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
