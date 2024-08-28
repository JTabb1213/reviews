import React, { MouseEvent } from 'react';
import { useHttpClient } from '../HttpClient';
import { useNavigate, useLocation } from 'react-router-dom';
//import { useState } from 'react';
import './SearchButton.css';

function AddReviewButton() {
    const navigate = useNavigate();
    const location = useLocation();
    const httpClient = useHttpClient();

    const handleAddReview = async (event: MouseEvent) => {
        event.preventDefault();
        try {
            const response = await httpClient.post(`/api/seeIfLoggedIn`);

            console.log('Backend response:', response.data);
            navigate({
                pathname: '/reviewpage',
                search: `${location.search}&redirect_url=/displaypage${location.search}`,
            })
        } catch (error: any) {
            console.log('Error calling backend for nearby restaurants:', error);

            if (error.response && error.response.status === 401) {
                //console.log("TTTTT", typeof (error));
                navigate({
                    pathname: '/needtologin',
                    search: `redirect_url=${location.pathname}${location.search}`,
                })
            }
        }
    };

    return (
        <button onClick={handleAddReview} className="Add-review-button">
            Review this place
        </button>
    );
}

export default AddReviewButton;
