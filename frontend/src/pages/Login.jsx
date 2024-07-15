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

export function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useRecoilState(authState);
  const navigate = useNavigate();
  return (
    <>
      <Logo />
      <Header label="Login" />
      <div className="bg-slate-200 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <InputBox
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              placeholder="xyz@gmail.com"
              label={"UserName "}
            />
            <InputBox
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="password"
              label={"Password "}
            />
            <div className="pt-4">
              <Button
                onClick={async () => {
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
                  }
                  // console.log(response);
                }}
                label={"Login"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
