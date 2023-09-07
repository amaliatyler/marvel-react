import { useHttp } from "../hooks/http.hook";

const useMarvelService  = () => {

  const { request, loading, error, clearError } = useHttp();

  const _apiBase = "https://gateway.marvel.com:443/v1/public/";

  const _apiKey = "apikey=a987d380bb021b15dbcd9a3283328c80";
  
  const _baseOffset = 606;

  

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformCharacter)
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    };
  };

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  }

  const getAllComics = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);

      return res.data.results.map(_transformComics);
  }

  const _transformComics = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      description: comic.description || 'There is no description',
      pageCount: comic.pageCount ? `${comic.pageCount} p.` : 'There is no information about the number of pages',
      thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
      language: comic.textObjects.language || 'en-us',
      price: comic.prices[0].price ? `${comic.prices[0].price}$` : 'Not available'
    }
  }

  return { loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic };

}

export default useMarvelService;
