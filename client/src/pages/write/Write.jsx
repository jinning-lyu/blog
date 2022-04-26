import "./write.css";
import { useState, useContext, useEffect } from "react";
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
      const res = await axios.get("/categories");
      setCat(res.data);
    };
    getCats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      username: user.username,
      userID: user._id,
      title,
      desc,
      categories: selectedCat,
    };

    if (file) {
      const data = new FormData();
      const filename = Date.now() + "-" + file.name;
      data.append("name", filename);
      data.append("file", file);
      newPost.photo = filename;

      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }

    try {
      const res = await axios.post("/posts", newPost);
      window.location.replace("/post/" + res.data._id);
    } catch (err) {}
  };
  return (
    <div className="write">
      {file && (
        <img src={URL.createObjectURL(file)} alt="" className="writeImg"></img>
      )}

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
