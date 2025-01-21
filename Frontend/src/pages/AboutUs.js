import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900">About Us</h2>
          <p className="mt-4 text-lg text-gray-600">
            We are a team of passionate professionals committed to delivering top-notch solutions and services.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mt-12 text-center">
          <h3 className="text-4xl font-semibold text-gray-800">Our Mission</h3>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our mission is to provide innovative and reliable solutions to our clients, ensuring their success through collaboration, creativity, and dedication.
          </p>
        </div>

        {/* Values Section */}
        <div className="mt-16">
          <h3 className="text-4xl font-semibold text-center text-gray-800">Our Values</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mt-8">
            {/* Integrity */}
            <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl text-center">
              <h4 className="text-2xl font-semibold text-indigo-600">Integrity</h4>
              <p className="mt-4 text-gray-600">
                We believe in honesty and transparency in all our dealings, ensuring trust and accountability.
              </p>
            </div>
            {/* Innovation */}
            <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl text-center">
              <h4 className="text-2xl font-semibold text-indigo-600">Innovation</h4>
              <p className="mt-4 text-gray-600">
                We embrace creativity and new ideas, striving to offer solutions that push boundaries and improve lives.
              </p>
            </div>
            {/* Excellence */}
            <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl text-center">
              <h4 className="text-2xl font-semibold text-indigo-600">Excellence</h4>
              <p className="mt-4 text-gray-600">
                We aim for excellence in everything we do, delivering high-quality results that exceed expectations.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-16 text-center">
          <h3 className="text-4xl font-semibold text-gray-800">Meet Our Team</h3>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our team is made up of talented and experienced individuals who are dedicated to achieving great things together.
          </p>

          {/* Team Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mt-8">
            {/* Team Member 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl text-center">
              <img src="https://via.placeholder.com/150" alt="Team Member" className="w-32 h-32 mx-auto rounded-full border-4 border-indigo-600" />
              <h4 className="mt-4 text-xl font-semibold text-gray-800">John Doe</h4>
              <p className="text-gray-600">CEO & Founder</p>
            </div>
            {/* Team Member 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl text-center">
              <img src="https://via.placeholder.com/150" alt="Team Member" className="w-32 h-32 mx-auto rounded-full border-4 border-indigo-600" />
              <h4 className="mt-4 text-xl font-semibold text-gray-800">Jane Smith</h4>
              <p className="text-gray-600">Lead Developer</p>
            </div>
            {/* Team Member 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl text-center">
              <img src="https://via.placeholder.com/150" alt="Team Member" className="w-32 h-32 mx-auto rounded-full border-4 border-indigo-600" />
              <h4 className="mt-4 text-xl font-semibold text-gray-800">Alice Johnson</h4>
              <p className="text-gray-600">Project Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
