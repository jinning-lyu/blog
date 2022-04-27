import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useContext, useState } from "react";
import { Context } from "../../context/Context";
import axios from "axios";

export default function Login() {
  let history = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const { dispatch, isFetching } = useContext(Context);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/api/auth/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      setError(false);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err) {
      setError(true);
      setMsg(err.response.data);
      dispatch({ type: "LOGIN_FAILURE" });
    }
  };
  return (
    <div className="login">
      <form className="loginForm" onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="text" ref={emailRef} />
        <label>Password</label>
        <input type="password" ref={passwordRef} />
        <button className="loginButton" type="submit" disabled={isFetching}>
          Login
        </button>
        <button className="loginRegisterButton">
          <Link to="/register">Register</Link>
        </button>
        <span className="msg">{error && msg}</span>
      </form>
    </div>
  );
}
