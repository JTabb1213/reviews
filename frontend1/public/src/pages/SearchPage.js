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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const HttpClient_1 = require("../HttpClient");
const LoginButton_1 = __importDefault(require("../components/LoginButton"));
const LogoutButton_1 = __importDefault(require("../components/LogoutButton"));
const react_loader_spinner_1 = require("react-loader-spinner"); //for loading wheel
require("./SearchPage.css");
function SearchPage() {
    const httpClient = HttpClient_1.useHttpClient();
    const navigate = react_router_dom_1.useNavigate();
    const [error, setError] = react_1.useState("");
    const [city, setCity] = react_1.useState('my location');
    const [keyword, setKeyword] = react_1.useState('');
    const [searchResults, setSearchResults] = react_1.useState([]);
    const [nextPageToken, setNextPageToken] = react_1.useState('');
    //const [moreResults, setMoreResults] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = react_1.useState(true);
    //const [userLat, setUserLat] = useState<number | null>(null);
    //const [userLng, setUserLng] = useState<number | null>(null);
    //const [average, setAverage] = useState<number | null>(null);
    const [loading, setLoading] = react_1.useState(false); //keep track of the loading symbol
    const [buttonClicked, setButtonClicked] = react_1.useState(false);
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };
    function success(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            const { latitude, longitude } = pos.coords;
            //console.log('Latitude:', latitude);
            //console.log('Longitude:', longitude);
            const response = yield httpClient.get(`/api/restaurantsNearby?address=${city}&name=${keyword}&nextPageToken=${nextPageToken}&lat=${latitude}&lng=${longitude}`);
            handleResponse(response);
        });
    }
    function errors(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    react_1.useEffect(() => {
        const getData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield httpClient.post('/api/seeIfLoggedIn');
            }
            catch (error) {
                if (error.response && error.response.status === 401) {
                    //console.log("not logged in");
                    setIsLoggedIn(false);
                }
                else {
                    console.error("error seeing login info: ", error);
                }
            }
        });
        getData();
    }, []);
    react_1.useEffect(() => {
        //console.log("loading", loading);
    }, [loading]);
    const handleCityChange = (e) => {
        setButtonClicked(false);
        setNextPageToken("");
        setCity(e.target.value);
    };
    const handleKeywordChange = (e) => {
        setButtonClicked(false);
        setNextPageToken("");
        setKeyword(e.target.value);
    };
    const handlePlaceClick = (id) => {
        navigate(`/displaypage?id=${id}`);
    };
    const handleLoading = () => {
        setLoading(true);
    };
    const getCurrentPos = () => {
        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                if (result.state === "granted") {
                    //If granted then you can directly call your function here
                    navigator.geolocation.getCurrentPosition(success, errors, options);
                    //console.log("HH", navigator.geolocation.getCurrentPosition);
                }
                else if (result.state === "prompt") {
                    //If prompt then the user will be asked to give permission
                    navigator.geolocation.getCurrentPosition(success, errors, options);
                }
                else if (result.state === "denied") {
                    //If denied then you have to show instructions to enable location
                }
            });
        }
        else {
            console.log("Geolocation is not supported by this browser.");
        }
    };
    react_1.useEffect(() => {
        console.log("NextP: ", nextPageToken);
    }, [nextPageToken]);
    function handleResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Backend response:', response.data);
            if (response.data.restaurants.length === 0) {
                setError("No restaurants found");
            }
            else {
                const updatedSearchResults = yield Promise.all(response.data.restaurants.map((restaurant) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const res = yield httpClient.get(`/api/getResReviews?id=${restaurant.id}`);
                        const reviews = res.data;
                        var add = 0;
                        var size = reviews.length;
                        var avg = 0;
                        if (reviews.length > 0) {
                            reviews.forEach((review) => {
                                const rating = parseFloat(review.rating);
                                add += rating;
                            });
                            avg = add / size;
                            avg = Math.round(avg * 10) / 10; //round avg to the nearest 10's place
                        }
                        return Object.assign(Object.assign({}, restaurant), { averageRating: avg });
                    }
                    catch (error) {
                        console.error(`Error fetching reviews for restaurant ${restaurant.id}:`, error);
                        return restaurant;
                    }
                    finally {
                        setLoading(false);
                    }
                })));
                if (response.data.nextPageToken) {
                    setNextPageToken(response.data.nextPageToken);
                }
                else {
                    setNextPageToken("");
                }
                setNextPageToken(response.data.nextPageToken);
                setSearchResults(updatedSearchResults);
                //console.log("nn", response.nextPageToken);
                // console.log("ss", updatedSearchResults);
            }
        });
    }
    //const response = await httpClient.get(`/api/getResReviews?id=${id}`);
    const handleSearch = () => __awaiter(this, void 0, void 0, function* () {
        setButtonClicked(true);
        console.log("city:", city);
        try {
            setError("");
            //console.log('City:', city);
            //console.log('Keyword:', keyword);
            if (city === 'my location') {
                getCurrentPos();
            }
            else {
                const response = yield httpClient.get(`/api/restaurantsNearby?address=${city}&name=${keyword}&nextPageToken=${nextPageToken}`);
                handleResponse(response);
            }
        }
        catch (error) {
            console.log('Error calling backend for nearby restaurants:', error);
            setError(error.response.data);
        }
    });
    return (react_1.default.createElement("div", { className: 'search-page' },
        isLoggedIn ? (react_1.default.createElement(LogoutButton_1.default, null)) : (react_1.default.createElement(LoginButton_1.default, null)),
        react_1.default.createElement("div", { className: "search-container" },
            react_1.default.createElement("label", null,
                "Near:",
                react_1.default.createElement("input", { type: "text", value: city, onChange: handleCityChange, className: "search-input" })),
            react_1.default.createElement("br", null),
            react_1.default.createElement("label", null,
                "Name:",
                react_1.default.createElement("input", { type: "text", value: keyword, onChange: handleKeywordChange, className: "search-input" })),
            react_1.default.createElement("br", null),
            react_1.default.createElement("button", { onClick: () => { handleSearch(); handleLoading(); }, className: "search-button", disabled: buttonClicked }, "Search"),
            loading && (react_1.default.createElement("div", { className: 'colorRingLoading', style: { display: 'flex', justifyContent: 'center' } },
                react_1.default.createElement(react_loader_spinner_1.ColorRing, { colors: ['green', 'blue', 'green', 'blue', 'green'] }))),
            error && react_1.default.createElement("div", { className: "error-message" }, error),
            searchResults.length > 0 && (react_1.default.createElement("div", null,
                !loading && (react_1.default.createElement("h2", null, "Search Results:")),
                !loading && (react_1.default.createElement("ul", null, searchResults.map((result) => (react_1.default.createElement("li", { key: result.id },
                    react_1.default.createElement("div", { className: "results", style: { cursor: 'pointer' }, onClick: () => handlePlaceClick(result.id) },
                        result.name,
                        " - ",
                        result.address,
                        result.averageRating ? (react_1.default.createElement("div", null,
                            "Average Rating: ",
                            result.averageRating)) : (react_1.default.createElement("div", null, "No reviews yet")))))))),
                nextPageToken ? (react_1.default.createElement("button", { onClick: () => { handleSearch(); handleLoading(); }, className: "search-button" }, loading ? 'Searching...' : 'Search more')) : (!loading && (react_1.default.createElement("div", { style: { color: 'red' } }, " No more restaurants nearby "))))))));
}
exports.default = SearchPage;
