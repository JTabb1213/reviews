import axios from "axios";
import AppProps from "./AppProps";
//import { useLocation, useNavigate } from "react-router-dom";

export const useHttpClient = () => {
    //const navigate = useNavigate();
    //const location = useLocation();
    console.log('[HttpClient] Creating axios instance with baseURL:', JSON.stringify(AppProps.backend));

    const axiosInstance = axios.create({
        baseURL: AppProps.backend,
        withCredentials: true,
        headers: {
            Accept: "application/json",
        },
    });

    axiosInstance.interceptors.request.use(request => {
        const fullURL = (request.baseURL ?? '') + (request.url ?? '');
        console.log('[HttpClient] Outgoing request:', request.method?.toUpperCase(), fullURL);
        return request;
    });

    axiosInstance.interceptors.response.use(
        response => {
            console.log('[HttpClient] Response:', response.status, response.config.url);
            return response;
        },
        function (error) {
            console.error('[HttpClient] Request failed:');
            console.error('  URL:   ', (error.config?.baseURL ?? '') + (error.config?.url ?? ''));
            console.error('  Status:', error.response?.status);
            console.error('  Data:  ', error.response?.data);
            console.error('  Code:  ', error.code);
            return Promise.reject(error);
        }
    )
    return axiosInstance;
}

export function getErrorMessage(err: any) {
    let msg = err.response?.data?.message;
    if (!msg) {
        if (err.code === 'ERR_NETWORK') {
            msg = 'The service could not be reached, check to see if it is available';
        } else {
            msg = 'Unknown server error';
        }
    }
    return {
        message: msg
    };
}