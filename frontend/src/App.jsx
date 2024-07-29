import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Login } from "./pages/Login";
import { CreateEmployee } from "./pages/CreateEmployee";
import { EmployeeEdit } from "./pages/EmployeeEdit";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { ViewEmployee } from "./pages/ViewEmployee";
import { Signup } from "./pages/Signup";

function App() {
  return (
    <>
      <BrowserRouter>
        <RecoilRoot>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/createEmployee" element={<CreateEmployee />} />
            <Route path="/viewEmployee" element={<ViewEmployee />} />
            <Route path="/editEmployee/:id" element={<EmployeeEdit />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </RecoilRoot>
      </BrowserRouter>
    </>
  );
}

export default App;
