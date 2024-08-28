import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useHttpClient } from '../HttpClient';
import './Display.css';

interface Review {
    rating: number;
    user_id: string;
    review_text: string;
    createdAt: string;
}

function DisplayReviews() {
    const location = useLocation();
    const httpClient = useHttpClient();
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const getData = async () => {
            console.log("getting reviews");
            try {
                const params = new URLSearchParams(location.search);
                const id = params.get('id');
                const response = await httpClient.get(`/api/getResReviews?id=${id}`);
                //to display the reviews in order of newest to latest
                const sortedReviews = response.data.sort((a: Review, b: Review) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setReviews(sortedReviews);
            } catch (error) {
                console.error("error getting review info: ", error);
            }
        }

        getData();
    }, []);

    return (
        <div className="reviews-container">
            {reviews.length === 0 ? (
                <p>No reviews yet!</p>
            ) : (
                <div>
                    {reviews.map((review, index) => (
                        <div key={index} className="review">
                            <h3>Rating: {review.rating}</h3>
                            <p>User: {review.user_id}</p>
                            <p>Review: {review.review_text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DisplayReviews;
