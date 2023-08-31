import React, { useEffect, useRef, useState } from "react";
import CommentsContainer from "./components/CommentsContainer";
import { Link, useLocation } from "react-router-dom";
import { api } from "./utils/axios/axios";
import "./scss/news.scss";
import Loader from "./components/Loader";

function News() {
  const location = useLocation();

  const { state } = location;
  const id = state?.id || Number(location.pathname.slice(6)); //взять id из state navigate или из url

  const titleRef = useRef(null);
  const nicknameRef = useRef(null);
  const dateRef = useRef(null);
  const urlRef = useRef(null);
  const scoreRef = useRef(null);

  const [loading, setIsLoading] = useState(true);

  const formateDate = (date) => {
    const milliseconds = date * 1000;
    const dateObject = new Date(milliseconds);
    const humanDateFormat = dateObject.toLocaleString();
    dateRef.current.innerHTML = humanDateFormat;
  };

  const getNewsData = async () => {
    try {
      const res = await api.get(`/item/${id}.json?print=pretty`);
      titleRef.current.innerHTML = res.data.title;
      nicknameRef.current.innerHTML = `by ${res.data.by}`;
      formateDate(res.data.time);
      urlRef.current.href = res.data.url;
      urlRef.current.innerHTML = "Ссылка на новость";
      scoreRef.current.innerHTML = `${res.data.score} points`;
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getNewsData();
  }, []);

  return (
    <div className="news-wrapper">
      <Link to="/" className="back-link">
        ← Назад
      </Link>
      {loading ? <Loader /> : null}
      <h1 className="news-title" ref={titleRef}>
        {" "}
      </h1>
      <ul className="news-info">
        <li className="news-info__elem" ref={scoreRef}></li>
        <li className="news-info__elem" ref={nicknameRef}></li>
        <li className="news-info__elem" ref={dateRef}></li>
      </ul>
      <Link to="" className="original-link" target="blank" ref={urlRef}></Link>
      <CommentsContainer id={id} />
    </div>
  );
}

export default News;
