import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Logo } from "../components/Logo";
import axios from "axios";
import { useRecoilState } from "recoil";
import { authState } from "../store/authState";
import { url } from "../store/Store";
import { Loader } from "../components/Loader";
import { pwdVisibilityState } from "../store/pwdVisibilityState";

export function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useRecoilState(authState);
  const [isRevealedPwd, setIsRevealedPwd] = useRecoilState(pwdVisibilityState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      {loading && <Loader />}
      <Logo />
      <Header label="Login" />
      <div className="bg-slate-200 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <div>
              <InputBox
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                placeholder="username"
                label={"UserName "}
              />
              <InputBox
                placeholder="password"
                label={"Password "}
                type={isRevealedPwd ? "text" : "password"}
                value={password}
                img={true}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="pt-4">
              <Button
                onClick={async () => {
                  setLoading(true);
                  console.log({ username, password });
                  try {
                    const response = await axios.post(
                      `${url}/api/v1/admin/login`,
                      {
                        username: username,
                        password: password,
                      },
                      {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    setUser({ token: response.data.token, username: username });

                    localStorage.removeItem("token");
                    localStorage.setItem("token", response.data.token);
                    navigate("/dashboard");
                  } catch (err) {
                    alert(err.response.data.msg);
                  } finally {
                    setLoading(false);
                  }
                  // console.log(response);
                }}
                label={"Login"}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
