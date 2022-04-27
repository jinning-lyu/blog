import { useLocation } from "react-router";
import { useEffect, useState, useContext } from "react";
import "./singlepost.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";

export default function Single() {
  const PF = "http://localhost:3001/img/";
  const location = useLocation();
  const path = location.pathname.split("/").at(-1);
  const [post, setPost] = useState({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [update, setUpdate] = useState(false);
  const [file, setFile] = useState(null);

  const { user } = useContext(Context);

  const handleUpdate = async () => {
    if (file && typeof file !== "string") {
      if (post.photo) {
        axios.delete("/api/delete", { data: { filename: post.photo } });
      }
      const data = new FormData();
      const filename = Date.now() + "-" + file.name;
      data.append("name", filename);
      data.append("file", file);
      post.photo = filename;
      try {
        await axios.post("/api/upload", data);
      } catch (err) {}
    } else if (!file) {
      if (post.photo) {
        axios.delete("/api/delete", { data: { filename: post.photo } });
        post.photo = null;
      }
    }
    try {
      await axios.put(`/api/posts/${post._id}`, {
        userID: user._id,
        username: user.username,
        title,
        desc,
        photo: post.photo,
      });
      setUpdate(false);
    } catch (err) {}
  };

  const handleDelete = async () => {
    try {
      if (post.photo) {
        axios.delete("/api/delete", { data: { filename: post.photo } });
      }
      await axios.delete(`/api/posts/${post._id}`, {
        data: { userID: user._id },
      });
      window.location.replace("/");
    } catch (err) {}
  };

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get("/api/posts/" + path);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
      setFile(res.data.photo);
    };
    getPost();
  }, [path]);

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {file && (
          <div className="container">
            <label htmlFor={update ? "fileInput" : undefined}>
              <img
                src={
                  typeof file === "string"
                    ? PF + file
                    : URL.createObjectURL(file)
                }
                alt=""
                className="singlePostImg"
              />
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            {update && (
              <i
                className="deleteImgIcon fa-solid fa-trash-can"
                onClick={() => setFile(null)}
              />
            )}
          </div>
        )}
        {update ? (
          <div className="singlePostTitle">
            {!file && (
              <div>
                <label htmlFor="fileInput">
                  <i className="writeIcon fa-solid fa-file-circle-plus"></i>
                </label>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            )}
            <input
              type="text"
              value={title}
              maxLength="70"
              className="singlePostTitleInput"
              autoFocus={true}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="singlePostButton" onClick={handleUpdate}>
              Update
            </button>
          </div>
        ) : (
          <h1 className="singlePostTitle">
            <p className="singlePostTitleInput">{title}</p>
            {post.userID === user?._id && (
              <div className="singlePostEdit">
                <i
                  className="singlePostIcon fa-solid fa-pen-to-square"
                  onClick={() => setUpdate(true)}
                />
                <i
                  className="singlePostIcon fa-solid fa-trash-can"
                  onClick={handleDelete}
                />
              </div>
            )}
          </h1>
        )}

        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <Link to={`/all?user=${post.userID}`}>
              <b>{post.username}</b>
            </Link>
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {update ? (
          <textarea
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="writeInput writeText"
          />
        ) : (
          <p className="singlePostDesc">{desc}</p>
        )}
      </div>
    </div>
  );
}
