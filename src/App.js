import React, { useEffect, useState } from "react";
import { api } from "./utils/axios/axios";
import Header from "./components/Header";
import NewsList from "./components/NewList";
import Loader from "./components/Loader";

function App() {
  const [news, setNews] = useState([]);
  const [click, setClick] = useState(10);
  const [loading, setIsLoading] = useState(true);

  const handleNews = React.useCallback(
    (newsArr) => {
      setNews([...newsArr]);
    },
    [setNews]
  );

  const handleLoading = React.useCallback(
    (value) => {
      setIsLoading(value);
    },
    [setIsLoading]
  );

  const getNews = async (arrSize) => {
    try {
      const response = await api.get(`/newstories.json?print=pretty`);
      const data = [...response.data.slice(0, arrSize)];
      const obj = [];

      data.forEach(async (el) => {
        try {
          const res = await api.get(`/item/${el}.json?print=pretty`);
          const data = res.data;
          obj.push(data);
          const news = obj.map((el, index) => {
            return (
              <NewsList
                key={index}
                id={el.id}
                title={el.title}
                rating={el.score}
                nickname={el.by}
                date={el.time}
              />
            );
          });
          setNews([...news]);
          setIsLoading(false);
        } catch (err) {
          console.log(err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getNews(100);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getNews(100);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMoreClick = () => {
    setIsLoading(true);
    getNews(click);
    setClick(click + 5);
  };

  const handleUpdateClick = () => {
    setIsLoading(true);
    getNews(100);
  };

  return (
    <div className="wrapper">
      <Header handleNews={handleNews} handleLoading={handleLoading} />
      <img
        src={process.env.PUBLIC_URL + "icons-update.png"}
        alt="update"
        className="update-btn"
        type="button"
        onClick={handleUpdateClick}
      />
      <div className="news-list-container">{loading ? <Loader /> : news}</div>
      <button className="more-btn" type="button" onClick={handleMoreClick}>
        More news...
      </button>
    </div>
  );
}

export default App;
