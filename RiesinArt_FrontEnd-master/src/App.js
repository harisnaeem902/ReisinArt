import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layouts from "./pages/Layouts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Details from "./pages/Details";
import AddProduct from "./pages/AddProduct";
import AllProducts from "./pages/AllProducts";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import PurchaseList from "./pages/PurchaseList";
import SoldItems from "./pages/SoldItems"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  // Load cart from localStorage when the app loads
  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (savedCartItems) {
      setCartItems(savedCartItems);
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find((item) => item._id === product._id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (product) => {
    if (product.quantity === 1) {
      const updatedItems = cartItems.filter((item) => item._id !== product._id);
      setCartItems(updatedItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    } else {
      const updatedItems = cartItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      setCartItems(updatedItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedItems)); 
    }
  };
  
  

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("x-auth-token");
      try {
        const response = await fetch("http://localhost:5000/api/products", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Error fetching products or invalid response structure");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layouts onAddToCart={handleAddToCart} cartItems={cartItems} />
            }
          />
          <Route path="/about" element={<About cartItems={cartItems} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact cartItems={cartItems} />} />
          <Route path="/details" element={<Details />} />
          <Route path="/seller/addproduct" element={<AddProduct />} />
          <Route path="/seller/allproduct" element={<AllProducts />} />
          <Route path="/seller/purchaseList" element={<PurchaseList />} />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                onAdd={handleAddToCart}
                onRemove={handleRemoveFromCart}
              />
            }
          />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/userList" element={<UserList />} />
          <Route path="/admin/solditems" element={<SoldItems />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
