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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const HttpClient_1 = require("../HttpClient");
const react_router_dom_1 = require("react-router-dom");
const fa_1 = require("react-icons/fa");
//import { ColorRing } from 'react-loader-spinner'//for loading wheel
const material_1 = require("@mui/material");
require("./SearchPage.css");
require("./ReviewPage.css");
function ReviewPage() {
    const httpClient = HttpClient_1.useHttpClient();
    const navigate = react_router_dom_1.useNavigate();
    const [searchParams] = react_router_dom_1.useSearchParams();
    const redirectUrl = searchParams.get('redirect_url');
    const [username, setUsername] = react_1.useState(null);
    const { search } = react_router_dom_1.useLocation();
    const queryParams = new URLSearchParams(search);
    const query = queryParams.get('id');
    const [isLoggedIn, setIsLoggedIn] = react_1.useState(true);
    //const [reviewText, setReviewText] = useState('');
    const [error, setError] = react_1.useState(null);
    const [working, setWorking] = react_1.useState(null);
    const [restaurant, setRestaurant] = react_1.useState(null);
    const [review, setReview] = react_1.useState("");
    const [rating, setRating] = react_1.useState(0);
    const [hover, setHover] = react_1.useState(0);
    react_1.useEffect(() => {
        const getData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield httpClient.get('/api/userinfo');
                setUsername(response.data.username);
            }
            catch (error) {
                if (error.response && error.response.status === 401) {
                    setIsLoggedIn(false);
                }
                else {
                    console.error("error seeing login info: ", error);
                }
            }
            try {
                const response = yield httpClient.get(`/api/searchByGoogleId?id=${query}`);
                setRestaurant(response.data.result.name);
            }
            catch (error) {
                console.log("had issue with finding by id: ", error);
            }
        });
        getData();
    }, []);
    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };
    const insertEmoji = (emoji) => {
        setReview(prevText => prevText + emoji);
    };
    const handleSubmit = () => __awaiter(this, void 0, void 0, function* () {
        if (!rating) {
            setError("Please rate the restaurant before submitting.");
            return;
        }
        //console.log("rating:", { rating });
        httpClient.post('/api/postReview', {
            rating: rating,
            user: username,
            id: query,
            review: review
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(result => {
            console.log("redirect url is:", redirectUrl);
            navigate(redirectUrl || '/');
        }).catch(err => {
            console.log("error: ", error);
        }).finally(() => {
            setWorking(false);
        });
    });
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(material_1.Grid, { container: true, spacing: 2, justifyContent: "center", alignItems: "center" },
            react_1.default.createElement(material_1.Grid, { item: true, xs: 12 },
                react_1.default.createElement("div", { className: 'Resname' }, `Write review for ${restaurant}`)),
            react_1.default.createElement(material_1.Grid, { item: true, xs: 12 },
                react_1.default.createElement("div", { className: 'text', style: { display: 'flex', justifyContent: 'center' } },
                    react_1.default.createElement("textarea", { className: 'box', value: review, onChange: handleReviewChange, placeholder: "Write your review here...", rows: 5, cols: 50 }))),
            react_1.default.createElement(material_1.Grid, { item: true, xs: 12, sm: 8, md: 6, lg: 4 },
                react_1.default.createElement("div", { className: 'starBox', style: { display: 'flex', justifyContent: 'center' } }, [...Array(5)].map((star, index) => {
                    var _a;
                    const currentRating = index + 1;
                    return (react_1.default.createElement("label", { style: { marginRight: '10px' }, key: index },
                        react_1.default.createElement("input", { type: 'radio', name: 'rating', value: currentRating, onClick: () => setRating(currentRating) }),
                        react_1.default.createElement(fa_1.FaStar, { className: 'star', size: 50, color: currentRating <= ((_a = (hover !== null && hover !== void 0 ? hover : rating)) !== null && _a !== void 0 ? _a : 0) ? "#ffc107" : "#e4e5e9", onMouseEnter: () => setHover(currentRating), onMouseLeave: () => setHover(null) })));
                })),
                error && react_1.default.createElement("p", { className: "error-message", style: { display: 'flex', justifyContent: 'center' } }, error)),
            react_1.default.createElement("br", null),
            react_1.default.createElement(material_1.Grid, { item: true, xs: 12 },
                react_1.default.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
                    react_1.default.createElement("button", { onClick: () => insertEmoji('😊') }, "\uD83D\uDE0A"),
                    react_1.default.createElement("button", { onClick: () => insertEmoji('👍') }, "\uD83D\uDC4D"),
                    react_1.default.createElement("button", { onClick: () => insertEmoji('🔥') }, "\uD83D\uDD25"))),
            react_1.default.createElement("br", null),
            react_1.default.createElement(material_1.Grid, { item: true, xs: 12 },
                react_1.default.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
                    react_1.default.createElement("button", { className: 'SubmitButton', onClick: handleSubmit }, "Submit Review"))))));
}
exports.default = ReviewPage;
