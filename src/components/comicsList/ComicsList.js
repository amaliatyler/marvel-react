import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

import "./comicsList.scss";

const setContent = (process, Component, newItemsLoading) => {
  switch (process) {
      case 'waiting':
          return <Spinner />;
          break;
      case 'loading':
          return newItemsLoading ? <Component /> :<Spinner /> ;
          break;
      case 'confirmed':
          return <Component />;
          break;
      case 'error':
          return <ErrorMessage />;
          break;
      default:
          throw new Error('Unexpected process state');
  }
};

const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [newItemsLoading, setNewItemsLoading] = useState(false);
  const [offset, setOffset] = useState(532);
  const [comicsListEnded, setComicsListEnded] = useState(false);

  const { loading, error, getAllComics, process, setProcess } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
    getAllComics(offset)
      /* onCharListLoaded принимает в себя массив charlist */
      .then(onComicsListLoaded)
      .then(() => setProcess('confirmed'));;
  };

  const onComicsListLoaded = (newComicsList) => {
    let ended = false;
    if (newComicsList.length < 8) {
      ended = true;
    }

    setComicsList((comicsList) => [...comicsList, ...newComicsList]);
    setNewItemsLoading((newItemsLoading) => false);
    setOffset((offset) => offset + 8);
    setComicsListEnded((comicsListEnded) => ended);
  };

  function renderItems(arr) {
    const items = arr.map((item, i) => {
      return (
        <li className="comics__item" key={item.id}>
          <Link to={`/comics/${item.id}`}>
            <img
              src={item.thumbnail}
              alt={item.title}
              className="comics__item-img"
            />
            <div className="comics__item-name">{item.title}</div>
            <div className="comics__item-price">{item.price}</div>
          </Link>
        </li>
      );
    });

    return <ul className="comics__grid">{items}</ul>;
  }

  return (
    <div className="comics__list">
      {setContent(process, () => renderItems(comicsList), newItemsLoading)}
      <button
        disabled={newItemsLoading}
        style={{ display: comicsListEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
        className="button button__main button__long"
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
