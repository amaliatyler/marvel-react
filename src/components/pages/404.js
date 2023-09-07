import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link } from 'react-router-dom';

import notfound from './../../resources/img/404.svg';

const Page404 = () => {
    return (
        <div>
            <img className="not-found_img" src={notfound} alt="Page not found"/>
            <p className="not-found_txt">Oops... page doesn't exist...</p>
            <Link to="/" className="not-found_lnk">Back to main page</Link>
        </div>
    )
}

export default Page404;