const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require("uuid");
const path = require("path");
const router = require("express").Router();
const Post = require("../models/Post");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "us-east-2",
});

const s3 = new aws.S3({ apiVersion: "2006-03-01" });

const deletePhoto = (url) => {
  const key = url.split("/").at(-1);
  s3.deleteObject(
    { Key: key, Bucket: process.env.S3_BUCKET_NAME },
    function (err, data) {
      if (err) {
        console.log(err, err.stack);
      }
    }
  );
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `${uuid.v4()}${path.extname(file.originalname)}`);
    },
  }),
});

//Create post
router.post("/", upload.single("file"), async (req, res) => {
  const newPost = new Post({ ...req.body, photo: req.file.location });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update post
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.body.userID === post.userID) {
      try {
        // delete old photo
        const newPost = req.body;
        if (post.photo && req.body.deleteOldFile) {
          deletePhoto(post.photo);
          newPost.photo = null;
        }
        if (req.file) {
          newPost.photo = req.file.location;
        }
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: newPost,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only update your post.");
    }
  } catch (err) {
    res.status(404).json("Post not found.");
  }
});

//Delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.body.userID === post.userID) {
      try {
        if (post.photo) {
          deletePhoto(post.photo);
        }
        await post.delete();
        res.status(200).json("Post has been deleted.");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can only delete your post.");
    }
  } catch (err) {
    res.status(404).json("Post not found.");
  }
});

//Get post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all posts
router.get("/", async (req, res) => {
  const userID = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (userID) {
      posts = await Post.find({ userID });
    } else if (catName) {
      posts = await Post.find({ categories: { $in: [catName] } });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
