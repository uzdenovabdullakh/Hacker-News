import React, { useEffect, useRef, useState } from "react";
import { api } from "../utils/axios/axios";
import PropTypes from "prop-types";
import Loader from "./Loader";

const AnswerForComment = React.lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(import("./AnswerForComment"));
      }, 2000);
    })
);

function Comment(props) {
  const { id } = props;

  const [isAnswers, setIsAnswers] = useState(false); //есть ли ответы
  const [isAnswersOpen, setIsAnswersOpen] = useState(false); //нажата ли кнопка показать ответы
  const [answersCount, setAnswersCount] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [isComment, setIsComment] = useState(true);

  const textRef = useRef(null);
  const dateRef = useRef(null);
  const nicknameRef = useRef(null);

  const formateDate = (date) => {
    const milliseconds = date * 1000;
    const dateObject = new Date(milliseconds);
    const humanDateFormat = dateObject.toLocaleString();
    return humanDateFormat;
  };

  const getAnswersCount = async () => {
    try {
      const res = await api.get(`/item/${id}.json?print=pretty`);
      const data = res.data.kids;
      if (res.data.dead || res.data.deleted) {
        setIsAnswers(false);
      } else if (data) {
        setIsAnswers(true);
        setAnswersCount(data.length);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const setComment = async () => {
    try {
      const res = await api.get(`/item/${id}.json?print=pretty`);
      const data = res.data;

      if (!data.deleted && !data.dead) {
        textRef.current.innerHTML = data.text;
        nicknameRef.current.innerHTML = `by ${data.by}`;
        dateRef.current.innerHTML = formateDate(data.time);
      } else {
        setIsComment(false);
        textRef.current.innerHTML = "";
        nicknameRef.current.innerHTML = "";
        dateRef.current.innerHTML = "";
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setComment();
    getAnswersCount();
  }, []);

  const handleOpenAnswers = async (e) => {
    e.preventDefault();
    setIsAnswersOpen(true);
    setIsAnswers(false);
    try {
      const res = await api.get(`/item/${id}.json?print=pretty`);
      const data = await res.data;
      const obj = [];

      data.kids.forEach((el, index) => {
        obj.push(<AnswerForComment key={index} id={el} />);
      });
      setAnswers([...obj]);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCloseAnswers = (e) => {
    e.preventDefault();
    setIsAnswersOpen(false);
    setIsAnswers(true);
  };

  return (
    <React.Fragment>
      {isComment ? (
        <React.Fragment>
          <ul className="comment">
            <li className="comment-info">
              <p ref={nicknameRef}></p>
              <p ref={dateRef}></p>
            </li>
            <li className="comment-text" ref={textRef}></li>
          </ul>
          <div className="comment-tree">
            <React.Suspense fallback={<Loader />}>
              {isAnswersOpen ? (
                <React.Fragment>
                  {answers}
                  <button type="button" onClick={handleCloseAnswers}>
                    Close answers
                  </button>
                </React.Fragment>
              ) : null}
            </React.Suspense>
            {isAnswers ? (
              <button type="button" onClick={handleOpenAnswers}>
                {answersCount} answers
              </button>
            ) : null}
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
}

Comment.propTypes = {
  id: PropTypes.number,
};

export default Comment;
