import { useState, useEffect, useRef, useMemo  } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const setContent = (process, Component, newItemsLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
        case 'loading':
            return newItemsLoading ? <Component /> : <Spinner />;
        case 'confirmed':
            return <Component />;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpected process state');
    }
};

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(606);
    const [charEnded, setCharEnded] = useState(false);

    const { getAllCharacters, process, setProcess } = useMarvelService();

    /* useEffect запускается после рендера, поэтому мы можем вызвать функцию "до" ее создания */
    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
        getAllCharacters(offset)
            /* onCharListLoaded принимает в себя массив charlist */
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'));
    };

    const onCharListLoaded = async (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList([...charList, ...newCharList]);
        setNewItemsLoading(false);
        setOffset(offset + 9);
        setCharEnded(ended);
    };

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach((item) =>
            item.classList.remove('char__item_selected')
        );
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    };

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { objectFit: 'cover' };
            if (
                item.thumbnail ===
                'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
            ) {
                imgStyle = { objectFit: 'unset' };
            }

            return (
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li 
                        className="char__item"
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}>
                            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            );
        });

        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>{items}</TransitionGroup>
            </ul>
        );
    }

    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemsLoading);
        // eslint-disable-next-line
    }, [process])

    return (
        <div className="char__list">
            {elements}
            <button
                disabled={newItemsLoading}
                style={{ display: charEnded ? 'none' : 'block' }}
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
