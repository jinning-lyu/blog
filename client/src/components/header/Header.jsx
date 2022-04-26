import React from "react";
import "./header.css";
export default function Header() {
  return (
    <div className="header">
      <div className="headerTitles">
        <span className="headerTitleS">React & Node</span>
        <span className="headerTitleL">Blog</span>
      </div>
      <img
        className="headerImg"
        src="https://images.pexels.com/photos/1612355/pexels-photo-1612355.jpeg?cs=srgb&dl=pexels-eberhard-grossgasteiger-1612355.jpg&fm=jpg"
        alt=""
      ></img>
    </div>
  );
}
