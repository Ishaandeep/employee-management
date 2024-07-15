import { Link } from "react-router-dom";
import logoGif from "../assets/logo2.gif";

export function Logo() {
  return (
    <>
      <Link to="/">
        <img src={logoGif} alt="Logo" className="w-12 h-12 mr-4" />
      </Link>
    </>
  );
}
