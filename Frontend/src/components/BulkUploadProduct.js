import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const BulkUploadProduct = ({ userID, bulkUploadModalSetting, handlePageUpdate }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
  
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    const downloadTemplate = () => {
      const wb = XLSX.utils.book_new();
      
      // Define the table with a formula for 'Quantity' column
      const ws = XLSX.utils.aoa_to_sheet([
        ['Product Name', 'Manufacturer', 'Stock', 'Batch', 'ExpDate', 'Description', 'Quantity','Size','Price','SupplierId','SupplierName','Category'],
        ['', '', '', '', '', '', '','','','','',''], // First row with placeholders
      ]);
      
      // Set the formula for the 'Quantity' column (starting from row 2)
      ws['G2'] = { f: 'C2*D2' };  // Formula to multiply Stock and Batch
      
      // Append the sheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Products');
      
      // Write the file
      XLSX.writeFile(wb, 'product-template.xlsx');
    };
    
  
    const handleUpload = async () => {
      if (!file) {
        setError('Please select a file to upload');
        return;
      }
  
      setError('');
  
      const formData = new FormData();
      formData.append('file', file);
  
      // Accessing userID directly because it's destructured
      if (!userID) {
        setError('User ID is not available');
        return;
      }
  
      formData.append('userID', userID);
    
  
      try {
        const response = await fetch('https://inventory-app-using-mern-stack-13.onrender.com/api/product/bulk-upload', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
  
        if (data.success) {
          handlePageUpdate(); // Refresh the products list
          bulkUploadModalSetting(); // Close the modal
          alert('Products uploaded successfully');
        } else {
          setError('There was an error uploading the file.');
        }
      } catch (error) {
        setError('Error uploading file: ' + error.message);
      }
    };
  
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 className="text-xl font-semibold">Bulk Upload Products</h3>
          <div className="mt-4">
            <button onClick={downloadTemplate} className="bg-green-500 text-white py-2 px-4 rounded-md mb-4 w-full">
              Download Excel Template
            </button>
            <input type="file" onChange={handleFileChange} className="border p-2 rounded-md mb-4 w-full" />
            <div className="flex justify-between">
              <button onClick={bulkUploadModalSetting} className="bg-gray-500 text-white py-2 px-4 rounded-md">
                Close
              </button>
              <button onClick={handleUpload} className="bg-blue-500 text-white py-2 px-4 rounded-md">
                Upload
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      </div>
    );
  };
  
  export default BulkUploadProduct;