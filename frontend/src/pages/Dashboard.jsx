import { Header } from "../components/Header";
import { HeaderDash } from "../components/HeaderDash";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useRecoilValue } from "recoil";
import { authState } from "../store/authState";

export function Dashboard() {
  const user = useRecoilValue(authState);
  console.log(user);

  const navigate = useNavigate();

  const handleCreateEmployeeClick = () => {
    navigate("/createEmployee");
  };

  const handleViewEmployeeClick = () => {
    navigate("/ViewEmployee");
  };
  return (
    <>
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
