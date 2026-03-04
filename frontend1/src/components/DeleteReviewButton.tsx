import React from 'react';
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

    async function confirmAndDelete() {
        const confirmDelete = window.confirm("Are you sure you want to delete your review?");
        if (confirmDelete) {
            try {
                const response = await httpClient.delete(`/api/deleteRev?user=${username}&id=${query}`);
                console.log(response.data);
                window.location.reload();
            } catch (err) {
                console.error(err);
                alert("Delete failed");
            }
        }
    }

    return (
        <button onClick={confirmAndDelete} className="Add-review-button" style={{ background: 'linear-gradient(135deg, #d63031, #c0392b)' }}>
            Delete your review
        </button>
    );
}

export default DeleteReviewButton;
