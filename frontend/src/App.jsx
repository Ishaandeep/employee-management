import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Login } from "./pages/Login";
import { CreateEmployee } from "./pages/CreateEmployee";
import { EmployeeEdit } from "./pages/EmployeeEdit";
// import { EmployeeList } from "./pages/EmployeeList";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { ViewEmployee } from "./pages/ViewEmployee";
import { Signup } from "./pages/Signup";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      {/* <h1 className="text-3xl font-bold underline">Hello world!</h1> */}
      <BrowserRouter>
        <RecoilRoot>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/createEmployee" element={<CreateEmployee />} />
            <Route path="/viewEmployee" element={<ViewEmployee />} />
            <Route path="/editEmployee/:id" element={<EmployeeEdit />} />
            {/* <Route path="/employeeList" element={<EmployeeList />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </RecoilRoot>
      </BrowserRouter>
    </>
  );
}

export default App;
