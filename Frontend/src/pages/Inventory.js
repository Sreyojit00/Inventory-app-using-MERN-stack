import React, { useState, useEffect, useContext } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import AuthContext from "../AuthContext";
import BulkUploadProduct from "../components/BulkUploadProduct";
import moment from "moment";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchProductsData();
    fetchSalesData();
  }, [updatePage]);


  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true); // Show the delete modal
  };

  const handleDeleteReasonChange = (e) => {
    setDeleteReason(e.target.value);
  };

  const handleDeleteSubmit = () => {
    if (deleteReason.trim()) {
      // Send the deletion data to the backend
      fetch(`http://localhost:4000/api/product/delete/${productToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: deleteReason, productName: productToDelete.name, deletionTime: new Date() })
      })
        .then(response => response.json())
        .then(data => {
          setShowDeleteModal(false); // Close the delete modal
          setDeleteReason(''); // Reset the reason input
          setUpdatePage(!updatePage); // Update the page (fetch fresh data)
        })
        .catch(err => console.error("Error deleting product:", err));
    } else {
      alert("Please enter a reason for deletion.");
    }
  };

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  };

  const bulkUploadModalSetting = () => {
    setShowBulkUploadModal(!showBulkUploadModal);
  };

  const fetchSalesData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };

  const updateProductModalSetting = (selectedProductData) => {
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };


  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const handleSearchTerm = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  
    if (term.trim() === "") {
      fetchProductsData(); // Fetch all products if the search box is cleared
    } else {
      fetchSearchData(term); // Fetch matching products
    }
  };
  
  const fetchSearchData = async (term) => {
    try {
      const response = await fetch(`http://localhost:4000/api/product/search?searchTerm=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setAllProducts(data); // Update the products in the UI
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Error during fetchSearchData:", error);
    }
  };
  
  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        <div className="bg-white rounded-lg p-6 shadow-xl">
  <span className="font-semibold text-xl text-gray-800 mb-6">Overall Inventory</span>
  <div className="flex flex-col md:flex-row justify-between gap-6">
    {/* Total Products Box */}
    <div className="flex flex-col p-8 w-full md:w-3/12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
      <span className="font-semibold text-blue-700 text-lg">Total Products</span>
      <span className="font-bold text-2xl text-gray-800">{products.length}</span>
      <span className="font-thin text-gray-600 text-sm mt-2">Last 7 days</span>
    </div>

    {/* Stores Box */}
    <div className="flex flex-col gap-4 p-8 w-full md:w-3/12 bg-gradient-to-r from-green-100 to-green-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
      <span className="font-semibold text-green-700 text-lg">Stores</span>
      <div className="flex justify-between gap-8">
        <div className="flex flex-col">
          <span className="font-bold text-xl text-gray-800">{stores.length}</span>
          <span className="font-thin text-gray-600 text-sm">Last 7 days</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl text-gray-800">₹2000</span>
          <span className="font-thin text-gray-600 text-sm">Revenue</span>
        </div>
      </div>
    </div>

    {/* Top Selling Box */}
    <div className="flex flex-col gap-4 p-8 w-full md:w-3/12 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
      <span className="font-semibold text-indigo-700 text-lg">Top Selling</span>
      <div className="flex justify-between gap-8">
        <div className="flex flex-col">
          <span className="font-bold text-xl text-gray-800">5</span>
          <span className="font-thin text-gray-600 text-sm">Last 7 days</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl text-gray-800">₹1500</span>
          <span className="font-thin text-gray-600 text-sm">Cost</span>
        </div>
      </div>
    </div>

    {/* Low Stocks Box */}
    <div className="flex flex-col gap-4 p-8 w-full md:w-3/12 bg-gradient-to-r from-red-100 to-red-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
      <span className="font-semibold text-red-700 text-lg">Low Stocks</span>
      <div className="flex justify-between gap-8">
        <div className="flex flex-col">
          <span className="font-bold text-xl text-gray-800">12</span>
          <span className="font-thin text-gray-600 text-sm">Ordered</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl text-gray-800">2</span>
          <span className="font-thin text-gray-600 text-sm">Not in Stock</span>
        </div>
      </div>
    </div>
  </div>
</div>


        {/* Modals */}
        {showProductModal && (
          <AddProduct
            addProductModalSetting={addProductModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}

        {showBulkUploadModal && (
          <BulkUploadProduct
            bulkUploadModalSetting={bulkUploadModalSetting}
            handlePageUpdate={handlePageUpdate}
            userID={authContext.user}
          />
        )}

        {showUpdateModal && (
          <UpdateProduct
            updateProductData={updateProduct}
            updateModalSetting={updateProductModalSetting}
          />
        )}

        {showDeleteModal && (
          <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal-content bg-white rounded-lg p-6 w-1/3 shadow-xl relative">


              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Enter Deletion Reason for <span className="text-red-500">{productToDelete?.name}</span>
              </h3>

              <textarea
                value={deleteReason}
                onChange={handleDeleteReasonChange}
                placeholder="Enter reason for deletion"
                className="reason-input w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />

              <div className="flex justify-between">
                {/* Close Button */}
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="close-btn w-full bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Close
                </button>

                {/* Delete Button */}
                <button
                  onClick={handleDeleteSubmit}
                  className="delete-btn w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ml-2"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>

        )}


        {/* Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 shadow-md">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold text-gray-700">Products</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md border-gray-300">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-xs transition duration-300"
                onClick={addProductModalSetting}
              >
                Add Product
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md text-xs transition duration-300"
                onClick={bulkUploadModalSetting}
              >
                Bulk Upload
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-center font-medium text-gray-900">ProductId</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Products</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Manufacturer</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Stock</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Batch</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Quantity</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Expiry Date</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Product Size</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Product Price</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">SupplierId</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">SupplierName</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200">
              {products.map((product, index) => (
                <tr key={product.productID} className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                  <td className="px-4 py-3 text-center text-gray-700">{product._id}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{product.name}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{product.manufacturer}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{product.stock}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{product.batch}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{product.quantity}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{moment(product.ExpDate).format("DD/MM/YYYY")}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{product.size}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{product.price}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{product.supplierId}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{product.supplierName}</td>
                  <td className="px-4 py-3 text-center text-gray-600 flex justify-center gap-2">
                    <button
                      className="bg-blue-600 text-white py-1 px-2 rounded-md text-xs transition duration-300 hover:bg-blue-700"
                      onClick={() => updateProductModalSetting(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white py-1 px-2 rounded-md text-xs transition duration-300 hover:bg-red-700"
                      onClick={() => handleDeleteClick(product)}
                    >
                      Delete
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

export default Inventory;
