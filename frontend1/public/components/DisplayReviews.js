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
const react_router_dom_1 = require("react-router-dom");
const HttpClient_1 = require("../HttpClient");
require("./Display.css");
function DisplayReviews() {
    const location = react_router_dom_1.useLocation();
    const httpClient = HttpClient_1.useHttpClient();
    const [reviews, setReviews] = react_1.useState([]);
    react_1.useEffect(() => {
        const getData = () => __awaiter(this, void 0, void 0, function* () {
            console.log("getting reviews");
            try {
                const params = new URLSearchParams(location.search);
                const id = params.get('id');
                const response = yield httpClient.get(`/api/getResReviews?id=${id}`);
                //to display the reviews in order of newest to latest
                const sortedReviews = response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setReviews(sortedReviews);
            }
            catch (error) {
                console.error("error getting review info: ", error);
            }
        });
        getData();
    });
    return (react_1.default.createElement("div", { className: "reviews-container" }, reviews.length === 0 ? (react_1.default.createElement("p", null, "No reviews yet!")) : (react_1.default.createElement("div", null, reviews.map((review, index) => (react_1.default.createElement("div", { key: index, className: "review" },
        react_1.default.createElement("h3", null,
            "Rating: ",
            review.rating),
        react_1.default.createElement("p", null,
            "User: ",
            review.user_id),
        react_1.default.createElement("p", null,
            "Review: ",
            review.review_text))))))));
}
exports.default = DisplayReviews;
