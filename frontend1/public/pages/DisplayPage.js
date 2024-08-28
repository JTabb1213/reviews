"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const HttpClient_1 = require("../HttpClient");
const react_router_dom_1 = require("react-router-dom");
const Display_1 = __importDefault(require("../components/Display"));
const LoginButton_1 = __importDefault(require("../components/LoginButton"));
const LogoutButton_1 = __importDefault(require("../components/LogoutButton"));
//import DisplayName from '../components/DisplayName';
const DeleteReviewButton_1 = __importDefault(require("../components/DeleteReviewButton"));
const SearchButton_1 = __importDefault(require("../components/SearchButton"));
const AddReviewButton_1 = __importDefault(require("../components/AddReviewButton"));
const DisplayReviews_1 = __importDefault(require("../components/DisplayReviews"));
const material_1 = require("@mui/material");
require("./Display.css");
//import { useHttpClient } from '../HttpClient';
function DisplayPage() {
    //const [id, setID] = useState<string | null>(null);
    const httpClient = HttpClient_1.useHttpClient();
    const { search } = react_router_dom_1.useLocation();
    const queryParams = new URLSearchParams(search);
    const query = queryParams.get('id');
    //setID(query);
    const [isLoggedIn, setIsLoggedIn] = react_1.useState(true);
    const [username, setUsername] = react_1.useState(null);
    const [userHasReview, setUserHasReview] = react_1.useState(false);
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
    react_1.useEffect(() => {
        if (username !== null) {
            //console.log("user is lohgged in:", username);
            httpClient.get(`/api/searchUserRev?user=${username}&id=${query}`, {}).then(result => {
                //console.log("successfully checked for a review:,", result);
                if (result.data === false) {
                    //console.log("they dont have a review", result);
                }
                else if (result.data === true) {
                    //console.log("they have a review", result);
                    setUserHasReview(true);
                }
            }).catch(error => {
                console.error("error", error);
            });
        }
    }, [username]);
    react_1.useEffect(() => {
        const getData = () => {
            httpClient.get('/api/userinfo', {}).then(result => {
                //console.log("user info:", result.data.username);
                setUsername(result.data.username);
                //console.log("2", username);
            }).catch(err => {
                //console.log("Not logged in: ", err);
                setIsLoggedIn(false);
            });
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
        };
        getData();
    });
    //console.log("made it here", query);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(material_1.Grid, { container: true, spacing: 2 },
            react_1.default.createElement(material_1.Grid, { item: true, xs: 12, sm: 4, style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } },
                react_1.default.createElement(SearchButton_1.default, null)),
            react_1.default.createElement(material_1.Grid, { item: true, xs: 12, sm: 4, style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }, userHasReview ? (react_1.default.createElement(DeleteReviewButton_1.default, { username: username, query: query })) : (react_1.default.createElement(AddReviewButton_1.default, null))),
            react_1.default.createElement(material_1.Grid, { item: true, xs: 12, sm: 4, style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } }, isLoggedIn ? (react_1.default.createElement(LogoutButton_1.default, null)) : (react_1.default.createElement(LoginButton_1.default, null)))),
        react_1.default.createElement("div", { className: 'DisplayResults' },
            react_1.default.createElement(Display_1.default, null)),
        react_1.default.createElement(DisplayReviews_1.default, null)));
}
exports.default = DisplayPage;
