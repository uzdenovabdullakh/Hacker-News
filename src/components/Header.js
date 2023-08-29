import React, { useRef } from "react";
import PropTypes from "prop-types";
import { api } from "../utils/axios/axios";
import NewsList from "./NewList";

function Header(props) {
  const { handleNews, handleLoading } = props;

  const inputRef = useRef(null);

  const getNews = async () => {
    try {
      const res = await api.get(`/newstories.json?print=pretty`);
      const data = [...res.data.slice(0, 100)];
      const newNews = [];

      data.forEach(async (el) => {
        try {
          const res = await api.get(`/item/${el}.json?print=pretty`);
          const data = res.data;
          newNews.push(data);

          const news = newNews.map((el, index) => {
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
          handleNews([...news]);
          handleLoading(false);
        } catch (err) {
          console.log(err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getPastNews = async () => {
    try {
      const response = await api.get(`/newstories.json?print=pretty`);
      const data = [...response.data.reverse().slice(0, 100)];
      const pastNews = [];

      data.forEach(async (el) => {
        try {
          const res = await api.get(`/item/${el}.json?print=pretty`);
          const data = res.data;
          pastNews.push(data);
          const news = pastNews.map((el, index) => {
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
          handleNews([...news]);
          handleLoading(false);
        } catch (err) {
          console.log(err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getSearchNews = async (value) => {
    try {
      const res = await api.get(`/newstories.json?print=pretty`);
      const data = [...res.data];
      const news = [];
      
      data.forEach(async (el, index) => {
        try {
          const res = await api.get(`/item/${el}.json?print=pretty`);
          const data = await res.data;

          if (data.title.toLowerCase().includes(value.toLowerCase())) {
            news.push(
              <NewsList
                key={index}
                id={data.id}
                title={data.title}
                rating={data.score}
                nickname={data.by}
                date={data.time}
              />
            );
            handleNews([...news]);
            handleLoading(false);
          }

          // Map.prototype.search = function (value) {
          //   let foundValue;
          //   this.forEach((val, key) => {
          //     if (key.includes(value.toLowerCase())) {
          //       foundValue = val;
          //     }
          //   });
          //   return foundValue;
          // };

          // newsMap.set(data.title.toLowerCase(), data);

          // if (newsMap.search(value) !== undefined) {
          //   const found = newsMap.search(value);
          //   news.push(
          //     <NewsList
          //       key={index}
          //       id={found.id}
          //       title={found.title}
          //       rating={found.score}
          //       nickname={found.by}
          //       date={found.time}
          //     />
          //   );
          //   handleNews([...news]);
          //   handleLoading(false)
          // }
        } catch (error) {
          console.error(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getPopular = async () => {
    try {
      const res = await api.get(`/beststories.json?print=pretty`);
      const data = [...res.data];
      let popNews = [];

      data.forEach(async (el) => {
        try {
          const res = await api.get(`/item/${el}.json?print=pretty`);
          const data = res.data;
          popNews.push(data);
          sessionStorage.setItem("popNews", JSON.stringify(popNews));
        } catch (err) {
          console.error(err);
        }
      });

      const news = JSON.parse(sessionStorage.getItem("popNews")).map(
        (el, index) => {
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
        }
      );
      handleNews([...news]);
      handleLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePastClick = (e) => {
    e.preventDefault();
    handleLoading(true);
    getPastNews();
  };
  const handleNewClick = (e) => {
    e.preventDefault();
    handleLoading(true);
    getNews();
  };

  const handlePopularClick = (e) => {
    e.preventDefault();
    handleLoading(true);
    getPopular();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoading(true);
    getSearchNews(inputRef.current.value);
  };

  return (
    <div className="header">
      <div className="header-container">
        <div className="header-logo">Hacker News</div>
        <ul className="header-sort-list">
          <li
            className="header-sort-list__item"
            type="button"
            onClick={handleNewClick}
          >
            New
          </li>
          <li
            className="header-sort-list__item"
            type="button"
            onClick={handlePastClick}
          >
            Past
          </li>
          <li
            className="header-sort-list__item"
            type="button"
            onClick={handlePopularClick}
          >
            Popular
          </li>
        </ul>
        <form className="header-search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="header-search__input"
            placeholder="Search news..."
            minLength={3}
            ref={inputRef}
          />
          <img
            src={process.env.PUBLIC_URL + "/icon-search.png"}
            alt="search"
            className="search-btn"
            type="button"
            onClick={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
}

Header.propTypes = {
  handleNews: PropTypes.func.isRequired,
  handleLoading: PropTypes.func.isRequired,
};

export default Header;
