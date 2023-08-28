import React, { useState, useEffect } from "react";
import classes from "./Forums.module.scss";
import { getFirestore } from "firebase/firestore";
import { app } from "../GoogleSignIn/Firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import PostModal from "../../components/PostModal/PostModal";

const Popup = ({ isVisible, onClose, message }) => {
  if (!isVisible) return null;

  return (
    <div className={classes.popupOverlay}>
      <div className={classes.popupContainer}>
        <div className={classes.popup}>
          <p>{message}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const Forums = () => {
  const [warning, setWarning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  
  const [reportPopupVisible, setReportPopupVisible] = useState(false);
  const [reportedMessage, setReportedMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setWarning(false);
    }, 3000);
  }, []);

  useEffect(() => {
    setFilteredPosts(
      posts?.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchInput?.toLowerCase());
      })
    );
  }, [searchInput]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const db = getFirestore(app);
    const q = query(collection(db, "posts"));

    const querySnapshot = await getDocs(q);
    let res = [];
    querySnapshot.forEach((doc) => {
      res.push(doc.data());
    });
    setPosts(res);
    setFilteredPosts(res);
    setLoading(false);
  };

  const [postModal, setPostModal] = useState(false);

  const handleReportClick = (message) => {
    setReportedMessage(message);
    setReportPopupVisible(true);
  };

  return (
    <div className={classes.container}>
      {warning && (
        <div className={classes.overlay}>
          <div className={classes.warning}>
            <h1>Warning</h1>
            Please make sure you adhere to privacy regulations and do not share
            any sensitive data. Feel free to report! Keep your posts true to our
            policy and rules.
          </div>
        </div>
      )}

      <Popup
        isVisible={reportPopupVisible}
        onClose={() => setReportPopupVisible(false)}
        message="This message is reported, we will look into it shortly. Thank you for being a responsible user."
      />

      <div className={classes.header}>
        <input
          type="text"
          placeholder="Search posts"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={() => setPostModal(true)}>Add Post</button>
      </div>
      <div className={classes.postList}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          filteredPosts.map((post, i) => (
            <section key={i} className={classes.card}>
              <div className={classes.tags}>
                {post.tags.map((ele, i) => (
                  <div key={i}>{ele}</div>
                ))}
              </div>
              <div className={classes.content}>
                <h1>{post.title}</h1>
                <p>{post.desc}</p>
              </div>
              <footer className={classes.footer}>
                <div className={classes.buttons}>
                  <div onClick={() => handleReportClick(post.title)}>Report</div>
                  <div>Connect</div>
                </div>
              </footer>
            </section>
          ))
        )}
      </div>
      <PostModal
        postModal={postModal}
        setPostModal={() => setPostModal(false)}
      />
    </div>
  );
};

export default Forums;
