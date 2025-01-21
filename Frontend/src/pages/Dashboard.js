import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import moment from "moment";




ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard(totalCost) {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [deleteLogs, setDeleteLogs] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);


  const [chart, setChart] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
    series: [
      {
        name: "series",
        data: [10, 20, 40, 50, 60, 20, 10, 35, 45, 70, 25, 70],
      },
    ],
  });

  // Fetch low stock and expiring products
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("https://inventory-app-using-mern-stack-13.onrender.com/api/product/alerts");
        const data = await response.json();
        if (response.ok) {
          setLowStockProducts(data.lowStock || []);
          setExpiringProducts(data.expiring || []);
        } else {
          alert(data.message || "Failed to fetch alert data.");
        }
      } catch (error) {
        alert("An error occurred: " + error.message);
      }
    };

    fetchAlerts();
  }, []);


  const doughnutData = {
    labels: lowStockProducts.map((product) => product.name),
    datasets: [
      {
        data: lowStockProducts.map((product) => product.stock),
        backgroundColor: ["rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };



  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchTotalSaleAmount();
    fetchTotalPurchaseAmount();
    fetchStoresData();
    fetchProductsData();
    fetchMonthlySalesData();
    fetchDeleteLogs();
  }, []);

  const fetchDeleteLogs = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/product/deleteLogs');
      const data = await response.json();
      setDeleteLogs(data);
      console.log(data);
    } catch (err) {
      console.error('Error fetching delete logs:', err);
    }
  };
  
  const fetchTotalSaleAmount = () => {
    fetch(
      `http://localhost:4000/api/sales/get/${authContext.user}/totalsaleamount`
    )
      .then((response) => response.json())
      .then((datas) => setSaleAmount(datas.totalSaleAmount));
  };

  const fetchTotalPurchaseAmount = () => {
    fetch(
      `http://localhost:4000/api/purchase/get/${authContext.user}/totalpurchaseamount`
    )
      .then((response) => response.json())
      .then((datas) => setPurchaseAmount(datas.totalPurchaseAmount));
  };

  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => setStores(datas));
  };

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => setProducts(datas))
      .catch((err) => console.log(err));
  };

  const fetchMonthlySalesData = () => {
    fetch(`http://localhost:4000/api/sales/getmonthly`)
      .then((response) => response.json())
      .then((datas) => updateChartData(datas.salesAmount))
      .catch((err) => console.log(err));
  };

  const updateChartData = (salesData) => {
    setChart({
      ...chart,
      series: [
        {
          name: "Monthly Sales Amount",
          data: [...salesData],
        },
      ],
    });
  };

  return (
    <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 md:grid-cols-3 lg:grid-cols-4 p-4">
      {/* Stats Section */}
      <article className="flex flex-col gap-6 rounded-lg border border-gray-300 bg-gradient-to-r from-green-100 to-green-300 p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="inline-flex gap-2 self-end rounded-full bg-green-200 p-2 text-green-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-sm font-semibold">67.81%</span>
        </div>
        <div>
          <strong className="block text-lg font-medium text-gray-600">Sales</strong>
          <p>
            <span className="text-3xl font-semibold text-gray-900">₹{saleAmount}</span>
            <span className="text-sm text-gray-500"> from ₹240.94</span>
          </p>
        </div>
      </article>

      <article className="flex flex-col gap-6 rounded-lg border border-gray-300 bg-gradient-to-r from-red-100 to-red-300 p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="inline-flex gap-2 self-end rounded-full bg-red-200 p-2 text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
          <span className="text-sm font-semibold">67.81%</span>
        </div>
        <div>
          <strong className="block text-lg font-medium text-gray-600">Purchase</strong>
          <p>
            <span className="text-3xl font-semibold text-gray-900">₹{purchaseAmount}</span>
            <span className="text-sm text-gray-500"> from ₹404.32</span>
          </p>
        </div>
      </article>

      <article className="flex flex-col gap-6 rounded-lg border border-gray-300 bg-gradient-to-r from-yellow-100 to-yellow-300 p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="inline-flex gap-2 self-end rounded-full bg-yellow-200 p-2 text-yellow-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
          <span className="text-sm font-semibold">67.81%</span>
        </div>
        <div>
          <strong className="block text-lg font-medium text-gray-600">Total Products</strong>
          <p>
            <span className="text-3xl font-semibold text-gray-900">{products.length}</span>
          </p>
        </div>
      </article>

      <article className="flex flex-col gap-6 rounded-lg border border-gray-300 bg-gradient-to-r from-blue-100 to-blue-300 p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="inline-flex gap-2 self-end rounded-full bg-blue-200 p-2 text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-sm font-semibold">67.81%</span>
        </div>
        <div>
          <strong className="block text-lg font-medium text-gray-600">Total Stores</strong>
          <p>
            <span className="text-3xl font-semibold text-gray-900">{stores.length}</span>
          </p>
        </div>
      </article>



      {/* Chart Section */}
      <div className="flex justify-around bg-white rounded-lg py-8 col-span-full justify-center">
        <div>
          <Chart options={chart.options} series={chart.series} type="bar" width="500" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Top 5 Low Stock Products</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>



      {/* Delete Logs Section */}
      <article className="col-span-full rounded-lg border border-gray-200 bg-white shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Delete Logs</h3>
        <div className="overflow-x-auto mt-4 max-h-64"> {/* Added scroll here */}
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-blue-200 text-gray-700">
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">Product Name</th>
                <th className="px-4 py-3 text-left font-medium">Reason</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {deleteLogs.map((log, index) => (
                <tr
                  key={index}
                  className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                >
                  <td className="px-4 py-3 text-gray-800">{log.productName}</td>
                  <td className="px-4 py-3 text-gray-600">{log.reason}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {moment(log.deletedAt).format("YYYY-MM-DD HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>




    </div>
  );
}

export default Dashboard;
