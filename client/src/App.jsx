import TopBar from "./components/topbar/TopBar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/homepage/Home";
import Single from "./pages/single/Single";
import Write from "./pages/write/Write";
import Settings from "./pages/settings/Settings";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import All from "./pages/all/All";
import { useContext } from "react";
import { Context } from "./context/Context";

function App() {
  const { user } = useContext(Context);
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="all" element={<All />} />
        <Route
          path="write"
          element={user ? <Write /> : <Navigate replace to="/login" />}
          //element={<Write />}
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="post/:postID" element={<Single />} />
        <Route
          path="settings"
          element={user ? <Settings /> : <Navigate replace to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
