import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import "./charList.scss";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemsLoading, setNewItemsLoading] = useState(false);
  const [offset, setOffset] = useState(606);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllCharacters } = useMarvelService();

  /* useEffect запускается после рендера, поэтому мы можем вызвать функцию "до" ее создания */
  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
      getAllCharacters(offset)
      /* onCharListLoaded принимает в себя массив charlist */
      .then(onCharListLoaded)
  };

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList((charList) => [...charList, ...newCharList]);
    setNewItemsLoading((newItemsLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
  };

  const itemRefs = useRef([]);

  const focusOnItem = (id) => {
    itemRefs.current.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    itemRefs.current[id].classList.add("char__item_selected");
    itemRefs.current[id].focus();
  };

  /* этот метод создан для оптимизации, 
    чтобы не помещать такую конструкцию в метод render */

  function renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }

      return (
        <li
          key={item.id}
          onClick={() => {
            props.onCharSelected(item.id);
            focusOnItem(i);
          }}
          onKeyPress={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              props.onCharSelected(item.id);
              focusOnItem(i);
            }
          }}
          className="char__item"
          tabIndex={0}
          /* коллбэк-реф принимает в себя единственным аргументом тот элемент, на котором он был вызван */
          ref={(el) => (itemRefs.current[i] = el)}
        >
          <img src={item.thumbnail} alt={item.title} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });

    // А эта конструкция вынесена для центровки спиннера/ошибки
    return <ul className="char__grid">{items}</ul>;
  }

  const items = renderItems(charList);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading  && !newItemsLoading ? <Spinner /> : null;
  

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {items}
      <button
        disabled={newItemsLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
        className="button button__main button__long"
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
