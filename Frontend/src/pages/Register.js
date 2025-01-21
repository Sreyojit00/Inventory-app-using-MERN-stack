import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UploadImage from "../components/UploadImage";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    imageUrl: "",
    role: "general", // Default role
  });

  const navigate = useNavigate();

  // Handling Input change for registration form.
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Register User
  const registerUser = async () => {
    try {
      const response = await fetch("https://inventory-app-using-mern-stack-13.onrender.com/api/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      });
  
      if (!response.ok) {
        // Handle server errors
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register user.");
      }
  
      alert("Successfully Registered, Now Login with your details");
      navigate("/login");
    } catch (err) {
      console.error("Error:", err.message);
      alert(err.message || "Something went wrong while registering.");
    }
  };
  
  // Uploading image to cloudinary
  const uploadImage = async (image) => {
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "inventoryapp");
  
      const response = await fetch("https://api.cloudinary.com/v1_1/ddhayhptm/image/upload", {
        method: "POST",
        body: data,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
  
      const result = await response.json();
      setForm({ ...form, imageUrl: result.url });
      alert("Image Successfully Uploaded");
    } catch (error) {
      console.error("Error:", error.message);
      alert("An error occurred while uploading the image");
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen bg-white  items-center place-items-center">
        <div className="w-full max-w-md space-y-8  p-10 rounded-lg">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={require("../assets/new_logo.png")}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Register your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 -space-y-px rounded-md shadow-sm">
              <div className="flex gap-4">
                <input
                  name="firstName"
                  type="text"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleInputChange}
                />
                <input
                  name="lastName"
                  type="text"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  name="phoneNumber"
                  type="number"
                  autoComplete="phoneNumber"
                  required
                  className="relative block w-full rounded-b-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Phone Number"
                  value={form.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <UploadImage uploadImage={uploadImage} />

              {/* Role Field */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="admin"
                    name="role"
                    value="admin"
                    checked={form.role === "admin"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <label htmlFor="admin" className="ml-2 text-sm text-gray-900">
                    Admin
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="general"
                    name="role"
                    value="general"
                    checked={form.role === "general"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <label htmlFor="general" className="ml-2 text-sm text-gray-900">
                    General User
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked
                  required
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I Agree Terms & Conditions
                </label>
              </div>

              <div className="text-sm">
                <span
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={registerUser}
              >
                Sign up
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  Already Have an Account, Please
                  <Link to="/login"> Login now </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
        <div className="flex justify-center order-first w-auto h-auto sm:order-last">
          <img src={require("../assets/login.jpg")} alt="" />
        </div>
      </div>
    </>
  );
}

export default Register;
