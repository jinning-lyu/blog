import "./settings.css";
import { useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../context/Context";

export default function Settings() {
  const { user, dispatch } = useContext(Context);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [msg, setMsg] = useState("");
  const [old, setOld] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_START" });
    try {
      const res = await axios.put("/api/users/" + user._id, {
        userID: user._id,
        username,
        email,
      });
      setMsg("Profile has been updated.");
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "UPDATE_FAILURE" });
      setMsg(err.response.data);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      await axios.delete(`/api/users/${user._id}`, {
        data: { userID: user._id },
      });
      dispatch({ type: "LOGOUT" });
    } catch (err) {}
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (confirmPwd === pwd) {
      var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,14}$/;
      if (!re.test(pwd)) {
        setError("Invalid password.");
      } else {
        try {
          await axios.put("/api/users/" + user._id, {
            userID: user._id,
            password: old,
            newPwd: pwd,
          });
          dispatch({ type: "LOGOUT" });
        } catch (err) {
          setError(err.response.data);
        }
      }
    } else {
      setError("Passwords do not match.");
    }
  };

  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Profile</span>
          <span className="settingsDeleteTitle" onClick={handleDelete}>
            Delete Account
          </span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            maxLength="14"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="settingsSubmit" type="submit">
            Update
          </button>
          {<span className="updateMessage">{msg}</span>}
        </form>

        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Change Password</span>
        </div>
        <form className="settingsForm" onSubmit={changePassword}>
          <label>Old Password</label>
          <input type="password" onChange={(e) => setOld(e.target.value)} />
          <label>New Password</label>
          <input
            type="password"
            maxLength="14"
            onChange={(e) => setPwd(e.target.value)}
          />
          <label>Confirm New Password</label>
          <input
            type="password"
            maxLength="14"
            onChange={(e) => setConfirmPwd(e.target.value)}
          />
          <button className="settingsSubmit" type="submit">
            Change Password
          </button>
          {<span className="updateMessage">{error}</span>}
        </form>
      </div>
    </div>
  );
}
