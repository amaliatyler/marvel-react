import { useState } from "react";
import {
    Formik,
    Form,
    Field,
    ErrorMessage as FormikErrorMessage,
} from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./searchForm.scss";

const SearchForm = () => {
    const [char, setChar] = useState(null);
    const { loading, error, getCharacterByName, clearError } =
        useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
    };

    const updateChar = (name) => {
        clearError();

        getCharacterByName(name)
        .then(onCharLoaded);
    };

    const errorMessage = error ? (
        <div className="char__search-critical-error">
            <ErrorMessage />
        </div>
    ) : null;

    const results = !char ? null : char.length > 0 ? 
        <div className="char__search-wrapper">
            <div className="char__search-success">
                There is! Visit {char[0].name} page?
            </div>
            <Link
                to={`/characters/${char[0].id}`}
                className="button button__secondary"
            >
                <div className="inner">To page</div>
            </Link>
        </div> :
        <div className="char__search-error">
            The character was not found. Check the name and try again.
        </div>;

    return (
        <div className="search-form">
            <Formik
                initialValues={{ 
                    charName: '' 
                }}
                validationSchema={yup.object({
                    charName: yup
                        .string()
                        .required('This field is required')
                        .min(2, 'The name must contain at least 2 characters'),
                })}
                onSubmit={ ({charName}) => {
                    updateChar(charName);
                }}
            >
                <Form>
                    <label className="search-form__label" htmlFor="charName">
                        Or find a character by name:
                    </label>
                    <div className="search-form__wrapper">
                        <Field
                            className="search-form__input"
                            id="charName"
                            name="charName"
                            type="text"
                            placeholder="Enter name"
                        />
                        <button 
                            className="button button__main" 
                            type="submit"
                            disabled={loading}
                            >
                            <div className="inner">Find</div>
                        </button>
                    </div>
                    <FormikErrorMessage
                        className="search-form__error"
                        name="charName"
                        component="div"
                    />
                </Form>
            </Formik>
            {results}
            {errorMessage}
        </div>
    );
};

export default SearchForm;
