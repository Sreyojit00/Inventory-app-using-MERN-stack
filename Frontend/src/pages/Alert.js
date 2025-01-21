import moment from "moment";
import React, { useState, useEffect } from "react";

const AlertPage = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockThreshold, setStockThreshold] = useState(""); // For stock products
  const [expiryThreshold, setExpiryThreshold] = useState(""); // For expiring products

  // Fetch low stock and expiring products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/product/alerts");
        const data = await response.json();
        if (response.ok) {
          setLowStockProducts(data.lowStock || []);
          setExpiringProducts(data.expiring || []);
        } else {
          alert(data.message || "Failed to fetch products.");
        }
      } catch (error) {
        alert("An error occurred: " + error.message);
      }
    };

    fetchProducts();
  }, []);

  // Handle form submission for setting threshold value
  const handleSetThreshold = async () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    const isExpiringProduct = selectedProduct.ExpDate;
    let thresholdValue;

    if (isExpiringProduct) {
      thresholdValue = expiryThreshold;

      // Validate expiryThreshold against product ExpDate
      const productExpiryDate = moment(selectedProduct.ExpDate);
      const selectedExpiryDate = moment(thresholdValue);

      if (selectedExpiryDate.isAfter(productExpiryDate)) {
        alert("Expiry Threshold cannot be later than the product's expiry date.");
        return;
      }

      thresholdValue = selectedExpiryDate.format("YYYY-MM-DD");

    } else {
      thresholdValue = stockThreshold;
    }

    if (!thresholdValue) {
      alert("Please enter a valid threshold value.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/product/setThreshold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct._id,
          thresholdType: isExpiringProduct ? "expiryThreshold" : "stockThreshold",
          threshold: isExpiringProduct ? thresholdValue : Number(thresholdValue),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Threshold value updated successfully!");
        setShowModal(false);

        // Update the product in the local state
        setLowStockProducts((prevProducts) =>
          prevProducts.map((prod) =>
            prod._id === selectedProduct._id
              ? { ...prod, stockThreshold: isExpiringProduct ? prod.stockThreshold : Number(thresholdValue) }
              : prod
          )
        );
        setExpiringProducts((prevProducts) =>
          prevProducts.map((prod) =>
            prod._id === selectedProduct._id
              ? { ...prod, expiryThreshold: isExpiringProduct ? thresholdValue : prod.expiryThreshold }
              : prod
          )
        );
      } else {
        alert(data.message || "Failed to set threshold value.");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center py-8">
      <div className="flex flex-col gap-10 w-11/12">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">
          Alert Section
        </h1>

        {/* Table for Low Stock Products */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center border-b pb-2">
            Top 5 Low Stock Products
          </h2>
          <table className="table-auto w-full bg-white shadow-lg rounded-lg overflow-hidden border">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Stock Threshold</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {lowStockProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } hover:bg-gray-200 transition-colors duration-300`}
                >
                  <td className="px-6 py-3">{product.name}</td>
                  <td className="px-6 py-3">{product.stock}</td>
                  <td className="px-6 py-3">{product.stockThreshold || "Not Set"}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setStockThreshold("");
                        setExpiryThreshold("");
                        setShowModal(true);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    >
                      Set Threshold
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table for Expiring Products */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center border-b pb-2">
            Top 5 Products Near Expiry
          </h2>
          <table className="table-auto w-full bg-white shadow-lg rounded-lg overflow-hidden border">
            <thead className="bg-green-100 text-green-800">
              <tr>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Expiry Date</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Expiry Threshold</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {expiringProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } hover:bg-gray-200 transition-colors duration-300`}
                >
                  <td className="px-6 py-3">{product.name}</td>
                  <td className="px-6 py-3">
                    {product.expiryThreshold
                      ? moment(product.expiryThreshold).format("DD/MM/YYYY")
                      : "Not Set"}
                  </td>

                  <td className="px-6 py-3">{product.stock}</td>
                  <td className="px-6 py-3">{product.expiryThreshold || "Not Set"}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setStockThreshold("");
                        setExpiryThreshold("");
                        setShowModal(true);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                    >
                      Set Threshold
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Threshold Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4 text-center">Set Threshold Value</h2>
              <p className="text-gray-700 mb-2">
                <strong>Product:</strong> {selectedProduct.name}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Stock:</strong> {selectedProduct.stock}
              </p>
              <div className="mb-4">
                {selectedProduct.ExpDate ? (
                  <>
                    <label className="block text-gray-700 mb-1">Expiry Date Threshold:</label>
                    <input
                      type="date"
                      value={expiryThreshold}
                      onChange={(e) => setExpiryThreshold(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </>
                ) : (
                  <>
                    <label className="block text-gray-700 mb-1">Stock Threshold:</label>
                    <input
                      type="number"
                      value={stockThreshold}
                      onChange={(e) => setStockThreshold(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter stock threshold value"
                    />
                  </>
                )}
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleSetThreshold}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertPage;
