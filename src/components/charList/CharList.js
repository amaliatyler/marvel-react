import { Component } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

class CharList extends Component {

    state = {
        charList: [],
        loading: true, 
        error: false,
        newItemsLoading: false,
        offset: 606, 
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
        .getAllCharacters(offset)
        /* onCharListLoaded принимает в себя массив charlist */
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemsLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {

        let ended = false;
        if(newCharList.length < 9) {
            ended= true;
        }

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList], 
            loading: false,
            newItemsLoading: false,
            offset: offset + 9,
            charEnded: ended
        }));
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    /* этот метод создан для оптимизации, 
    чтобы не помещать такую конструкцию в метод render */

    renderItems(arr) {
        const items = arr.map((item) => {
            let imgStyle = {'objectFit': 'cover'};
            if(item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'unset'};
            }

            return (
                <li 
                    key={item.id} 
                    onClick={() => this.props.onCharSelected(item.id)}
                    className="char__item">

                    <img src={item.thumbnail} alt={item.title} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })

        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const { charList, loading, error, offset, newItemsLoading, charEnded } = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;


        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    disabled={newItemsLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}
                    className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;