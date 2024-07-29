import { useRecoilState } from "recoil";
import { EmployeeForm } from "../components/EmployeeForm";
import { Header } from "../components/Header";
import { HeaderDash } from "../components/HeaderDash";
import { Logo } from "../components/Logo";
import { authState } from "../store/authState";
import { Loader } from "../components/Loader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../store/Store";
export function CreateEmployee() {
  const [user, setUser] = useRecoilState(authState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function verifyUser() {
      setLoading(true);
      if (!user.token) {
        console.log("1");
        try {
          const response = await axios.get(`${url}/api/v1/admin/verify`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log(response);
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
  return (
    <>
      {loading && <Loader />}
      <Logo />
      <HeaderDash adminName={user.username} />
      <Header label="Create Employee" />
      <EmployeeForm />
    </>
  );
}
