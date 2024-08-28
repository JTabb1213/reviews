import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHttpClient } from '../HttpClient';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import { ColorRing } from 'react-loader-spinner'//for loading wheel
import './SearchPage.css';


function SearchPage() {
    const httpClient = useHttpClient();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [city, setCity] = useState('my location');
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [nextPageToken, setNextPageToken] = useState('');
    //const [moreResults, setMoreResults] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    //const [userLat, setUserLat] = useState<number | null>(null);
    //const [userLng, setUserLng] = useState<number | null>(null);
    //const [average, setAverage] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);//keep track of the loading symbol
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);


    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    async function success(pos: any) {
        const { latitude, longitude } = pos.coords;
        //console.log('Latitude:', latitude);
        //console.log('Longitude:', longitude);
        const response = await httpClient.get(`/api/restaurantsNearby?address=${city}&name=${keyword}&nextPageToken=${nextPageToken}&lat=${latitude}&lng=${longitude}`);
        handleResponse(response);
    }

    function errors(err: any) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }


    useEffect(() => {
        const getData = async () => {
            try {
                const response = await httpClient.post('/api/seeIfLoggedIn');
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    //console.log("not logged in");
                    setIsLoggedIn(false);
                } else {
                    console.error("error seeing login info: ", error);
                }
            }
        }

        getData();

    }, []);

    useEffect(() => {
        //console.log("loading", loading);
    }, [loading]);



    const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
        setButtonClicked(false);
        setNextPageToken("");
        setCity(e.target.value);
    };

    const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setButtonClicked(false);
        setNextPageToken("");
        setKeyword(e.target.value);
    };

    const handlePlaceClick = (id: string) => {
        navigate(`/displaypage?id=${id}`)
    }

    const handleLoading = () => {
        setLoading(true);
    }

    const getCurrentPos = () => {
        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                    if (result.state === "granted") {
                        //If granted then you can directly call your function here
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                        //console.log("HH", navigator.geolocation.getCurrentPosition);
                    } else if (result.state === "prompt") {
                        //If prompt then the user will be asked to give permission
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                    } else if (result.state === "denied") {
                        //If denied then you have to show instructions to enable location
                    }
                });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    useEffect(() => {
        console.log("NextP: ", nextPageToken);
    }, [nextPageToken])

    async function handleResponse(response: any) {
        console.log('Backend response:', response.data);
        if (response.data.restaurants.length === 0) {
            setError("No restaurants found");
        } else {
            const updatedSearchResults = await Promise.all(response.data.restaurants.map(async (restaurant: any) => {
                try {
                    const res = await httpClient.get(`/api/getResReviews?id=${restaurant.id}`);
                    const reviews = res.data;
                    var add = 0;
                    var size = reviews.length;
                    var avg = 0;

                    if (reviews.length > 0) {
                        reviews.forEach((review: any) => {
                            const rating = parseFloat(review.rating);
                            add += rating;
                        });

                        avg = add / size;
                        avg = Math.round(avg * 10) / 10; //round avg to the nearest 10's place
                    }

                    return { ...restaurant, averageRating: avg };
                } catch (error: any) {
                    console.error(`Error fetching reviews for restaurant ${restaurant.id}:`, error);
                    return restaurant;
                } finally {
                    setLoading(false);
                }
            }));

            if (response.data.nextPageToken) {
                setNextPageToken(response.data.nextPageToken);
            } else {
                setNextPageToken("");
            }
            setNextPageToken(response.data.nextPageToken);
            setSearchResults(updatedSearchResults);
            //console.log("nn", response.nextPageToken);
            // console.log("ss", updatedSearchResults);
        }
    }

    //const response = await httpClient.get(`/api/getResReviews?id=${id}`);

    const handleSearch = async () => {
        setButtonClicked(true);
        console.log("city:", city);
        try {
            setError("");
            //console.log('City:', city);
            //console.log('Keyword:', keyword);
            if (city === 'my location') {
                getCurrentPos();
            } else {
                const response = await httpClient.get(`/api/restaurantsNearby?address=${city}&name=${keyword}&nextPageToken=${nextPageToken}`);
                handleResponse(response);
            }
        } catch (error: any) {
            console.log('Error calling backend for nearby restaurants:', error);
            setError(error.response.data);
        }
    };

    return (
        <div className='search-page'>
            {isLoggedIn ? (
                <LogoutButton />
            ) : (
                <LoginButton />
            )}
            <div className="search-container">
                <label>
                    Near:
                    <input type="text" value={city} onChange={handleCityChange} className="search-input" />
                </label>
                <br />
                <label>
                    Name:
                    <input type="text" value={keyword} onChange={handleKeywordChange} className="search-input" />
                </label>
                <br />

                <button onClick={() => { handleSearch(); handleLoading(); }}
                    className="search-button"
                    disabled={buttonClicked}
                >
                    Search
                </button>

                {loading && (
                    <div className='colorRingLoading' style={{ display: 'flex', justifyContent: 'center' }}>
                        <ColorRing colors={['green', 'blue', 'green', 'blue', 'green']} />
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}
                {searchResults.length > 0 && (
                    <div>
                        {!loading && (
                            <h2>Search Results:</h2>
                        )}
                        {!loading && (
                            <ul>
                                {searchResults.map((result) => (
                                    <li key={result.id}>
                                        <div
                                            className="results"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handlePlaceClick(result.id)}
                                        >
                                            {result.name} - {result.address}
                                            {result.averageRating ? (
                                                <div>Average Rating: {result.averageRating}</div>
                                            ) : (
                                                <div>No reviews yet</div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {nextPageToken ? (
                            <button onClick={() => { handleSearch(); handleLoading(); }} className="search-button">
                                {loading ? 'Searching...' : 'Search more'}
                            </button>
                        ) : (
                            !loading && (
                                <div style={{ color: 'red' }}> No more restaurants nearby </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPage;
