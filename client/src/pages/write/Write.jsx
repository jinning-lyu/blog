import "./write.css";
import { useState, useContext, useEffect, useMemo } from "react";
import axios from "axios";
import { Context } from "../../context/Context";

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { user } = useContext(Context);
  const [cat, setCat] = useState([]);
  const [selectedCat, selectCat] = useState([]);

  const handleSelect = (e) => {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);
    selectCat(value);
  };

  useEffect(() => {
    const getCats = async () => {
      const res = await axios.get("/api/categories");
      setCat(res.data);
    };
    getCats();
  }, []);

  const imgObject = useMemo(() => {
    return file ? URL.createObjectURL(file) : undefined;
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("username", user.username);
    data.append("userID", user._id);
    data.append("title", title);
    data.append("desc", desc);
    data.append("categories", selectedCat);

    if (file) {
      data.append("file", file);

      // try {
      //   await axios.post("/api/upload", data);
      // } catch (err) {}
    }

    try {
      const res = await axios.post("/api/posts", data);
      window.location.replace("/post/" + res.data._id);
    } catch (err) {}
  };

  return (
    <div className="write">
      {file && <img src={imgObject} alt="" className="writeImg"></img>}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fa-solid fa-file-circle-plus"></i>
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          ></input>
          <input
            type="text"
            placeholder="Title"
            className="writeTitle"
            autoFocus={true}
            maxLength="70"
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="writeSubmit" type="submit">
            Publish
          </button>
        </div>
        <div>
          <select multiple size="1" onChange={handleSelect}>
            {cat.map((c) => (
              <option value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="writeFormGroup">
          <textarea
            type="text"
            placeholder="Tell your story..."
            className="writeInput writeText"
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
      </form>
    </div>
  );
}
