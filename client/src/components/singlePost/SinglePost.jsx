import { useLocation } from "react-router";
import { useEffect, useState, useContext, useMemo } from "react";
import LoadingOverlay from "react-loading-overlay";
import axios from "axios";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import "./singlepost.css";

export default function Single() {
  const location = useLocation();
  const path = location.pathname.split("/").at(-1);
  const [post, setPost] = useState({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [update, setUpdate] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const { user } = useContext(Context);

  const handleUpdate = async () => {
    setIsLoading(true);
    setLoadingText("Updating...");
    const data = new FormData();
    data.append("userID", user._id);
    data.append("username", user.username);
    data.append("title", title);
    data.append("desc", desc);
    if (file) {
      if (typeof file !== "string") {
        // file updated
        data.append("deleteOldFile", true);
        data.append("file", file);
      }
    } else {
      // file deleted
      data.append("deleteOldFile", true);
    }
    try {
      await axios.put(`/api/posts/${post._id}`, data);
    } catch (err) {}
    setUpdate(false);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setLoadingText("Deleting...");
      await axios.delete(`/api/posts/${post._id}`, {
        data: { userID: user._id },
      });
      setIsLoading(false);
      window.location.replace("/all");
    } catch (err) {}
  };

  const imgSrc = useMemo(() => {
    if (file) {
      return typeof file === "string" ? file : URL.createObjectURL(file);
    }
    return null;
  }, [file]);

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
    <LoadingOverlay active={isLoading} spinner text={loadingText}>
      <div className="singlePost">
        <div className="singlePostWrapper">
          {imgSrc && (
            <div className="container">
              <label htmlFor={update ? "fileInput" : undefined}>
                <img src={imgSrc} alt="post image" className="singlePostImg" />
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
    </LoadingOverlay>
  );
}
