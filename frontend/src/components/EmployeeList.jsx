import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../store/authState";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../store/Store";

export function EmployeeList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const user = useRecoilValue(authState);
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const sortableHeaders = ["unique id", "name", "email", "create date"];

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/admin/bulk`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const processedEmployees = response.data.employees.map((employee) => ({
          ...employee,
          createDate: new Date(employee["createDate"])
            .toISOString()
            .split("T")[0],
        }));

        setEmployees(processedEmployees);
      } catch (err) {
        console.error("Error Fetching Employees:", err);
      }
    };
    fetchEmployee();
  }, []);

  const filteredEmployees = useMemo(() => {
    let filtered = employees.filter((employee) => {
      const nameMatch = employee.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const emailMatch = employee.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const activeMatch =
        activeFilter === "all" ||
        employee.active === (activeFilter === "active");
      return nameMatch || (emailMatch && activeMatch);
    });

    if (sortBy) {
      const sortHeader = sortBy.toLowerCase();

      filtered.sort((a, b) => {
        if (sortHeader === "create-date") {
          return sortOrder === "asc"
            ? a[sortHeader].localeCompare(b[sortHeader])
            : b[sortHeader].localeCompare(a[sortHeader]);
        } else if (sortHeader === "uniqueid") {
          return sortOrder === "asc"
            ? a[sortHeader].localeCompare(b[sortHeader], undefined, {
                numeric: true,
              })
            : b[sortHeader].localeCompare(a[sortHeader], undefined, {
                numeric: true,
              });
        } else {
          let aValue = a[sortHeader];
          let bValue = b[sortHeader];
          aValue = aValue !== undefined ? aValue.toString().toLowerCase() : "";
          bValue = bValue !== undefined ? bValue.toString().toLowerCase() : "";
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      });
    }

    return filtered;
  }, [employees, searchQuery, activeFilter, sortBy, sortOrder]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const headers = [
    "Unique ID",
    "Image",
    "Name",
    "Email",
    "Mobile No",
    "Designation",
    "Gender",
    "Course",
    "Create Date",
    "Action",
  ];

  const handleHeaderClick = (header) => {
    if (sortBy === header) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(header);
      setSortOrder("asc");
    }
  };
  const handleAddEmployeeClick = () => {
    navigate("/createEmployee");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/v1/admin/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const response = await axios.get(`${url}/api/v1/admin/bulk`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployees(response.data.employees);
    } catch (err) {
      console.error("Error deleting employee: ", err);
    }
  };

  return (
    <div className="mt-8 p-4">
      <h2 className="text-xl font-semibold mb-4">Employee List</h2>

      {/* Search and Filter */}
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          onClick={handleAddEmployeeClick}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Employee
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  sortableHeaders.includes(header.toLowerCase())
                    ? "cursor-pointer"
                    : ""
                }`} // Conditionally add cursor-pointer
                onClick={() =>
                  sortableHeaders.includes(header.toLowerCase())
                    ? handleHeaderClick(header)
                    : null
                } // Only handle clicks for sortable headers
              >
                {header}{" "}
                {sortBy === header && (
                  <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentItems.map((employee) => (
            <tr key={employee._id}>
              {Object.keys(employee).map((key) => (
                <td
                  key={key}
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                >
                  {key === "image" ? (
                    <img
                      src={employee[key]}
                      alt="Employee"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    employee[key]
                  )}
                </td>
              ))}

              {/* Action Column */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  to={`/editEmployee/${employee._id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </Link>
                {" | "}
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => handleDelete(employee._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
