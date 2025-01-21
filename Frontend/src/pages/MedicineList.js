import React, { useState, useEffect, useContext } from "react";
import { useShoppingCartStore } from "../components/useShoppingCartStore"; // Ensure the zustand store is properly imported
import AuthContext from "../AuthContext";

function MedicineList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { addToCart } = useShoppingCartStore(); // Call hook directly in the component
  const authContext = useContext(AuthContext); // Get the auth context

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchProducts = () => {
    const categoryFilter = selectedCategory === "All" ? "" : `?category=${selectedCategory}`;
    fetch(`https://inventory-app-using-mern-stack-13.onrender.com/api/product/get${categoryFilter}`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  };

  const fetchCategories = () => {
    fetch(`https://inventory-app-using-mern-stack-13.onrender.com/api/product/categories`)
      .then((response) => response.json())
      .then((data) => setCategories(["All", ...data]))
      .catch((err) => console.error(err));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchTerm = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      fetchProducts();
    } else {
      fetchSearchData(term);
    }
  };

  const fetchSearchData = async (term) => {
    try {
      const response = await fetch(`https://inventory-app-using-mern-stack-13.onrender.com/api/product/search?searchTerm=${term}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Error during fetchSearchData:", error);
    }
  };

  // Function to handle adding a product to the cart with userId
  const handleAddToCart = (product) => {
    if (authContext.user) {
      console.log(authContext.user)
      addToCart(product, authContext.user); // Pass the product and userId to the store
    } else {
      alert("You need to be logged in to add products to the cart.");
    }
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-6 w-full lg:w-11/12">
        {/* Search and Category Section */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <span className="font-semibold text-2xl text-gray-800 mb-6">Medicine List</span>

          {/* Search Bar */}
          <div className="flex justify-center items-center px-4 py-2 border-2 rounded-lg border-gray-300 w-full lg:w-96 mx-auto mb-6 shadow-md">
            <img alt="search-icon" className="w-5 h-5 mr-2" src={require("../assets/search-icon.png")} />
            <input
              className="border-none outline-none focus:ring-2 focus:ring-blue-600 w-full text-sm"
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={handleSearchTerm}
            />
          </div>

          {/* Categories */}
          <div className="flex justify-between pt-5 pb-3">
            <div className="flex gap-4 items-center">
              <span className="font-bold text-gray-700">Categories:</span>
              <div className="flex gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`py-2 px-4 rounded-md text-sm transition duration-300 ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="overflow-x-auto rounded-lg bg-white border shadow-md">
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Product</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Manufacturer</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Quantity</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Size</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Price</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200">
              {products.map((product, index) => (
                <tr
                  key={product._id}
                  className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : ""}`}
                >
                  <td className="px-4 py-3 text-center text-gray-600">{product.name}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{product.manufacturer}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{product.quantity}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{product.size}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{product.price}/-</td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    <button
                      className="bg-green-600 text-white py-1 px-4 rounded-md text-xs transition duration-300 hover:bg-green-700"
                      onClick={() => handleAddToCart(product)} // Call handleAddToCart
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MedicineList;
