import { Component } from "react";

import "./charInfo.scss";
import MarvelService from "../../services/MarvelService";
import Skeleton from '../skeleton/Skeleton';
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

class CharInfo extends Component {
  state = {
    char: null,
    /* по макету загрузка идет только после действий пользователя */
    loading: false,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps, prevState) {
    /* обязательно сравнивать пропсы или стейты с предыдущими для избежания бесконечного цикла */
    if(this.props.charId !== prevProps.charId) {
        this.updateChar();
    }
  }

  updateChar = () => {
    const { charId } = this.props;
    if (!charId) {
      return;
    }

    this.onCharLoading();
    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };


  onCharLoaded = (char) => {
    /* как только заканчивается загрузка - меняем loading на false */
    this.setState({ char, loading: false });
  };

  onCharLoading = () => {
    this.setState({
      loading: true,
    });
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  render() {
    const {char, loading, error} = this.state;
    /* если что-то из этого есть - ничего не рендерим */
    const skeleton = char || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    /* НЕ загрузка, НЕ ошибка, при этом уже есть персонаж (двойное отрицание) */
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return <div className="char__info">
        {skeleton}
        {errorMessage}
        {spinner}
        {content}
    </div>;
  }
}

const View = ({ char }) => {

    const {name, description, thumbnail, homepage, wiki, comics} = char;
    let imgStyle = {'objectFit': 'cover'};
        if(thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit': 'contain'};
        }

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} style={imgStyle}/>
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">
        {description}
      </div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        { comics.length > 0 ? (
            comics.map((item, i) => {
                if(i > 10) return;
                return (
                    <li key={i} className="char__comics-item">
                        {item.name}
                    </li>
                )
            })
        ) : <div>There are no comics about this character</div>}
      </ul>
    </>
  );
};

export default CharInfo;
