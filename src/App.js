import React, { useEffect, useState } from "react";
import { api } from "./utils/axios/axios";
import Header from "./components/Header";
import NewsList from "./components/NewList";
import Loader from "./components/Loader";
import { useDispatch } from "react-redux";
import { setStories } from "./utils/store/slice/storiesSlice";
import image from './assets/icons-update.png'

function App() {
  const [news, setNews] = useState([]);
  const [click, setClick] = useState(110);
  const [loading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

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

  const setObj = React.useCallback(async () => {
    try {
      const res = await api.get(`/newstories.json?print=pretty`);
      const data = [...res.data];
      const obj = [];

      data.forEach(async (el) => {
        try {
          const res = await api.get(`/item/${el}.json?print=pretty`);
          const data = await res.data;
          obj.push(data)
        } catch (err) {
          console.error(err);
        }
        dispatch(
          setStories({
            stories: [...obj],
          })
        );
      });
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    document.title ="Hacker News";
  })

  useEffect(() => {
    setIsLoading(true);
    getNews(100);
    setObj();
  }, [setObj]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true);
      getNews(100);
      setObj();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [setObj]);

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
        src={image}
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
