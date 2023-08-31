import React, { useRef } from "react";
import PropTypes from "prop-types";
import { api } from "../utils/axios/axios";
import NewsList from "./NewList";
import { useSelector } from "react-redux"

function Header(props) {
  const { handleNews, handleLoading } = props;

  const searchRef = useRef(null);

  const select = useSelector((state) => state.stories)

  const getNews = async () => {
    try {
      const res = await api.get(`/newstories.json?print=pretty`);
      const data = [...res.data.slice(0, 100)];

      const news = data.map((el, index) => {
        return <NewsList key={index} id={el} />;
      });

      handleNews([...news]);
      handleLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getPastNews = async () => {
    try {
      const res = await api.get(`/newstories.json?print=pretty`);
      const data = [...res.data.reverse().slice(0, 100)];

      const pastNews = data.map((el, index) => {
        return <NewsList key={index} id={el} />;
      });

      handleNews([...pastNews]);
      handleLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getSearchNews = async (value) => {
    const news = [];
    select.stories.forEach((el, index) => {
      if (el.title.toLowerCase().includes(value.toLowerCase())) {
        console.log(el)
        news.push(<NewsList key={index} id={el.id} />);
        handleNews([...news]);
      }
    });
    handleLoading(false);
  };

  const getPopular = async () => {
    try {
      const res = await api.get(`/beststories.json?print=pretty`);
      const data = [...res.data];

      const popNews = data.map((el, index) => {
        return <NewsList key={index} id={el} />;
      });

      handleNews([...popNews]);
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
    getSearchNews(searchRef.current.value);
  };

  return (
    <div className="header">
      <div className="header-container">
        <div className="header-logo">Hacker News</div>
        <input id="menu-toggle" type="checkbox" />
        <label className="menu-button-container" htmlFor="menu-toggle">
          <div className="menu-button"></div>
        </label>
        <div className="navbar menu">
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
              ref={searchRef}
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
    </div>
  );
}

Header.propTypes = {
  handleNews: PropTypes.func.isRequired,
  handleLoading: PropTypes.func.isRequired,
};

export default Header;
