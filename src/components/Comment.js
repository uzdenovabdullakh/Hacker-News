import React, { useEffect, useRef, useState } from "react";
import { api } from "../utils/axios/axios";
import PropTypes from "prop-types";
import AnswerForComment from "./AnswerForComment";
import Loader from "./Loader";

function Comment(props) {
  const { id, text, date, nickname } = props;

  const [isAnswers, setIsAnswers] = useState(false); //есть ли ответы
  const [isAnswersOpen, setIsAnswersOpen] = useState(false); //нажата ли кнопка показать ответы
  const [answersCount, setAnswersCount] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const textRef = useRef(null);
  const dateRef = useRef(null);

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
      if (data) {
        setIsAnswers(true);
        setAnswersCount(data.length);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    textRef.current.innerHTML = text;
    dateRef.current.innerHTML = formateDate(date);

    getAnswersCount();
  }, []);

  const handleOpenAnswers = async (e) => {
    e.preventDefault();
    setIsAnswersOpen(true);
    setIsAnswers(false);
    setIsLoading(true)
    try {
      const res = await api.get(`/item/${id}.json?print=pretty`);
      const data = await res.data;
      const obj = [];

      data.kids.forEach(async (el) => {
        try {
          const res = await api.get(`/item/${el}.json?print=pretty`);
          const data = res.data;
          obj.push(data);

          const commentsArr = obj.map((el, index) => {
            if (!el.dead) {
              return (
                <AnswerForComment
                  key={index}
                  id={el.id}
                  text={el.text}
                  date={formateDate(el.time)}
                  nickname={el.by}
                />
              );
            } else {
              return (
                <ul key={index} className="answers">
                  <li>{"deleted"}</li>
                </ul>
              );
            }
          });
          setAnswers([...commentsArr]);
          setIsLoading(false)
        } catch (err) {
          console.error(err);
        }
      });
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
      <ul className="comment">
        <li className="comment-info">
          <p>by {nickname}</p>
          <p ref={dateRef}></p>
        </li>
        <li className="comment-text" ref={textRef}></li>
      </ul>
      <div className="comment-tree">
        {loading ? (
          <Loader />
        ) : isAnswersOpen ? (
          <React.Fragment>
            {answers}
            <button type="button" onClick={handleCloseAnswers}>
              Close answers
            </button>
          </React.Fragment>
        ) : null}
        {isAnswers ? (
          <button type="button" onClick={handleOpenAnswers}>
            {answersCount} answers
          </button>
        ) : null}
      </div>
    </React.Fragment>
  );
}

Comment.propTypes = {
  id: PropTypes.number,
  text: PropTypes.string,
  date: PropTypes.number,
  nickname: PropTypes.string,
};

export default Comment;
