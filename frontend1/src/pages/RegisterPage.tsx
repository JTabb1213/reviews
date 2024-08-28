import React, { useState } from 'react';
//import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHttpClient } from '../HttpClient';
import { ColorRing } from 'react-loader-spinner'//for loading wheel
import './LoginPage.css';

export default function Register() {
    const httpClient = useHttpClient();
    const navigate = useNavigate();
    //const location = useLocation();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect_url');
    //const [searchParams] = useSearchParams();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState<string | null>(null);
    // const [previousRoute, setPreviousRoute] = useState("");
    const [working, setWorking] = useState<boolean | null>(null);


    const handleTakeMeHome = () => {
        navigate('/');
    }

    const handleCreateAccount = () => {
        //setWorking(true);
        setError("");
        if (password !== confirmPass) {
            setError("Passwords have to match");
            return;
        }
        setWorking(true);
        // console.log("U", username);
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
    }

    return (
        <>
            {working && (
                <div className='loadWheelRegister' style={{ display: 'flex', justifyContent: 'center' }}>
                    <ColorRing />
                </div>
            )}
            {!working && (
                <div className="login-container">
                    <h1>Create Account</h1>
                    <div className="input-container">
                        <label>
                            Email:
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                            />
                        </label>
                        <label>
                            Username:
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="login-input"
                            />
                        </label>
                        <br />
                        <label>
                            Password:
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                            />
                        </label>
                        <label>
                            Confirm Password:
                            <input
                                type="confirmPassword"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                className="login-input"
                            />
                        </label>

                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="button-container">
                        <button
                            onClick={handleCreateAccount}
                            className="login-button"
                            disabled={working ?? false}
                        >
                            {working ? "Creating account..." : "Create Account"}
                        </button>
                        <button
                            onClick={handleTakeMeHome}
                            className="take-me-home-button"
                            disabled={working ?? false}
                        >
                            {working ? "Going back..." : "Take me back"}
                        </button>
                    </div>
                </div>
            )
            }
        </>
    );
}

