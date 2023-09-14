import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

import useMarvelService from "../../services/MarvelService";

import "./searchForm.scss";

const SearchForm = () => {

    const [searchedChar, setSearchedChar] = useState(null);

    const { loading, error, searchForCharacter } = useMarvelService();

    useEffect(() => {
        
    })

    const handleInput = (name) => {
        searchForCharacter(name.search);
    };


    return (
        <Formik
            initialValues={{ search: "" }}
            validationSchema={yup.object({
                search: yup
                    .string()
                    .required("This field is required")
                    .min(2, "The name must contain at least 2 characters"),
            })}
            onSubmit={(value) =>
                handleInput(value)}
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
            </Form>
        </Formik>
    );
};



export default SearchForm;
