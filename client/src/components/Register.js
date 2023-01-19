import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (password.length < 3) {
      alert("비밀번호가 안전하지 않습니다");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다")
      return;
    }

    const formData = { username, email, password };

    console.log(formData);

    fetch(`${process.env.REACT_APP_SERVER}/accounts/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then(data => {
      // 가입에 성공했을 때
      // 로그인 페이지로 이동
      navigate('/login');
    })
    .catch(error => {
      // 가입에 실패했을 때

      // 유저이름 또는 이메일을 가진 유저가 이미 가입되어있을 경우
      if (error.status === 400) {
        return alert("가입된 유저이름 또는 이메일입니다");
      }

      // 기타 에러
      alert("Something's broken");
    })
  }

  const disabled = !username.trim() || !email.trim() || !password.trim() || !passwordConfirm.trim();

  return (
    <form onSubmit={handleSubmit} className="max-w-xs mx-auto px-2">
      <div className="mb-4 flex h-24 items-end">
        <h1 className="text-2xl">회원가입</h1>
      </div>

      <div className="mb-2">
        <label htmlFor="">Username</label>
        <input
          type="text"
          className="border px-2 py-1 w-full"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="">Email</label>
        <input
          type="text"
          className="border px-2 py-1 w-full"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="">Password</label>
        <input
          type="password"
          className="border px-2 py-1 w-full"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="">Password confirm</label>
        <input
          type="password"
          className="border px-2 py-1 w-full"
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <button
          type="submit"
          className="border border-blue-500 text-blue-500 px-2 py-1 w-full disabled:opacity-[0.2]"
          disabled={disabled}
        >
          Submit
        </button>
      </div>
      <div>
        <Link to="/login" className="text-blue-500">Login</Link>
      </div>
    </form>
  )
}