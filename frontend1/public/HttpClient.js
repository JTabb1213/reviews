"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = exports.useHttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const AppProps_1 = __importDefault(require("./AppProps"));
//import { useLocation, useNavigate } from "react-router-dom";
exports.useHttpClient = () => {
    //const navigate = useNavigate();
    //const location = useLocation();
    const axiosInstance = axios_1.default.create({
        baseURL: AppProps_1.default.backend,
        withCredentials: true,
        headers: {
            Accept: "application/json",
        },
    });
    axiosInstance.interceptors.response.use(response => {
        return response;
    });
    return axiosInstance;
};
function getErrorMessage(err) {
    var _a, _b;
    let msg = (_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message;
    if (!msg) {
        if (err.code === 'ERR_NETWORK') {
            msg = 'The service could not be reached, check to see if it is available';
        }
        else {
            msg = 'Unknown server error';
        }
    }
    return {
        message: msg
    };
}
exports.getErrorMessage = getErrorMessage;
