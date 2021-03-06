import "./post.css";
import { Link } from "react-router-dom";

export default function Post({ post }) {
  return (
    <Link to={`/post/${post._id}`}>
      <div className="post">
        {post.photo && <img className="postImg" src={post.photo} alt=""></img>}

        <div className="postInfo">
          <div className="postCats">
            {post.categories.map((c) => (
              <span className="postCat">{c.name}</span>
            ))}
          </div>
          <span className="postTitle">{post.title}</span>

          <hr />
          <span className="postDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        <p className="postDesc">{post.desc}</p>
      </div>
    </Link>
  );
}
