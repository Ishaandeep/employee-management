import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authState } from "../store/authState";
import { useNavigate, useParams } from "react-router-dom";
import { url } from "../store/Store";

export function EmployeeEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useRecoilValue(authState);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    designation: "hr",
    gender: "m",
    course: [],
    image: null,
  });
  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/admin/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const employeeData = response.data.employee;
        console.log(employeeData.course);
        setFormData({
          name: employeeData.name || "",
          email: employeeData.email || "",
          mobileNo: employeeData.mobileNo || "",
          designation: employeeData.designation || "hr",
          gender: employeeData.gender.toLowerCase() || "m",
          course: Array.isArray(employeeData.course)
            ? employeeData.course.map((course) => course.toLowerCase())
            : [],
          image: employeeData.image || null,
        });
        // console.log({ formData: formData });
      } catch (err) {
        console.log("Error in fectching ", err);
      }
    };
    fetchEmp();
  }, [id]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "course") {
        setFormData((prevData) => {
          const updatedCourses = checked
            ? [...prevData.course, value]
            : prevData.course.filter((course) => course !== value);
          return { ...prevData, course: updatedCourses };
        });
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: checked,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        form.append(key, formData[key].join(","));
      } else {
        form.append(key, formData[key]);
      }
    }

    try {
      let response;
      if (id) {
        response = await axios.put(`${url}/api/v1/admin/edit/${id}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        response = await axios.post(`${url}/api/v1/admin/create`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      console.log("Response:", response.data);
      navigate("/ViewEmployee");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded"
    >
      {/* Form Fields (unchanged) */}
      <div className="mb-4">
        <div className="flex items-center">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2 w-28"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-80 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="mb-4">
        <div className="flex items-center">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2 w-28"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-80 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
      </div>
      {/* Mobile */}
      <div className="mb-4">
        <div className="flex items-center">
          <label
            htmlFor="mobileNo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Mobile No.
          </label>
          <input
            type="tel"
            id="mobileNo"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-80 ml-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
      </div>

      {/* Designation (Dropdown) */}
      <div className="mb-4">
        <div className="flex items-center">
          <label
            htmlFor="designation"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Designation
          </label>
          <select
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-80 ml-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="hr">HR</option>
            <option value="manager">Manager</option>
            <option value="sale">Sales</option>
          </select>
        </div>
      </div>

      {/* Gender (Radio Buttons) */}
      <div className="mb-4">
        <div className="flex items-center">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Gender
          </label>
          <div className="ml-10 flex items-center">
            <input
              type="radio"
              id="male"
              name="gender"
              value="m"
              checked={formData.gender === "m"}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="male" className="text-gray-700">
              Male
            </label>
            <input
              type="radio"
              id="female"
              name="gender"
              value="f"
              checked={formData.gender === "f"}
              onChange={handleChange}
              className="ml-4 mr-2"
            />
            <label htmlFor="female" className="text-gray-700">
              Female
            </label>
          </div>
        </div>
      </div>

      {/* Course (Checkboxes) */}
      <div className="mb-4">
        <div className="flex items-center">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Course
          </label>
          <div className="ml-10 flex items-center">
            <input
              type="checkbox"
              id="mca"
              name="course"
              value="mca"
              checked={formData.course.includes("mca")}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="mca" className="text-gray-700 mr-2">
              MCA
            </label>
            <input
              type="checkbox"
              id="bca"
              name="course"
              value="bca"
              checked={formData.course.includes("bca")}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="bca" className="text-gray-700 mr-2">
              BCA
            </label>
            <input
              type="checkbox"
              id="bsc"
              name="course"
              value="bsc"
              checked={formData.course.includes("bsc")}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="bsc" className="text-gray-700">
              BSC
            </label>
          </div>
        </div>
      </div>

      {/* <div className="mb-4">
        <div className="flex items-center">
          <label
            htmlFor="image"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
            className="shadow appearance-none border rounded w-80 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div> */}

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </form>
  );
}
