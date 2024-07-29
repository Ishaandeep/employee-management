import { Header } from "../components/Header";
import { HeaderDash } from "../components/HeaderDash";
import { Logo } from "../components/Logo";
import { useRecoilState, useRecoilValue } from "recoil";
import { authState } from "../store/authState";
import { EmployeeForm } from "../components/EmployeeForm";
import { EmployeeEditForm } from "../components/EmployeeEditForm";
import { Loader } from "../components/Loader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../store/Store";
import axios from "axios";

export function EmployeeEdit() {
  const [user, setUser] = useRecoilState(authState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function verifyUser() {
      setLoading(true);
      if (!user.token) {
        try {
          console.log("1");
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
  return (
    <>
      {loading && <Loader />}
      <Logo />
      <HeaderDash adminName={user.username} />
      <Header label="Edit Employee Details" />
      <EmployeeEditForm />
    </>
  );
}
