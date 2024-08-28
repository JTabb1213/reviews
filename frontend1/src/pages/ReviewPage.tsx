import React, { useEffect, useState } from 'react';
import { useHttpClient } from "../HttpClient";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
//import { ColorRing } from 'react-loader-spinner'//for loading wheel
import { Grid } from "@mui/material";
import './SearchPage.css';
import './ReviewPage.css';

function ReviewPage() {
    const httpClient = useHttpClient();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect_url');
    const [username, setUsername] = useState<string | null>(null);
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const query = queryParams.get('id');
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    //const [reviewText, setReviewText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [working, setWorking] = useState<boolean | null>(null);
    const [restaurant, setRestaurant] = useState<string | null>(null);
    const [review, setReview] = useState("");
    const [rating, setRating] = useState<number | null>(0);
    const [hover, setHover] = useState<number | null>(0);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await httpClient.get('/api/userinfo');
                console.log("user is logged in:", response.data);
                setUsername(response.data.username);
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    console.log("user is not logged in");
                    setIsLoggedIn(false);
                } else {
                    console.error("error seeing login info: ", error);
                }
            }

            try {
                const response = await httpClient.get(`/api/searchByGoogleId?id=${query}`);
                setRestaurant(response.data.result.name);
            } catch (error: any) {
                console.log("had issue with finding by id: ", error);
            }
        }
        getData();
    }, []);

    const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReview(event.target.value);
    }

    const insertEmoji = (emoji: string) => {
        setReview(prevText => prevText + emoji);
    }

    const handleSubmit = async () => {
        if (!rating) {
            setError("Please rate the restaurant before submitting.");
            return;
        }
        //console.log("rating:", { rating });
        httpClient.post('/api/postReview', {
            rating: rating,
            user: username,
            id: query,
            review: review
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(result => {
            console.log("redirect url is:", redirectUrl);
            navigate(redirectUrl || '/');
        }).catch(err => {
            console.log("error: ", error);
        }).finally(() => {
            setWorking(false);
        })
    }

    return (
        <div>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <div className='Resname'>
                        {`Write review for ${restaurant}`}
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className='text' style={{ display: 'flex', justifyContent: 'center' }}>
                        <textarea className='box'
                            value={review}
                            onChange={handleReviewChange}
                            placeholder="Write your review here..."
                            rows={5}
                            cols={50}
                        />
                    </div>
                </Grid>
                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <div className='starBox' style={{ display: 'flex', justifyContent: 'center' }}>
                        {[...Array(5)].map((star, index) => {
                            const currentRating = index + 1;
                            return (
                                <label style={{ marginRight: '10px' }} key={index}>
                                    <input
                                        type='radio'
                                        name='rating'
                                        value={currentRating}
                                        onClick={() => setRating(currentRating)}
                                    />
                                    <FaStar
                                        className='star'
                                        size={50}
                                        color={currentRating <= ((hover ?? rating) ?? 0) ? "#ffc107" : "#e4e5e9"}
                                        onMouseEnter={() => setHover(currentRating)}
                                        onMouseLeave={() => setHover(null)}
                                    />
                                </label>
                            );
                        })}
                    </div>
                    {error && <p className="error-message" style={{ display: 'flex', justifyContent: 'center' }}>{error}</p>}
                </Grid>

                <br />
                <Grid item xs={12}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={() => insertEmoji('😊')}>😊</button>
                        <button onClick={() => insertEmoji('👍')}>👍</button>
                        <button onClick={() => insertEmoji('🔥')}>🔥</button>
                        {/* Add more emoji buttons as needed */}
                    </div>
                </Grid>
                <br />
                <Grid item xs={12}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className='SubmitButton'
                            onClick={handleSubmit}
                        >
                            Submit Review
                        </button>
                    </div>
                </Grid>
            </Grid>
        </div >
    );
}

export default ReviewPage;
