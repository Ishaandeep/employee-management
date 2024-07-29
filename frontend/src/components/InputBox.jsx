import showPwdImg from "../assets/show-password.svg";
import hidePwdImg from "../assets/hide-password.svg";
import { useRecoilState } from "recoil";
import { pwdVisibilityState } from "../store/pwdVisibilityState";
export function InputBox({ label, placeholder, onChange, type, value }) {
  const [isRevealedPwd, setIsRevealedPwd] = useRecoilState(pwdVisibilityState);
  return (
    <div className="relative flex items-center">
      <div className="text-sm font-medium text-left py-2 w-full">{label}</div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-2 py-1 border rounded border-slate-200 ${
          placeholder === "password" ? "pr-10" : ""
        }`}
      />
      {placeholder === "password" && (
        <img
          className="absolute right-3 cursor-pointer w-5"
          title={isRevealedPwd ? "Hide password" : "Show password"}
          src={isRevealedPwd ? hidePwdImg : showPwdImg}
          onClick={() => setIsRevealedPwd((prevState) => !prevState)}
          alt="Toggle Password Visibility"
        />
      )}
    </div>
  );
}
