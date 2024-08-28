import React, { useEffect, useState } from 'react';
import { useHttpClient } from "../HttpClient";
import { useLocation } from 'react-router-dom';
import DisplayResults from '../components/Display';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
//import DisplayName from '../components/DisplayName';
import DeleteReviewButton from '../components/DeleteReviewButton';
import SearchButton from '../components/SearchButton';
import AddReviewButton from '../components/AddReviewButton';
import DisplayReviews from '../components/DisplayReviews';
import { Grid } from "@mui/material";
import './Display.css';
//import { useHttpClient } from '../HttpClient';

function DisplayPage() {
    //const [id, setID] = useState<string | null>(null);
    const httpClient = useHttpClient();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const query = queryParams.get('id');
    //setID(query);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [username, setUsername] = useState<string | null>(null);
    const [userHasReview, setUserHasReview] = useState<boolean>(false);

    /*
        httpClient.post('/api/createUser', {
            email: email,
            username: username,
            password: password
        },).then(result => {
            console.log(result);
            navigate({
                pathname: '/loginpage',
                search: `redirect_url=${redirectUrl}`
            })
        }).catch(err => {
            console.log("Error", err);
            setError(err.response.data.message);
        }).finally(() => {
            setWorking(false);
        })
    */
    useEffect(() => {
        if (username !== null) {
            //console.log("user is lohgged in:", username);
            httpClient.get(`/api/searchUserRev?user=${username}&id=${query}`, {
            }).then(result => {
                //console.log("successfully checked for a review:,", result);
                if (result.data === false) {
                    //console.log("they dont have a review", result);
                } else if (result.data === true) {
                    //console.log("they have a review", result);
                    setUserHasReview(true);
                }
            }).catch(error => {
                console.error("error", error);
            })
        }

    }, [username]);

    useEffect(() => {

        const getData = () => {
            httpClient.get('/api/userinfo', {

            }).then(result => {
                console.log("user info:", result.data.username);
                setUsername(result.data.username);
                console.log("2", username);
            }).catch(err => {
                console.log("Not logged in: ", err);
                setIsLoggedIn(false);
            })

            //console.log("username is:", username)

            /*
            try {
                const response = await httpClient.get('/api/userinfo');
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    console.log("not logged in");
                    setIsLoggedIn(false);
                } else {
                    console.error("error seeing login info: ", error);
                }
            }
            */
        }

        getData();

    }, []);

    //console.log("made it here", query);

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <SearchButton />
                </Grid>

                <Grid item xs={12} sm={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {userHasReview ? (
                        <DeleteReviewButton username={username} query={query} />
                    ) : (
                        <AddReviewButton />
                    )}
                </Grid>

                <Grid item xs={12} sm={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {isLoggedIn ? (
                        <LogoutButton />
                    ) : (
                        <LoginButton />
                    )}
                </Grid>


            </Grid>
            <div className='DisplayResults'>
                <DisplayResults />
            </div>
            <DisplayReviews />
        </div>
    );
}

export default DisplayPage;
