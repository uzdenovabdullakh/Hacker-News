import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { api } from "../utils/axios/axios";

function NewsList(props) {
  const { id } = props;

  const [date, setDate] = useState(null);
  const [title, setTitle] = useState(null);
  const [rating, setRating] = useState(null);
  const [nickname, setNickname] = useState(null);

  const navigate = useNavigate();

  const formateDate = (date) => {
    const milliseconds = date * 1000;
    const dateObject = new Date(milliseconds);
    const humanDateFormat = dateObject.toLocaleString();
    return humanDateFormat;
  };

  const setNewsData = async () => {
    try {
      const res = await api.get(`/item/${id}.json?print=pretty`);
      const data = res.data;

      setDate(formateDate(data.time));
      setTitle(data.title);
      setNickname(data.by);
      setRating(data.score);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setNewsData();
  }, []);

  const handleClick = () => {
    navigate(`/news/${id}`, { state: { id: id } });
  };

  return (
    <div className="news-item-container">
      <h3 className="news-item__title" onClick={handleClick}>
        {title}
      </h3>
      <ul className="news-item-info">
        <li className="news-item-info__elem">{rating} points</li>
        <li className="news-item-info__elem">by {nickname}</li>
        <li className="news-item-info__elem">{date}</li>
      </ul>
    </div>
  );
}

NewsList.propTypes = {
  id: PropTypes.number,
};

export default NewsList;
