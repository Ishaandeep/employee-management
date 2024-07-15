import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Logo } from "../components/Logo";
import "./Home.css";
export function Home() {
  const navigate = useNavigate();
  const LoginHandle = () => {
    navigate("/login");
  };
  const SignupHandle = () => {
    navigate("/signup");
  };
  const text = "Employee   Manager";
  return (
    <>
      <Logo />
      <Header label="Home" />
      <div className="floating-text">
        {text.split("").map((char, index) => (
          <span key={index}>{char === " " ? "\u00A0" : char}</span>
        ))}
      </div>
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={LoginHandle}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
        <button
          onClick={SignupHandle}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold ml-4 py-2 px-4 rounded"
        >
          Signup
        </button>
      </div>
    </>
  );
}
