import React, { useEffect, useRef } from "react";
import { api } from "../utils/axios/axios";
import PropTypes from "prop-types";

function AnswerForComment(props) {
  const { id } = props;

  const textRef = useRef(null);
  const dateRef = useRef(null);
  const nicknameRef = useRef(null);

  const formateDate = (date) => {
    const milliseconds = date * 1000;
    const dateObject = new Date(milliseconds);
    const humanDateFormat = dateObject.toLocaleString();
    return humanDateFormat;
  };

  const setAnswer = async () => {
    try {
      const res = await api.get(`/item/${id}.json?print=pretty`);
      const data = res.data;
      
      if (!data.dead && !data.deleted) {
        textRef.current.innerHTML = data.text;
        dateRef.current.innerHTML = formateDate(data.time);
        nicknameRef.current.innerHTML = `by ${data.by}`;
      } else {
        textRef.current.innerHTML = "deleted";
        dateRef.current.innerHTML = "";
        nicknameRef.current.innerHTML = "";
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    setAnswer();
  }, []);

  return (
    <ul className="answers">
      <li className="comment-info">
        <p ref={nicknameRef}></p>
        <p ref={dateRef}></p>
      </li>
      <li className="comment-text" ref={textRef}></li>
    </ul>
  );
}

AnswerForComment.propTypes = {
  id: PropTypes.number,
};

export default AnswerForComment;
