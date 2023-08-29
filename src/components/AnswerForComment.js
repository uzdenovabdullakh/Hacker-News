import React, {useEffect, useRef} from "react";
import PropTypes from "prop-types";

function AnswerForComment(props) {
  const { text, date, nickname } = props;

  const textRef = useRef(null);

  useEffect(() => {
    textRef.current.innerHTML = text;
  }, [text]);

  return (
    <ul className="answers">
      <li className="comment-info">
        <p>by {nickname}</p>
        <p>{date}</p>
      </li>
      <li className="comment-text"ref={textRef}></li>
    </ul>
  );
}

AnswerForComment.propTypes = {
  id: PropTypes.number,
  text: PropTypes.string,
  date: PropTypes.string,
  nickname: PropTypes.string,
};

export default AnswerForComment;
