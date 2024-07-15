import { Header } from "../components/Header";
import { HeaderDash } from "../components/HeaderDash";
import { Logo } from "../components/Logo";
import { useRecoilValue } from "recoil";
import { authState } from "../store/authState";
import { EmployeeForm } from "../components/EmployeeForm";
import { EmployeeEditForm } from "../components/EmployeeEditForm";

export function EmployeeEdit() {
  const user = useRecoilValue(authState);
  return (
    <>
      <Logo />
      <HeaderDash adminName={user.username} />
      <Header label="Edit Employee Details" />
      <EmployeeEditForm />
    </>
  );
}
