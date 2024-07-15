import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function HeaderDash({ adminName }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <header className=" left-0 w-full bg-white z-10 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="text-gray-800 hover:text-blue-500">
            Home
          </Link>
          {/* <span className="text-gray-600">Employee List</span> */}
        </div>
        <div className="flex space-x-4">
          <span className="text-gray-600">{adminName}</span>
          <Link
            to="/"
            className="text-gray-800 hover:text-blue-500"
            onClick={handleLogout}
          >
            Logout
          </Link>
        </div>
      </div>
    </header>
  );
}
