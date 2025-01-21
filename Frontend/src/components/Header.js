import { useContext } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useShoppingCartStore } from "../components/useShoppingCartStore"; // Adjust path
import AuthContext from "../AuthContext";

// Define the navigation items
const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Medicine List", href: "/medicine-list" },
  { name: "Contact Us", href: "/contact" },
];

const userNavigation = [{ name: "Sign out", href: "./login" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


export default function Header() {
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const location = useLocation(); // Get the current route path

  // Get cart count from Zustand with default value 0
  const cartCount = useShoppingCartStore((state) => state.cart?.length || 0);

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-2 justify-start ml-0">
                  <img
                    className="h-10 w-10"
                    src={require("../assets/new_logo.png")}
                    alt="Inventory Management"
                  />
                  <Link to={"/"}>
                    <span className="font-bold text-white italic">
                      Inventory Management
                    </span>
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        location.pathname === item.href
                          ? "bg-gray-600 text-white" // Highlight the active link
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "px-3 py-2 rounded-md text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Notification, Cart, and User Menu */}
                <div className="hidden md:flex items-center space-x-4">
                  {/* Notification Icon */}
                  <button className="text-gray-400 hover:text-white">
                    <BellIcon className="h-6 w-6" />
                  </button>

                  {/* Cart Icon with Badge */}
                  <Link to="/cart" className="relative text-gray-400 hover:text-white">
                    <FaShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                    {cartCount === 0 && (
                      <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        0
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={localStorageData?.imageUrl}
                        alt="User profile"
                      />
                    </Menu.Button>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                to={item.href}
                                className={classNames(
                                  active ? "bg-gray-200" : "",
                                  "block px-4 py-2 text-sm text-gray-600"
                                )}
                                onClick={() => authContext.signout()}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden">
                  <Disclosure.Button className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white">
                    {open ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      location.pathname === item.href
                        ? "bg-gray-900 text-white" // Highlight the active link
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-700 px-5 py-4">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={localStorageData?.imageUrl}
                    alt="User profile"
                  />
                  <div className="ml-3 text-white">
                    <div className="text-base font-medium">
                      {localStorageData?.firstName} {localStorageData?.lastName}
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                      {localStorageData?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {userNavigation.map((item) => (
                    <button
                      key={item.name}
                      className="block w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => authContext.signout()}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
