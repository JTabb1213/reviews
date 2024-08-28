import React, { MouseEvent } from 'react';
import { useHttpClient } from '../HttpClient';
//import { /*useNavigate,*/ useLocation } from 'react-router-dom';
//import { useState } from 'react';
//import { Grid } from "@mui/material";
import './SearchButton.css';

function DeleteReviewButton({ username, query }: { username: string | null, query: string | null }) {
    // const navigate = useNavigate();
    //const location = useLocation();
    const httpClient = useHttpClient();
    //const { search } = useLocation();
    //const queryParams = new URLSearchParams(search);


    console.log("got username", username)
    console.log("Id", query);

    const handleAddReview = async (event: MouseEvent) => {
        event.preventDefault();
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete your review?");
            if (confirmDelete) {
                const response = httpClient.delete(`/api/deleteRev?user=${username}&id=${query}`);
                console.log(response);
                window.location.reload();
            }
        } catch (error: any) {
            console.error("error deleting review", error);
        }
    };

    return (
        <button onClick={handleAddReview} className="Add-review-button">
            Delete your review
        </button>
    );
}

export default DeleteReviewButton;
