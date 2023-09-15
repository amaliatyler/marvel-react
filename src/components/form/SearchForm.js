import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";

import "./searchForm.scss";

const SearchForm = () => {
    const [searchedChar, setSearchedChar] = useState(null);

    const { loading, error, searchForCharacter, clearError } = useMarvelService();

    useEffect(() => {
    }, [searchedChar]);

    const updateChar = (name) => {

        clearError();
        searchForCharacter(name).then(onCharacterLoaded);
    };

    const onCharacterLoaded = (char) => {
        setSearchedChar(char);
    };

    const errorMessage = error ? (
        <div>The character was not found. Check the name and try again</div>
    ) : null;
    const spinner = loading ? <Spinner /> : null;
    const successResponse = !(loading || error || !searchedChar) ? (
        <OuterLink />
    ) : null;

    return (
        <Formik
            initialValues={{ search: "" }}
            validationSchema={yup.object({
                search: yup
                    .string()
                    .required("This field is required")
                    .min(2, "The name must contain at least 2 characters"),
            })}
            onSubmit={(value) => {
                updateChar(value.search);
            }}
        >
            <Form className="search-form">
                <label className="search-form__label" htmlFor="search">
                    Or find a character by name:
                </label>
                <div className="search-form__wrapper">
                    <Field
                        className="search-form__input"
                        id="search"
                        name="search"
                        type="text"
                        placeholder="Enter name"
                    />
                    <button className="button button__main" type="submit">
                        <div className="inner">Find</div>
                    </button>
                </div>
                <ErrorMessage
                    className="search-form__error"
                    name="search"
                    component="div"
                />
                {errorMessage}
                {spinner}
                {successResponse}
                {/* {searchedChar ? <div>succeeded</div> : <div>failed</div>} */}
            </Form>
        </Formik>
    );
};

const OuterLink = () => {
    return (
        <div className="success">
            <p className="success__title">There is! Visit page?</p>
            <a href="#" className="button button__secondary">
                <div className="inner">To Page</div>
            </a>
        </div>
    );
};

export default SearchForm;
