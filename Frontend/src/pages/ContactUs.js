import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with your API request)
    setTimeout(() => {
      setResponseMessage("Your message has been sent successfully!");
      setIsSubmitting(false);
      
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen bg-white">
      {/* Left side Image */}
      <div className="flex justify-center items-center">
        <img
          src={require("../assets/background.jpg")}
          alt="Contact Us"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Right side Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-white  rounded-lg">
        <h2 className="text-4xl font-bold text-gray-900">Contact Us</h2>
        <p className="text-lg text-gray-600 mt-2">We’d love to hear from you!</p>

        <form className="mt-8 space-y-6 w-full" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-4 py-3 mt-3 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Message Input */}
            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                className="block w-full px-4 py-3 mt-3 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 text-white font-semibold rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-600 hover:bg-blue-500 ${isSubmitting ? "cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>

        {/* Response Message */}
        {responseMessage && (
          <div className="mt-4 p-4 bg-green-100 text-green-600 rounded-md text-center">
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactUs;
