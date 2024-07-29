import { Header } from "../components/Header";
import { HeaderDash } from "../components/HeaderDash";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useRecoilState, useRecoilValue } from "recoil";
import { authState } from "../store/authState";
import { useEffect, useState } from "react";
import { url } from "../store/Store";
import axios from "axios";
import { Loader } from "../components/Loader";

export function Dashboard() {
  const [user, setUser] = useRecoilState(authState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function verifyUser() {
      setLoading(true);
      if (!user.token) {
        try {
          const response = await axios.get(`${url}/api/v1/admin/verify`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setUser({
            token: localStorage.getItem("token"),
            username: response.data.username,
          });
          setLoading(false);
        } catch (err) {
          console.log(err);
          alert("Login Again");
          setLoading(false);
          navigate("/login");
        }
      }
      setLoading(false);
    }
    verifyUser();
  }, [user]);

  const handleCreateEmployeeClick = () => {
    navigate("/createEmployee");
  };

  const handleViewEmployeeClick = () => {
    navigate("/ViewEmployee");
  };
  return (
    <>
      {loading && <Loader />}
      <Logo />
      <Header label="Dashboard" />
      <HeaderDash adminName={user.username} />
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold">Welcome Admin</h2>
        <div className="mt-4 space-x-4">
          <button
            onClick={handleCreateEmployeeClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Employee
          </button>
          <button
            onClick={handleViewEmployeeClick}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            View Employee
          </button>
        </div>
      </div>
    </>
  );
}
