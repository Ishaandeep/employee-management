import { useEffect, useState } from "react";
import { EmployeeList } from "../components/EmployeeList";
import { Header } from "../components/Header";
import { HeaderDash } from "../components/HeaderDash";
import { Logo } from "../components/Logo";
import { useRecoilState, useRecoilValue } from "recoil";
import { authState } from "../store/authState";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader } from "../components/Loader";
import { url } from "../store/Store";

export function ViewEmployee() {
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
      <Header label="Employee List" />
      <EmployeeList />
    </>
  );
}
