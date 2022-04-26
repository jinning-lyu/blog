import { useContext } from "react";
import "./topbar.css";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";

export default function TopBar() {
  const { user, dispatch } = useContext(Context);
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };
  return (
    <div className="top">
      <div className="topLeft"></div>
      <div className="topCenter">
        <ul className="navigation">
          <li className="navigationItem">
            <Link to="/">HOME</Link>
          </li>
          <li className="navigationItem">
            <Link to="/all">POSTS</Link>
          </li>
          <li className="navigationItem">
            <Link to="/write">WRITE</Link>
          </li>
          <li className="navigationItem" onClick={handleLogout}>
            {user && "LOGOUT"}
          </li>
        </ul>
      </div>
      <div className="topRight">
        <ul className="navigation">
          <li className="navigationItem">
            {user ? (
              <Link to="/settings">SETTING</Link>
            ) : (
              <div className="loginRegister">
                <Link to="/login">LOGIN</Link>
                <p>/</p>
                <Link to="/register">REGISTER</Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
