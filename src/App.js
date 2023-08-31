import React, { useEffect, useState } from "react";
import { api } from "./utils/axios/axios";
import Header from "./components/Header";
import NewsList from "./components/NewList";
import Loader from "./components/Loader";

function App() {
  const [news, setNews] = useState([]);
  const [click, setClick] = useState(110);
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
      const res = await api.get(`/newstories.json?print=pretty`);
      const data = [...res.data.slice(0, arrSize)];
      const news = data.map((el, index) => {
        return <NewsList key={index} id={el} />;
      });
      setNews([...news]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const setObj = async () =>{
    try {
      const res = await api.get(`/newstories.json?print=pretty`);
      const data = [...res.data];
      const obj = [];
      data.forEach(async (el) => {
        try {
          const res = await api.get(`/item/${el}.json?print=pretty`);
          const data = await res.data;
          obj.push(data);
        } catch (err) {
          console.error(err);
        }
        sessionStorage.setItem("newsObj", JSON.stringify(obj));
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getNews(100);
    setObj()
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true);
      getNews(100);
      setObj()
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMoreClick = () => {
    setIsLoading(true);
    getNews(click);
    setClick(click + 10);
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
      <div className="news-list-container">
        {loading ? <Loader /> : news}
      </div>
      <button className="more-btn" type="button" onClick={handleMoreClick}>
        More news...
      </button>
    </div>
  );
}

export default App;
