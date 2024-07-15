import { useState } from "react";
import { EmployeeList } from "../components/EmployeeList";
import { Header } from "../components/Header";
import { HeaderDash } from "../components/HeaderDash";
import data from "../../src/assets/data.json";
import { Logo } from "../components/Logo";
import { useRecoilValue } from "recoil";
import { authState } from "../store/authState";

export function ViewEmployee() {
  const [employeeList, setEmployeeList] = useState(data);
  const user = useRecoilValue(authState);
  return (
    <>
      <Logo />
      <HeaderDash adminName={user.username} />
      <Header label="Employee List" />
      <EmployeeList employees={employeeList} />
    </>
  );
}
