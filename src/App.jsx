import React, {useEffect,useState} from 'react'
import Search from "./Search.jsx";
import Spinner from "./Spinner.jsx";
import {MovieCard} from "./MovieCard.jsx";
//API- Application Programming Interface- a set of rules that allow one s/w application
// to talk to another
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    }
}


const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')


    //Debounce the search term to prevent making too many API requests
    // by waiting for the user to stop typing for 500ms
    useDebounce(()=>setDebouncedSearchTerm(searchTerm),500,[searchTerm]);

    const fetchMovies = async (query='') => {
        try {
            setIsLoading(true);
            setErrorMessage('');
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        const response = await fetch(endpoint,API_OPTIONS);
        if (!response.ok) {
            throw new Error('Failed to fetch movies');

        }
        const data=await response.json();
        if (data.Response==='False'){
            setErrorMessage(data.Error||'Failed to fetch movies');
            setMovieList([]);
            return;
        }
        setMovieList(data.results || []);
        if(query && data.results.length>0){
            await updateSearchCount(query,data.results[0]);
        }
        }
        catch(error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies. Pls Try Again Later.');
        }
        finally {
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try {
          const movies = await getTrendingMovies();
          setTrendingMovies(movies);
        }
        catch(error){
            console.error(`Error fetching trending movies: ${error}`);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
        } ,[debouncedSearchTerm]); //we pass searchTerm in dep array so that when searched the query poopulates it accordingly
useEffect(() => {
  loadTrendingMovies();
},[]) //Empty so that it will be called onlu once in start

    return (
        <main>
           <div className="pattern"/>
            <div className="wrapper">
            <header>
                <img src="./hero.png" alt="Hero" />
                <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle</h1>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </header>
                {trendingMovies.length > 0 &&  (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie,index)=>(
                                <li key={movie.$id}>
                                    <p>{index+1}</p>
                                    <img src={movie.poster_url} alt={movie.title}/>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
                <section className="all-movies">
                    <h2>All Movies</h2>

                    {isLoading ? (
                     <Spinner/>
                    ):errorMessage?(
                        <p className="text-red-500">{errorMessage}</p>
                    ):(
                        <ul>
                            {movieList.map((movie) => (
                             <MovieCard key={movie.id} movie={movie}/>

                            ))}
                        </ul>
                    )}
                </section>


            </div>
        </main>
    )
}
export default App
