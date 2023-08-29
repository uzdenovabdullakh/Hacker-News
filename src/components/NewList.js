import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import useFormateDate from "../utils/useFormateDate";

function NewsList(props) {
  const { id, title, rating, nickname, date } = props;

  const [dateVal, setDateVal]=useState(null);
  const navigate = useNavigate()

  const humanDateFormat = useFormateDate(date)

  useEffect(()=>{
    setDateVal(humanDateFormat)
  }, [humanDateFormat])

  const handleClick = () => {
    navigate(`/news/${id}`, { state: { id: id } })
  }

  return (
    <div className="news-item-container">
      <h3 className="news-item__title" onClick={handleClick}>{title}</h3>
      <ul className="news-item-info">
        <li className="news-item-info__elem">{rating} points</li>
        <li className="news-item-info__elem">by {nickname}</li>
        <li className="news-item-info__elem">{dateVal}</li>
      </ul>
    </div>
  );
}

NewsList.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  rating: PropTypes.number,
  nickname: PropTypes.string,
  date: PropTypes.number,
};

export default NewsList;


