import React, { useEffect, useRef, useState } from "react";
import { api } from "../utils/axios/axios";
import PropTypes from "prop-types";
import Comment from "./Comment";
import Loader from "./Loader";
import image from "../assets/icons-update.png";

function CommentsContainer(props) {
  const { id } = props;

  const [comments, setComments] = useState([]);
  const [loading, setIsLoading] = useState(true);

  const commentsCountRef = useRef(null);

  const getComments = async () => {
    try {
      const commentId = await api.get(`/item/${id}.json?print=pretty`);

      if (!commentId.data.kids) {
        setComments(["No comments"]);
        setIsLoading(false);
      } else {
        const obj = [];

        commentId.data.kids.forEach((el, index) => {
          obj.push(<Comment key={index} id={el} />);
        });
        setComments([...obj]);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getCommentsCount = async () => {
    try {
      const res = await api.get(`/item/${id}.json?print=pretty`);
      commentsCountRef.current.innerHTML = `${res.data.descendants} comments`;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getComments();
    getCommentsCount();
  }, []);

  const handleUpdateClick = () => {
    setIsLoading(true);
    getComments();
    getCommentsCount();
  };

  return (
    <div className="comments-wrapper">
      <div className="comments-header">
        <div className="comments__count" ref={commentsCountRef}></div>
        <img
          src={image}
          alt="update"
          className="update-comments-btn"
          type="button"
          onClick={handleUpdateClick}
        />
      </div>
      <div className="comments-container">
        {loading ? <Loader /> : comments}
        {/* <React.Suspense fallback={<Loader />}>{comments}</React.Suspense> */}
      </div>
    </div>
  );
}

CommentsContainer.propTypes = {
  id: PropTypes.number,
};

export default CommentsContainer;
