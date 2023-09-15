import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const DetailedPage = () => {
    const { characterName } = useParams();

    const [character, setCharacter] = useState('loki');

    const { loading, error, searchForCharacter, clearError } =
        useMarvelService();

    useEffect(() => {
        searchForCharacter('loki').then(onCharacterLoaded);
    },[characterName]);

    const onCharacterLoaded = (character='loki') => {
        setCharacter(character);
    };

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !character) ? (
        <View comic={character} />
    ) : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    );
};

const View = ({ character }) => {
    // const { thumbnail, description, title } = character;

    return (
        <>
            {/* <div className="detailed-info">
                <div className="detailed-info__img-wrapper">
                    <img src={thumbnail} alt={title} />
                </div>
                <div className="detailed-info__text">
                    <p className="detailed-info__title">{title}</p>
                    <p className="detailed-info__description">{description}</p>
                </div>
            </div> */}
            {console.log(character)}
        </>
    );
};

export default DetailedPage;
