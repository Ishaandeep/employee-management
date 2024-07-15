import { useRecoilValue } from "recoil";
import { EmployeeForm } from "../components/EmployeeForm";
import { Header } from "../components/Header";
import { HeaderDash } from "../components/HeaderDash";
import { Logo } from "../components/Logo";
import { authState } from "../store/authState";
export function CreateEmployee() {
  const user = useRecoilValue(authState);
  return (
    <>
      <Logo />
      <HeaderDash adminName={user.username} />
      <Header label="Create Employee" />
      <EmployeeForm />
    </>
  );
}
