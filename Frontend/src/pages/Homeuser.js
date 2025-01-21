import React from 'react';
import { Link, useNavigate } from "react-router-dom";

const Homeuser = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}
      <section className="bg-gray-800 text-white py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold">Welcome to Your Medicine Store</h1>
          <p className="mt-4 text-xl">Browse and purchase your essential medicines with ease.</p>
          <div className="mt-8">
            <Link
              to="/medicine-list"
              className="inline-block px-8 py-3 bg-indigo-700 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-800"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Medicines Section */}
      <section className="py-16 px-6 bg-gray-100" id="medicines">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-gray-800">Explore Our Medicines</h2>
          <p className="mt-4 text-xl text-gray-600">Browse a wide variety of medicines and order online for quick delivery.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mt-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-indigo-600">Pain Relief</h3>
              <p className="mt-4 text-gray-600">Browse our range of pain relief medications for quick relief.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-indigo-600">Cough & Cold</h3>
              <p className="mt-4 text-gray-600">Find medicines to help you feel better when you're under the weather.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-indigo-600">Vitamins & Supplements</h3>
              <p className="mt-4 text-gray-600">Browse a variety of vitamins and supplements to support your health.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-6 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-gray-800">How It Works</h2>
          <p className="mt-4 text-xl text-gray-600">Simply browse, select, and order your medicines online.</p>
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-center gap-8">
              <div className="bg-indigo-100 p-6 rounded-xl shadow-md w-full sm:w-1/3">
                <h3 className="text-2xl font-semibold text-indigo-600">1. Browse Medicines</h3>
                <p className="mt-4 text-gray-600">Explore a wide range of medicines in various categories like pain relief, cold and flu, etc.</p>
              </div>
              <div className="bg-indigo-100 p-6 rounded-xl shadow-md w-full sm:w-1/3">
                <h3 className="text-2xl font-semibold text-indigo-600">2. Add to Cart</h3>
                <p className="mt-4 text-gray-600">Select your desired products and add them to your shopping cart.</p>
              </div>
              <div className="bg-indigo-100 p-6 rounded-xl shadow-md w-full sm:w-1/3">
                <h3 className="text-2xl font-semibold text-indigo-600">3. Secure Checkout</h3>
                <p className="mt-4 text-gray-600">Complete your order using our secure and easy-to-use checkout process.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-indigo-50" id="testimonials">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-gray-800">What Our Customers Say</h2>
          <p className="mt-4 text-xl text-gray-600">See how our customers are benefiting from the convenience of shopping with us.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-8 mt-8">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full sm:w-1/3">
              <p className="text-lg text-gray-600">"I love how easy it is to find the medicine I need. The process is smooth, and the delivery is always quick!"</p>
              <h4 className="mt-4 font-semibold text-indigo-600">Sarah Miller</h4>
              <p className="text-gray-500">Happy Customer</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg w-full sm:w-1/3">
              <p className="text-lg text-gray-600">"A great experience! I ordered my cough medicine, and it arrived the next day. Definitely my go-to place now."</p>
              <h4 className="mt-4 font-semibold text-indigo-600">John Doe</h4>
              <p className="text-gray-500">Regular Customer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-6 bg-gray-800 text-white text-center">
        <h2 className="text-3xl font-semibold">Ready to Order Your Medicines?</h2>
        <p className="mt-4 text-lg">Start browsing and order your medicines with ease, delivered to your doorstep.</p>
        <div className="mt-8">
          <Link
            to="/medicine-list"
            className="inline-block px-8 py-3 bg-indigo-700 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-800"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Homeuser;
