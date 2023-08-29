import React, { useEffect, useRef, useState } from "react";
import { api } from "../utils/axios/axios";
import PropTypes from "prop-types";
import Loader from "./Loader";

const Comment = React.lazy(() => new Promise(resolve =>{
  setTimeout(()=>{
    resolve(import("./Comment"))
  }, 3000)
}));

function CommentsContainer(props) {
  const { id } = props;

  const [comments, setComments] = useState([]);

  const commentsCountRef = useRef(null);

  const getComments = async () => {
    try {
      const commentId = await api.get(`/item/${id}.json?print=pretty`);

      if (!commentId.data.kids) {
        setComments(["No comments"]);
      } else {
        const obj = [];
        commentId.data.kids.forEach(async (el) => {
          try {
            const res = await api.get(`/item/${el}.json?print=pretty`);
            const data = res.data;
            obj.push(data);

            const commentsArr = obj.map((el, index) => {
              if (!el.deleted && !el.dead) {
                return (
                  <Comment
                    key={index}
                    id={el.id}
                    text={el.text}
                    nickname={el.by}
                    date={el.time}
                  />
                );
              } else {
                return (
                  <Comment
                    key={index}
                    id={el.id}
                    text={"deleted"}
                    nickname={el.by}
                    date={el.time}
                  />
                );
              }
            });
            setComments([...commentsArr]);
          } catch (err) {
            console.error(err);
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const getCommentsCount = async () => {
      try {
        const res = await api.get(`/item/${id}.json?print=pretty`);
        commentsCountRef.current.innerHTML = `${res.data.descendants} comments`;
      } catch (e) {
        console.log(e);
      }
    };

    getComments();
    getCommentsCount();
  }, []);

  const handleUpdateClick = () => {
    getComments();
  };

  return (
    <div className="comments-wrapper">
      <div className="comments-header">
        <div className="comments__count" ref={commentsCountRef}></div>
        <img
          src={process.env.PUBLIC_URL + "/icons-update.png"}
          alt="update"
          className="update-comments-btn"
          type="button"
          onClick={handleUpdateClick}
        />
      </div>
      <div className="comments-container">
        <React.Suspense fallback={<Loader />}>{comments}</React.Suspense>
      </div>
    </div>
  );
}

CommentsContainer.propTypes = {
  id: PropTypes.number,
};

export default CommentsContainer;
